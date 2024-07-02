const pool = require("../dbConfig");

const getUserByPhone = async (phoneNo) => {
  const query = "SELECT * FROM users WHERE phoneNo=$1";

  const result = await pool.query(query, [phoneNo]);

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email=$1";

  const result = await pool.query(query, [email]);

  console.log("---result: ", result.rows[0]);
  return result.rows[0];
};

const getUserByName = async (name) => {
  const query = "SELECT * FROM users WHERE name=$1";

  const result = await pool.query(query, [name]);

  return result.rows[0];
};

const addUser = async (userDetails) => {
  const { name, email, password, phoneNo } = userDetails;

  const query =
    "INSERT INTO users (name, email, phoneNo, password) VALUES ($1, $2, $3, $4) RETURNING *";

  const result = await pool.query(query, [name, email, phoneNo, password]);

  /* const registrationDetails = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    phoneNo: result.rows[0].phoneNo,
  }; */

  return result.rows[0];
};

const checkUserLoggedIn = async (user_id) => {
  const query = "SELECT * FROM sessions WHERE user_id=$1";

  const result = await pool.query(query, [user_id]);

  return result.rows[0];
};

const loginUser = async (user_id) => {
  const query = "INSERT INTO sessions (user_id) VALUES ($1) RETURNING *";

  const result = await pool.query(query, [user_id]);

  /*  const loginDetails = {
    session_id: result.rows[0].session_id,
    user_id: result.rows[0].user_id,
  }; */

  return result.rows[0];
};

module.exports = {
  getUserByPhone,
  getUserByEmail,
  getUserByName,
  addUser,
  checkUserLoggedIn,
  loginUser,
};
