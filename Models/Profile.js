
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const ProfileSchema = new mongoose.Schema({
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

module.exports = mongoose.model("profile", ProfileSchema);
