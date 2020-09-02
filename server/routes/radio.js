const article = require("../models/Article");

const getRadio = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/radio", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRadio,
};
