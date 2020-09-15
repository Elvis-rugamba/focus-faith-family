const tv = require("../models/Tv");
const article = require("../models/Article");
const tvCategory = require("../models/TvCategory");
const timeDifference = require("../utils/timeDifference");

const getTv = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { category, search } = req.query;
    let tvShows = [];

    if (category) {
      tvShows = await tv.getTvByCategory(category);
    } else if (search) {
      tvShows = await tv.searchTv(search);
    } else {
      tvShows = await tv.getTvShows();
    }
    const recentNews = await article.getRecentNews(currentLocale);
    const categories = await tvCategory.getTvCategories();

    res.locals.currentLocale = currentLocale;
    res.render("pages/tvShow", { tvShows, recentNews, categories });
  } catch (error) {
    throw error;
  }
};

const getSingleTv = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const {slug} = req.query;

    const tvShow = await tv.getSingleTv(slug);
    const recentNews = await article.getRecentNews(currentLocale);

    res.locals.currentLocale = currentLocale;
    res.render("pages/selected-tvShow", { tvShow, recentNews, timeDifference });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTv,
  getSingleTv
};
