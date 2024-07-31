/* eslint-env node */
const webpack = require('webpack')
const path = require('path');
const ejs = require('ejs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const pwaHelper = require('../resource/plugins/pwa-helper');
const { BuildErrorPlugin } = require('../resource/lib/node/webpack-plugin');

// 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PLANTFORM = process.env.PLANTFORM;

const buildFileName = PLANTFORM === 'pc' ? 'zno-pwa' : 'zno-pwa-m';

const getOutput = () => {
  return path.resolve(__dirname, `../build/`)
};

const getPluginConfig = env => {
  const pwaSourcePath = path.resolve(__dirname, `../resource/pwa`);
  const outputPath = getOutput();
  const isCN = !!env.cn;
  const devMode = !env.production;

  const pwaStaticPath = path.join(
      pwaSourcePath,
      'static',
      isCN ? 'cunxin' : 'zno'
  );


  return [
    new CleanWebpackPlugin(),
    new BuildErrorPlugin(),
    new webpack.DefinePlugin({
      __LANGUAGE__: JSON.stringify('en'),
      __isCN__: isCN,
      __DEVMODE__: !env.production,
      __DEVELOPMENT__: !env.production,
      __isPWA__: true,
      __ENABLE_API_ERROR_NOTIFICATION_: false,
      __isDZ__: false,
      __SINGLE_SPA__: true,
      __VERSION__: JSON.stringify(env.version)
    }),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../src/app.html'),
      to: `${outputPath}/app.html`
    },
      {
        from: `${pwaStaticPath}/images`,
        to: `${outputPath}/images/pwa`
      },
      {
        from: `${pwaStaticPath}/manifest.json`,
        to: `${outputPath}/manifest/manifest.json`
      }]),
    new OfflinePlugin({
      caches: {
        main: [],
        additional: [],
        optional: ['*.js', '*.wasm']
      },
      excludes: ['*.html', '**/*.map', '**/*.gz'],
      ServiceWorker: {
        output: 'sw.js',
        entry: path.join(__dirname, '../src/pwa/sw.js'),
        minify: !devMode,
        events: true,
        scope: '/software/'
      },
      publicPath: '/config/',
      AppCache: false
    }),
    new pwaHelper({
      template: () => {
        const key = '../app.html';
        return key;
      },
      templateVariables: env.production ? (outputs => {
        const { main } = outputs;
        return {
          config: main
        }
      }) : {
        config: `config-${env.version}.js`,
        navbar: `navbar-${env.version}.js`,
        navbarStore: `store-${env.version}.js`,
        software: `software-${env.version}.js`,
        designer: `designer-${env.version}.js`,
        commonDeps: `common-deps-${env.version}.js`,
        appWASM: `appWASM-${env.version}.js`,
      }
    })
  ]
};

module.exports = (env = {}) => {
  return {
    entry: './src/entry/config.js',
    output: {
      filename: env.production ? `config-[contenthash:8].js` : `config-${env.version}.js`,
      library: 'config',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, `../build/config/`)
    },
    mode: 'production',
    module: {
      rules: [
        { parser: { System: false } },
        {
          test: /\.js?$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          exclude: [path.resolve(__dirname, 'node_modules'), /\.krem.css$/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[path][name]__[local]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins() {
                  return [
                    require('autoprefixer')
                  ];
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: [path.resolve(__dirname, 'node_modules')],
          exclude: [/\.krem.css$/],
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.yml$/,
          use: [
            'json-loader',
            {
              loader: 'yaml-loader',
              options: {
                name: '[name].json?[hash]',
                context: './i18n/!yaml'
              }
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        __dirname,
        'node_modules',
      ],
      alias: {
        '@resource': path.resolve(__dirname, '../resource/'),
        '@src': path.resolve(__dirname, '../src/'),
        '@software': path.resolve(__dirname, '../software/')
      }
    },
    plugins: getPluginConfig(env),
    devtool: 'source-map',
    externals: [
      /^lodash$/,
      /^single-spa$/
    ],
  };
}

