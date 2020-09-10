const article = require("../models/Article");

const getAbout = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-US";
    const recentNews = await article.getRecentNews();

    res.locals.currentLocale = currentLocale;
    res.render("pages/aboutus", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAbout,
};
