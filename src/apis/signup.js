const { getUserByPhone, getUserByEmail } = require("../db/queries/queries");
const { hashPassword } = require("../utils/helper");

const user_signup = (app) => {
  app.post("/v1/signup", async (req, res) => {
    try {
      const { name = "", email = "", phoneNo = "", password = "" } = req.body;

      if (name === "" || email === "" || phoneNo === "" || password === "") {
        return res
          .status(400)
          .json({ title: "Bad Request", message: "Missing required fields." });
      }

      const checkUserExist = await getUserByPhone(phoneNo);
      if (checkUserExist !== undefined) {
        return res
          .status(409)
          .json({
            title: "Conflict",
            message: "User with the given phone number already exists.",
          });
      }

      checkUserExist = await getUserByEmail(email);
      if (checkUserExist !== undefined) {
        return res
          .status(409)
          .json({
            title: "Conflict",
            message: "User with the given email already exists.",
          });
      }

      const hashedPassword = await hashPassword(password);

      const userDetails = {
        name: name,
        email: email,
        password: hashedPassword,
        phoneNo: phoneNo,
      };

      const response = await addUser(userDetails);

      return res
        .status(201)
        .json({ title: "User Registered Successfully", data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        title: "Internal Server Error",
        message: "Something went wrong!",
      });
    }
  });
};

module.exports = user_signup;