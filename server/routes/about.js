const article = require("../models/Article");
const verse = require('../models/Verse');

const getAbout = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "ki-RW";
    const recentNews = await article.getRecentNews();
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/aboutus", { recentNews, verse: verseOfTheDay });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAbout,
};
