const article = require("../models/Article");
const cat = require("../models/Category");
const timeDifference = require("../utils/timeDifference");

const getNews = async (req, res) => {
  let news = [];
  try {
    const { category, search } = req.query;

    if (category) {
      news = await article.getNewsByCategory(category);
    } else if (search) {
      console.log(search);
      news = await article.searchNews(search);
      console.log(news);
    } else {
      news = await article.getNews();
    }

    const recentNews = await article.getRecentNews();
    const categories = await cat.getnewsCategories();

    console.log(news);

    res.render("pages/news", { news, recentNews, categories, timeDifference });
  } catch (error) {
    throw error;
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const { slug } = req.query;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews();
    res.render("pages/selected-post", {
      article: newsArticle,
      recentNews,
      timeDifference,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getNews,
  getSingleArticle,
};
