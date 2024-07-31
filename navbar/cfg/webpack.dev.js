const webpack = require('webpack');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const getPort = () => {
  // return 8081;
  return process.env.project === 'src' ? 8081 : 8082;
};

const proxyTarget = {
  www: {
    target: 'https://www.zno.com.d',
    ignorePath: false,
    changeOrigin: true,
    secure: false
  },
  gallery: {
    target: 'https://gallery.zno.com.d',
    ignorePath: false,
    changeOrigin: true,
    secure: false
  }
};

const devConfig = {
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist', // 资源文件目录
    // open: true, //自动打开浏览器
    hot: true,
    port: getPort(), // 服务器端口,
    hotOnly: true,
    proxy: {
      // 为了统一代理我们的接口. 我们再接口请求是加上/api，配置代理时再去除即可.
      '/userid': proxyTarget.www,
      '/BigPhotoBookServlet': proxyTarget.www,
      '/web-api': proxyTarget.gallery,
      '/cloudapi': proxyTarget.gallery
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
    new WebpackNotifierPlugin({ alwaysNotify: true })
  ]
};

module.exports = devConfig;
