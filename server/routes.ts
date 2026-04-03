import { Express, Request, Response } from "express";
import { db } from "./db.js";
import {
    renewableSites,
    windResources,
    solarResources,
    gridInfrastructure,
    demandCenters
} from '../shared/schema.js';
import { eq, and, gt, lt } from 'drizzle-orm';
import { analyzeSite } from './analysis.js';

//extend express request to include session
declare module 'express-session' {
    interface SessionData {
        userId?: number;
        email?: string;
    }
}

export function setupRoutes (app: Express) {
  // ============================================
  // RENEWABLE SITES ENDPOINTS
  // ============================================
  
  /**
   * GET /api/renewable-sites
   * Get all renewable sites for the current user
   */  
    app.get('/api/renewable-sites',async (req: Request, res: Response) => {
        try {
            const sites = await db.select().from(renewableSites);
            console.log(`📊 Fetched ${sites.length} renewable sites`);
            res.json(sites);
        } catch(error) {
            console.error('Error fetching renewable sites:',error);
            res.status(500).json({ error: 'Failed to fetch renewable sites'});
        }
    });

    /**
     * GET /api/renewable-sites/:id
     * Get a single renewable site by ID
     */
    app.get('/api/renewable-sites/:id',async (req: Request, res: Response) => {
        try{
            const id = req.params.id; //uuid
            if(!id||id.trim()===''){
                return res.status(400).json({ error: 'Invalid site ID '});
            }
            const [site] = await db
              .select()
              .from(renewableSites)
              .where(eq(renewableSites.id, id));
            if(!site) {
                return res.status(404).json({ error: 'Site not found' });
            }
            console.log(`📍 Fetched site: ${site.name}`);
            res.json(site);
        } catch (error) {
            console.error('Error fetching site:',error);
            res.status(500).json({ error: 'Failed to fetch site' });
        }
    });

    /**
     * POST /api/renewable-sites
     * Create a new renewable site
     */
    app.post('/api/renewable-sites/', async (req: Request, res: Response) => {
        try {
            const { name, type, latitude, longitude, capacity } = req.body;
            //validate required fields
            if( !name || !type || latitude === undefined || longitude === undefined) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['name','type','latitude','longitude']
                });
            }
            //validate type
            if (!['wind','solar','hybrid'].includes(type)){
                return res.status(400).json({
                    error: 'Invalid type. Must be wind, solar, or hybrid'
            });
            }
            // set default capacity if not provided
            const siteCapacity = capacity || 50;
            
            console.log(`🏗️  Creating new ${type} site: ${name} at (${latitude}, ${longitude})`);
            //perform site analysis 
            const analysis = await analyzeSite({
                type,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                capacity: siteCapacity,
            });
            // Insert site into database
            const [newSite] = await db
                .insert(renewableSites)
                .values({
                    name,
                    type,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    capacity: siteCapacity,
                    suitabilityScore: analysis.suitabilityScore,
                    resourceQuality: analysis.factors.resourceQuality,
                    gridDistance: analysis.technicalMetrics.gridDistance,
                    landArea: analysis.technicalMetrics.landAreaRequired,
                    annualGeneration: analysis.technicalMetrics.annualGeneration,
                    capacityFactor: analysis.technicalMetrics.capacityFactor.toString(),
                    co2SavedAnnually: analysis.impactMetrics.co2SavedAnnually,
                    homesSupported: analysis.impactMetrics.homesSupported,
                    investmentRequired: analysis.economicMetrics.investmentRequired,
                    roiPercentage: analysis.economicMetrics.roi.toString(),
                    paybackYears: analysis.economicMetrics.paybackPeriod.toString(),
                    isAiSuggested: false,
                }).returning();
            console.log(`✅ Site created successfully: ID ${newSite.id}`);
            //return both site and analysis
            res.status(201).json({
                site: newSite,
                analysis,
            });
        } catch (error) {
            console.error('Error creating site:',error);
            res.status(500).json({ error: 'Failed to create renewable site' });
        }
    });

    /**
     * PUT /api/renewable-sites/:id
     * Update an existing renewable site
     */
    app.put('/api/renewable-sites/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if(!id || id.trim() === '') {
                return res.status(400).json({ error: 'Invalid site ID' });
            }
            const { name, capacity, description } = req.body;
            //Build update object with only provided fields
            const updateData: any = {};
            if(name !== undefined) updateData.name = name;
            if(capacity !== undefined) updateData.capacity = capacity;
            if(description !== undefined) updateData.description = description;
            if(Object.keys(updateData).length === 0 ){
                return res.status(400).json({ error: 'No fields to update' });
            }
            console.log(`✏️  Updating site ID ${id}`);
            const [updatedSite] = await db
                .update(renewableSites)
                .set(updateData)
                .where(eq(renewableSites.id, id))
                .returning();
            if(!updatedSite) {
                return res.status(404).json({ error: 'Site not found' });
            }
            
            console.log(`✅ Site updated successfully: ID ${updatedSite.id}`);
            res.json(updatedSite);
        } catch (error) {
            console.error('Error updating site:',error);
            res.status(500).json({ error: 'Failed to update renewable site' });
        }
    });

    /**
     * DELETE /api/renewable-sites/:id
     * Delete a renewable site
     */
    app.delete('/api/renewable-sites/:id',async (req: Request, res:Response) => {
        try{
            const id = req.params.id;
            if(!id||id.trim() === ''){
                return res.status(400).json({ error: 'Invalid site ID' });
            }
            console.log(`🗑️  Deleting site ID ${id}`);
            const [deleted] = await db
                .delete(renewableSites)
                .where(eq(renewableSites.id, id))
                .returning();
            if(!deleted) {
                return res.status(404).json({ error: 'Site not found' });
            }
            console.log(`✅ Site deleted successfully`);
            res.json({
                message: 'Site deleted successfully',
                deletedSite: deleted
            });      
        } catch(error){
            console.error('Error deleting site:',error);
            res.status(500).json({ error: 'Failed to delete site' });
        }
    });

    // ============================================
    // AI SUGGESTIONS ENDPOINT
    // ============================================
  
   /**
    * GET /api/ai-suggestions
    * Get AI-suggested optimal sites
    */ 
   app.get('/api/ai-suggestions', async (req:Request, res:Response) => {
    try{
        const suggestions = await db
            .select()
            .from(renewableSites)
            .where(eq(renewableSites.isAiSuggested, true));
        console.log(`🤖 Fetched ${suggestions.length} AI suggestions`);
        res.json(suggestions);
    } catch(error){
        console.error('Error fetching AI suggestions:',error);
        res.status(500).json({ error: 'Failed to fetch AI suggestions'});
    }
   });

    // ============================================
    // RESOURCE DATA ENDPOINTS
    // ============================================
  
    /**
     * GET /api/wind-resources
     * Get all wind resource zones
     */
    app.get('/api/wind-resources', async (req: Request, res: Response) => {
    try {
      const resources = await db.select().from(windResources);
      
      console.log(`💨 Fetched ${resources.length} wind resources`);
      res.json(resources);
    } catch (error) {
      console.error('Error fetching wind resources:', error);
      res.status(500).json({ error: 'Failed to fetch wind resources' });
    }
  });
  
  /**
   * GET /api/solar-resources
   * Get all solar resource zones
   */
  app.get('/api/solar-resources', async (req: Request, res: Response) => {
    try {
      const resources = await db.select().from(solarResources);
      
      console.log(`☀️  Fetched ${resources.length} solar resources`);
      res.json(resources);
    } catch (error) {
      console.error('Error fetching solar resources:', error);
      res.status(500).json({ error: 'Failed to fetch solar resources' });
    }
  });
  
  /**
   * GET /api/grid-infrastructure
   * Get all grid infrastructure (substations and transmission lines)
   */
  app.get('/api/grid-infrastructure', async (req: Request, res: Response) => {
    try {
      const infrastructure = await db.select().from(gridInfrastructure);
      
      console.log(`⚡ Fetched ${infrastructure.length} grid infrastructure points`);
      res.json(infrastructure);
    } catch (error) {
      console.error('Error fetching grid infrastructure:', error);
      res.status(500).json({ error: 'Failed to fetch grid infrastructure' });
    }
  });
  
  /**
   * GET /api/demand-centers
   * Get all energy demand centers
   */
  app.get('/api/demand-centers', async (req: Request, res: Response) => {
    try {
      const centers = await db.select().from(demandCenters);
      
      console.log(`🏭 Fetched ${centers.length} demand centers`);
      res.json(centers);
    } catch (error) {
      console.error('Error fetching demand centers:', error);
      res.status(500).json({ error: 'Failed to fetch demand centers' });
    }
  });

    // ============================================
    // DASHBOARD & ANALYTICS ENDPOINTS
    // ============================================
  
    /**
     * GET /api/dashboard/stats
     * Get aggregated dashboard statistics
     */
    app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
        try{
            const sites = await db.select().from(renewableSites);
            const stats = {
                totalSites: sites.length,
                totalCapacity: sites.reduce((sum, site) => sum + site.capacity,0),
                totalGeneration: sites.reduce((sum, site) => sum + (site.annualGeneration || 0) ,0),
                totalCO2Saved: sites.reduce((sum, site) => sum + (site.co2SavedAnnually || 0),0),
                totalHomesSupported: sites.reduce((sum, site) => sum + (site.homesSupported || 0), 0),
                totalInvestment: sites.reduce((sum, site) => sum + (site.investmentRequired || 0),0),
                averageROI: sites.length > 0 
                  ? sites.reduce((sum , site) => sum + parseFloat(site.roiPercentage || '0'),0) / sites.length
                  : 0,
                averagePayback: sites.length > 0
                  ? sites.reduce((sum, site) => sum + parseFloat(site.paybackYears || '0'), 0) / sites.length
                  : 0,
                averageSuitabilityScore: sites.length > 0
                  ? sites.reduce((sum , site) => sum + site.suitabilityScore,0) / sites.length
                  : 0,
                sitesByType: {
                    wind: sites.filter(s => s.type === 'wind').length,
                    solar: sites.filter(s => s.type === 'solar').length,
                    hybrid: sites.filter(s => s.type === 'hybrid').length,
                },
                topSites: sites
                    .sort((a,b) => b.suitabilityScore - a.suitabilityScore)
                    .slice(0,5),
            };
            console.log(`📊 Generated dashboard stats: ${stats.totalSites} sites, ${stats.totalCapacity}MW`);
            res.json(stats); 
        } catch (error) {
            console.error('Error fetching dashboard stats:',error);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
        }
    });

    // ============================================
    // SITE ANALYSIS ENDPOINTS
    // ============================================

    /**
     * POST /api/analyze-site
     * Analyze a potential site without saving (for map click-to-analyze feature)
     */
    app.post('/api/analyze-site', async (req: Request, res: Response) => {
      try {
        console.log('📍 Analyze site request received:', req.body);
        
        const { type, latitude, longitude, capacity } = req.body;
        
        // Validate inputs
        if (!type || latitude === undefined || longitude === undefined) {
          console.error('❌ Missing required fields');
          return res.status(400).json({
            error: 'Missing required fields',
            required: ['type', 'latitude', 'longitude']
          });
        }
        
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
          console.error('❌ Invalid coordinates');
          return res.status(400).json({ error: 'Invalid coordinates' });
        }
        
        console.log(`🔍 Starting analysis for ${type} site at ${latitude}, ${longitude}`);
        
        const analysis = await analyzeSite({
          type,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          capacity: capacity || (type === 'wind' ? 300 : type === 'solar' ? 500 : 400),
        });
        
        console.log(`✅ Analysis completed - Score: ${analysis.suitabilityScore}/100`);
        res.json(analysis);
        
      } catch (error: any) {
        console.error('❌ Analysis failed with error:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
          error: 'Failed to analyze site', 
          details: error.message 
        });
      }
    });

    /**
 * POST /api/sites/save-analyzed
 * Save an analyzed site to the database
 */
app.post('/api/sites/save-analyzed', async (req: Request, res: Response) => {
  try {
    const { name, type, latitude, longitude, capacity, analysis } = req.body;
    
    if (!name || !type || !latitude || !longitude || !analysis) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'type', 'latitude', 'longitude', 'analysis']
      });
    }

    console.log(`💾 Saving analyzed site: ${name}`);

    const [newSite] = await db
      .insert(renewableSites)
      .values({
        name,
        type,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        capacity: capacity || 50,
        suitabilityScore: analysis.suitabilityScore,
        resourceQuality: analysis.factors.resourceQuality,
        gridDistance: analysis.technicalMetrics.gridDistance,
        landArea: analysis.technicalMetrics.landAreaRequired,
        annualGeneration: analysis.technicalMetrics.annualGeneration,
        capacityFactor: analysis.technicalMetrics.capacityFactor.toString(),
        co2SavedAnnually: analysis.impactMetrics.co2SavedAnnually,
        homesSupported: analysis.impactMetrics.homesSupported,
        investmentRequired: analysis.economicMetrics.investmentRequired,
        roiPercentage: analysis.economicMetrics.roi.toString(),
        paybackYears: analysis.economicMetrics.paybackPeriod.toString(),
        isAiSuggested: false,
      })
      .returning();

    console.log(`✅ Site saved successfully: ${newSite.id}`);
    res.status(201).json(newSite);
  } catch (error) {
    console.error('Error saving site:', error);
    res.status(500).json({ error: 'Failed to save site' });
  }
});

    /**
     * POST /api/analysis/site
     * Analyze a potential site without saving (alternative endpoint)
     */
    app.post('/api/analysis/site', async (req: Request, res: Response) => {
        try{
            const { type, latitude, longitude, capacity } = req.body;
            if(!type || latitude === undefined || longitude === undefined) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['type','latitude','longitude']
                });
            }
            console.log(`🔍 Analyzing potential site: Type ${type}, Location (${latitude}, ${longitude}), Capacity ${capacity || 'N/A'}MW`);
            const analysis = await analyzeSite({
                type,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                capacity: capacity ?? 50,
            });
            res.json(analysis);
        } catch(error){
            console.error('Error analyzing site:',error);
            res.status(500).json({ error: 'Failed to analyze site' });
        }
    });

    console.log('✅ API routes configured successfully');
}