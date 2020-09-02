const { Pool, Client } = require("pg");
const { config } = require("dotenv");

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("connect", () => {
  console.log("connected");
});

module.exports = pool;
