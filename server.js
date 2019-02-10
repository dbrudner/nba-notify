if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const port = process.env.PORT || 8080;
const app = express();

console.log(process.env.APP_SECRET);

app.use(cookieParser());

app.use((req, res, next) => {
	const { token } = req.cookies;

	if (token) {
		const { _id } = jwt.verify(token, process.env.APP_SECRET);
		req._id = _id;
	}

	next();
});

app.get("/verify", async (req, res) => {
	const { token } = req.cookies;

	if (token) {
		res.status(304).json({
			verified: true,
			message: "You are already authorized"
		});
	}

	const { name, key } = req.query;

	const apiResponse = await axios.get(
		`http://nba-notify-api.herokuapp.com/verify?key=${key}&name=${name}`
	);
	const data = await apiResponse.data;

	if (data.verified) {
		console.log("pass");
		const token = jwt.sign({ verified: true }, process.env.APP_SECRET);
		res.cookie("token", token, { httpOnly: true });
		return res.json({ verified: true });
	}
	console.log("Unauth");
	res.status(401).json(data);
});

app.get("/", (req, res) => {
	const { token } = req.cookies;
	if (token) {
		res.sendFile(path.resolve(__dirname + "/dist", "index.html"));
	} else {
		res.sendFile(path.resolve(__dirname + "/dist", "verify.html"));
	}
});

// Serves assetts
app.use(express.static(__dirname + "/dist"));

app.listen(port, () => {
	console.log(`Running on ${port}`);
});
