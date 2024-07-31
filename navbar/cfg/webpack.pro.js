// uglifyjs-webpack-plugin use uglify-js to compress code and uglify-js
// doesn't support ES6, use terser-webpack-plugin.
const TerserPlugin = require('terser-webpack-plugin');
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const proConfig = {
  // devtool: "cheap-module-source-map",
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [     
      new TerserPlugin({
        cache: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ],

    // 启动摇树功能.
    usedExports: true,

    // 代码拆分.
    splitChunks: {
      chunks: 'all',
      // 50kb
      minSize: 102400,

      // 150kb
      maxSize: 153600,

      name: true,

      // 以_连接.
      automaticNameDelimiter: '_',

      cacheGroups: {
        // Create a vendors chunk, which includes all code
        // from node_modules in the whole application.
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};

module.exports = proConfig;
