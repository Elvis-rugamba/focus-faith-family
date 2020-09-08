const radio = require("../models/Radio");
const radioCategory = require('../models/RadioCategory');
const article = require("../models/Article");
const category = require('../models/Category');
const timeDifference = require("../utils/timeDifference");

const getRadio = async (req, res) => {
  try {
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
    const recentNews = await article.getRecentNews();

    res.render("pages/radio", { radios, recentRadios, recentNews, categories, timeDifference });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRadio,
};
