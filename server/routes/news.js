const article = require("../models/Article");

const getNews = async (req, res) => {
  let news = [];
  try {
    const { category } = req.query;

    if (category) {
      news = await article.getNewsByCategory(category);
    } else {
      news = await article.getNews();
    }

    const recentNews = await article.getRecentNews();

    res.render("pages/news", { news, recentNews });
  } catch (error) {
    throw error;
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const { slug } = req.query;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews();
    res.render("pages/selected-post", { article: newsArticle, recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getNews,
  getSingleArticle,
};
