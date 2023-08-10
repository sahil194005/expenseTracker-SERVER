const Express = require("express");
require("dotenv").config();
const bodyParser = require('body-parser')
const UserRoute = require('./Routes/Users')
const ExpensesRoute = require('./Routes/Expenses');
const connectDB = require("./DB/connect");
const cors = require('cors');
const app = Express(); 
 
app.use(cors());



app.use(bodyParser.json());
app.use('/users', UserRoute)
app.use('/expenses', ExpensesRoute);


const PORT = process.env.PORT||3006
async function serverStart() {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`server listening on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}
serverStart();
