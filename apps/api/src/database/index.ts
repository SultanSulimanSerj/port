import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as objects from './schemas/objects';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/saas_portal';
const client = postgres(connectionString);

export const db = drizzle(client, { schema: { ...objects } });
export * from './schemas/objects';