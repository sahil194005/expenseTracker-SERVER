const express = require('express')
const { SignUp,Login } = require('../Controller/Users')
const router = express.Router();

router.route('/signup').post(SignUp)
router.route('/login').post(Login)

module.exports = router;