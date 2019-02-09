if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + "/dist"));

app.get("/", (_, res) => {
	res.sendFile(path.resolve(__dirname + "/dist", "index.html"));
});

app.listen(port, () => {
	console.log(`Running on ${port}`);
});
