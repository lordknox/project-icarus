import { SolarResource } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface RenewableSite {
    id: string;
    name: string;
    type: 'wind' | 'solar' | 'hybrid';
    latitude: string;
    longitude: string;
    capacity: number;
    suitabilityScore: number;
    isAiSuggested: boolean;
    resourceQuality: number | null;
    gridDistance: number | null;
    landArea: number | null;
    annualGeneration: number | null;
    capacityFactor: string | null;
    co2SavedAnnually: number | null;
    homesSupported: number | null;
    investmentRequired: number | null;
    roiPercentage: string | null;
    paybackYears: string | null;
    description: string | null;
    createdAt: string;
}

export interface WindResource {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    avgWindSpeed: string;
    windPowerDensity: number | null;
    capacity: number | null;
    turbineCount: number | null;
    isExisting: boolean;
}

export interface GridInfrastructure {
    id: string;
    name: string;
    type: 'substation' | 'transmission_line';
    latitude: string;
    longitude: string;
    voltage: number | null;
    capacity: number | null;
    operator: string | null;
}

export interface DemandCenter {
    id: string;
    name: string;
    type: 'industrial' | 'residential' | 'commercial' | 'mixed';
    latitude: string;
    longitude: string;
    demandLevel: 'low' | 'medium' | 'high' | 'very_high';
    peakDemand: number | null;
    population: number | null;
}

export interface DashboardStats {
    totalSites: number;
    totalCapacity: number;
    totalGeneration: number;
    totalCO2Saved: number;
    totalHomesSupported: number;
    totalInvestment: number;
    averageROI: number;
    averagePayback: number;
    averageSuitabilityScore: number;
    sitesByType: {
        wind: number;
        solar: number;
        hybrid: number;
    };
    topSites: RenewableSite[];
}

export interface SiteAnalysis {
    suitabilityScore: number;
    energyType: 'wind' | 'solar' | 'hybrid';
    factors: {
        resourceQuality: number;
        gridProximity: string;
        landAvailability: string;
        economicViability: string;
        environmentalImpact: string;
    };
    technicalMetrics: {
        estimatedCapacity: number;
        capacityFactor: number;
        annualGeneration: number;
        gridDistance: number;
        landAreaRequired: number;
    };
    economicMetrics: {
        investmentRequired: number;
        annualRevenue: number;
        operatingCosts: number;
        roi: number;
        paybackPeriod: number;
    };
    impactMetrics: {
        co2SavedAnnually: number;
        homesSupported: number;
        jobsCreated: number;
    };
    recommendations: string[];
    warnings: string[];
}

class ApiClient {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl=baseUrl;
    }
    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if(!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }

    async getRenewableSites(): Promise<RenewableSite[]> {
        return this.fetch<RenewableSite[]>('/api/renewable-sites');
    }
    async getRenewableSite(id: string): Promise<RenewableSite> {
        return this.fetch<RenewableSite>(`/api/renewable-sites/${id}`);
    }

   async createRenewableSite(data: {
    name: string;
    type: 'wind' | 'solar' | 'hybrid';
    latitude: number;
    longitude: number;
    capacity?: number;
   }): Promise<{ site: RenewableSite; analysis: SiteAnalysis }> {
    return this.fetch<{ site: RenewableSite; analysis: SiteAnalysis}>(
        '/api/renewable-sites',
        {
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
   } 

   async analyzeSite(data: {
    type: 'wind' | 'solar' | 'hybrid';
    latitude: number;
    longitude: number;
    capacity?: number; 
   }): Promise<SiteAnalysis> {
    return this.fetch<SiteAnalysis>('/api/analyze-site', {
        method: 'POST',
        body: JSON.stringify(data),
    });
   }

   async saveSite(data: {
    name: string;
    type: 'wind' | 'solar' | 'hybrid';
    latitude: number;
    longitude: number;
    capacity: number;
    analysis: SiteAnalysis;
    }): Promise<RenewableSite> {
        return this.fetch<RenewableSite>('/api/sites/save-analyzed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    }

   async deleteSite(id: string): Promise<void> {
    await this.fetch(`/api/renewable-sites/${id}`, {
        method: 'DELETE',
    });
   }

   async getAiSuggestions(): Promise<RenewableSite[]> {
    return this.fetch<RenewableSite[]>('/api/ai-suggestions');
   }

   async getWindResources(): Promise<WindResource[]> {
    return this.fetch<WindResource[]>('/api/wind-resources');
   }

   async getSolarResources(): Promise<SolarResource[]> {
    return this.fetch<SolarResource[]>('/api/solar-resources');
   }

   async getGridInfrastructure(): Promise<GridInfrastructure[]> {
    return this.fetch<GridInfrastructure[]>('/api/grid-infrastructure');
   }

   async getDemandCenters(): Promise<DemandCenter[]> {
    return this.fetch<DemandCenter[]>('/api/demand-centers');    
   }

   async getDashboardStats(): Promise<DashboardStats> {
    return this.fetch<DashboardStats>('/api/dashboard/stats');
   }
}

export const apiClient = new ApiClient(API_BASE_URL);