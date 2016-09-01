var path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			'react-gesture': path.join(__dirname, '..', '..', 'src')
		}
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, loader: 'react-hot!babel', exclude: /node_modules/ }
		]
	}
};
