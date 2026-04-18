import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

declare global {

  var __pgPool: Pool | undefined;
}

export const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
export type DB = typeof db;
