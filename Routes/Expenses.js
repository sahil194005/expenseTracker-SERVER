const express = require('express');
const { addExpense } = require('../Controller/Expenses')
const AuthUser = require('../Auth/AuthUser')
const router = express.Router();

router.route('/addExpense').post(AuthUser,addExpense);
module.exports = router;