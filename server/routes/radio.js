const radio = require("../models/Radio");
const radioCategory = require('../models/RadioCategory');
const article = require("../models/Article");
const verse = require('../models/Verse');

const getRadio = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { category, search } = req.query;
    let radios = [];

    if (category) {
      radios = await radio.getRadioByCategory(category);
    } else if (search) {
      radios = await radio.searchRadio(search);
    } else {
      radios = await radio.getRadio();
    }
    const recentRadios = await radio.getRecentRadio();
    const categories = await radioCategory.getRadioCategories();
    const recentNews = await article.getRecentNews(currentLocale);
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/radio", { radios, recentRadios, recentNews, categories, verse: verseOfTheDay });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRadio,
};
