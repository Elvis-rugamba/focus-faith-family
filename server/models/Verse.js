const db = require("../config/connect");

const createVerse = async (req, res) => {
  const { body, french, rwandan } = req.body;
  try {
    if (!body) {
      return res.status(400).json({ message: "Verse is required" });
    }

    const results = await db.query(
      `INSERT INTO verses(body,french,rwandan) VALUES ($1,$2,$3) RETURNING *`,
      [body, french, rwandan]
    );
    return res.status(201).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getVerse = async () => {
  const verse = await db.query(
    "SELECT * FROM verses ORDER BY id DESC LIMIT 1"
  );

  if (verse.rowCount <= 0) {
    return null;
  }

  return verse.rows[0];
};

const editVerse = async (req, res) => {
  try {
    const { verseId } = req.params;
    const { body, french, rwandan } = req.body;
  
    // check if the article exists
    const isVerse = await db.query("SELECT * FROM verses WHERE id=$1", [
      verseId,
    ]);
    if (isVerse.rowCount < 0) {
      res.status(404).json({ status: 404, message: "Verse not found" });
    }
      if (!body) {
        return res.status(400).json({ message: "Verse is required" });
      }
      if (!french) {
        return res.status(400).json({ message: "Verse French is required" });
      }
      if (!rwandan) {
        return res.status(400).json({ message: "Verse in Kinyarwanda is required" });
      }

    // edit the article
    // change the status of the article to posted
    const updatedArticle = await db.query(
      `UPDATE verses SET body=$1, french=$2, rwandan=$3 WHERE id=$4 RETURNING *`,
      [body, french, rwandan, verseId]
    );

    return res.status(200).json({
      status: 200,
      message: "Verse edited successfully",
      data: updatedArticle.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteVerse = async (req, res) => {
  //check if the user exists
  const { verseId } = req.params;
  try {

    // check if the article exists
    const isVerse = await db.query("SELECT * FROM news WHERE news_id=$1", [
      verseId,
    ]);
    if (isVerse.rowCount < 0) {
      res.status(404).json({ status: 404, message: "Verse not found" });
    }
    const deletedArticle = await db.query(
      `DELETE FROM verses WHERE id=$1 RETURNING *`,
      [verseId]
    );

    return res.status(200).json({
      status: 200,
      message: "Verse deleted successfully",
      data: deletedArticle.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllVerses = async (req, res) => {
  //get all articles
  try {
    const verses = await db.query("SELECT * FROM verses ORDER BY id DESC");
    return res.status(200).json({ status: 200, data: verses.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getSingleVerse = async (req, res) => {
  // get from params
  const { verseId } = req.params;
  try {
    const isVerse = await db.query("SELECT * FROM verses WHERE id=$1", [
      verseId,
    ]);
    return res.status(200).json({ status: 200, data: isVerse.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

module.exports = {
  createVerse,
  getVerse,
  editVerse,
  getAllVerses,
  getSingleVerse,
  deleteVerse
};
