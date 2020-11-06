const db = require("../config/connect");
const slugs = require("../utils/slugs");

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

const createArticle = async (req, res) => {
  const { user_id } = req.user.payload;
  const {
    title,
    subtitle,
    body,
    author,
    category,
    image,
    bodyhtml,
    language,
  } = req.body;
  let status = "pending";
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role == "admin" || rows[0].role == "editor") status = "edited";
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!subtitle) {
      return res.status(400).json({ message: "Subtitle is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Upload image" });
    }

    const slug = slugs(title);

    const results = await db.query(
      `INSERT INTO news(title,subtitle,body,author,category,image,bodyhtml,language,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        title,
        subtitle,
        body,
        author,
        category,
        image,
        bodyhtml,
        language,
        // slug,
        status,
      ]
    );
    return res.status(201).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNews = async (language, perPage, offset) => {
  const result = await db.query(
    "SELECT * FROM news WHERE status=$1 AND language=$2 GROUP BY news_id ORDER BY news_id DESC LIMIT $3 OFFSET $4",
    ["edited", language, perPage, offset]
  );
  const { rows } = await db.query("SELECT COUNT(*) FROM news WHERE status=$1", [
    "edited",
  ]);
  return { rows: result.rows, count: rows[0].count };
};

const getHomeNews = async (language) => {
  const {
    rows,
  } = await db.query(
    "SELECT * FROM news WHERE status=$1 AND language=$2 ORDER BY news_id DESC LIMIT 15",
    ["edited", language]
  );
  return rows;
};

const getMoreHomeNews = async (language) => {
  const {
    rows,
  } = await db.query(
    "SELECT * FROM news WHERE status=$1 AND language=$2 ORDER BY news_id DESC OFFSET 15 LIMIT 15",
    ["edited", language]
  );
  return rows;
};

const getSingleArticle = async (slug) => {
  const article = await db.query(
    "SELECT * FROM news WHERE news_id=$1 AND status=$2",
    [slug, "edited"]
  );

  if (article.rowCount <= 0) {
    return null;
  }

  return article.rows[0];
};

const getRecentNews = async (language) => {
  const {
    rows,
  } = await db.query(
    "SELECT * FROM news WHERE language=$1 AND status=$2 ORDER BY news_id DESC LIMIT 3",
    [language, "edited"]
  );

  return rows;
};

const getNewsByCategory = async (category, language, perPage, offset) => {
  const article = await db.query(
    "SELECT * FROM news WHERE category=$1 AND language=$2 AND status=$3 ORDER BY news_id DESC LIMIT $4 OFFSET $5",
    [category, language, "edited", perPage, offset]
  );
  const {
    rows,
  } = await db.query(
    "SELECT COUNT(*) FROM news WHERE category=$1 AND language=$2 AND status=$3",
    [category, language, "edited"]
  );

  if (article.rowCount <= 0) {
    return null;
  }

  return { rows: article.rows, count: rows[0].count };
};

const searchNews = async (search, language, perPage, offset) => {
  const article = await db.query(
    "SELECT * FROM news WHERE (title ILIKE $1 OR body ILIKE $1) AND language=$2 AND status=$3 ORDER BY news_id DESC LIMIT $4 OFFSET $5",
    [`%${search}%`, language, "edited", perPage, offset]
  );
  const {
    rows,
  } = await db.query(
    "SELECT COUNT(*) FROM news WHERE (title ILIKE $1 OR body ILIKE $1) AND language=$2 AND status=$3",
    [`%${search}%`, language, "edited"]
  );

  if (article.rowCount <= 0) {
    return null;
  }

  return { rows: article.rows, count: rows[0].count };
};

const getRelatedArticle = async (newsId, language) => {
  try {
    const { rows } = await db.query("SELECT * FROM news WHERE news_id=$1", [
      newsId,
    ]);
    if (rows.length < 0) return null;

    const results = await db.query(
      `SELECT * FROM news WHERE category=$1 AND language=$2 AND status=$3 AND news_id!=$4 ORDER BY news_id DESC LIMIT 3`,
      [rows[0].category, language, "edited", newsId]
    );
    return results.rows;
  } catch (error) {
    throw error;
  }
};

const editArticle = async (req, res) => {
  //check if the user exists
  const { user_id } = req.user.payload;
  const { articleId } = req.params;
  const {
    title,
    subtitle,
    category,
    body,
    language,
    bodyhtml,
    image,
  } = req.body;
  let status = "edited";
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role !== "admin" && rows[0].role !== "editor")
      status = "pending";

    // check if the article exists
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      articleId,
    ]);
    if (isArticle.rowCount < 0) {
      res.status(404).json({ status: 404, message: "Article not found" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!subtitle) {
      return res.status(400).json({ message: "Subtitle is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }

    // edit the article
    // change the status of the article to posted
    const updatedArticle = await db.query(
      `UPDATE news SET title=$1, subtitle=$2, body=$3, category=$4, language=$5, bodyhtml=$6, image=$7, status=$8 WHERE news_id=$9 RETURNING *`,
      [
        title,
        subtitle,
        body,
        category,
        language,
        bodyhtml,
        image,
        status,
        articleId,
      ]
    );

    return res.status(200).json({
      status: 200,
      message: "Article edited successfully",
      data: updatedArticle.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  //check if the user exists
  const { user_id } = req.user.payload;
  const { articleId } = req.params;
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    if (rows.length < 0)
      return res.status(404).json({ status: 404, message: "User not found" });

    // check if the user is an admin or editor
    if (rows[0].role !== "admin" && rows[0].role !== "editor")
      return res.status(403).json({ status: 403, message: "Forbidden action" });

    // check if the article exists
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      articleId,
    ]);
    if (isArticle.rowCount <= 0) {
      res.status(404).json({ status: 404, message: "Article not found" });
    }
    const deletedArticle = await db.query(
      `DELETE FROM news WHERE news_id=$1 RETURNING *`,
      [articleId]
    );

    return res.status(200).json({
      status: 200,
      message: "Article deleted successfully",
      data: deletedArticle.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAllArticles = async (req, res) => {
  //get all articles
  try {
    const articles = await db.query("SELECT * FROM news ORDER BY news_id DESC");
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getAppNews = async (req, res) => {
  const { language, perPage, page } = req.query;
  const offset = perPage * page - perPage;
  try {
    const articles = await db.query(
      "SELECT * FROM news WHERE language=$1 AND status=$2 GROUP BY news_id ORDER BY news_id DESC LIMIT $3 OFFSET $4",
      [language, "edited", perPage, offset]
    );
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

const getAppSingleArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      id,
    ]);

    if (isArticle.rowCount <= 0)
      return res.status(404).json({ status: 404, error: "Article not found" });

    return res.status(200).json({ status: 200, data: isArticle.rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

const getAppNewsByCategory = async (req, res) => {
  const { category } = req.params;
  const { language, perPage, page } = req.query;
  const offset = perPage * page - perPage;

  try {
    const articles = await db.query(
      "SELECT * FROM news WHERE category=$1 AND language=$2 AND status=$3 ORDER BY news_id DESC LIMIT $4 OFFSET $5",
      [category, language, "edited", perPage, offset]
    );

    if (articles.rowCount <= 0) {
      return res.status(404).json({ status: 404, error: 'Not found' });;
    }

    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

const searchAppNews = async (req, res) => {
  const { search, language, perPage, page } = req.query;
  const offset = perPage * page - perPage;

  try {
    const articles = await db.query(
      "SELECT * FROM news WHERE (title ILIKE $1 OR body ILIKE $1) AND language=$2 AND status=$3 ORDER BY news_id DESC LIMIT $4 OFFSET $5",
      [`%${search}%`, language, "edited", perPage, offset]
    );
  
    if (articles.rowCount <= 0) {
      return res.status(404).json({ status: 404, error: 'Not found' });;
    }
  
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
  
};

const getAppRelatedArticles = async (req, res) => {
  const { id } = req.params;
  const { category, language } = req.query;

  try {
    const articles = await db.query(
      `SELECT * FROM news WHERE category=$1 AND language=$2 AND status=$3 AND news_id!=$4 ORDER BY news_id DESC LIMIT 5`,
      [category, language, "edited", id]
    );

    if (articles.rowCount <= 0) {
      return res.status(404).json({ status: 404, error: 'Not found' });;
    }
  
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

const getArticle = async (req, res) => {
  // get from params
  const { newsId } = req.params;
  try {
    const isArticle = await db.query("SELECT * FROM news WHERE news_id=$1", [
      newsId,
    ]);
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

const getRecentArticles = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM news ORDER BY news_id DESC LIMIT 5"
    );
    return res.status(200).json({ status: 200, data: rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, data: error.message });
  }
};

const getTotalArticles = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT COUNT(*) FROM news");
    return res.status(200).json({ status: 200, data: rows[0].count });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

const getTotalPendingArticles = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT COUNT(*) FROM news WHERE status=$1",
      ["pending"]
    );
    return res.status(200).json({ status: 200, data: rows[0].count });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

const countArticles = async (articleId) => {
  try {
    const isArticle = await db.query("SELECT * FROM stats WHERE news_id=$1", [
      articleId,
    ]);

    if (isArticle.rowCount <= 0) {
      const results = await db.query(
        `INSERT INTO stats(counts,news_id) VALUES ($1,$2) RETURNING *`,
        [1, articleId]
      );

      return results.rows[0].counts;
    }

    const count = Number(isArticle.rows[0].counts) + 1;
    const results = await db.query(
      `UPDATE stats SET counts=$1 WHERE news_id=$2 RETURNING *`,
      [count, articleId]
    );

    return results.rows[0].counts;
  } catch (error) {
    throw error;
  }
};

const getTotalViews = async (req, res) => {
  try {
    const counts = await db.query(
      "SELECT COALESCE(SUM(counts),0) AS counts FROM stats"
    );

    return res.status(200).json({ status: 200, data: counts.rows[0].counts });
  } catch (error) {
    return res.status(500).json({ status: 500, data: error.message });
  }
};

const getMostViewedArticles = async (req, res) => {
  try {
    const mostViewed = await db.query(
      "SELECT * FROM stats JOIN news ON news.news_id=stats.news_id ORDER BY stats.counts DESC LIMIT 5"
    );
    return res.status(200).json({ status: 200, data: mostViewed.rows });
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
  getHomeNews,
  getMoreHomeNews,
  getNewsByCategory,
  searchNews,
  getRelatedArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getAppNews,
  getAppSingleArticle,
  getAppNewsByCategory,
  searchAppNews,
  getAppRelatedArticles,
  getArticle,
  getRecentArticles,
  getTotalArticles,
  getTotalPendingArticles,
  countArticles,
  getTotalViews,
  getMostViewedArticles,
};
