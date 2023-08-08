
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
	},
    email: {
        type: String,
    },
	password: {
		type: String,
	},
});

module.exports = mongoose.model("users", UserSchema);
