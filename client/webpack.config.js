const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { SourceMapDevToolPlugin } = require("webpack");

module.exports = {
	entry: "./src/components/root/index.js",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "index_bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},

			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|jpe?g)$/,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
	plugins: [
		new SourceMapDevToolPlugin({
			filename: "[file].map",
		}),
		new CopyPlugin({
			patterns: [{ from: "public" }],
		}),
		new CompressionPlugin({
			algorithm: "gzip",
			deleteOriginalAssets: true,
		}),
	],
};
