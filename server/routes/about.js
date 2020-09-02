const article = require("../models/Article");

const getAbout = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/aboutus", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAbout,
};
