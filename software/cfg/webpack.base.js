const path = require('path'); // 注意path.join和path.resolve的区别以及规则
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs-extra');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { BuildErrorPlugin } = require('../../resource/lib/node/webpack-plugin');

// 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./webpack.dev');
const proConfig = require('./webpack.pro');

const { project } = args.env || {};
const isDashboard = project === 'dashboard-mobile';

const getEntry = project => {
  const entry =
    project === 'src' ? `./software/src/index.js` : `./software/apps/${project}/index.js`;

  return ['@babel/polyfill', entry];
};

const getOutput = (devMode, project, isClientProject, isCN) => {
  const baseDir = devMode ? '../dist/assets' : '../dist';
  return path.resolve(__dirname, `${baseDir}/${project}`);
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

  const copyWebpackPluginCfg = () => {
    const cfg = [
      { from: `${pwaStaticPath}/favicon.ico` },
      { from: `${pwaStaticPath}/store.ico` },
      {
        from: `${pwaStaticPath}/images`,
        to: `${outputPath}/images`,
      },
    ];
    //打包项目专属的静态文件夹
    const clientStatic = path.join(pwaStaticPath, project);
    if (fs.existsSync(clientStatic)) {
      cfg.push({
        from: clientStatic,
        to: outputPath,
      });
    }

    return cfg;
  };

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
      __SINGLE_SPA__: false,
    }),
    new htmlWebpackPlugin({
      title: 'webpack',
      filename: isDashboard ? 'app.html' : 'index.html',
      template: path.join(pwaSourcePath, 'bootstrap', templateName),
      baseDir: pwaStaticPath,
    }),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new CopyWebpackPlugin(copyWebpackPluginCfg()),
  ];

  return plugins;
};

const getBaseConfig = ({ devMode, isCN, project, isClientProject, isMobileProject }) => {
  const outputPath = getOutput(devMode, project, isClientProject, isCN);
  const slugProjects = ['slide-show-client', 'slide-show-client-mobile'];
  const publicPath = !devMode && slugProjects.includes(project) ? '/slideshow/': ''

  return {
    context: path.join(__dirname, '../../'),
    entry: {
      // 'react-hot-loader/patch' 在ie上无法打开, 不管是dev还是pro模式..
      main: getEntry(project),
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
        src: path.resolve(__dirname, '../src/'),
        appsCommon: path.resolve(__dirname, '../../resource/websiteCommon'),
      }, 
    },
    output: {
      path: outputPath,
      publicPath,
      filename: devMode ? '[name].js' : '[name]_[hash].js',
    },
    module: {
      rules: [
        // {
        //   test: /\.module\.s?css$/,
        //   use: [
        //     {
        //       loader: MiniCssExtractPlugin.loader,
        //       options: {
        //         hmr: devMode
        //       }
        //     },
        //     {
        //       // 开启css modules
        //       loader: 'css-loader',
        //       options: {
        //         modules: true
        //       }
        //     },
        //     'css-loader',
        //     'postcss-loader',
        //     'sass-loader'
        //   ]
        // },
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
            // 'postcss-loader',
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
      }),
      proConfig
    );
  }
  return merge(
    getBaseConfig({
      devMode: true,
      isCN: !!cn,
      project,
      isClientProject,
      isMobileProject,
    }),
    devConfig
  );
};
