const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.join(__dirname, 'src', 'app-client.js'),
  output: {
    path: path.join(__dirname, 'src', 'static'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: path.join(__dirname, 'src'),
      loader: ['babel-loader'],
      query: {
        cacheDirectory: 'babel_cache'
      }
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
      "Promise": "promise-polyfill"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}  