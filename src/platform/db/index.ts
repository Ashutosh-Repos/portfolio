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

  let url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Local SQLite file mode fallback
  if (!url) {
    const sourceDbPath = path.join(process.cwd(), 'data', 'pdp.db');

    // In serverless / read-only environments (such as Vercel or AWS Lambda),
    // copy the bundled database to /tmp so SQLite has read/write filesystem access without EROFS
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const tmpDbPath = path.join('/tmp', 'pdp.db');
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
        try {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } catch (err) {
          console.warn('[db] Failed to copy db to /tmp, falling back to source path:', err);
        }
      }
      url = fs.existsSync(tmpDbPath) ? `file:${tmpDbPath}` : `file:${sourceDbPath}`;
    } else {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        try {
          fs.mkdirSync(dataDir, { recursive: true });
        } catch {
          // directory might already exist
        }
      }
      url = `file:${sourceDbPath}`;
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
