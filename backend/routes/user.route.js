const expres = require("express");
const { Register } = require("../controllers/user.controller");

const userRoute = expres.Router();

userRoute.post("/register", Register);

module.exports = userRoute;
