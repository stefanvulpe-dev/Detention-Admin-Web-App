import { dirname } from 'path';
import dotenv from 'dotenv';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: __dirname + '/../../.env' });

const settings = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
};

export default data = JSON.stringify(
  { development: settings, production: settings },
  null,
  2
);
