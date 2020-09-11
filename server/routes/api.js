const { Router } = require("express");
const article = require("../models/Article");
const category = require("../models/Category");
const user = require("../models/User");
const music = require("../models/Music");
const musicCategory = require("../models/MusicCategory");
const tv = require("../models/Tv");
const tvCategory = require("../models/TvCategory");
const radio = require("../models/Radio");
const radioCategory = require("../models/RadioCategory");
const { verifyToken } = require("../middleware/verifyToken");
const upload = require('../middleware/upload');

const router = Router();

router.get("/users", user.getAllUsers);
router.get("/news", article.getAllArticles);
router.post("/news/upload", verifyToken, upload.single('image'), article.upload);
router.get("/categories", category.getCategories);
router.get("/group-categories", category.getCategoriesByGroup);
router.post("/new-article", article.createArticle);
router.post("/new-category", category.createCategory);
router.post("/new-user", user.createUser);
router.get("/news/:newsId", article.getArticle);
router.post("/signin", user.signinUser);
router.patch("/user/:userId", verifyToken, user.changeRole);
router.patch("/edit-article/:articleId", verifyToken, article.editArticle);
router.post("/musics", verifyToken, music.createLibrary);
router.get("/musics", music.getAllMusics);
router.patch("/musics/:id", verifyToken, music.editmusic);
router.post("/musics/categories", verifyToken, musicCategory.createCategory);
router.get("/musics/categories", musicCategory.getCategories);
router.get("/musics/categories/group", musicCategory.getCategoriesByGroup);
router.post("/musics/upload", verifyToken, upload.single('music'), music.upload);
router.post("/musics/cover", verifyToken, upload.single('image'), music.upload);
router.post("/radio", verifyToken, radio.createRadio);
router.get("/radio", radio.getAllRadio);
router.patch("/radio/:id", verifyToken, radio.editRadio);
router.post("/radio/categories", verifyToken, radioCategory.createCategory);
router.get("/radio/categories", radioCategory.getCategories);
router.get("/radio/categories/group", radioCategory.getCategoriesByGroup);
router.post("/radio/upload", verifyToken, upload.single('radio'), radio.upload);
router.post("/radio/cover", verifyToken, upload.single('image'), radio.upload);
router.post("/tv", verifyToken, tv.createTv);
router.get("/tv", tv.getAllTvShows);
router.patch("/tv/:id", verifyToken, tv.editTv);
router.post("/tv/categories", verifyToken, tvCategory.createCategory);
router.get("/tv/categories", tvCategory.getCategories);
router.get("/tv/categories/group", tvCategory.getCategoriesByGroup);
router.post("/tv/upload", verifyToken, upload.single('tv'), tv.upload);
router.post("/tv/cover", verifyToken, upload.single('cover'), tv.upload);

module.exports = router;
