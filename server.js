if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

console.log(process.env.APP_SECRET);

app.use(cookieParser());
// app.use(express.static(__dirname + "/dist"));

app.get("/verify", async (req, res) => {
	const { key } = req.query;

	const apiResponse = await axios.get(
		`http://nba-notify-api.herokuapp.com/verify?key=${key}`,
	);
	const data = await apiResponse.data;

	if (data.verified) {
		const token = jwt.sign({ verified: true }, process.env.APP_SECRET);
	}

	res.cookie("token", token, { httpOnly: true });
	res.json({ verified: true });
});

app.get("/", (req, res) => {
	const { token } = req.cookies;
	if (token) {
		res.sendFile(path.resolve(__dirname + "/dist", "index.html"));
	} else {
		res.sendFile(path.resolve(__dirname + "/dist", "verify.html"));
	}
});

app.listen(port, () => {
	console.log(`Running on ${port}`);
});
