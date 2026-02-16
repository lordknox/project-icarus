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
        updatedeAt: timestamp("updated_at").defaultNow(),
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
        isAiSuggestes: boolean("is_ai_suggested").default(false),

        //technical metrics
        resourceQuality: integer("resource_quality"), //0-100
        gridDistance: integer("grid_distance"), //in km
        landArea: integer("land_area"), // in hectares

        // Performance metrics
        annualGeneration: integer("annual_generation"), // in MWh
        capacityFactor: decimal("capacity_factor", { precision: 4, scale: 2}), //0-1

        // Impact metrics
        co2savedAnually: integer("co2_saved_annually"), //in tons
        homeSupported: integer("homes_supported"), //number of homes powered

        // Economic metrics
        investsmentRequired: integer("investment_required"), //in USD
        roiPercentage: decimal("roi_percentage", { precision: 5, scale: 2}), //0-100
        paybackYears: decimal("payback_years", { precision: 4, scale: 1}),
        // additional data
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    }
);
