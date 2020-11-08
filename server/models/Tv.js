const db = require("../config/connect");

const upload = async (req, res) => {
  try {
    const [, ...rest] = req.file.path.replace(/\\/g, "/").split("/");
    const filePath = rest.join("/");
    const url = `https://${req.get("host")}/${filePath}`;

    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTv = async (req, res) => {
  const { title, body, bodyhtml, category, host, cover, url } = req.body;
  console.log("here", req.body);
  try {
    if (!url) {
      return res.status(400).json({ message: "Upload your file please" });
    }
    if (!cover) {
      return res.status(400).json({ message: "Upload your tv cover" });
    }

    const results = await db.query(
      `INSERT INTO tv_shows(title, body, bodyhtml, category, host, cover, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, body, bodyhtml, category, host, cover, url]
    );
    return res
      .status(201)
      .json({ message: "Tv Show created", data: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTvShows = async () => {
  const { rows } = await db.query(
    "SELECT * FROM tv_shows ORDER BY id DESC"
  );

  return rows;
};

const getHomeTvShows = async () => {
  const { rows } = await db.query(
    "SELECT * FROM tv_shows ORDER BY id DESC LIMIT 10"
  );

  return rows;
};

const getSingleTv = async (slug) => {
  const music = await db.query("SELECT * FROM tv_shows WHERE id=$1", [
    slug,
  ]);

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows[0];
};

const getRecentTvShows = async () => {
  const { rows } = await db.query(
    "SELECT * FROM tv_shows ORDER BY id DESC LIMIT 3"
  );

  return rows;
};

const getTvByCategory = async (category) => {
  const music = await db.query(
    "SELECT * FROM tv_shows WHERE category=$1 ORDER BY id DESC",
    [category]
  );

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const searchTv = async (search) => {
  const music = await db.query(
    "SELECT * FROM tv_shows WHERE title ILIKE $1 OR body ILIKE $1 ORDER BY id DESC",
    [`%${search}%`]
  );

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const editTv = async (req, res) => {
  //check if the user exists
  const { user_id } = req.user.payload;
  const { id } = req.params;
  const { title, body, bodyhtml, category, host, cover, url } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role !== "admin")
      return res.status(403).json({ status: 403, message: "Forbidden action" });

    // check if the music exists
    const ismusic = await db.query("SELECT * FROM tv_shows WHERE id=$1", [id]);
    if (ismusic.rowCount < 0)
      res.status(404).json({ status: 404, message: "Tv Show not found" });

    // edit the music
    // change the status of the music to posted
    const updatedmusic = await db.query(
      `UPDATE tv_shows SET title=$1, body=$2, bodyhtml=$3, category=$4, host=$5, cover=$6, url=$7 WHERE id=$8 RETURNING *`,
      [title, body, bodyhtml, category, host, cover, url, id]
    );

    // if (updatedmusic.rows[0].id === id && updatedmusic.rows[0].status === 'posted') return res.status(400).json({ status: 400, message: 'The music was not edited successfully' });

    return res.status(200).json({
      status: 200,
      message: "Tv Show edited successfully",
      data: updatedmusic.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllTvShows = async (req, res) => {
  //get all Radio
  try {
    const radio = await db.query("SELECT * FROM tv_shows");
    return res.status(200).json({ status: 200, data: radio.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAppTvShows = async (req, res) => {
  try {
    const tvShows = await db.query("SELECT * FROM tv_shows ORDER BY id DESC");
    return res.status(200).json({ status: 200, data: tvShows.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

const getTv = async (req, res) => {
  // get from params
  const { id } = req.params;
  try {
    const ismusic = await db.query("SELECT * FROM tv_shows WHERE id=$1", [
      id,
    ]);
    // check if the music exists
    if (ismusic.rowCount <= 0)
      return res.status(404).json({ status: 404, message: "Tv Show not found" });
    // return music
    return res.status(200).json({ status: 200, data: ismusic.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

const getAppTv = async (req, res) => {
  const { id } = req.params;
  try {
    const isTv = await db.query("SELECT * FROM tv_shows WHERE id=$1", [
      id,
    ]);
    
    if (isTv.rowCount <= 0)
      return res.status(404).json({ status: 404, error: "Tv Show not found" });
    
    return res.status(200).json({ status: 200, data: isTv.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

module.exports = {
  upload,
  createTv,
  getTvShows,
  getHomeTvShows,
  getSingleTv,
  getRecentTvShows,
  getTvByCategory,
  searchTv,
  editTv,
  getAllTvShows,
  getAppTvShows,
  getTv,
  getAppTv
};
