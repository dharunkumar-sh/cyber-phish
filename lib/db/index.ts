import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// ---------------------------------------------------------------------------
// Neon serverless HTTP driver — works in Edge, Vercel, Cloudflare Workers
// ---------------------------------------------------------------------------

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error("[CyberPhish DB] DATABASE_URL is not set.");
}

const sql = connectionString ? neon(connectionString) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = sql ? drizzle(sql, { schema }) : (null as any);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

export async function pingDatabase(): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export { schema };
