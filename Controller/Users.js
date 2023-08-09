const UserSchema = require("../Models/Users");
const ProfileSchema = require("../Models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailValidator = require("deep-email-validator");
const nodemailer = require("nodemailer");

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

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const isUser = await UserSchema.findOne({ email: email });

		if (!isUser) {
			res.status(404).json({ msg: "no user with this email", success: false });
		} else {
			const newid = isUser._id;
			const transporter = await nodemailer.createTransport({
				host: "smtp-mail.outlook.com",
				port: 587,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASSWORD,
				},
				tls: {
					ciphers: "SSLv3",
				},
			});

			const mailOptions = {
				from: "lyfesahil@outlook.com",
				to: email,
				subject: "Password Reset",
				text: "Dont worry we will help you get your password back.",
				html: `<a href="http://localhost:3000/updatePassword/${newid}">click here to reset your password</a>`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					res.status(500).json({ msg: `cannot send email `, success: false });
				} else {
					res.status(200).json({ msg: `email sent successfully`, success: true });
				}
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "couldnt Send mail", success: false });
	}
};

const updatePassword = async (req, res) => {
	try {
		const { email,password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = await UserSchema.findOneAndUpdate({ email: email }, { password: hashedPassword });
		
		res.status(201).json({ msg: "password updated...", success: true });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "couldnt update password", success: false });
	}
};

module.exports = { SignUp, Login, profileComplete, getProfile, forgotPassword, updatePassword };
