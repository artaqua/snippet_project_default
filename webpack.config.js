var webpack = require("webpack");
var path = require("path");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'bundle': './src/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'build/assets/js/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/
        // loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // Убрать если не нужна минификация js
    // new UglifyJSPlugin()
  ]
}