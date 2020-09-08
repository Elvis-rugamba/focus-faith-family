const db = require("../config/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    profileImage,
    role,
  } = req.body;
  console.log("here", req.bo);
  try {
    const isUser = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (isUser.rowCount > 0)
      return res
        .status(409)
        .json({ status: 409, message: "User already exists" });
    const hashPassword = bcrypt.hashSync(password, 11);
    const results = await db.query(
      `INSERT INTO users(firstName, lastName, email, phone, password, profileImage,role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [firstName, lastName, email, phone, hashPassword, profileImage, role]
    );
    console.log("yoooo", results.rows);
    return res.status(201).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailFound = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    
    if (emailFound.rowCount === 0)
      return res
        .status(404)
        .json({ message: "This account is not created yet" });

    console.log("password", emailFound, password);
    const isPassword = bcrypt.compareSync(
      password,
      emailFound.rows[0].password
    );
    if (!isPassword)
      return res.status(401).json({ message: "Incorrect email or password" });

    const token = jwt.sign({ payload: emailFound.rows[0] }, process.env.KEY);
    const payload = jwt.verify(token, process.env.KEY);
    req.user = payload;
    return res.status(200).json({ status: 200, data: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changeRole = async (req, res) => {
  const { user_id } = req.user.payload;
  const { userId } = req.params;
  const { role } = req.body;
  //check if is admin
  const { rows } = await db.query("SELECT * FROM users WHERE user_id=$1", [
    user_id,
  ]);
  if (rows[0].role !== "admin")
    return res.status(403).json({ status: 403, message: "Forbidden action" });
  //check if email or user exists
  const user = await db.query("SELECT * FROM users WHERE user_id=$1", [userId]);
  if (user.rowCount === 0)
    return res.status(404).json({ status: 404, message: "User not found" });
  //change role
  const updateRole = await db.query(
    "UPDATE users SET role=$1 WHERE user_id=$2 RETURNING *",
    [role, userId]
  );
  console.log("whaaat", updateRole.rows[0]);
  return res.status(200).json({ status: 200, data: updateRole.rows[0] });
};

const getAllUsers = async (req, res) => {
  //get all users
  try {
    const users = await db.query("SELECT * FROM users");
    return res.status(200).json({ status: 200, data: users.rows });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  createUser,
  signinUser,
  changeRole,
  getAllUsers,
};
