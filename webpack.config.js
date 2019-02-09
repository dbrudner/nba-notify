const path = require("path");
const glob = require("glob");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

const manifestJSON = require("./manifest-json");

const html = glob.sync("src/views/*.html").map(file => {
	const filename = file.split("/")[2];
	return new HtmlWebpackPlugin({
		template: path.resolve(__dirname, "src/views", filename),
		filename: `./${filename}`,
		chunks: [filename.substring(0, filename.length - 5)],
	});
});

const plugins = [
	...html,
	new ServiceWorkerWebpackPlugin({
		entry: path.join(__dirname, "src/firebase-messaging-sw.js"),
		filename: "firebase-messaging-sw.js",
	}),
	new WebpackPwaManifest(manifestJSON),
	new MiniCssExtractPlugin({
		filename: "./src/style/[name].css",
	}),
];

const entry = glob.sync("src/js/*.js").reduce((obj, file) => {
	const filename = file.split("/")[2];
	return {
		...obj,
		[filename.substring(0, filename.length - 3)]: `./src/js/${filename}`,
	};
}, {});

module.exports = {
	entry,
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
	},
	plugins,
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
