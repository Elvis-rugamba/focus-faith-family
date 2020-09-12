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

const createRadio = async (req, res) => {
  const { title, body, bodyhtml, category, cover, url } = req.body;
  console.log("here", req.body);
  try {
    if (!url) {
      return res.status(400).json({ message: "Upload your file please" });
    }
    if (!cover) {
      return res.status(400).json({ message: "Upload your radio cover" });
    }

    const results = await db.query(
      `INSERT INTO radio(title, body, bodyhtml, category, cover, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, body, bodyhtml, category, cover, url]
    );
    return res
      .status(201)
      .json({ message: "Radio created", data: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRadio = async () => {
  const { rows } = await db.query(
    "SELECT * FROM radio ORDER BY id DESC"
  );

  return rows;
};

const getSingleRadio = async (slug) => {
  const music = await db.query("SELECT * FROM radio WHERE id=$1", [
    slug,
  ]);

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows[0];
};

const getRecentRadio = async () => {
  const { rows } = await db.query(
    "SELECT * FROM radio ORDER BY id DESC LIMIT 3"
  );

  return rows;
};

const getRadioByCategory = async (category) => {
  const music = await db.query(
    "SELECT * FROM radio WHERE category=$1 ORDER BY id DESC",
    [category]
  );

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const searchRadio = async (search) => {
  const music = await db.query(
    "SELECT * FROM radio WHERE title ILIKE $1 OR body ILIKE $1 ORDER BY id DESC",
    [`%${search}%`]
  );

  console.log(music);

  if (music.rowCount <= 0) {
    return null;
  }

  return music.rows;
};

const editRadio = async (req, res) => {
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
    if (rows[0].role !== "admin")
      return res.status(403).json({ status: 403, message: "Forbidden action" });

    // check if the music exists
    const ismusic = await db.query("SELECT * FROM radio WHERE id=$1", [id]);
    if (ismusic.rowCount < 0)
      res.status(404).json({ status: 404, message: "music not found" });

    // edit the music
    // change the status of the music to posted
    const updatedmusic = await db.query(
      `UPDATE radio SET name=$1, artist=$2, album=$3, category=$4, cover=$5, url=$6 WHERE id=$6 RETURNING *`,
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

const getAllRadio = async (req, res) => {
  //get all Radio
  try {
    const radio = await db.query("SELECT * FROM radio");
    return res.status(200).json({ status: 200, data: radio.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getMusic = async (req, res) => {
  // get from params
  const { RadioId } = req.params;
  try {
    const ismusic = await db.query("SELECT * FROM radio WHERE id=$1", [
      RadioId,
    ]);
    // check if the music exists
    console.log("ari", ismusic.rowCount <= 0);
    if (ismusic.rowCount <= 0)
      return res.status(404).json({ status: 404, message: "Radio not found" });
    // return music
    return res.status(200).json({ status: 200, data: ismusic.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

module.exports = {
  upload,
  createRadio,
  getRadio,
  getSingleRadio,
  getMusic,
  getRecentRadio,
  getRadioByCategory,
  searchRadio,
  editRadio,
  getAllRadio,
  getMusic,
};
