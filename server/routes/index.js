const { Router } = require("express");
const catchErrors = require("../utils/catchErrors");
const home = require("./home");
const news = require("./news");
const tv = require("./tv");
const radio = require("./radio");
const music = require("./music");
const contact = require("./contact");
const about = require("./about");
const tvSelected = require("./tvSelected");

const router = Router();

router.get("/", catchErrors(home.getHome));
router.get("/news", catchErrors(news.getNews));
router.get("/article", catchErrors(news.getSingleArticle));
router.get("/tv", catchErrors(tv.getTv));
router.get("/radio", catchErrors(radio.getRadio));
router.get("/music", catchErrors(music.getMusic));
router.get("/contact", catchErrors(contact.getContact));
router.get("/about", catchErrors(about.getAbout));
router.get("/selectedtv", catchErrors(tvSelected.getSelected));
module.exports = router;
