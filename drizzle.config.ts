import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/platform/db/schema/index.ts',
  out: './src/platform/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:./data/pdp.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
