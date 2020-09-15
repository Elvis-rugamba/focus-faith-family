const article = require("../models/Article");
const verse = require('../models/Verse');

const getContact = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const recentNews = await article.getRecentNews();
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/contactus", { recentNews, verse: verseOfTheDay });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getContact,
};
