const expres = require("express");
const {
  Register,
  UserProfile,
  Login,
} = require("../controllers/user.controller");

const userRoute = expres.Router();

userRoute.get("/profile", UserProfile);
userRoute.post("/login", Login);
userRoute.post("/register", Register);

module.exports = userRoute;
