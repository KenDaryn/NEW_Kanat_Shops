// import { Pool } from "pg";

// const pool =new Pool({
//     user: 'postgres',
//     password: 'root',
//     host: 'localhost',
//     port: 5432,
//     database: 'kanat_shop'
// });

const POSTGRES_URL="postgres://default:XRzOHUkGZt25@ep-sparkling-cell-92534195-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
const POSTGRES_PRISMA_URL="postgres://default:XRzOHUkGZt25@ep-sparkling-cell-92534195-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
const POSTGRES_URL_NON_POOLING="postgres://default:XRzOHUkGZt25@ep-sparkling-cell-92534195.us-east-1.postgres.vercel-storage.com:5432/verceldb"
const POSTGRES_USER="default"
const POSTGRES_HOST="ep-sparkling-cell-92534195-pooler.us-east-1.postgres.vercel-storage.com"
const POSTGRES_PASSWORD="XRzOHUkGZt25"
const POSTGRES_DATABASE="verceldb"

import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


export default pool;