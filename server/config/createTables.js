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
    category_name VARCHAR(100) PRIMARY KEY,
    french_name VARCHAR(100),
    rwandan_name VARCHAR(100)
  )`;

  const newsTable = `CREATE TABLE IF NOT EXISTS news(
    news_id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    subtitle VARCHAR(1000) NOT NULL,
    body VARCHAR(1000000) NOT NULL,
    author VARCHAR(500) NOT NULL,
    language VARCHAR(500),
    category VARCHAR(100) REFERENCES categories(category_name) NOT NULL,
    image VARCHAR(2000) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    bodyhtml VARCHAR(10100000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const musicCategoriesTable = `CREATE TABLE IF NOT EXISTS music_categories(
    category_name VARCHAR(100) PRIMARY KEY,
    french_name VARCHAR(100),
    rwandan_name VARCHAR(100)
  )`;

  const musicsTable = `CREATE TABLE IF NOT EXISTS musics(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    artist VARCHAR(500) NOT NULL,
    album VARCHAR(500) NOT NULL,
    language VARCHAR(500),
    category VARCHAR(100) REFERENCES music_categories(category_name) NOT NULL,
    cover VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    duration VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const tvCategoriesTable = `CREATE TABLE IF NOT EXISTS tv_categories(
    category_name VARCHAR(100) PRIMARY KEY, 
    french_name VARCHAR(100),
    rwandan_name VARCHAR(100)
  )`;

  const tvTable = `CREATE TABLE IF NOT EXISTS tv_shows(
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    body VARCHAR(500) NOT NULL,
    bodyhtml VARCHAR(10100000) NOT NULL,
    category VARCHAR(100) REFERENCES tv_categories(category_name) NOT NULL,
    host VARCHAR(500) NOT NULL,
    language VARCHAR(500),
    cover VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const radioCategoriesTable = `CREATE TABLE IF NOT EXISTS radio_categories(
    category_name VARCHAR(100) PRIMARY KEY, 
    french_name VARCHAR(100),
    rwandan_name VARCHAR(100)
  )`;

  const radioTable = `CREATE TABLE IF NOT EXISTS radio(
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    body VARCHAR(500) NOT NULL,
    bodyhtml VARCHAR(10100000) NOT NULL,
    category VARCHAR(100) REFERENCES radio_categories(category_name) NOT NULL,
    cover VARCHAR(500) NOT NULL,
    language VARCHAR(500),
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const versersTable = `CREATE TABLE IF NOT EXISTS verses(
    id SERIAL NOT NULL PRIMARY KEY,
    body VARCHAR(10100000) NOT NULL,
    french VARCHAR(10100000) NOT NULL,
    rwandan VARCHAR(10100000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const commentsTable = `CREATE TABLE IF NOT EXISTS comments(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL,
    comment VARCHAR(10100000) NOT NULL,
    news_id VARCHAR(100) REFERENCES news(news_id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const aboutTable = `CREATE TABLE IF NOT EXISTS about(
    id SERIAL NOT NULL PRIMARY KEY,
    body VARCHAR(10100000) NOT NULL,
    mission VARCHAR(10100000) NOT NULL,
    vission VARCHAR(10100000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  const contactsTable = `CREATE TABLE IF NOT EXISTS contacts(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL,
    message VARCHAR(10100000) NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  )`;

  // const dummy = `INSERT INTO users(firstname, lastname, email, password, role, profileImage, phone) VALUES('Abba','Gospel', 'admin@abbagospel.online','$2b$11$AKHsa/XHWkyRJ70KEl2AaOTvKWSRYTT7IHTz2cVU9Mtq/oARJr9tO', 'admin', '', '0789279774')`;
  
  await pool.query(usersTable);
  await pool.query(categoriesTable);
  await pool.query(newsTable);
  await pool.query(musicCategoriesTable);
  await pool.query(musicsTable);
  await pool.query(tvCategoriesTable);
  await pool.query(tvTable);
  await pool.query(radioCategoriesTable);
  await pool.query(radioTable);
  await pool.query(versersTable);
  await pool.query(commentsTable);
  await pool.query(aboutTable);
  await pool.query(contactsTable);
  // await pool.query(dummy);
};

createTable();
