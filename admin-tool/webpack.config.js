var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


const APP_DIR = path.join(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, '..', 'application', 'public');

var config = {
  entry : path.join(APP_DIR, 'app.jsx'),
  output : { path : BUILD_DIR, filename : 'bundle.js' },
  
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        loader : 'babel-loader',
        exclude : /node_modules/,
        query : {
          presets : [ 'es2015', 'react' ]
        }
      },

      {
        test: /\.css$/,
        loader : ExtractTextPlugin.extract(
            'style-loader',
            'css-loader?modules=true'
        )
      }
    ]
  },

  plugins : [
      new ExtractTextPlugin('styles.css')
  ]
  
};

module.exports = config;
