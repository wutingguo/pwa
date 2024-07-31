const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pwaHelper = require('../../resource/plugins/pwa-helper');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { BuildErrorPlugin } = require('../../resource/lib/node/webpack-plugin');

// 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./webpack.dev');
const proConfig = require('./webpack.pro');
const PLANTFORM = process.env.PLANTFORM;

const buildFileName = PLANTFORM === 'pc' ? 'zno-pwa' : 'zno-pwa-m';
function resolve(dir) {
  const s = path.join(__dirname, '..', dir);
  console.log(s);
  return s;
}

const getBaseConfig = ({ devMode, version, cn }) => {
  const plugins = [
    new BuildErrorPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: devMode,
      __LANGUAGE__: JSON.stringify('en'),
      __isCN__: cn,
      __DEVMODE__: devMode,
      __isPWA__: true,
      __ENABLE_API_ERROR_NOTIFICATION_: false,
      __isDZ__: false,
      __SINGLE_SPA__: true
    }),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css'
    })
  ];

  if (!devMode) {
    plugins.push(
      new pwaHelper({
        template: path.resolve(__dirname, `../../build/app.html`),
        templateVariables: (outputs) => {
          const { navbar, store } = outputs;
          return {
            navbar,
            navbarStore: store
          }
        }
      })
    );
  }

  return {
    mode: 'production',
    context: path.join(__dirname, '../../'),
    entry: {
      navbar: './navbar/src/index.js',
      store: './navbar/src/store.js'
    },
    output: {
      filename: devMode ? `[name]-${version}.js` : '[name]-[contenthash:8].js',
      library: 'navbar',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, `../../build/navbar`),
    },
    module: {
      rules: [
        { parser: { System: false } },
        {
          test: /\.s?css$/,
          // exclude: /\.module\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode
              }
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: resolve('postcss.config.js')
                }
              },
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
              limit: 12288
            }
          }
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              limit: 10240
            }
          }
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
        },
        {
          test: /\.xml$/,
          use: 'raw-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'entry',
                    corejs: 2
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-syntax-import-meta',
                '@babel/plugin-proposal-json-strings',
                '@babel/plugin-proposal-function-sent',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-throw-expressions',
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-logical-assignment-operators',
                [
                  '@babel/plugin-proposal-pipeline-operator',
                  {
                    proposal: 'minimal'
                  }
                ],
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-proposal-do-expressions',
                '@babel/plugin-proposal-function-bind',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-syntax-dynamic-import',
                ['react-hot-loader/babel'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                [
                  '@babel/plugin-transform-runtime',
                  {
                    absoluteRuntime: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        resolve('node_modules'),
        resolve('../node_modules')
      ],
      alias: {
        // 根目录下的resource.
        '@resource': path.resolve(__dirname, '../../resource/'),
        '@src': path.resolve(__dirname, '../src/')
      }
    },
    resolveLoader: {
      extensions: ['.js'],
      modules: [resolve('node_modules'), resolve('../node_modules')]
    },
    plugins,
    externals: [
      /^@portal\/*/,
      /^lodash$/,
      /^single-spa$/,
      /^rxjs\/?.*$/,
      /^react$/,
      /^redux$/,
      /^react-redux$/,
      /^reselect$/,
      /^immutable$/,
      /^react\/lib.*/,
      /^react-dom$/,
      /.*react-dom.*/,
    ],

  };
};

module.exports = (env = {}) => {
  const { production } = env;

  if (production) {
    return merge(
      getBaseConfig({
        devMode: false,
        ...env
      })
    );
  } else {
    return merge(
      getBaseConfig({
        devMode: true,
        ...env
      }),
      devConfig
    );
  }
};
