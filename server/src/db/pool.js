const { Pool } = require('pg');
const { databaseUrl, nodeEnv } = require('../config/env');

const pool = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => console.error('PG pool error:', err));

pool.query('SELECT NOW()').then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ PG failed:', err.message));

module.exports = pool;