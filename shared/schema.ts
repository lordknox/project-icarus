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