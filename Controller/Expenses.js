const ExpenseSchema = require("../Models/Expenses");

const addExpense = async (req, res) => {
	try {
		console.log(req.body);
        const response = await ExpenseSchema.create({ ...req.body, userId: req.User._id });
        res.status(201).json({ msg: "expense Added", success: true });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "could not add expense", success: false });
	}
};


const getExpenses = async (req, res) => {
	try {
		const response = await ExpenseSchema.find({ userId: req.User._id });
		res.status(201).json({ msg: "Fetched Expenses", success: "true", data: response });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: 'could not get expenses', success: false });
	}
}
module.exports = { addExpense,getExpenses };
