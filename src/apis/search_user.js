const queries = require("../db/queries/queries");

const search_user = (app) => {
  try {
    app.get("/v1/search", async (req, res) => {
      const { name, phone_no, email } = req.query;
      const user_id = req.header("user_id");
      const device_id = req.header("device_id");

      if (name === undefined && phone_no === undefined && email === undefined) {
        return res.status(404).json({
          title: "404 Error Not Found",
          message: "Url does not exist",
        });
      }

      if (user_id === undefined) {
        return res.status(400).json({
          title: "Bad Request",
          message: "Header user_id is missing.",
        });
      }

      if (device_id === undefined) {
        return res.status(400).json({
          title: "Bad Request",
          message: "Header device_id is missing.",
        });
      }

      const checkUserLoggedIn = await queries.checkUserLoggedIn(
        user_id,
        device_id
      );

      if (checkUserLoggedIn === undefined) {
        return res.status(401).json({
          title: "Unauthorized",
          message: "You need to sign in to use this feature",
        });
      }

      const normalizedPhoneNo = phone_no
        ? phone_no.replace(/ /g, "+")
        : undefined;

      let response = [];

      if (name !== undefined) {
        response = await queries.getUserByName(name);
      } else if (phone_no !== undefined) {
        response = await queries.getUserByEmailOrPhone(
          "phone_no",
          normalizedPhoneNo
        );
      } else if (email !== undefined) {
        response = await queries.getUserByEmailOrPhone("email", email);
      }

      return res
        .status(200)
        .json({ title: "Users Fetched Successfully", data: response });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      title: "Internal Server Error",
      message: error.message.length != 0 ? error.message : "Something went wrong!",
    });
  }
};

module.exports = search_user;
