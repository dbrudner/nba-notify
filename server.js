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
app.use(express.static(__dirname + "/dist"));

app.get("/verify", async (req, res) => {
	const { key } = req.query;

	const res = await axios.get("apiUrl");
	const data = await res.data;

	if (data.verified) {
		const token = jwt.sign({ verified: true }, process.env.APP_SECRET);
	}

	res.cookie("token", token, { httpOnly: true });
	res.json({ verified: true });
});

app.get("/", (_, res) => {
	res.sendFile(path.resolve(__dirname + "/dist", "index.html"));
});

app.listen(port, () => {
	console.log(`Running on ${port}`);
});
