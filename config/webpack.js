var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/client'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
        loader: 'babel-loader',
        test: /src\/.+.js$/,
        exclude: [ path.resolve(__dirname, 'node_modules') ]
    },
    {
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        test: /\.css$/
    }]
  }

};
