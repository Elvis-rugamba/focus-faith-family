const article = require("../models/Article");
const cat = require("../models/Category");
const timeDifference = require("../utils/timeDifference");

const getNews = async (req, res) => {
  let news = [];
  try {
    const currentLocale = req.query.locale || "en-US";
    const { category, search } = req.query;

    if (category) {
      news = await article.getNewsByCategory(category);
    } else if (search) {
      news = await article.searchNews(search);
      console.log(news);
    } else {
      news = await article.getNews();
    }

    const recentNews = await article.getRecentNews();
    const categories = await cat.getnewsCategories();

    res.locals.currentLocale = currentLocale;
    res.render("pages/news", { news, recentNews, categories, });
  } catch (error) {
    throw error;
  }
};

const getSingleArticle = async (req, res) => {
  try {
    console.log(res.query);
    const currentLocale = req.query.locale || "en-US";
    const { slug } = req.query;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews();

    res.locals.currentLocale = currentLocale;
    res.render("pages/selected-post", {
      article: newsArticle,
      recentNews,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getNews,
  getSingleArticle,
};
