const article = require("../models/Article");
const verse = require("../models/Verse");
const cat = require("../models/Category");
const comment = require("../models/Comment");

const getNews = async (req, res) => {
  let news = [];
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { category, search } = req.query;

    if (category) {
      news = await article.getNewsByCategory(category, currentLocale);
    } else if (search) {
      news = await article.searchNews(search, currentLocale);
      console.log(news);
    } else {
      news = await article.getNews(currentLocale);
    }

    const recentNews = await article.getRecentNews(currentLocale);
    const categories = await cat.getnewsCategories();
    const verseOfTheDay = await verse.getVerse();

    res.locals.currentLocale = currentLocale;
    res.render("pages/news", {
      news,
      recentNews,
      categories,
      verse: verseOfTheDay,
    });
  } catch (error) {
    throw error;
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { slug } = req.query;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews(currentLocale);
    const relatedArticles = await article.getRelatedArticle(slug, currentLocale);
    const verseOfTheDay = await verse.getVerse();
    const comments = await comment.getComments(slug);

    res.locals.currentLocale = currentLocale;
    res.render("pages/selected-post", {
      article: newsArticle,
      recentNews,
      relatedArticles,
      verse: verseOfTheDay,
      comments,
    });
  } catch (error) {
    throw error;
  }
};

const postComment = async (req, res) => {
  try {
    const currentLocale = req.query.locale || "en-GB";
    const { slug } = req.query;
    const { name, email, comment: commnt } = req.body;
    const newsArticle = await article.getSingleArticle(slug);
    const recentNews = await article.getRecentNews(currentLocale);
    const relatedArticles = await article.getRelatedArticle(slug, currentLocale);
    const verseOfTheDay = await verse.getVerse();
    const { comments, errors } = await comment.postComment(name, email, commnt, slug);

    res.locals.currentLocale = currentLocale;
    res.render("pages/selected-post", {
      article: newsArticle,
      recentNews,
      relatedArticles,
      verse: verseOfTheDay,
      comments,
      errors,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getNews,
  getSingleArticle,
  postComment,
};
