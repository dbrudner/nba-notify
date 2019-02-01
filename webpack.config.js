const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: ["./src/index.js", "./src/sw.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			minify: true,
			template: path.resolve(__dirname, "src", "index.html"),
			filename: "./index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "./src/style.css",
		}),
	],
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					// fallback to style-loader in development
					process.env.NODE_ENV !== "production"
						? "style-loader"
						: MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
};
