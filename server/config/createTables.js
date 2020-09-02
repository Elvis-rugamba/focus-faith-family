const { Pool } = require("pg");
const { config } = require("dotenv");

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("connect", () => {
  console.log("connected");
});

const createTable = async () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL NOT NULL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    profileImage TEXT,
    phone TEXT NOT NULL
  )`;

  const categoriesTable = `CREATE TABLE IF NOT EXISTS categories(
    category_name VARCHAR(100) PRIMARY KEY
  )`;

  const newsTable = `CREATE TABLE IF NOT EXISTS news(
    news_id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    subtitle VARCHAR(1000) NOT NULL,
    body VARCHAR(1000000) NOT NULL UNIQUE,
    author VARCHAR(500) NOT NULL,
    category VARCHAR(100) REFERENCES categories(category_name) NOT NULL,
    image VARCHAR(2000) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    bodyhtml VARCHAR(10100000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const dummy = `INSERT INTO users(firstname, lastname, email, password, role, profileImage, phone) VALUES('Abba','Gospel', 'admin@abbagospel.online','	$2b$11$AKHsa/XHWkyRJ70KEl2AaOTvKWSRYTT7IHTz2cVU9Mtq/oARJr9tO', 'admin', '', '0789279774')`;
  
  await pool.query(usersTable);
  await pool.query(categoriesTable);
  await pool.query(newsTable);
  await pool.query(dummy);
};

createTable();
