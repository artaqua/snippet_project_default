var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: './assets/js/main.js',
  output: {
    path: path.resolve(__dirname, 'build/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/
        // loader: 'babel-loader'
      }
    ]
  }
}