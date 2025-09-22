import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as objects from './schemas/objects';
import * as documents from './schemas/documents';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/saas_portal';
const client = postgres(connectionString);

export const db = drizzle(client, { schema: { ...objects, ...documents } });
export * from './schemas/objects';
export * from './schemas/documents';