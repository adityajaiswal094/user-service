const queries = require("../db/queries/queries");

const userLoggedIn = (app) => {
  try {
    app.get("/userloggedin", async (req, res) => {
      const { user_id } = req.query;

      if (user_id === undefined) {
        return res
          .status(400)
          .json({ title: "Bad Request", message: "Header user_id is missing" });
      }

      const loggedInUsers = await queries.getLoggedInUsers();

      if (loggedInUsers.some(user => user.user_id === parseInt(user_id))) {
        res.status(200).send({ isLoggedIn: true });
      } else {
        res.status(200).send({ isLoggedIn: false });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Internal Server Error",
      message:
        error.message.length != 0 ? error.message : "Something went wrong",
    });
  }
};

module.exports = userLoggedIn;
