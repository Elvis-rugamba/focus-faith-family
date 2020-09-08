const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connSring = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connSring,
});
try {
  const dropTable = [
    'DROP TABLE IF EXISTS users CASCADE',
    'DROP TABLE IF EXISTS news CASCADE',
    'DROP TABLE IF EXISTS categories CASCADE',
    'DROP TABLE IF EXISTS musics CASCADE',
    'DROP TABLE IF EXISTS tv_shows CASCADE',
    'DROP TABLE IF EXISTS radio CASCADE',
    'DROP TABLE IF EXISTS music_categories CASCADE',
    'DROP TABLE IF EXISTS tv_categories CASCADE',
    'DROP TABLE IF EXISTS radio_categories CASCADE',
  ];
  const dropTables = async () => {
    for (const table of dropTable) {
      await pool.query(table);
    }
  }
  dropTables();

} catch (error) {
  console.log(error.message);
}