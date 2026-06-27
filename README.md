# 🌍 Project Icarus
### Renewable Energy Intelligence Platform for India
 
> An AI-powered full-stack platform for renewable energy site analysis, portfolio management, and investment decision-making — built specifically for the Indian market.
 
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20Node.js-green?logo=node.js)](https://expressjs.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Supabase-orange?logo=postgresql)](https://supabase.com)
[![Deployed on](https://img.shields.io/badge/Deployed%20on-Render%20%2B%20Vercel-purple)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
 
---
 
## 📋 Table of Contents
 
- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Data Flow](#-data-flow)
- [Database Schema](#-database-schema)
- [Component Tree](#-component-tree)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Indian Policy Integration](#-indian-policy-integration)
- [Roadmap](#-roadmap)
- [License](#-license)
---
 
## 🎯 Overview
 
**Project Icarus** addresses a critical gap in India's renewable energy sector: the lack of an integrated, data-driven platform for site selection and investment analysis. Traditional approaches rely on manual surveys, siloed datasets, and generic global tools that don't account for India's unique geography, grid infrastructure, and policy landscape.
 
### What Icarus Does
 
- **Drop a pin anywhere on India** → Instant AI-powered suitability analysis
- **Evaluate 5 key factors** → Resource quality, grid proximity, land availability, economic viability, environmental impact
- **Apply Indian state context** → PLI incentives, PPA rates, state-specific policies
- **Build and compare portfolios** → Multi-site comparison with radar charts and detailed metrics
- **Visualize impact** → CO₂ saved, homes powered, jobs created
### Why It Matters
 
India has a target of **500 GW of renewable energy by 2030**. Achieving this requires:
- Faster site identification and screening
- Better economic modeling with Indian policy incentives
- Integrated environmental impact assessment
- Data-driven portfolio optimization
Icarus makes all of this accessible in one platform.
 
---
 
## 🌐 Live Demo
 
| Service | URL |
|--------|-----|
| Frontend | [icarus-renewable.vercel.app](https://icarus-renewable.vercel.app) |
| Backend API | [icarus-api.onrender.com](https://icarus-api.onrender.com) |
| API Health | [/api/renewable-sites](https://icarus-api.onrender.com/api/renewable-sites) |
 
---
 
## ✨ Key Features
 
### 🗺️ 1. Drag-and-Drop Site Analysis (Core Feature)
 
The signature feature of Icarus. Click anywhere on the map of India to:
 
- **Drop a pin** at any latitude/longitude
- **Select energy type**: Solar ☀️, Wind 💨, or Hybrid ⚡
- **Trigger real-time AI analysis** via backend scoring engine
- **View a slide-in analysis panel** with:
  - Overall suitability score (0–100) with color-coded progress bar
  - Technical metrics (capacity, generation, capacity factor, grid distance)
  - Economic analysis (investment, ROI, payback period)
  - Environmental impact (CO₂ saved, homes powered, jobs created)
  - Detailed scoring factors with individual progress bars
  - State-specific policy recommendations
  - Risk warnings
### 📊 2. Interactive Dashboard
 
- **4 stat cards**: Total sites, capacity (MW), generation (MWh), investment ($M)
- **3 impact cards**: CO₂ saved, homes powered, average ROI
- **4 interactive charts** (Recharts):
  - Bar chart: Capacity by energy type
  - Pie chart: Portfolio distribution
  - Line chart: Top 5 sites ROI vs Suitability
  - Timeline: 5-year generation projection with degradation factor
- **Top sites table**: Ranked by suitability score
- **All sites grid**: Complete portfolio overview
### ⚖️ 3. Site Comparison Tool
 
- Select 2–4 sites using checkboxes
- Compare with:
  - **Radar chart**: Multi-axis performance comparison
  - **Dual-axis bar chart**: Capacity vs Generation
  - **Full metrics table**: Side-by-side all indicators
  - **AI Recommendation**: Best site with justification
### 💾 4. Save Analyzed Sites
 
- Save any analyzed location with a custom name
- Persists to PostgreSQL database
- Immediately appears on map and dashboard
- Tracked in portfolio statistics
### 🇮🇳 5. Indian Policy Integration
 
State-specific analysis for 5 key states with:
- Production Linked Incentive (PLI) schemes
- Power Purchase Agreement (PPA) rates
- Banking facilities
- State policy recommendations
### 🗺️ 6. Multi-Layer Map
 
Toggle on/off:
- **AI-recommended sites** (8 pre-analyzed optimal locations)
- **Wind resource zones** (8 high-potential areas, 20km radius circles)
- **Solar resource zones** (8 high-irradiance regions)
- **Grid infrastructure** (10 major substations)
- **Demand centers** (12 high-consumption industrial/residential hubs)
---
 
## 🛠️ Tech Stack
 
### Frontend
 
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.4.19 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Leaflet.js | 1.9.4 | Interactive maps |
| React-Leaflet | 4.2.1 | React bindings for Leaflet |
| Recharts | 2.x | Data visualization |
| TanStack Query | 5.x | Server state management |
| Lucide React | 0.383.0 | Icon library |
 
### Backend
 
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.21 | Web framework |
| TypeScript | 5.x | Type safety |
| Drizzle ORM | 0.36 | Database ORM |
| tsx | 4.x | TypeScript execution |
| dotenv | 16.x | Environment variables |
| cors | 2.x | Cross-origin resource sharing |
| express-session | 1.x | Session management |
 
### Database & Infrastructure
 
| Technology | Purpose |
|-----------|---------|
| PostgreSQL | Primary database |
| Supabase | Managed PostgreSQL hosting |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| GitHub | Version control & CI/CD |
 
---
 
## 🏗️ System Architecture
 
```
╔══════════════════════════════════════════════════════════════════╗
║                        CLIENT LAYER                            ║
║                    (Vercel - Global CDN)                       ║
║                                                                  ║
║   ┌─────────────┐   ┌──────────────┐   ┌───────────────────┐  ║
║   │  React App  │   │ Leaflet Maps │   │ Recharts Dashbrd  │  ║
║   │ (TypeScript)│   │  (Geospatial)│   │ (Data Viz)        │  ║
║   └──────┬──────┘   └──────┬───────┘   └────────┬──────────┘  ║
║          │                 │                     │              ║
║          └─────────────────┴─────────────────────┘              ║
║                            │                                    ║
║                     TanStack Query                              ║
║                    (Cache + Mutations)                          ║
║                            │                                    ║
║                       API Client                                ║
║                  (fetch + error handling)                       ║
╚════════════════════════════╪═════════════════════════════════════╝
                             │
                       HTTPS / REST
                             │
╔════════════════════════════╪═════════════════════════════════════╗
║                       SERVER LAYER                             ║
║                   (Render - Node.js 20)                        ║
║                            │                                    ║
║                    Express Router                               ║
║                            │                                    ║
║        ┌───────────────────┼──────────────────┐               ║
║        │                   │                  │               ║
║  ┌─────▼──────┐   ┌───────▼──────┐   ┌──────▼──────┐        ║
║  │  Analysis  │   │ Site Routes  │   │ Resource    │        ║
║  │  Engine    │   │ CRUD + Save  │   │ Routes      │        ║
║  │ (Scoring)  │   │              │   │ Wind/Solar  │        ║
║  └─────┬──────┘   └───────┬──────┘   └──────┬──────┘        ║
║        │                   │                  │               ║
║        └───────────────────┴──────────────────┘               ║
║                            │                                    ║
║                      Drizzle ORM                                ║
╚════════════════════════════╪═════════════════════════════════════╝
                             │
                      PostgreSQL / SSL
                             │
╔════════════════════════════╪═════════════════════════════════════╗
║                     DATABASE LAYER                             ║
║                  (Supabase - Managed PG)                       ║
║                                                                  ║
║  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  ║
║  │  renewable_  │  │   wind_      │  │  solar_resources   │  ║
║  │  sites       │  │   resources  │  │  grid_infra        │  ║
║  │  (main)      │  │              │  │  demand_centers    │  ║
║  └──────────────┘  └──────────────┘  └────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════╝
```
 
---
 
## 🔄 Data Flow
 
### Flow 1: Click-to-Analyze (Core Feature)
 
```
User clicks map
      │
      ▼
MapView captures coordinates
+ selected site type (wind/solar/hybrid)
      │
      ▼
POST /api/analyze-site
{ type, latitude, longitude, capacity }
      │
      ▼
Backend: Analysis Engine
┌─────────────────────────────────────┐
│  1. Detect Indian state             │
│  2. Query wind/solar resources      │
│  3. Find nearest grid point         │
│  4. Score resource quality (0-100)  │
│  5. Score grid proximity (0-100)    │
│  6. Calculate capacity factor       │
│  7. Compute annual generation       │
│  8. Apply state PLI incentives      │
│  9. Calculate ROI with PPA rate     │
│  10. Compute environmental impact   │
│  11. Generate recommendations       │
│  12. Compute overall score          │
└─────────────────────────────────────┘
      │
      ▼
Response: SiteAnalysis JSON
      │
      ▼
SiteAnalysisPanel renders
(slide-in from right)
      │
      ▼
User clicks Save
      │
      ▼
POST /api/sites/save-analyzed
      │
      ▼
INSERT INTO renewable_sites
      │
      ▼
React Query invalidates cache
      │
      ▼
Map + Dashboard refresh
with new site
```
 
### Flow 2: Dashboard Load
 
```
User navigates to Dashboard
      │
      ▼
useRenewableSites() hook fires
      │
      ▼
GET /api/renewable-sites
      │
      ▼
PostgreSQL returns all sites
      │
      ▼
React Query caches result
      │
      ▼
Dashboard renders:
┌─────────────────────┐
│  Stats Cards        │ ← Aggregated from sites array
│  Impact Metrics     │ ← CO2, homes, ROI computed
│  DashboardCharts    │ ← Recharts receives sites data
│  Top Sites Table    │ ← Sorted by suitabilityScore
│  All Sites Grid     │ ← Full list with checkboxes
└─────────────────────┘
```
 
### Flow 3: Site Comparison
 
```
User checks 2-4 sites
      │
      ▼
selectedSitesForComparison state updates
      │
      ▼
"Compare X Sites" button appears
      │
      ▼
User clicks Compare
      │
      ▼
SiteComparison modal opens
      │
      ▼
sites.filter(s => selectedIds.includes(s.id))
      │
      ▼
Renders:
┌─────────────────────────────┐
│  Summary cards (per site)   │
│  Radar chart (4 metrics)    │
│  Dual-axis bar chart        │
│  Metrics comparison table   │
│  AI Recommendation          │
└─────────────────────────────┘
```
 
---
 
## 🗄️ Database Schema
 
```sql
-- ══════════════════════════════════════
-- CORE TABLE: All saved renewable sites
-- ══════════════════════════════════════
CREATE TABLE renewable_sites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  type            VARCHAR(20) NOT NULL CHECK (type IN ('wind','solar','hybrid')),
  latitude        DECIMAL(10, 6) NOT NULL,
  longitude       DECIMAL(10, 6) NOT NULL,
  capacity        INTEGER NOT NULL,                    -- MW
  suitability_score INTEGER NOT NULL,                 -- 0-100
  resource_quality  INTEGER,                          -- 0-100
  grid_distance     DECIMAL(10, 2),                   -- km
  land_area         INTEGER,                          -- hectares
  annual_generation INTEGER,                          -- MWh/year
  capacity_factor   DECIMAL(4, 2),                    -- 0-1
  co2_saved_annually INTEGER,                         -- tons/year
  homes_supported   INTEGER,
  investment_required DECIMAL(10, 2),                 -- $M
  roi_percentage    DECIMAL(5, 2),                    -- %
  payback_years     DECIMAL(5, 2),                    -- years
  is_ai_suggested   BOOLEAN DEFAULT FALSE,
  description       TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- ══════════════════════════════════════
-- WIND RESOURCE ZONES
-- ══════════════════════════════════════
CREATE TABLE wind_resources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  latitude        DECIMAL(10, 6) NOT NULL,
  longitude       DECIMAL(10, 6) NOT NULL,
  avg_wind_speed  DECIMAL(4, 2) NOT NULL,             -- m/s
  wind_power_density INTEGER,                         -- W/m²
  capacity        INTEGER,                            -- MW
  turbine_count   INTEGER,
  is_existing     BOOLEAN DEFAULT FALSE
);
 
-- ══════════════════════════════════════
-- SOLAR RESOURCE ZONES
-- ══════════════════════════════════════
CREATE TABLE solar_resources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  latitude        DECIMAL(10, 6) NOT NULL,
  longitude       DECIMAL(10, 6) NOT NULL,
  ghi             DECIMAL(5, 2) NOT NULL,             -- kWh/m²/day
  capacity        INTEGER,                            -- MW
  is_existing     BOOLEAN DEFAULT FALSE
);
 
-- ══════════════════════════════════════
-- GRID INFRASTRUCTURE
-- ══════════════════════════════════════
CREATE TABLE grid_infrastructure (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  type            VARCHAR(50) CHECK (type IN ('substation','transmission_line')),
  latitude        DECIMAL(10, 6) NOT NULL,
  longitude       DECIMAL(10, 6) NOT NULL,
  voltage         INTEGER,                            -- kV
  capacity        INTEGER,                            -- MVA
  operator        VARCHAR(255)
);
 
-- ══════════════════════════════════════
-- DEMAND CENTERS
-- ══════════════════════════════════════
CREATE TABLE demand_centers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  type            VARCHAR(50) CHECK (type IN ('industrial','residential','commercial','mixed')),
  latitude        DECIMAL(10, 6) NOT NULL,
  longitude       DECIMAL(10, 6) NOT NULL,
  demand_level    VARCHAR(20) CHECK (demand_level IN ('low','medium','high','very_high')),
  peak_demand     INTEGER,                            -- MW
  population      INTEGER
);
```
 
### Entity Relationship Diagram
 
```
renewable_sites
      │
      │ (scored against)
      │
      ├──── wind_resources   (Haversine distance scoring)
      │
      ├──── solar_resources  (GHI scoring)
      │
      ├──── grid_infrastructure (nearest point distance)
      │
      └──── demand_centers   (proximity weighting)
```
 
---
 
## 🧩 Component Tree
 
```
App (App.tsx)
│
├── Sidebar (Sidebar.tsx)
│   ├── Logo + Brand
│   ├── Navigation Links
│   │   ├── Map View
│   │   └── Dashboard
│   └── Resource Counts (sites, wind zones, solar zones, grid)
│
├── MapView (MapView.tsx)                    [view = 'map']
│   ├── MapContainer (Leaflet)
│   │   ├── TileLayer (OpenStreetMap)
│   │   ├── MapClickHandler (useMapEvents hook)
│   │   ├── MapRecenter (useMap hook)
│   │   │
│   │   ├── [Layer: Sites]
│   │   │   └── Marker × N (renewable_sites)
│   │   │       └── Popup (name, type, score, CTA button)
│   │   │
│   │   ├── [Layer: New Pin]
│   │   │   └── Marker (red SVG icon at clicked location)
│   │   │       └── Popup (lat/lng + loading spinner)
│   │   │
│   │   ├── [Layer: Wind Zones]
│   │   │   └── Circle × 8 (blue, r=20km)
│   │   │       └── Popup (name, speed, capacity)
│   │   │
│   │   ├── [Layer: Solar Zones]
│   │   │   └── Circle × 8 (orange, r=20km)
│   │   │       └── Popup (name, GHI, capacity)
│   │   │
│   │   ├── [Layer: Grid Infrastructure]
│   │   │   └── Marker × 10 (yellow)
│   │   │       └── Popup (name, voltage, operator)
│   │   │
│   │   └── [Layer: Demand Centers]
│   │       └── Circle × 12 (red, r=30km)
│   │           └── Popup (name, type, demand level)
│   │
│   ├── AnalyzeNewSite Button (top-left)
│   ├── SiteType Selector (Solar/Wind/Hybrid)
│   ├── LayerControls (top-right checkboxes)
│   ├── LoadingOverlay (while data fetches)
│   └── SiteAnalysisPanel (conditional, z-index overlay)
│       ├── Header (site name, type, emoji, AI badge)
│       ├── SaveButton (💾 icon, for new sites only)
│       ├── SaveNameInput (conditional, with Save/Cancel)
│       ├── SavedBanner (green, conditional)
│       ├── SuitabilityScore (progress bar, 0-100)
│       ├── TechnicalMetrics (capacity, generation, CF, grid)
│       ├── EconomicAnalysis (investment, ROI, payback)
│       ├── EnvironmentalImpact (CO₂, homes, cars equiv.)
│       ├── ScoringFactors (5 factors with progress bars)
│       ├── Recommendations (green cards with ✓)
│       ├── Warnings (orange cards with ⚠️)
│       └── Location (lat/lng coordinates)
│
└── Dashboard (Dashboard.tsx)               [view = 'dashboard']
    ├── Header (title, site count)
    │
    ├── StatsGrid (4 cards)
    │   ├── Total Sites
    │   ├── Total Capacity (MW)
    │   ├── Annual Generation (MWh)
    │   └── Total Investment ($M)
    │
    ├── ImpactMetrics (3 gradient cards)
    │   ├── CO₂ Saved (green)
    │   ├── Homes Powered (blue)
    │   └── Average ROI (purple)
    │
    ├── DashboardCharts (DashboardCharts.tsx)
    │   ├── CapacityBarChart (by type)
    │   ├── PortfolioPieChart (distribution)
    │   ├── ROILineChart (top 5 sites)
    │   └── GenerationTimeline (5-year projection)
    │
    ├── TopSitesTable (top 5 by score)
    │
    ├── AllSitesGrid
    │   └── SiteCard × N
    │       ├── Checkbox (for comparison)
    │       ├── Type emoji + name
    │       ├── AI badge (conditional)
    │       └── Key metrics
    │
    ├── CompareSitesButton (conditional, ≥2 selected)
    └── SiteComparison Modal (conditional)
        ├── Header (title, count)
        ├── SummaryCards (one per site, color-coded)
        ├── RadarChart (Suitability/Resource/ROI/Grid)
        ├── DualAxisBarChart (Capacity + Generation)
        ├── MetricsTable (all KPIs side by side)
        └── AIRecommendation (best site + insights)
```
 
---
 
## 📡 API Reference
 
### Base URL
```
Production:  https://your-backend.onrender.com
Development: http://localhost:4000
```
 
### Endpoints
 
#### Site Analysis
 
```
POST /api/analyze-site
```
 
Analyzes a location without saving. Used by the map click-to-analyze feature.
 
**Request:**
```json
{
  "type": "solar",
  "latitude": 23.0225,
  "longitude": 72.5714,
  "capacity": 500
}
```
 
**Response:**
```json
{
  "suitabilityScore": 85,
  "energyType": "solar",
  "factors": {
    "resourceQuality": 92,
    "gridProximity": "Excellent",
    "landAvailability": "Good",
    "economicViability": "Good",
    "environmentalImpact": "Positive"
  },
  "technicalMetrics": {
    "estimatedCapacity": 500,
    "capacityFactor": 0.22,
    "annualGeneration": 964200,
    "gridDistance": 8.5,
    "landAreaRequired": 2000
  },
  "economicMetrics": {
    "investmentRequired": 375,
    "annualRevenue": 53031000,
    "operatingCosts": 9375000,
    "roi": 11.63,
    "paybackPeriod": 8.6
  },
  "impactMetrics": {
    "co2SavedAnnually": 482100,
    "homesSupported": 87654,
    "jobsCreated": 1500
  },
  "recommendations": [
    "Excellent state incentives in Gujarat: 25% PLI reduction on investment",
    "Gujarat Solar Power Policy 2021 - Priority grid connectivity",
    "Excellent resource quality - high potential for energy generation",
    "Strong economic returns (11.6%) with PPA at ₹4,565/MWh"
  ],
  "warnings": []
}
```
 
---
 
```
GET /api/renewable-sites
```
Returns all saved sites.
 
---
 
```
POST /api/sites/save-analyzed
```
Saves an analyzed location to the database.
 
**Request:**
```json
{
  "name": "Kutch Solar Farm",
  "type": "solar",
  "latitude": 23.0225,
  "longitude": 72.5714,
  "capacity": 500,
  "analysis": { }
}
```
 
---
 
```
GET /api/wind-resources
GET /api/solar-resources
GET /api/grid-infrastructure
GET /api/demand-centers
```
Return geospatial resource data for map layers.
 
---
 
```
GET /api/dashboard/stats
```
Returns aggregated portfolio statistics.
 
---
 
### HTTP Status Codes
 
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (missing fields) |
| 404 | Not Found |
| 500 | Server Error |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 20+
- npm 10+
- PostgreSQL database (or free Supabase account)
- Git
### Clone & Install
 
```bash
git clone https://github.com/yourusername/project-icarus.git
cd project-icarus
npm install
```
 
### Environment Setup
 
Create `.env` in the project root:
 
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=4000
NODE_ENV=development
SESSION_SECRET=your-random-secret-here
```
 
Create `client/.env`:
 
```env
VITE_API_URL=http://localhost:4000
```
 
### Database Setup
 
```bash
# Push schema to database
npm run db:push
 
# Seed with Indian renewable energy data
npm run db:seed
```
 
This seeds:
- 8 AI-recommended renewable sites
- 8 wind resource zones
- 8 solar resource zones
- 10 grid infrastructure points
- 12 demand centers
### Run Development Servers
 
```bash
# Terminal 1 — Backend (port 4000)
npm run dev
 
# Terminal 2 — Frontend (port 5173)
npm run dev:client
```
 
Open: **http://localhost:5173**
 
---
 
## ⚙️ Environment Variables
 
### Backend (`.env`)
 
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PORT` | ✅ | Server port (default: 4000) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `SESSION_SECRET` | ✅ | Secret for session signing |
| `FRONTEND_URL` | Production | Frontend URL for CORS |
 
### Frontend (`client/.env`)
 
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend base URL |
 
---
 
## 🚢 Deployment
 
### Frontend → Vercel
 
1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/client`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy
### Backend → Render
 
1. Create new **Web Service** on [render.com](https://render.com)
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `NODE_ENV=production tsx -r dotenv/config server/index.ts`
4. Add environment variables
5. Deploy
### Database → Supabase
 
1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string from Settings → Database
3. Set as `DATABASE_URL` in Render
4. Run `npm run db:push` to create tables
5. Run `npm run db:seed` to populate data
---
 
## 🇮🇳 Indian Policy Integration
 
### State-Specific Analysis
 
| State | PLI Incentive | PPA Rate | Key Policy |
|-------|--------------|----------|------------|
| Gujarat | 25% | ₹4,565/MWh | Solar Power Policy 2021 |
| Rajasthan | 30% | ₹4,316/MWh | Solar Energy Policy 2019 |
| Tamil Nadu | 20% | ₹4,814/MWh | Wind Energy Leader |
| Karnataka | 22% | ₹4,648/MWh | Renewable Energy Policy 2022 |
| Madhya Pradesh | 18% | ₹4,482/MWh | Ultra Mega Solar Parks |
| Rest of India | 15% | ₹4,399/MWh | Central MNRE Schemes |
 
### Analysis Scoring Weights
 
```
Suitability Score (0-100) =
  Resource Quality    × 40%   (wind speed or solar GHI)
  Grid Proximity      × 20-25% (distance to nearest substation)
  Land Availability   × 20%   (fixed baseline)
  Economic Viability  × 15%   (land + terrain factors)
  ROI Factor          × 5%    (capped at 15% ROI for scoring)
```
 
### Economic Model
 
```
Investment = Capacity × (₹/MW rate) × (1 - PLI Incentive %)
 
Annual Revenue = Annual Generation (MWh) × State PPA Rate (USD/MWh)
 
Operating Costs = Total Investment × 2.5%
 
Annual Profit = Annual Revenue - Operating Costs
 
ROI = (Annual Profit / Total Investment) × 100
 
Payback Period = Total Investment / Annual Profit
```
 
---
 
## 🗺️ Roadmap
 
### Version 1.1 (Next)
- [ ] PDF investment report generation
- [ ] Excel portfolio export
- [ ] Toast notifications (replace browser alerts)
- [ ] Animated number counters on dashboard
### Version 1.2
- [ ] User authentication (JWT)
- [ ] Multi-user portfolios
- [ ] Project notes and tags
### Version 2.0
- [ ] Real-time weather API integration
- [ ] Satellite imagery for land assessment
- [ ] ML model for improved scoring
- [ ] Mobile app (React Native)
- [ ] Integration with Google Earth Engine
### Future
- [ ] Integration with POSOCO grid data
- [ ] Live MNRE project database
- [ ] Carbon credit marketplace integration
- [ ] Investment fund matching
---
 
## 📁 Project Structure
 
```
project-icarus/
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── DashboardCharts.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SiteAnalysisPanel.tsx
│   │   │   ├── SiteComparison.tsx
│   │   │   └── AnimatedCounter.tsx
│   │   ├── hooks/
│   │   │   └── useRenewableSites.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── .env
│
├── server/                          # Backend
│   ├── index.ts                     # Express app entry point
│   ├── routes.ts                    # All API routes
│   ├── analysis.ts                  # AI scoring engine
│   ├── db.ts                        # Database connection
│   └── seed-data.ts                 # Database seeding
│
├── shared/                          # Shared types
│   └── schema.ts                    # Drizzle schema + types
│
├── .env                             # Backend env vars
├── .gitignore
├── drizzle.config.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```
 
---
 
## 🤝 Contributing
 
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request
### Commit Convention
 
```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructure
test:     Tests
chore:    Build/config changes
```
 
---
 
## 📜 License
 
This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.
 
---
 
## 👨‍💻 Author
 
**Maalav** — Full-Stack Developer
- Built with React, TypeScript, Express, PostgreSQL
- Deployed on Vercel + Render + Supabase
---
 
## 🙏 Acknowledgements
 
- [Leaflet.js](https://leafletjs.com) — Interactive maps
- [Recharts](https://recharts.org) — React chart library
- [Supabase](https://supabase.com) — Open source Firebase alternative
- [Drizzle ORM](https://orm.drizzle.team) — TypeScript ORM
- [TanStack Query](https://tanstack.com/query) — Async state management
- [Ministry of New & Renewable Energy, India](https://mnre.gov.in) — Policy reference data
- [OpenStreetMap](https://www.openstreetmap.org) — Map tiles
---
 
<div align="center">
  <strong>Built with ❤️ for India's renewable energy future 🇮🇳</strong>
  <br/>
  <em>Targeting 500 GW renewable capacity by 2030</em>
</div>
 
