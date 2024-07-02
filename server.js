const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const user_signup = require("./src/apis/signup");
const user_signin = require("./src/apis/signin");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// apis
user_signup(app);
user_signin(app);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
