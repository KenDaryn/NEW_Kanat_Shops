// import { Pool } from "pg";

// const pool =new Pool({
//     user: 'postgres',
//     password: 'root',
//     host: 'localhost',
//     port: 5432,
//     database: 'kanat_shop'
// });

import { Pool } from 'pg';
require('dotenv').config()

const pool = new Pool({
  connectionString: "postgres://default:XRzOHUkGZt25@ep-sparkling-cell-92534195-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
})


export default pool;