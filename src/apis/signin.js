const {
    loginUser,
    checkUserLoggedIn,
    getUserByEmail,
  } = require("../db/queries/queries");
  const { comparePassword } = require("../utils/helper");
  
  const user_signin = (app) => {
    app.post("/v1/signin", async (req, res) => {
      try {
        const { email = "", password = "" } = req.body;
  
        if (email === "" || password === "") {
          return res
            .status(400)
            .json({ title: "Bad Request", message: "Missing required fields." });
        }
  
        const checkUserExist = await getUserByEmail(email);
  
        if (checkUserExist === undefined) {
          return res.status(404).json({
            title: "User Not Found",
            message: "User with the following email does not exist.",
          });
        } else {
          const userLoggedIn = await checkUserLoggedIn(checkUserExist.id);
  
          if (userLoggedIn !== undefined) {
            const userData = {
              session_id: userLoggedIn.session_id,
              user_id: userLoggedIn.id,
              email: checkUserExist.email,
              createdAt: checkUserExist.createdAt,
            };
  
            return res
              .status(200)
              .json({ title: "User Already Logged In", details: userData });
          } else {
            const storedPassword = checkUserExist.password;
            const matchPassword = await comparePassword(password, storedPassword);
  
            if (matchPassword) {
              const response = await loginUser(checkUserExist.id);
  
              const userData = {
                id: loginUser.id,
                user_id: loginUser.user_id,
                name: checkUserExist.name,
                email: checkUserExist.email,
                phoneNo: checkUserExist.phoneNo,
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
          message: "Something went wrong!",
        });
      }
    });
  };
  
  module.exports = user_signin;
  