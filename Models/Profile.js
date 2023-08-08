
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
	image: {
		type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId
    }
});

module.exports = mongoose.model("users", UserSchema);
