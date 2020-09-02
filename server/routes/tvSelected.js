const article = require("../models/Article");

const getSelected = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/selected-tvShow", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSelected,
};
