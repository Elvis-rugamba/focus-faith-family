const db = require("../config/connect");

const createComment = async (req, res) => {
  const { newsId } = req.params;
  const { name, email, comment } = req.body;
  try {
    if (!newsId) {
      return res.status(400).json({ message: "News ID is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Your name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Your email is required" });
    }
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const results = await db.query(
      `INSERT INTO comments(name, email, comment, news_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, comment, newsId]
    );
    return res.status(201).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postComment = async (name, email, comment, newsId) => {
  let errors = {};
  try {
    if (!newsId) {
      return (errors = {
        newsId: {
          message: "News ID is required",
        },
      });
    }
    if (!name) {
      errors.name = {
        message: "Your name is required",
      };
    }
    if (!email) {
      errors.email = {
        message: "Your email is required",
      };
    }
    if (!comment) {
      errors.comment = {
        message: "Comment is required",
      };
    }

    const results = await db.query(
      `INSERT INTO comments(name, email, comment, news_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, comment, newsId]
    );
    return { comments: results.rows, errors };
  } catch (error) {
    throw error;
  }
};

const getComments = async (newsId) => {
  const {
    rows,
  } = await db.query(
    "SELECT * FROM comments WHERE news_id=$1 ORDER BY id DESC",
    [newsId]
  );

  return rows;
};

const deleteComment = async (req, res) => {
  //check if the user exists
  const { commentId } = req.params;
  try {
    // check if the article exists
    const isComment = await db.query("SELECT * FROM comments WHERE id=$1", [
      commentId,
    ]);
    if (isComment.rowCount < 0) {
      res.status(404).json({ status: 404, message: "Comment not found" });
    }
    const deletedComment = await db.query(
      `DELETE FROM comments WHERE id=$1 RETURNING *`,
      [commentId]
    );

    return res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
      data: deletedComment.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllComments = async (req, res) => {
  //get all articles
  try {
    const comments = await db.query("SELECT * FROM comments ORDER BY id DESC");
    return res.status(200).json({ status: 200, data: comments.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getSingleComment = async (req, res) => {
  // get from params
  const { commentId } = req.params;
  try {
    const isComment = await db.query("SELECT * FROM comments WHERE id=$1", [
      commentId,
    ]);
    return res.status(200).json({ status: 200, data: isComment.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

module.exports = {
  createComment,
  postComment,
  getComments,
  getAllComments,
  getSingleComment,
  deleteComment,
};
