/* eslint-env node */
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = (...opt) => {
  const config = require('./webpack.common-deps.js')(...opt);
  config.plugins.push(new webpack.NamedModulesPlugin());
  config.plugins.push(new WriteFilePlugin());
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devServer = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }

  config.mode = 'development';
  return config;
};

