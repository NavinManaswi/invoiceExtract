import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const hasDatabase =
  typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;

export const pool = hasDatabase
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as pg.Pool);
export const db = hasDatabase ? drizzle(pool, { schema }) : (null as unknown as ReturnType<typeof drizzle>);
