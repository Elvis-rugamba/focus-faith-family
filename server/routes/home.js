const article = require("../models/Article");
const category = require("../models/Category");

const getHome = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-US";
    const news = await article.getNews(currentLocale);
    const recentNews = await article.getRecentNews(currentLocale);
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
