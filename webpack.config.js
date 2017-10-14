const path = require('path')
const webpack = require('webpack')

const config = () => (
	{

		entry: [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://localhost:3000',
			'webpack/hot/only-dev-server',
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

		devServer: {
			historyApiFallback: true,
			hot: true,
			port: 3000,
			proxy: {
				'/api': {
					target: 'http://localhost:8080',
				},
			},
		},

		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
		],
	}
)

module.exports = config
