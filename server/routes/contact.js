const article = require("../models/Article");

const getContact = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-US";
    const recentNews = await article.getRecentNews();

    res.locals.currentLocale = currentLocale;
    res.render("pages/contactus", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getContact,
};
