import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.js';
//check if database url is set or not
if(!process.env.DATABASE_URL){
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.log('\n📝 Please create a .env file with:');
    console.log('DATABASE_URL=postgresql://user:password@localhost:5432/icarus\n');
    process.exit(1);
}

//create PostgreSQL client
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString,{
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

//create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Test database connection
async function testConnection(){
    try{
        await client`SELECT 1`;
        console.log('✅ Database connection successful!');
    } catch (error){
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
testConnection();
export default db;