const express = require("express");
const { SignUp, Login, profileComplete, getProfile } = require("../Controller/Users");
const AuthUser = require("../Auth/AuthUser");
const router = express.Router();

router.route("/signup").post(SignUp);
router.route("/login").post(Login);
router.route("/profile/complete").post(AuthUser, profileComplete);
router.route("/profile/getProfile").get( AuthUser,getProfile);

module.exports = router;
