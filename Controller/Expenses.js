const ExpenseSchema = require("../Models/Expenses");
const CsvParser = require("json2csv").Parser;
const addExpense = async (req, res) => {
	try {
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
		res.status(404).json({ msg: "could not get expenses", success: false });
	}
};

const deleteExpense = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await ExpenseSchema.findOneAndDelete({ _id: id });
		res.status(201).json({ msg: "expense deleted", success: true });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "could not delete expense", success: false });
	}
};

const downloadCSV = async (req, res) => {
	try {
		const userExpenses = await ExpenseSchema.find({ userId: req.User._id });
		let ExpensesArr = [];
		userExpenses.forEach((expense) => {
			const { amount, description, category } = expense;
			ExpensesArr.push({ amount, description, category });
		});
		const csvFields = ["Amount", "Description", "Category"];
		const csvParser = new CsvParser({ csvFields });
		const csvData = csvParser.parse(ExpensesArr);
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attatchment:filename=usersExpenses.csv");
		res.status(201).end(csvData);
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, msg: error });
	}
};

module.exports = { addExpense, getExpenses, deleteExpense, downloadCSV };
