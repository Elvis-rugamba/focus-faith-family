const article = require("../models/Article");
const category = require("../models/Category");
const timeDifference = require("../utils/timeDifference");
const { translate } = require("../i18n/i18n");

const getHome = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-US";
    const news = await article.getNews();
    const recentNews = await article.getRecentNews();
    const categories = await category.getnewsCategories();

    res.locals.currentLocale = currentLocale;
    res.render("pages/index", { news, categories, recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHome,
};
