const article = require("../models/Article");
const cat = require("../models/Category");

const getNews = async (req, res) => {
  let news = [];
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { category, search } = req.query;

    if (category) {
      news = await article.getNewsByCategory(category, currentLocale);
    } else if (search) {
      news = await article.searchNews(search, currentLocale);
      console.log(news);
    } else {
      news = await article.getNews(currentLocale);
    }

    const recentNews = await article.getRecentNews(currentLocale);
    const categories = await cat.getnewsCategories();

    res.locals.currentLocale = currentLocale;
    res.render("pages/news", { news, recentNews, categories, });
  } catch (error) {
    throw error;
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { slug } = req.query;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews(currentLocale);

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
