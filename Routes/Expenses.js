const express = require('express');
const { addExpense ,getExpenses} = require('../Controller/Expenses')
const AuthUser = require('../Auth/AuthUser')
const router = express.Router();

router.route('/addExpense').post(AuthUser, addExpense);
router.route('/getExpenses').get(AuthUser,getExpenses)
module.exports = router;