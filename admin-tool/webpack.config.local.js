var webpack = require('webpack');
var path = require('path');

const APP_DIR = path.join(__dirname, 'app');
const BUILD_DIR = path.join(__dirname, 'build');

var config = {
  entry : path.join(APP_DIR, 'app.jsx'),
  output : { path : BUILD_DIR, filename : 'bundle.js' },
  
  module : {
    loaders : [
      {
        test : /.jsx?$/,
        loader : 'babel-loader',
        exclude : /node_modules/,
        query : {
          presets : [ 'es2015', 'react' ]
        }
      }
    ]
  }
  
};

module.exports = config;