const jwt = require("jsonwebtoken");
const UserSchema = require("../Models/Users");
const AuthUser = async (req, res, next) => {
	try {
        const token = req.header("Authorization");
		const { userId } = jwt.verify(token, process.env.JWT_SECRET);
		const currUser = await UserSchema.findById(userId);
		req.User = currUser;
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, msg: "Unauthorized User" });
	}
};

module.exports = AuthUser;
 