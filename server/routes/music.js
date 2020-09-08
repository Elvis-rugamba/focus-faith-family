const music = require("../models/Music");
const musicCategory = require("../models/MusicCategory");
const article = require("../models/Article");
const timeDifference = require("../utils/timeDifference");

const getMusic = async (req, res) => {
  try {
    const { category, search } = req.query;
    let musics = [];

    if (category) {
      musics = await music.getMusicsByCategory(category);
    } else if (search) {
      console.log(search);
      musics = await music.searchMusics(search);
      console.log(musics);
    } else {
      musics = await music.getMusics();
    }
    const recentMusics = await music.getRecentMusics();
    const categories = await musicCategory.getMusicsCategories();
    const recentNews = await article.getRecentNews();

    res.render("pages/music", {
      musics,
      recentMusics,
      categories,
      recentNews,
      timeDifference,
    });
  } catch (error) {
    throw error;
  }
};

const getSingleMusic = async (req, res) => {
  try {
    const { slug } = req.query;
    const singleMusic = await music.getSingleMusic(slug);
    const recentMusics = await music.getRecentMusics();
    const recentNews = await article.getRecentNews();
    res.render("pages/selected-music", {
      music: singleMusic,
      recentNews,
      recentMusics,
      timeDifference,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMusic,
  getSingleMusic
};
