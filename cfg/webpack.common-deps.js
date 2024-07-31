const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BuildErrorPlugin } = require('../resource/lib/node/webpack-plugin');
const pwaHelper = require('../resource/plugins/pwa-helper');
const webpack = require('webpack');

const PLANTFORM = process.env.PLANTFORM;

const buildFileName = PLANTFORM === 'pc' ? 'zno-pwa' : 'zno-pwa-m';

module.exports = (env = {}) => {
  const outputPath = path.resolve(__dirname, `../build/common-deps`);
  const resourcePath = path.resolve(__dirname, '../resource');
  console.log('env', env);

  let copyPluginParams = [
    {
      from: `${resourcePath}/lib/perfectlyClear/wasm/appWASM.js`,
      to: `${outputPath}/appWASM-${env.version}.js`,

      // 将模板中的字符串动态的替换为真实的值.
      transform: content => {
        const s = content.toString();

        return s.replace('appWASM.wasm', `appWASM-${env.version}.wasm`);
      }
    },
    {
      from: `${resourcePath}/lib/perfectlyClear/wasm/appWASM.wasm`,
      to: `${outputPath}/appWASM-${env.version}.wasm`
    }
  ];

  if (env.production) {
    copyPluginParams = [
      {
        from: `${resourcePath}/lib/perfectlyClear/wasm/appWASM.js`,
        to: `${outputPath}/appWASM-[hash:8].js`
      },
      {
        from: `${resourcePath}/lib/perfectlyClear/wasm/appWASM.wasm`,
        to: `${outputPath}/appWASM-[hash:8].wasm`
      }
    ];
  }

  const plugins = [
    new BuildErrorPlugin(),
    new webpack.DefinePlugin({
      __DEVMODE__: !env.production,
      __DEVELOPMENT__: !env.production,
      __VERSION__: JSON.stringify(env.version)
    }),
    CopyWebpackPlugin(copyPluginParams)
  ];

  if (env.production) {
    plugins.push(
      new pwaHelper({
        template: path.resolve(__dirname, `../build/app.html`),
        templateVariables: (outputs, assets) => {
          const { main } = outputs;
          const ret = {
            commonDeps: main
          };

          Object.keys(assets).find(key => {
            if (/appWASM-[^.]+\.js/.test(key)) {
              ret.appWASM = key;
              return true;
            }
            return false;
          });

          return ret;
        },
        customHandler: compilation => {
          let appWASMJSFile = '';
          let appWASMJSContent = '';
          let appWASMFile = '';
          Object.keys(compilation.assets).forEach(key => {
            if (/appWASM-[^.]+\.js/.test(key)) {
              appWASMJSFile = key;
              appWASMJSContent = compilation.assets[key].source().toString('utf-8');
            } else if (/appWASM-[^.]+\.wasm/.test(key)) {
              appWASMFile = key;
            }
          });
          if (appWASMJSFile && appWASMJSContent && appWASMFile) {
            appWASMJSContent = appWASMJSContent.replace('appWASM.wasm', appWASMFile);
            compilation.assets[appWASMJSFile] = {
              source() {
                return appWASMJSContent;
              },
              size() {
                return appWASMJSContent.length;
              }
            };
          }
        }
      })
    );
  }

  return {
    entry: './src/entry/common-deps.js',
    output: {
      filename: env.production ? `common-deps-[contenthash:8].js` : `common-deps-${env.version}.js`,
      path: outputPath,
      chunkFilename: '[name].js'
    },
    mode: 'production',
    node: {
      fs: 'empty'
    },
    resolve: {
      modules: [__dirname, 'node_modules']
    },
    devtool: 'sourcemap',
    plugins,
    module: {
      rules: [
        { parser: { System: false } },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  };
};
