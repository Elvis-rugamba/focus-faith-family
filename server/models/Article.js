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

const createArticle = async (req, res) => {
  const { title, subtitle, body, author, category, image, bodyhtml } = req.body;
  console.log("here", req.body);
  try {
    const results = await db.query(
      `INSERT INTO news(title,subtitle,body,author,category,image,bodyhtml) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, subtitle, body, author, category, image, bodyhtml]
    );
    return res.status(201).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNews = async () => {
  const { rows } = await db.query(
    "SELECT * FROM news ORDER BY news_id DESC LIMIT 10"
  );

  return rows;
};

const getSingleArticle = async (slug) => {
  const article = await db.query("SELECT * FROM news WHERE news_id=$1", [
    slug,
  ]);

  console.log(article);

  if (article.rowCount <= 0) {
    return null;
  }

  return article.rows[0];
};

const getRecentNews = async () => {
  const { rows } = await db.query(
    "SELECT * FROM news ORDER BY news_id DESC LIMIT 3"
  );

  return rows;
};

const getNewsByCategory = async (category) => {
  const article = await db.query("SELECT * FROM news WHERE category=$1 ORDER BY news_id DESC", [
    category,
  ]);

  if (article.rowCount <= 0) {
    return null;
  }

  return article.rows;
};

const searchNews = async (search) => {
  const article = await db.query("SELECT * FROM news WHERE title ILIKE $1 OR body ILIKE $1 ORDER BY news_id DESC", [
    `%${search}%`,
  ]);

  console.log(article);

  if (article.rowCount <= 0) {
    return null;
  }

  return article.rows;
};

const editArticle = async (req, res) => {
  //check if the user exists
  const { user_id } = req.user.payload;
  const { articleId } = req.params;
  const { title, subtitle, category, body, status } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    console.log("savage", user_id);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role !== "admin" && rows[0].role !== "editor")
      return res.status(403).json({ status: 403, message: "Forbidden action" });

    // check if the article exists
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      articleId,
    ]);
    if (isArticle.rowCount < 0)
      res.status(404).json({ status: 404, message: "Article not found" });

    // edit the article
    // change the status of the article to posted
    const updatedArticle = await db.query(
      `UPDATE news SET title=$1, subtitle=$2, body=$3, category=$4, status='edited' WHERE news_id=$5 RETURNING *`,
      [title, subtitle, body, category, articleId]
    );
    console.log("savage", updatedArticle.rows[0]);

    // if (updatedArticle.rows[0].news_id === articleId && updatedArticle.rows[0].status === 'posted') return res.status(400).json({ status: 400, message: 'The article was not edited successfully' });

    return res.status(200).json({
      status: 200,
      message: "Article edited successfully",
      data: updatedArticle.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllArticles = async (req, res) => {
  //get all articles
  try {
    const articles = await db.query("SELECT * FROM news");
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getArticle = async (req, res) => {
  // get from params
  const { newsId } = req.params;
  try {
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      newsId,
    ]);
    // check if the article exists
    console.log("ari", isArticle.rowCount <= 0);
    if (isArticle.rowCount <= 0)
      return res
        .status(404)
        .json({ status: 404, message: "Article not found" });
    // return article
    return res.status(200).json({ status: 200, data: isArticle.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

module.exports = {
  upload,
  createArticle,
  getNews,
  getSingleArticle,
  getRecentNews,
  getNewsByCategory,
  searchNews,
  editArticle,
  getAllArticles,
  getArticle,
};
