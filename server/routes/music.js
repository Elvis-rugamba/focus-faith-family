const article = require("../models/Article");

const getMusic = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/music", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMusic,
};
