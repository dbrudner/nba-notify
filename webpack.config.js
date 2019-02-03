const path = require("path");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

const manifestJSON = require("./manifest-json");

module.exports = {
	entry: {
		main: "./src/main.js",
	},
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
		new ServiceWorkerWebpackPlugin({
			entry: path.join(__dirname, "src/firebase-messaging-sw.js"),
			filename: "firebase-messaging-sw.js",
		}),
		new WebpackPwaManifest(manifestJSON),
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
