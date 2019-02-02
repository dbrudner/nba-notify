const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const entry = glob.sync("./src/*.js").reduce((acc, file) => {
	let name = file.split("/")[2];
	name = name.substr(0, name.length - 3);
	return { ...acc, [name]: file };
}, {});

module.exports = {
	entry,
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		publicPath: "./",
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
