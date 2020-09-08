const db = require("../config/connect");

const upload = async (req, res) => {
  try {
    const [, ...rest] = req.file.path.replace(/\\/g, "/").split("/");
    const filePath = rest.join("/");
    const url = `${req.protocol}://${req.get("host")}/${filePath}`;

    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createLibrary = async (req, res) => {
  const { name, artist, album, category, cover, url } = req.body;
  console.log("here", req.body);
  try {
    if (!url) {
      return res.status(400).json({ message: "Upload your song please" });
    }
    if (!cover) {
      return res.status(400).json({ message: "Upload your music cover" });
    }

    const results = await db.query(
      `INSERT INTO musics(name, artist, album, category, cover, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, artist, album, category, cover, url]
    );
    return res
      .status(201)
      .json({ message: "Music created", data: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMusics = async () => {
  const { rows } = await db.query(
    "SELECT * FROM musics ORDER BY id DESC LIMIT 10"
  );

  return rows;
};

const getSingleMusic = async (slug) => {
  const music = await db.query("SELECT * FROM musics WHERE id=$1", [
    slug,
  ]);

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows[0];
};

const getRecentMusics = async () => {
  const { rows } = await db.query(
    "SELECT * FROM musics ORDER BY id DESC LIMIT 3"
  );

  return rows;
};

const getMusicsByCategory = async (category) => {
  const music = await db.query(
    "SELECT * FROM musics WHERE category=$1 ORDER BY id DESC",
    [category]
  );

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const searchMusics = async (search) => {
  const music = await db.query(
    "SELECT * FROM musics WHERE name ILIKE $1 OR artist ILIKE $1 OR album ILIKE $1 ORDER BY id DESC",
    [`%${search}%`]
  );

  console.log(music);

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const editmusic = async (req, res) => {
  //check if the user exists
  const { user_id } = req.user.payload;
  const { id } = req.params;
  const { name, artist, album, category, cover, url } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    console.log("savage", user_id);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role !== "admin" && rows[0].role !== "artist")
      return res.status(403).json({ status: 403, message: "Forbidden action" });

    // check if the music exists
    const ismusic = await db.query("SELECT * FROM musics WHERE id=$1", [id]);
    if (ismusic.rowCount < 0)
      res.status(404).json({ status: 404, message: "music not found" });

    // edit the music
    // change the status of the music to posted
    const updatedmusic = await db.query(
      `UPDATE musics SET name=$1, artist=$2, album=$3, category=$4, cover=$5, url=$6 WHERE id=$6 RETURNING *`,
      [name, artist, album, category, cover, url, id]
    );
    console.log("savage", updatedmusic.rows[0]);

    // if (updatedmusic.rows[0].id === id && updatedmusic.rows[0].status === 'posted') return res.status(400).json({ status: 400, message: 'The music was not edited successfully' });

    return res.status(200).json({
      status: 200,
      message: "music edited successfully",
      data: updatedmusic.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllMusics = async (req, res) => {
  //get all musics
  try {
    const musics = await db.query("SELECT * FROM musics");
    return res.status(200).json({ status: 200, data: musics.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getMusic = async (req, res) => {
  // get from params
  const { musicsId } = req.params;
  try {
    const ismusic = await db.query("SELECT * FROM musics WHERE id=$1", [
      musicsId,
    ]);
    // check if the music exists
    console.log("ari", ismusic.rowCount <= 0);
    if (ismusic.rowCount <= 0)
      return res.status(404).json({ status: 404, message: "music not found" });
    // return music
    return res.status(200).json({ status: 200, data: ismusic.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

module.exports = {
  upload,
  createLibrary,
  getMusics,
  getSingleMusic,
  getMusic,
  getRecentMusics,
  getMusicsByCategory,
  searchMusics,
  editmusic,
  getAllMusics,
  getMusic,
};
