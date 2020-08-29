const express = require('express')
const router = express.Router()
const db = require('../config/connect');

router.get('/', async (req, res) => {
  try {
    const news = await db.getNews();
    res.render('pages/index', { data: news, error: null });
  } catch (error) {
    console.log(error);
    res.render('pages/index', { data: null, error });
  }
});

router.get('/news', async (req, res) => {
  const singleNews = await db.getSingleNews(req);
  console.log('ssss', singleNews);
  res.render('pages/selected-post', {data: singleNews, error: null});
});

router.get('/tv', (req, res) => {
  res.render('pages/tvShow');
});

router.get('/radio', (req, res) => {
  res.render('pages/selected-radio');
});

router.get('/music', (req, res) => {
  res.render('pages/music');
});

router.get('/contact', (req, res) => {
  res.render('pages/contactus');
});

router.get('/about', (req, res) => {
  res.render('pages/aboutus');
});

router.get('/selectedtv', (req, res) => {
  res.render('pages/selected-tvShow');
});

module.exports = router;