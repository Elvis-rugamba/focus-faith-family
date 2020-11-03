const db = require("../config/connect");

const createCategory = async (req, res) => {
  // get from body
  const { categoryName, frenchName, rwandanName } = req.body;
  // check if the category exists already
  const isCategory = await db.query(
    "SELECT * FROM radio_categories WHERE category_name=$1",
    [categoryName]
  );
  if (isCategory.rowCount > 0)
    return res
      .status(409)
      .json({ status: 409, message: "Category already created" });
  // create category
  const newCategory = await db.query(
    "INSERT INTO radio_categories(category_name, french_name, rwandan_name) VALUES($1, $2, $3) RETURNING *",
    [categoryName, frenchName, rwandanName]
  );
  return res.status(201).json({ status: 201, data: newCategory.rows[0] });
};

const getCategories = async (req, res) => {
  try {
    const isArticle = await db.query("SELECT * FROM radio_categories");
    return res.status(200).json({ status: 200, data: isArticle.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getCategoriesByGroup = async (req, res) => {
  try {
    const articles = await db.query(
      "SELECT COUNT(radio.category) FROM radio INNER JOIN radio_categories ON radio.category=radio_categories.category_name GROUP BY radio.category"
    );
    return res.status(200).json({ status: 200, data: articles.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getRadioCategories = async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM radio_categories");
    return categories.rows;
  } catch (error) {
    throw error
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoriesByGroup,
  getRadioCategories
};
