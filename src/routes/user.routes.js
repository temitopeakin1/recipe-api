const { signup, login} = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const { validateLogin, validateSignUp } = require("../validators/auth");


router.post("/signup", validateSignUp, signup);
router.post("/login", validateLogin, login);


module.exports = router;