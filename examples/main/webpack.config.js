var path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js'],
		alias: {
			'react-gesture': path.join(__dirname, '..', '..', 'lib')
		}
	},
	module: {
		loaders: [
			{ test: /\.(js)(\?.*)?$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	},
	devtool: 'source-map'
};
