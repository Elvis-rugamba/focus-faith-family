const article = require("../models/Article");

const getContact = async (req, res) => {
  try {
    const recentNews = await article.getRecentNews();

    res.render("pages/contactus", { recentNews });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getContact,
};
