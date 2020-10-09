const article = require("../models/Article");
const verse = require('../models/Verse');l

const getSelected = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "ki-RW";
    const recentNews = await article.getRecentNews(currentLocale);
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/selected-tvShow", { recentNews,verse: verseOfTheDay });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSelected,
};
