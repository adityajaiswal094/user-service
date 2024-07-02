const queries = require("../db/queries/queries");
const { hashPassword, comparePassword } = require("../utils/helper");

const user_signup = (app) => {
  app.post("/v1/signup", async (req, res) => {
    try {
      const { name = "", email = "", phone_no = "", password = "" } = req.body;
      const device_id = req.header("device_id");

      if (device_id === undefined || device_id === "") {
        return res.status(400).json({
          title: "Bad Request",
          message: "Header device_id is missing.",
        });
      }

      if (name === "" || email === "" || phone_no === "" || password === "") {
        return res
          .status(400)
          .json({ title: "Bad Request", message: "Missing required fields." });
      }

      let checkUserExist = await queries.checkUserExist("phone_no", phone_no);
      if (checkUserExist !== undefined) {
        return res.status(409).json({
          title: "Conflict",
          message: "User with the given phone number already exists.",
        });
      }

      checkUserExist = await queries.checkUserExist("email", email);
      if (checkUserExist !== undefined) {
        return res.status(409).json({
          title: "Conflict",
          message: "User with the given email already exists.",
        });
      }

      const hashedPassword = await hashPassword(password);

      const userDetails = {
        name: name,
        email: email,
        password: hashedPassword,
        phone_no: phone_no,
      };

      const addUserResponse = await queries.addUser(userDetails);

      const loginResponse = await queries.loginUser(
        addUserResponse.id,
        device_id
      );


      return res
        .status(201)
        .json({ title: "User Registered Successfully", data: addUserResponse });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        title: "Internal Server Error",
        message: error.message.length != 0 ? error.message : "Something went wrong!",
      });
    }
  });
};

module.exports = user_signup;
