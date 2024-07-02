const pool = require("../dbConfig");

const checkUserExist = async (key, value) => {
  const query = `SELECT * FROM users WHERE ${key}=$1`;

  const result = await pool.query(query, [value]);

  return result.rows[0];
};

const getUserByEmailOrPhone = async (key, value) => {
  const query = `SELECT id, name, email, phone_no FROM users WHERE ${key} LIKE $1`;

  const result = await pool.query(query, [`%${value}%`]);

  return result.rows;
};

const getUserByName = async (name) => {
  let lowerCaseName = name.toLowerCase();
  const query =
    "SELECT id, name, email, phone_no FROM users WHERE LOWER(name) LIKE $1";

  const result = await pool.query(query, [`%${lowerCaseName}%`]);

  return result.rows;
};

const addUser = async (userDetails) => {
  const { name, email, password, phone_no } = userDetails;

  const query =
    "INSERT INTO users (name, email, phone_no, password) VALUES ($1, $2, $3, $4) RETURNING *";

  const result = await pool.query(query, [name, email, phone_no, password]);

  const data = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    phone_no: result.rows[0].phone_no,
  };

  return data;
};

const checkUserLoggedIn = async (user_id, device_id) => {
  const query = "SELECT * FROM sessions WHERE user_id=$1 AND device_id=$2";

  const result = await pool.query(query, [user_id, device_id]);

  return result.rows[0];
};

const loginUser = async (user_id, device_id) => {
  const query =
    "INSERT INTO sessions (user_id, device_id) VALUES ($1, $2) RETURNING *";

  const result = await pool.query(query, [user_id, device_id]);

  const data = {
    id: result.rows[0].id,
    user_id: result.rows[0].user_id,
    device_id: result.rows[0].device_id,
  };

  return data;
};

const getLoggedInUsers = async () => {
  const query = "SELECT * FROM sessions";

  const result = await pool.query(query);

  return result.rows;
};

module.exports = {
  checkUserExist,
  getUserByEmailOrPhone,
  getUserByName,
  addUser,
  checkUserLoggedIn,
  loginUser,
  getLoggedInUsers,
};
