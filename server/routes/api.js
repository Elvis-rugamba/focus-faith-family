const { Router } = require("express");
const article = require("../models/Article");
const category = require("../models/Category");
const user = require("../models/User");
const { verifyToken } = require("../middleware/verifyToken");

const router = Router();

router.get("/users", user.getAllUsers);
router.get("/news", article.getAllArticles);
router.get("/categories", category.getCategories);
router.get("/group-categories", category.getCategoriesByGroup);
router.post("/new-article", article.createArticle);
router.post("/new-category", category.createCategory);
router.post("/new-user", user.createUser);
router.get("/news/:newsId", article.getArticle);
router.post("/signin", user.signinUser);
router.patch("/user/:userId", verifyToken, user.changeRole);
router.patch("/edit-article/:articleId", verifyToken, article.editArticle);

module.exports = router;
