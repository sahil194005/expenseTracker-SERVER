const express = require('express');
const { addExpense ,getExpenses,deleteExpense,downloadCSV} = require('../Controller/Expenses')
const AuthUser = require('../Auth/AuthUser')
const router = express.Router();

router.route('/addExpense').post(AuthUser, addExpense);
router.route('/getExpenses').get(AuthUser, getExpenses);
router.route('/deleteExpense/:id').delete(AuthUser, deleteExpense)
router.route('/downloadCSV').get(AuthUser,downloadCSV)
module.exports = router;