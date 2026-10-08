const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const dir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(dir).sort();
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    for (const file of files) {
      const { rows } = await client.query('SELECT id FROM migrations WHERE name = $1', [file]);
      if (rows.length) { console.log(`⏭  ${file}`); continue; }
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ ${file}`);
      } catch (e) { await client.query('ROLLBACK'); throw e; }
    }
    console.log('\n✨ Migrations complete.\n');
  } finally { client.release(); await pool.end(); }
}

migrate().catch((e) => { console.error('❌', e.message); process.exit(1); });