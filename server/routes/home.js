const article = require("../models/Article");
const category = require("../models/Category");
const timeDifference = require("../utils/timeDifference");

const getHome = async (req, res) => {
  try {
    const news = await article.getNews();
    const recentNews = await article.getRecentNews();
    const categories = await category.getnewsCategories();

    res.render("pages/index", { news, categories, recentNews, timeDifference });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHome,
};
