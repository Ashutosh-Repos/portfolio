import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

// Singleton instance management for development hot reloading
const globalForDb = globalThis as unknown as {
  libsqlClient?: Client;
  drizzleDb?: LibSQLDatabase<typeof schema>;
};

function getDbClient(): { client: Client; db: LibSQLDatabase<typeof schema> } {
  if (globalForDb.libsqlClient && globalForDb.drizzleDb) {
    return { client: globalForDb.libsqlClient, db: globalForDb.drizzleDb };
  }

  const url = process.env.TURSO_DATABASE_URL || 'file:./data/pdp.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // If using local file, ensure parent directory exists
  if (url.startsWith('file:')) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // directory might already exist concurrently
      }
    }
  }

  const client = createClient({
    url,
    authToken,
  });

  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.libsqlClient = client;
    globalForDb.drizzleDb = db;
  }

  return { client, db };
}

export const { client, db } = getDbClient();
export type Database = typeof db;
export { schema };
