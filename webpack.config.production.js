const path = require('path')

const config = () => (
	{

		entry: [
			'./src/js/bundle.js',
		],

		output: {
			path: path.resolve(__dirname, 'assets/js'),
			publicPath: '/assets/js/',
			filename: 'bundle.js',
			sourceMapFilename: 'bundle.js.map',
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
)

module.exports = config
