var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: './assets/js/main.js',
  output: {
    path: path.resolve(__dirname, 'build/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: ['css-loader?url=false', 'postcss-loader?url=false'],
      //     publicPath: 'build/css/'
      //   })
      // },
      // {
      //   test: /\.scss$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: ['css-loader?url=false', 'postcss-loader?url=false', 'sass-loader?url=false'],
      //     publicPath: 'build/css/'
      //   })
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules)/
        // loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin({
    //   filename: '../css/bundle.css',
    //   ignoreOrder: true
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     postcss: [
    //       autoprefixer({
    //         browsers: ['last 3 versions', '> 1%']
    //       })
    //     ],
    //   }
    // })
  ]
}