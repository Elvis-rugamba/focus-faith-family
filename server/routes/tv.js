const article = require("../models/Article");

const getTv = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/tvShow", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTv,
};
