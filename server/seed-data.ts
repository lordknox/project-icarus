import 'dotenv/config';
import { db } from './db';
import {
  windResources,
  solarResources,
  gridInfrastructure,
  demandCenters,
  renewableSites,
} from '../shared/schema.js';

async function seedIndianDatabase() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   🇮🇳 Seeding Icarus — India Data               ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  try {

    // ============================================================
    // 1. WIND RESOURCES — Real Indian wind zones
    // ============================================================
    console.log('💨 Seeding Indian wind resources...');
    await db.insert(windResources).values([
      {
        name: 'Muppandal Wind Farm, Tamil Nadu',
        latitude: '8.4203',
        longitude: '77.6498',
        avgWindSpeed: '8.9',
        windPowerDensity: 490,
        capacity: 1500,
        turbineCount: 3000,
        isExisting: true,
      },
      {
        name: 'Kutch Wind Energy Zone, Gujarat',
        latitude: '23.7337',
        longitude: '69.8597',
        avgWindSpeed: '8.2',
        windPowerDensity: 445,
        capacity: 1200,
        turbineCount: 600,
        isExisting: true,
      },
      {
        name: 'Jaisalmer Wind Park, Rajasthan',
        latitude: '27.0238',
        longitude: '70.5827',
        avgWindSpeed: '7.9',
        windPowerDensity: 420,
        capacity: 1064,
        turbineCount: 532,
        isExisting: true,
      },
      {
        name: 'Kurnool Wind Corridor, Andhra Pradesh',
        latitude: '15.8281',
        longitude: '78.0373',
        avgWindSpeed: '7.5',
        windPowerDensity: 395,
        capacity: 900,
        turbineCount: 450,
        isExisting: true,
      },
      {
        name: 'Chitradurga Wind Zone, Karnataka',
        latitude: '14.2251',
        longitude: '76.3980',
        avgWindSpeed: '7.3',
        windPowerDensity: 380,
        capacity: 800,
        turbineCount: 400,
        isExisting: true,
      },
      {
        name: 'Satara Wind Zone, Maharashtra',
        latitude: '17.6805',
        longitude: '73.9860',
        avgWindSpeed: '7.1',
        windPowerDensity: 365,
        capacity: 650,
        turbineCount: 325,
        isExisting: true,
      },
      {
        name: 'Dewas Wind Zone, Madhya Pradesh',
        latitude: '22.9623',
        longitude: '76.0505',
        avgWindSpeed: '6.8',
        windPowerDensity: 345,
        capacity: 500,
        turbineCount: 250,
        isExisting: true,
      },
      {
        name: 'Spiti Valley Wind Zone, Himachal Pradesh',
        latitude: '32.2432',
        longitude: '78.0350',
        avgWindSpeed: '8.5',
        windPowerDensity: 460,
        capacity: 200,
        turbineCount: 100,
        isExisting: false,
      },
    ]);
    console.log('  ✅ 8 wind zones added (TN, GJ, RJ, AP, KA, MH, MP, HP)');

    // ============================================================
    // 2. SOLAR RESOURCES — Real Indian solar parks
    // ============================================================
    console.log('\n☀️  Seeding Indian solar resources...');
    await db.insert(solarResources).values([
      {
        name: 'Bhadla Solar Park, Rajasthan',
        latitude: '27.5341',
        longitude: '71.9172',
        ghi: '6.8',
        dni: '7.4',
        capacity: 2245,
        panelCount: 4490000,
        isExisting: true,
      },
      {
        name: 'Charanka Solar Park, Gujarat',
        latitude: '23.9882',
        longitude: '71.1906',
        ghi: '6.4',
        dni: '7.0',
        capacity: 600,
        panelCount: 1200000,
        isExisting: true,
      },
      {
        name: 'Kurnool Ultra Mega Solar Park, AP',
        latitude: '15.4000',
        longitude: '78.3000',
        ghi: '5.8',
        dni: '6.4',
        capacity: 1000,
        panelCount: 2000000,
        isExisting: true,
      },
      {
        name: 'Rewa Ultra Mega Solar Park, MP',
        latitude: '24.5362',
        longitude: '81.3032',
        ghi: '5.6',
        dni: '6.2',
        capacity: 750,
        panelCount: 1500000,
        isExisting: true,
      },
      {
        name: 'Pavagada Solar Park, Karnataka',
        latitude: '14.1022',
        longitude: '77.2800',
        ghi: '5.9',
        dni: '6.5',
        capacity: 2050,
        panelCount: 4100000,
        isExisting: true,
      },
      {
        name: 'Kamuthi Solar Power Project, Tamil Nadu',
        latitude: '9.3370',
        longitude: '78.3800',
        ghi: '5.7',
        dni: '6.3',
        capacity: 648,
        panelCount: 1296000,
        isExisting: true,
      },
      {
        name: 'Nalgonda Solar Zone, Telangana',
        latitude: '17.0575',
        longitude: '79.2673',
        ghi: '5.5',
        dni: '6.0',
        capacity: 400,
        panelCount: 800000,
        isExisting: true,
      },
      {
        name: 'Ladakh Solar Energy Zone, J&K',
        latitude: '34.1526',
        longitude: '77.5771',
        ghi: '7.2',
        dni: '7.8',
        capacity: 300,
        panelCount: 600000,
        isExisting: false,
      },
    ]);
    console.log('  ✅ 8 solar zones added (RJ, GJ, AP, MP, KA, TN, TS, Ladakh)');

    // ============================================================
    // 3. GRID INFRASTRUCTURE — Real Indian substations & corridors
    // ============================================================
    console.log('\n⚡ Seeding Indian grid infrastructure...');
    await db.insert(gridInfrastructure).values([
      {
        name: 'Agra 765kV Substation, UP',
        type: 'substation',
        latitude: '27.1767',
        longitude: '78.0081',
        voltage: 765,
        capacity: 4000,
        operator: 'PGCIL',
      },
      {
        name: 'Lucknow 400kV Substation, UP',
        type: 'substation',
        latitude: '26.8467',
        longitude: '80.9462',
        voltage: 400,
        capacity: 2500,
        operator: 'PGCIL',
      },
      {
        name: 'Vadodara 400kV Substation, Gujarat',
        type: 'substation',
        latitude: '22.3072',
        longitude: '73.1812',
        voltage: 400,
        capacity: 3000,
        operator: 'GETCO',
      },
      {
        name: 'Pune 400kV Substation, Maharashtra',
        type: 'substation',
        latitude: '18.5204',
        longitude: '73.8567',
        voltage: 400,
        capacity: 2800,
        operator: 'MSETCL',
      },
      {
        name: 'Chennai 400kV Substation, Tamil Nadu',
        type: 'substation',
        latitude: '13.0827',
        longitude: '80.2707',
        voltage: 400,
        capacity: 3500,
        operator: 'TANTRANSCO',
      },
      {
        name: 'Bengaluru 765kV Substation, Karnataka',
        type: 'substation',
        latitude: '12.9716',
        longitude: '77.5946',
        voltage: 765,
        capacity: 4500,
        operator: 'KPTCL',
      },
      {
        name: 'Hyderabad 400kV Substation, Telangana',
        type: 'substation',
        latitude: '17.3850',
        longitude: '78.4867',
        voltage: 400,
        capacity: 3200,
        operator: 'TSTRANSCO',
      },
      {
        name: 'Kolkata 400kV Substation, West Bengal',
        type: 'substation',
        latitude: '22.5726',
        longitude: '88.3639',
        voltage: 400,
        capacity: 2600,
        operator: 'WBSEDCL',
      },
      {
        name: 'Green Energy Corridor — Rajasthan–Gujarat',
        type: 'transmission_line',
        latitude: '25.2138',
        longitude: '71.0211',
        voltage: 765,
        capacity: 6000,
        operator: 'PGCIL',
      },
      {
        name: 'Green Energy Corridor — Tamil Nadu–Karnataka',
        type: 'transmission_line',
        latitude: '11.3410',
        longitude: '77.7172',
        voltage: 400,
        capacity: 3500,
        operator: 'PGCIL',
      },
    ]);
    console.log('  ✅ 10 grid points added (8 substations + 2 Green Energy Corridors)');

    // ============================================================
    // 4. DEMAND CENTERS — Major Indian industrial & urban hubs
    // ============================================================
    console.log('\n🏭 Seeding Indian demand centers...');
    await db.insert(demandCenters).values([
      {
        name: 'Delhi NCR',
        type: 'mixed',
        latitude: '28.6139',
        longitude: '77.2090',
        demandLevel: 'very_high',
        peakDemand: 7409,
        population: 32900000,
      },
      {
        name: 'Mumbai Metropolitan Region',
        type: 'mixed',
        latitude: '19.0760',
        longitude: '72.8777',
        demandLevel: 'very_high',
        peakDemand: 4200,
        population: 20700000,
      },
      {
        name: 'Bengaluru Urban',
        type: 'mixed',
        latitude: '12.9716',
        longitude: '77.5946',
        demandLevel: 'high',
        peakDemand: 3100,
        population: 13200000,
      },
      {
        name: 'Chennai Metropolitan',
        type: 'mixed',
        latitude: '13.0827',
        longitude: '80.2707',
        demandLevel: 'high',
        peakDemand: 2800,
        population: 10900000,
      },
      {
        name: 'Hyderabad Metropolitan',
        type: 'mixed',
        latitude: '17.3850',
        longitude: '78.4867',
        demandLevel: 'high',
        peakDemand: 2600,
        population: 10500000,
      },
      {
        name: 'Ahmedabad Industrial Corridor, Gujarat',
        type: 'mixed',
        latitude: '23.0225',
        longitude: '72.5714',
        demandLevel: 'high',
        peakDemand: 2200,
        population: 8100000,
      },
      {
        name: 'Pune Auto & IT Industry, Maharashtra',
        type: 'industrial',
        latitude: '18.5204',
        longitude: '73.8567',
        demandLevel: 'high',
        peakDemand: 2100,
        population: 7400000,
      },
      {
        name: 'Surat Textile & Diamond Industry, Gujarat',
        type: 'industrial',
        latitude: '21.1702',
        longitude: '72.8311',
        demandLevel: 'high',
        peakDemand: 1800,
        population: 6600000,
      },
      {
        name: 'Visakhapatnam Steel & Port, AP',
        type: 'industrial',
        latitude: '17.6868',
        longitude: '83.2185',
        demandLevel: 'high',
        peakDemand: 1600,
        population: 2100000,
      },
      {
        name: 'Ludhiana Industrial Hub, Punjab',
        type: 'industrial',
        latitude: '30.9010',
        longitude: '75.8573',
        demandLevel: 'medium',
        peakDemand: 1200,
        population: 1800000,
      },
      {
        name: 'Jaipur Commercial Hub, Rajasthan',
        type: 'commercial',
        latitude: '26.9124',
        longitude: '75.7873',
        demandLevel: 'medium',
        peakDemand: 1100,
        population: 3900000,
      },
      {
        name: 'Coimbatore Textiles & Manufacturing, TN',
        type: 'industrial',
        latitude: '11.0168',
        longitude: '76.9558',
        demandLevel: 'medium',
        peakDemand: 900,
        population: 2200000,
      },
    ]);
    console.log('  ✅ 12 demand centers added');

    // ============================================================
    // 5. AI-SUGGESTED SITES — Best wind/solar/hybrid in India
    // ============================================================
    console.log('\n🤖 Seeding AI-suggested optimal Indian sites...');
    await db.insert(renewableSites).values([
      // ---- WIND ----
      {
        name: 'High-Potential Wind Farm — Rann of Kutch, Gujarat',
        type: 'wind',
        latitude: '23.9515',
        longitude: '70.2025',
        capacity: 500,
        suitabilityScore: 95,
        isAiSuggested: true,
        resourceQuality: 97,
        gridDistance: 18,
        landArea: 250,
        annualGeneration: 1533000,
        capacityFactor: '0.35',
        co2SavedAnnually: 766500,
        homesSupported: 139363,
        investmentRequired: 900,         // 900 million USD
        roiPercentage: '9.8',
        paybackYears: '10.2',
        description: "Rann of Kutch offers India's strongest coastal winds exceeding 9 m/s. Vast salt flat terrain with zero agricultural conflict. Green Energy Corridor evacuation within 18 km.",
      },
      {
        name: 'Muppandal Wind Expansion — Kanyakumari, Tamil Nadu',
        type: 'wind',
        latitude: '8.3108',
        longitude: '77.5520',
        capacity: 300,
        suitabilityScore: 93,
        isAiSuggested: true,
        resourceQuality: 95,
        gridDistance: 10,
        landArea: 150,
        annualGeneration: 919800,
        capacityFactor: '0.35',
        co2SavedAnnually: 459900,
        homesSupported: 83618,
        investmentRequired: 540,         // 540 million USD
        roiPercentage: '9.5',
        paybackYears: '10.5',
        description: "Adjacent to India's largest wind cluster in Muppandal. Proven high-wind zone with established supply chains and TANTRANSCO 400kV substation within 10 km.",
      },
      {
        name: 'Jaisalmer Wind Expansion, Rajasthan',
        type: 'wind',
        latitude: '27.2147',
        longitude: '70.9063',
        capacity: 400,
        suitabilityScore: 91,
        isAiSuggested: true,
        resourceQuality: 92,
        gridDistance: 22,
        landArea: 200,
        annualGeneration: 1226400,
        capacityFactor: '0.35',
        co2SavedAnnually: 613200,
        homesSupported: 111490,
        investmentRequired: 720,         // 720 million USD
        roiPercentage: '9.1',
        paybackYears: '11.0',
        description: "Extension of the established Jaisalmer Wind Park. Rajasthan's dedicated wind corridors and PGCIL Green Energy Corridor make this a top development opportunity.",
      },
      // ---- SOLAR ----
      {
        name: 'Ultra Mega Solar — Thar Desert, Rajasthan',
        type: 'solar',
        latitude: '26.8467',
        longitude: '72.1000',
        capacity: 1000,
        suitabilityScore: 97,
        isAiSuggested: true,
        resourceQuality: 99,
        gridDistance: 15,
        landArea: 4000,
        annualGeneration: 1752000,
        capacityFactor: '0.20',
        co2SavedAnnually: 876000,
        homesSupported: 159272,
        investmentRequired: 1000,        // 1000 million USD (1 billion)
        roiPercentage: '9.2',
        paybackYears: '10.9',
        description: "India's highest solar irradiance zone (6.8 kWh/m²/day). Flat barren land with no competing land use. PGCIL 765kV dedicated renewable evacuation line within the corridor.",
      },
      {
        name: 'Ladakh Solar Zone — Leh, J&K',
        type: 'solar',
        latitude: '34.2996',
        longitude: '78.0688',
        capacity: 250,
        suitabilityScore: 94,
        isAiSuggested: true,
        resourceQuality: 98,
        gridDistance: 30,
        landArea: 1000,
        annualGeneration: 438000,
        capacityFactor: '0.20',
        co2SavedAnnually: 219000,
        homesSupported: 39818,
        investmentRequired: 250,         // 250 million USD
        roiPercentage: '8.6',
        paybackYears: '11.6',
        description: "Highest solar irradiance in India (7.2 kWh/m²/day) due to high altitude and clear skies. Aligned with India's 7.5 GW Ladakh solar mission. HVDC transmission under development.",
      },
      {
        name: 'Coastal Solar Plant — Rameswaram, Tamil Nadu',
        type: 'solar',
        latitude: '9.2881',
        longitude: '79.3129',
        capacity: 350,
        suitabilityScore: 90,
        isAiSuggested: true,
        resourceQuality: 91,
        gridDistance: 12,
        landArea: 1400,
        annualGeneration: 613200,
        capacityFactor: '0.20',
        co2SavedAnnually: 306600,
        homesSupported: 55690,
        investmentRequired: 350,         // 350 million USD
        roiPercentage: '8.8',
        paybackYears: '11.4',
        description: "High irradiance with sea breeze cooling improving panel efficiency. Strong demand from Tuticorin industrial cluster. TANTRANSCO grid connectivity within 12 km.",
      },
      // ---- HYBRID ----
      {
        name: 'Wind-Solar Hybrid Hub — Fatehgarh, Rajasthan',
        type: 'hybrid',
        latitude: '27.4833',
        longitude: '72.1167',
        capacity: 600,
        suitabilityScore: 96,
        isAiSuggested: true,
        resourceQuality: 97,
        gridDistance: 12,
        landArea: 1500,
        annualGeneration: 1447560,
        capacityFactor: '0.275',
        co2SavedAnnually: 723780,
        homesSupported: 131616,
        investmentRequired: 840,         // 840 million USD
        roiPercentage: '9.6',
        paybackYears: '10.4',
        description: "Fatehgarh combines exceptional solar irradiance (6.7 kWh/m²/day) with strong winds (7.8 m/s). PGCIL 765kV line passes directly through zone. MNRE-recognised optimal hybrid development area.",
      },
      {
        name: 'Green Energy Park — Anantapur, Andhra Pradesh',
        type: 'hybrid',
        latitude: '14.6819',
        longitude: '77.6006',
        capacity: 400,
        suitabilityScore: 92,
        isAiSuggested: true,
        resourceQuality: 93,
        gridDistance: 8,
        landArea: 1000,
        annualGeneration: 964600,
        capacityFactor: '0.275',
        co2SavedAnnually: 482300,
        homesSupported: 87690,
        investmentRequired: 560,         // 560 million USD
        roiPercentage: '8.9',
        paybackYears: '11.2',
        description: "Anantapur is India's driest district with excellent wind-solar complementarity. Multiple large-scale projects already operational nearby. APSPDCL 400kV substation at just 8 km.",
      },
    ]);
    console.log('  ✅ 8 AI-suggested sites added (3 Wind · 3 Solar · 2 Hybrid)');

    // ---- Final Summary ----
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   ✅  Indian Database Seeding Complete!             ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('\n📊 Summary:');
    console.log('   💨  8 Wind Zones — TN, GJ, RJ, AP, KA, MH, MP, HP');
    console.log('   ☀️   8 Solar Zones — RJ, GJ, AP, MP, KA, TN, TS, Ladakh');
    console.log('   ⚡  10 Grid Points — PGCIL, GETCO, MSETCL, KPTCL + more');
    console.log('   🏭  12 Demand Centers — Delhi, Mumbai, Bengaluru + 9 more');
    console.log('   🤖   8 AI Sites — 3 Wind · 3 Solar · 2 Hybrid\n');
    console.log('   🗺️  Map center: India (20.5937°N, 78.9629°E)\n');

    process.exit(0);
  } catch (error: any) {
    if (error?.code === '23505') {
      console.error('\n⚠️  Data already exists. Clear tables first, then re-run.');
      console.log('   TRUNCATE wind_resources, solar_resources, grid_infrastructure,');
      console.log('   demand_centers, renewable_sites CASCADE;\n');
    } else {
      console.error('\n❌ Error seeding database:', error);
    }
    process.exit(1);
  }
}

seedIndianDatabase();
