const UserSchema = require("../Models/Users");
const ProfileSchema = require("../Models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailValidator = require("deep-email-validator");

async function isEmailValid(email) {
	return emailValidator.validate(email);
}

const SignUp = async (req, res) => {
	try {
		const { email, password } = req.body;
		const { valid, reason, validators } = await isEmailValid(email);
		if (valid) {
			let existingUser = await UserSchema.findOne({
				email: email,
			});
			if (existingUser)
				res.status(403).json({
					msg: "email already exists",
					success: false,
				});
			else {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);

				const response = await UserSchema.create({
					...req.body,
					password: hashedPassword,
				});

				res.status(201).json({
					msg: "successfully Signed Up",
					success: true,
				});
			}
		} else {
			res.status(403).json({
				msg: "Please provide valid email address",
				success: false,
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			msg: "Something went wrong",
			success: false,
			error: error,
		});
	}
};

const generateToken = (id, email) => {
	let token = jwt.sign({ userId: id, userEmail: email }, process.env.JWT_SECRET);

	return token;
};

const Login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await UserSchema.findOne({
			email: email,
		});

		if (!existingUser)
			res.status(401).json({
				msg: "No account with this email",
				success: false,
			});
		else {
			let passwordMatch = await bcrypt.compare(password, existingUser.password);
			if (!passwordMatch) res.status(401).json({ msg: "Wrong password", success: false });
			else
				res.status(201).json({
					msg: "successfully logged in",
					success: true,
					token: generateToken(existingUser._id, existingUser.email),
					name: existingUser.name,
				});
		}
	} catch (error) {
		console.log(error);
		res.staus(401).json({
			msg: "Not Authorized",
			error: error,
			success: false,
		});
	}
};

// {
// 	_id: new ObjectId("64d280bde0ed86ab110f81d0"),
// 	email: 'sahilkumar2275@gmail.com',
// 	password: '$2b$10$kjdS5PIV2cw.XOSdSDctO.6ka62qI9/HLgGGNgnAhle49kle73w1O',
// 	__v: 0
//   }
//   {
// 	name: 'Sahil Kumar',
// 	image: 'C:\\fakepath\\Screenshot from 2023-08-08 22-39-58.png'
//   }
const profileComplete = async (req, res) => {
	try {
		const isProfile = await ProfileSchema.findOne({ userId: req.User._id });
		if (!isProfile) {
			const response = await ProfileSchema.create({ ...req.body, userId: req.User._id });
		} else {
			const response = await ProfileSchema.findOneAndUpdate({ user_id: req.User._id }, req.body);
		}
		res.status(201).json({ msg: "profile completed", success: true });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "something went wrong", success: false });
	}
};

const getProfile = async (req, res) => {
	try {
		let response = await ProfileSchema.findOne({ userId: req.User._id });
		res.status(201).json({ msg: "profile found", success: true, data: response });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "no Profile", success: false });
	}
};

module.exports = { SignUp, Login, profileComplete, getProfile };
