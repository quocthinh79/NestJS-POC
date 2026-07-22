import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
export const APP_CONFIG = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
} as const;
