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

app.use(cookieParser());

app.use((req, res, next) => {
	const { token } = req.cookies;

	if (token) {
		const { verified } = jwt.verify(token, process.env.APP_SECRET);
		req.verified = verified;
	}

	next();
});

app.get("/api/verify", async (req, res) => {
	if (req.verified) {
		return res.status(200).json({
			verified: true,
			message: "You are already authorized",
		});
	}

	try {
		const { name, key } = req.query;
		const apiResponse = await axios.get(
			`http://nba-notify-api.herokuapp.com/verify?key=${key}&name=${name}`,
		);
		const data = await apiResponse.data;

		if (data.valid) {
			const token = jwt.sign({ verified: true }, process.env.APP_SECRET);
			res.cookie("token", token, { httpOnly: true });
			res.json({ verified: true });
		} else {
			res.status(401).json({
				verified: false,
				message: "Wrong key name or key.",
			});
		}
	} catch (err) {
		res.status(err.response.status).json(err.response.data);
	}
});

app.get("/", (req, res) => {
	if (req.verified) {
		res.sendFile(path.resolve(__dirname + "/dist", "home.html"));
	} else {
		res.redirect("/verify");
	}
});

app.get("/verify", (req, res) => {
	if (!req.verified) {
		res.sendFile(path.resolve(__dirname + "/dist", "verify.html"));
	} else {
		res.redirect("/");
	}
});

// Serves assets
app.use(express.static(__dirname + "/dist"));

app.listen(port, () => {
	console.log(`Running on ${port}`);
});
