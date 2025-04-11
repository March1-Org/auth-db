import { config } from 'config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    database: config.POSTGRES_DB,
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    ssl: false,
  },
});
