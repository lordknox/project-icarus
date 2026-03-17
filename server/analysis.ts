import { db } from './db.js';
import {
    windResources,
    solarResources,
    gridInfrastructure,
    demandCenters,    
} from '../shared/schema';

export type EnergyType = 'wind' | 'solar' | 'hybrid';

export interface SiteInput {
    type: EnergyType;
    latitude: number;
    longitude: number;
    capacity: number; // in MW
}

export interface SiteAnalysis {
    suitabilityScore: number;
    energyType: EnergyType;
    factors: {
        resourceQuality: number;
        gridProximity: string;
        landAvailability: string;
        economicViability: string;
        environmentalImpact: string;
    };
    technicalMetrics: {
        estimatedCapacity: number; //MW
        capacityFactor: number; // 0-1
        annualGeneration: number; // MWh
        gridDistance: number; // km
        landAreaRequired: number; //hectares
    };
    economicMetrics: {
        investmentRequired: number; // USD
        annualRevenue: number; // USD
        operatingCosts: number; // USD
        roi: number; // percentage
        paybackPeriod: number; // years
    };
    impactMetrics: {
        co2SavedAnnually: number; // tons
        homesSupported: number;
        jobsCreated: number;
    };
    recommendations: string[];
    warnings: string[];
}
/**
 * Calculate distance between two coordinates using haversine formula
 * @returns distance in kilometers
 */
function calculateDistance(lat1: number,lon1: number, lat2: number, lon2: number): number {
    const R = 6371;// earth radius in km
    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);
    const a = 
        Math.sin(dlat/2)*Math.sin(dlat/2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dlon/2) * Math.sin(dlon/2);

    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Find nearest grid infrastructure and return distance
 */
async function findNearestGrid(lat: number, lon: number){
    const allGrid = await db.select().from(gridInfrastructure);
    if(allGrid.length === 0){
        return { grid: null, distance: 100};
    }
    let nearest = allGrid[0];
    let minDistance = Infinity;
    for(const grid of allGrid){
        const distance = calculateDistance(
            lat,
            lon,
            parseFloat(grid.latitude),
            parseFloat(grid.longitude)
        );
        if(distance < minDistance){
            minDistance = distance;
            nearest = grid;
        }
    }
    return { grid: nearest, distance: minDistance };
}
/** 
 * Score wind site based on wind resources in the area
 */
async function scoreWindSite(lat: number, lon: number): Promise<number> {
    const allWindResources = await db.select().from(windResources);

    if(allWindResources.length===0){
        return 50;//default moderate score if no data
    }
    let bestScore = 0;

    for(const resource of allWindResources) {
        const distance = calculateDistance(
            lat,
            lon,
            parseFloat(resource.latitude),
            parseFloat(resource.longitude)
        );
        const windSpeed = parseFloat(resource.avgWindSpeed);
        let speedScore = 0;
        // score based on average wind speed (m/s)
        if(windSpeed >=8.5){
            speedScore = 95;
        } else if (windSpeed >= 8.0){
            speedScore = 90;
        } else if (windSpeed >=7.0) {
            speedScore = 75;
        } else if (windSpeed >= 6.5) {
            speedScore = 65;
        } else if (windSpeed>= 6.0) {
            speedScore = 55;
        } else if (windSpeed >= 5.0) {
            speedScore = 40;
        } else {
            speedScore = 20;
        }
        //adjust for distance (closer is better, max 30% penalty)
        const distancePenalty = Math.min(distance/50,0.3);
        const adjustedScore = speedScore * (1 - distancePenalty);
        bestScore = Math.max(bestScore, adjustedScore);
    }
    return Math.min(Math.round(bestScore), 100);
}
/**
 * Score solar site based on solar irradiance in the area
 */
async function scoreSolarSite(lat: number, lon: number): Promise<number> {
    const allSolarResources = await db.select().from(solarResources);
    
    if(allSolarResources.length === 0){
        return 50;
    }
    let bestScore = 0;
    for(const resource of allSolarResources) {
        const distance = calculateDistance(
            lat,
            lon,
            parseFloat(resource.latitude),
            parseFloat(resource.longitude)
        );

        const ghi = parseFloat(resource.ghi); // Global Horizontal Irradiance (kWh/m²/day)
        let ghiScore = 0;
        
        // Score based on GHI
        if( ghi >= 6.5){
            ghiScore = 95; // Excellent
        } else if (ghi >= 6.0) {
            ghiScore = 90;
        } else if (ghi>=5.5) {
            ghiScore = 85;
        } else if ( ghi >= 5.0) {
            return 75; //Good
        } else if (ghi >= 4.5) {
            ghiScore = 65;
        } else if (ghi>=4.0) {
            ghiScore = 50; // Fair
        } else if (ghi>=3.5) {
            ghiScore = 35;
        } else {
            ghiScore = 20; // Poor
        }

        //Adjust for distance
        const distancePenalty = Math.min(distance / 50, 0.3);
        const adjustedScore = ghiScore * (1 - distancePenalty);

        bestScore = Math.max(bestScore, adjustedScore);
    }
    return Math.min(Math.round(bestScore), 100);
}

/**
 * Main site analysis function
 */
export async function analyzeSite(input: SiteInput): Promise<SiteAnalysis> {
    const { type, latitude, longitude, capacity} = input;
    
    console.log(`🔍 Analyzing ${type} site at (${latitude}, ${longitude}) with ${capacity}MW capacity`);
    // get resource quality score
    let resourceQuality = 0;
    if(type === 'wind'){
        resourceQuality = await scoreWindSite(latitude, longitude);
    } else if (type === 'solar') {
        resourceQuality = await scoreSolarSite(latitude,longitude);
    } else if (type === 'hybrid') {
        const windScore = await scoreWindSite(latitude,longitude);
        const solarScore = await scoreSolarSite(latitude,longitude);
        resourceQuality = Math.round((windScore + solarScore) /2);
    }
    // find nearest grid infrastructure
    const { grid, distance: gridDistance } = await findNearestGrid(latitude, longitude);

    let gridScore=0;
    let gridProximity = '';

    if(gridDistance < 5) {
        gridScore = 100;
        gridProximity = 'Excellent';
    } else if ( gridDistance <10){
        gridScore=90;
        gridProximity = 'Excellent';
    } else if ( gridDistance< 20 ){
        gridScore = 75;
        gridProximity = 'Good';
    } else if ( gridDistance< 30) {
        gridScore = 60;
        gridProximity = 'Good';
    } else if ( gridDistance < 50) {
        gridScore = 45;
        gridProximity = 'Fair';
    } else {
        gridScore = 30;
        gridProximity = 'Poor';
    }
    // calculate capacity factor based on type
    let capacityFactor = 0;
    if( type === 'wind' ) {
        capacityFactor = 0.35;
    } else if (type === 'solar'){
        capacityFactor = 0.20;
    } else {
        capacityFactor = 0.275;
    }

    //adjusted capacity factor based on resource quality
    const resouceAdjustment = (resourceQuality - 50) /100; // -0.5 to +0.5
    capacityFactor = Math.max(0.1, Math.min(0.6, capacityFactor + resouceAdjustment * 0.1));

    // technical metrics
    const annualGeneration = Math.round(capacity * capacityFactor * 8760);// MWh per year
    const landAreaRequired = type === 'solar'
        ? Math.round(capacity * 4) // 4 hectares per MW for solar
        : Math.round(capacity * 0.5); // 0.5 hectares per MW for wind
    // economic metrics
    const investmentPerMW = type === 'wind' ? 1.5 : type === 'solar' ? 1.0 : 1.4;
    const investmentRequired = Math.round(capacity * investmentPerMW);// stored as $M in db
    const investmentUSD = investmentRequired * 1e6; // convert to USD
    const electricityRate = 50; //USD per MWH (average)
    const annualRevenue = annualGeneration * electricityRate;
    const operatingCosts = investmentUSD * 0.025;// 2.5% of investment annually
    const annualProfit = annualRevenue - operatingCosts;
    const roi = (annualProfit / investmentUSD) * 100;
    const payBackPeriod = investmentUSD / annualProfit;
    // impact metrics
    
    const gridEmissionFactor = 0.5; //tons co2 per MWH (average grid)
    const co2SavedAnnually = Math.round(annualGeneration * gridEmissionFactor);
    const homesSupported = Math.round(annualGeneration / 11);//11 MWH per home per year
    const jobsCreated = Math.round(capacity * 3); //3 jobs per MW during construction + operation

    // oveerall suitability score
    let suitabilityScore = 0;
    if(type === 'wind') {
        suitabilityScore = Math.round(
            resourceQuality * 0.4 +
            gridScore * 0.25 +
            85 * 0.20 +
            75 * 0.15 +
            Math.min(roi, 15)/15 * 100 * 0.05
        );
    } else if (type === 'solar') {
        suitabilityScore = Math.round(
            resourceQuality * 0.40 +
            gridScore * 0.20 +
            85 * 0.20 +
            75 * 0.15 + 
            Math.min(roi, 15)/15 * 100 * 0.05
        );
    } else {
        suitabilityScore = Math.round(
            resourceQuality * 0.37 +
            gridScore * 0.23 +
            85 * 0.20 +
            75 * 0.15 +
            Math.min(roi, 15)/15 * 100 * 0.05
        );
    }
    // recommendations and warnings
    const recommendations: string[] = [];

    if(resourceQuality >=85) {
        recommendations.push('Excellent resource quality - high potential for energy generation');
    } else if (resourceQuality >= 70) {
        recommendations.push('Good resource Potential - proceed with detailed feasibility study');
    } else if (resourceQuality >= 50) {
        recommendations.push('Moderate resource quality - consider if other factors are favorable');
    } else {
        recommendations.push('Low resource quality - explore alternative locations');
    }

    if(gridDistance < 10) {
        recommendations.push('Excellent grid connectivity reduces interconnection costs significantly');
    } else if (gridDistance < 30) {
        recommendations.push('Moderate grid distance - factor in transmission line costs');
    } else {
        recommendations.push('Significant distance to grid - high interconnection costs expected');
    }

    if(roi >= 12 ) {
        recommendations.push('Strong economic returns - attractive investment opportunity');
    } else if (roi >= 8) {
        recommendations.push('Moderate returns - consider government incentives and PPAs');
    } else if(roi >= 5) {
        recommendations.push('Lower returns - requires favorable financing terms');
    } else {
        recommendations.push('Economic viability concerns - explore cost reduction strategies');        
    }

    if(co2SavedAnnually >= 50000) {
        recommendations.push('Significant environmental impact - strong case for green financing');
    }

    // generate warnings
    const warnings: string[] = [];
    if(resourceQuality < 40 ) {
        warnings.push('Low resource quality may significantly impact project viability');
    }
    if(gridDistance > 50) {
        warnings.push('Very high grid connection costs due to distance - detailed cost analysis required');
    }
    if(payBackPeriod > 15) {
        warnings.push('Long payback period may deter investment - explore revenue enhancement options');
    }
    if (roi < 5) {
        warnings.push('Return on investment below typical market expectations');
    }

    console.log(`✅ Analysis complete - Suitability Score: ${suitabilityScore}/100`);

    return{
        suitabilityScore: Math.min(Math.max(suitabilityScore, 0), 100),
        energyType: type,
        factors: {
            resourceQuality,
            gridProximity,
            landAvailability: 'Good',
            economicViability: roi >= 10? 'Excellent' : roi >= 7 ? 'Good' : roi >= 5 ? 'Fair' : 'Poor',
            environmentalImpact: 'Positive',
        },
        technicalMetrics: {
            estimatedCapacity: capacity,
            capacityFactor: Math.round(capacityFactor *100) /100,
            annualGeneration,
            gridDistance: Math.round(gridDistance * 10) /10,
            landAreaRequired,
        },
        economicMetrics: {
            investmentRequired,
            annualRevenue,
            operatingCosts,
            roi: Math.round(roi * 100)/100,
            paybackPeriod: Math.round(payBackPeriod * 10)/10,
        },
        impactMetrics: {
            co2SavedAnnually,
            homesSupported,
            jobsCreated,
        },
        recommendations,
        warnings,
    };
}