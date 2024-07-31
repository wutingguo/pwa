const path = require('path'); // 注意path.join和path.resolve的区别以及规则
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BuildErrorPlugin } = require('../../resource/lib/node/webpack-plugin');
const pwaHelper = require('../../resource/plugins/pwa-helper');

// 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./webpack.dev');

const PLANTFORM = process.env.PLANTFORM;

const buildFileName = PLANTFORM === 'pc' ? 'zno-pwa' : 'zno-pwa-m';

const getEntry = project => {
  const entry =
    project === 'src' ? `./software/src/index.js` : `./apps/software/${project}/index.js`;

  return ['@babel/polyfill', entry];
};

const getOutput = () => {
  return path.resolve(__dirname, `../../build/software`);
};

function resolve(dir) {
  const s = path.join(__dirname, '..', dir);
  console.log(s);
  return s;
}

const getPluginConfig = (devMode, isCN, project, isClientProject, isMobileProject) => {
  const isNotClientMobileProject = process.env.isNotClientMobileProject;
  const pwaSourcePath = path.resolve(
    __dirname,
    `../../resource/${
      isClientProject ? (isNotClientMobileProject ? 'pwa-mobile' : 'pwa-client') : 'pwa'
    }`
  );
  const outputPath = getOutput(devMode, project);
  const isSrcProject = project === 'src';

  // 获取html模板文件.
  let templateName = isSrcProject ? 'template-pwa.html' : 'template.html';
  if (isClientProject) {
    templateName = isMobileProject ? 'template-mobile.html' : 'template.html';
  }

  const isPwaMode = process.env.pwa;
  const pwaStaticPath = path.join(pwaSourcePath, 'static', isCN ? 'cunxin' : 'zno');

  const lang = isCN ? 'cn' : 'en';
  const plugins = [
    new BuildErrorPlugin(),
    // new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: devMode,
      __isCN__: isCN,
      __isPWA__: isPwaMode,
      __ENABLE_API_ERROR_NOTIFICATION_: true,
      __LANGUAGE__: JSON.stringify(lang),
      __isDZ__: false,
      __SINGLE_SPA__: true,
    }),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new CopyWebpackPlugin([
      { from: `${pwaStaticPath}/favicon.ico` },
      { from: `${pwaStaticPath}/store.ico` },
    ]),
  ];

  if (!devMode) {
    plugins.push(
      new pwaHelper({
        template: path.resolve(__dirname, `../../build/app.html`),
        templateVariables: outputs => {
          const { software } = outputs;
          return {
            software,
          };
        },
      })
    );
  }

  return plugins;
};

const getBaseConfig = ({ devMode, isCN, project, isClientProject, isMobileProject, version }) => {
  const outputPath = getOutput();
  console.log('outputPath', outputPath);

  return {
    devtool: 'source-map',
    mode: 'production',
    context: path.join(__dirname, '../../'),
    entry: {
      // 'react-hot-loader/patch' 在ie上无法打开, 不管是dev还是pro模式..
      // main: getEntry(project)
      polyfill: '@babel/polyfill',
      software: './software/src/single-spa/entry.js',
      // store: './src/single-spa/store.js'
    },
    resolve: {
      extensions: ['.js'],
      modules: [resolve('node_modules'), resolve('../node_modules')],
      alias: {
        '@src': path.resolve(__dirname, '../src/'),
        '@resource': path.resolve(__dirname, '../../resource/'),
        '@apps': path.resolve(__dirname, '../apps/'),
        '@gallery': path.resolve(__dirname, '../apps/gallery'),
        '@common': path.resolve(__dirname, '../common/'),
        appsCommon: path.resolve(__dirname, '../../resource/websiteCommon'),
        src: path.resolve(__dirname, '../src'),
      },
    },
    resolveLoader: {
      extensions: ['.js'],
      modules: [resolve('node_modules'), resolve('../node_modules')],
    },
    output: {
      filename: devMode ? `[name]-${version}.js` : '[name]-[contenthash:8].js',
      library: 'software',
      libraryTarget: 'umd',
      path: outputPath,
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
                hmr: devMode,
              },
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: resolve('postcss.config.js'),
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
              limit: 12288,
            },
          },
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              limit: 10240,
            },
          },
        },
        {
          test: /\.yml$/,
          use: [
            'json-loader',
            {
              loader: 'yaml-loader',
              options: {
                name: '[name].json?[hash]',
                context: './i18n/!yaml',
              },
            },
          ],
        },
        {
          test: /\.xml$/,
          use: 'raw-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              configFile: '../.babelrc',
            },
          },
        },
        {
          test: /\.worker\.js$/,
          exclude: /node_modules/,
          use: { loader: 'worker-loader' },
        },

        {
          test: /\.sharedWorker\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'shared-worker-loader',
              options: {
                inline: false,
              },
            },
          ],
        },
      ],
    },
    plugins: getPluginConfig(devMode, isCN, project, isClientProject, isMobileProject),
    externals: [
      /^@portal\/*/,
      /^lodash$/,
      /^single-spa$/,
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
  const { production, cn, project, isClientProject, isMobileProject } = env;

  if (production) {
    return merge(
      getBaseConfig({
        devMode: false,
        isCN: !!cn,
        project,
        isClientProject,
        isMobileProject,
        ...env,
      })
    );
  }
  return merge(
    getBaseConfig({
      devMode: true,
      isCN: !!cn,
      project,
      isClientProject,
      isMobileProject,
      ...env,
    }),
    devConfig
  );
};
