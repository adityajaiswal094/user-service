const queries = require("../db/queries/queries");
const { comparePassword } = require("../utils/helper");

const user_signin = (app) => {
  app.post("/v1/signin", async (req, res) => {
    try {
      const { email = "", password = "" } = req.body;
      const device_id = req.header("device_id");

      if (device_id === undefined || device_id === "") {
        return res
          .status(400)
          .json({
            title: "Bad Request",
            message: "Header device_id is missing.",
          });
      }

      if (email === "" || password === "") {
        return res
          .status(400)
          .json({ title: "Bad Request", message: "Missing required fields." });
      }

      const checkUserExist = await queries.checkUserExist("email", email);

      if (checkUserExist === undefined) {
        return res.status(404).json({
          title: "User Not Found",
          message: "User with the following email does not exist.",
        });
      } else {
        const userLoggedIn = await queries.checkUserLoggedIn(
          checkUserExist.id,
          device_id
        );

        if (userLoggedIn !== undefined) {
          const userData = {
            session_id: userLoggedIn.id,
            user_id: userLoggedIn.id,
            device_id: userLoggedIn.device_id,
            createdAt: userLoggedIn.createdAt,
          };

          return res
            .status(200)
            .json({ title: "User Already Logged In", details: userData });
        } else {
          const storedPassword = checkUserExist.password;
          const matchPassword = await comparePassword(password, storedPassword);

          if (matchPassword) {
            const response = await queries.loginUser(
              checkUserExist.id,
              device_id
            );

            const userData = {
              id: response.id,
              user_id: response.user_id,
              name: checkUserExist.name,
              email: checkUserExist.email,
              phone_no: checkUserExist.phone_no,
            };

            return res
              .status(200)
              .json({ title: "User Logged In", data: userData });
          } else {
            return res
              .status(401)
              .json({ title: "Unauthorized", message: "Invalid credentials." });
          }
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        title: "Internal Server Error",
        message: error.message.length != 0 ? error.message : "Something went wrong!",
      });
    }
  });
};

module.exports = user_signin;
