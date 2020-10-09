const article = require("../models/Article");
const category = require("../models/Category");
const verse = require('../models/Verse');

const getHome = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "ki-RW";
    const news = await article.getNews(currentLocale);
    const recentNews = await article.getRecentNews(currentLocale);
    const categories = await category.getnewsCategories();
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/index", { news, categories, recentNews, verse: verseOfTheDay });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHome,
};
