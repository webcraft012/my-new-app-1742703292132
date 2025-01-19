import { drizzle } from 'drizzle-orm/libsql';
export type DatabaseClient = ReturnType<typeof drizzle>;
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const databaseClient: DatabaseClient = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
