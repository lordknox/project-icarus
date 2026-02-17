import { table } from 'console';
import { sql } from 'drizzle-orm';
import { 
    index,
    jsonb,
    pgTable,
    timestamp,
    varchar,
    text,
    integer,
    decimal,
    boolean,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from  "zod";
//Enums
export const energyTypeEnum = pgEnum('energy_type', ['wind', 'solar','hybrid']);
export const demandLevelEnum = pgEnum('demand_level', ['low','medium','high', 'very_high']);
export const demandTypeEnum = pgEnum('demand_type', ['industrial','residential','commercial','mixed']);
export const gridTypeEnum = pgEnum('grid_type', ['substation','transmission_line']);
// session storage table (for authentication)
export const sessions = pgTable(
    "sessions",
    {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull(),
    },
    (table) => [index("IDX_session_expire").on(table.expire)],
);
//user storage table
export const users = pgTable(
    "users",{
        id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
        email: varchar("email").unique(),
        firstName: varchar("first_name"),
        lastName: varchar("last_name"),
        profileImageUrl: varchar("profile_image_url"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    }
);
// renewable energy sites table
export const renewableSites = pgTable("renewable_sites",
    {
        id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id").references(()=> users.id),
        name: varchar("name").notNull(),
        type: energyTypeEnum("type").notNull(),
        latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
        longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
        capacity: integer("capacity").notNull(), //in MW
        sustainabilityScore: integer("sustainability_score").notNull(), //0-100
        isAiSuggested: boolean("is_ai_suggested").default(false),

        //technical metrics
        resourceQuality: integer("resource_quality"), //0-100
        gridDistance: integer("grid_distance"), //in km
        landArea: integer("land_area"), // in hectares

        // Performance metrics
        annualGeneration: integer("annual_generation"), // in MWh
        capacityFactor: decimal("capacity_factor", { precision: 4, scale: 2}), //0-1

        // Impact metrics
        co2savedAnnually: integer("co2_saved_annually"), //in tons
        homeSupported: integer("homes_supported"), //number of homes powered

        // Economic metrics
        investmentRequired: integer("investment_required"), //in USD
        roiPercentage: decimal("roi_percentage", { precision: 5, scale: 2}), //0-100
        paybackYears: decimal("payback_years", { precision: 4, scale: 1}),
        // additional data
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    }
);
//wind resource zones
export const windResources = pgTable("wind_resources", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8}).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 8}).notNull(),
    avgWindSpeed: decimal("avg_wind_speed", { precision: 4, scale: 2}).notNull(), //m/s
    windPowerDensity: integer("wind_power_density"), //W/m^2
    capacity: integer("capacity"), //MW (if existing installation)
    turbineCount: integer("turbine_count"),
    isExisting: boolean("is_existing").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
//solar resources zone
export const solarResources = pgTable("solar_resources",{
    id: varchar("id").primaryKey().default( sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    latitude: decimal("latitude",  { precision: 10, scale: 8}).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 8}).notNull(),
    ghi: decimal("ghi", { precision: 5,scale: 2}).notNull(), // kWh/m^2/day - Global Horizontal Irradiance
    dni: decimal("dni", { precision: 5, scale: 2 }), // kWh/m^2/day - Direct Normal Irradiance
    capacity: integer("capacity"), // MW (if existing installation)
    panelCount: integer("panel_count"),
    isExisting: boolean("is_existing").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
//grid infrastructure (substations and transmission lines)
export const gridInfrastructure = pgTable("grid_infrastructure", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: gridTypeEnum("type").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  voltage: integer("voltage"), // in kV
  capacity: integer("capacity"), // in MW
  operator: varchar("operator"),
  createdAt: timestamp("created_at").defaultNow(),
});
// Energy demand centers
export const demandCenters = pgTable("demand_centers", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    type: demandTypeEnum("type").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8}).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8}).notNull(),
    demandLevel: demandLevelEnum("demand_level").notNull(),
    peakDemand :integer("peak_demand"), //in MW
    population: integer("population"),
    createdAt: timestamp("created_at").defaultNow(),
});
// chat history  for AI assistant
export const chatHistory = pgTable("chat_history", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id).notNull(),
    message: text("message").notNull(),
    response: text("response").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// type exports for TypeScript
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertRenewableSiteSchema = createInsertSchema(renewableSites);

export const insertWindResourceSchema = createInsertSchema(windResources);

export const insertSolarResourceSchema = createInsertSchema(solarResources);

export const insertGridInfrastructureSchema = createInsertSchema(gridInfrastructure);

export const insertDemandCenterSchema = createInsertSchema(demandCenters);

export type InsertRenewableSite = z.infer<typeof insertRenewableSiteSchema>;
export type RenewableSite = typeof renewableSites.$inferSelect;
export type WindResource = typeof windResources.$inferSelect;
export type SolarResource = typeof solarResources.$inferSelect;
export type GridInfrastructure = typeof gridInfrastructure.$inferSelect;
export type DemandCenter = typeof demandCenters.$inferSelect;
export type ChatHistory = typeof chatHistory.$inferSelect;