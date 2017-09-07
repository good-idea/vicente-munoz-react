const path = require('path');

const entries = {
	bundle: './src/js/bundle.js',
	rebuildCache: './src/js/rebuildCache.js',
};

const config = () => (
	{
		entry: entries,
		output: {
			path: path.resolve(__dirname, 'assets/js'),
			filename: '[name].js',
			sourceMapFilename: '[name].js.map',
		},
		devtool: 'cheap-module-source-map',
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
			],
		},
	}
);

module.exports = config;
