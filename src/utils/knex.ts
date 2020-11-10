import dotenv from 'dotenv';
import Knex from 'knex';

// Load environment variables from .env file
dotenv.config();

export default Knex({
  client: 'pg',
  version: '7.2',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    port: Number.parseInt(process.env.POSTGRES_PORT as string),
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
  }
});
