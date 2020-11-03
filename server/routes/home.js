const article = require("../models/Article");
const category = require("../models/Category");
const verse = require('../models/Verse');
const tv = require("../models/Tv");

const getHome = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "ki-RW";
    const news = await article.getHomeNews(currentLocale);
    const moreNews = await article.getMoreHomeNews(currentLocale);
    const recentNews = await article.getRecentNews(currentLocale);
    const categories = await category.getnewsCategories();
    const verseOfTheDay = await verse.getVerse();
    const tvShows = await tv.getHomeTvShows();

    res.locals.currentLocale = currentLocale;
    res.render("pages/index", { news, moreNews, categories, recentNews, verse: verseOfTheDay, tvShows });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHome,
};
