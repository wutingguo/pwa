const args = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const path = require('path');

const clean = require('./resource/lib/node/clean');
const { getVersion, clearVersion } = require('./version');
const startProxy = require('./resource/tools/whistle');

const fs = require('fs-extra');
const { prompt } = require('enquirer');
const { env = {} } = args;
const { project, subProject } = env;
let _CURRENT_VERSION_ = '';
const { PLANTFORM } = process.env;

const independentProjects = ['designer'];
// 不需要单独build的项目列表.
const excludedList = ['build', 'cfg', 'node_modules', 'src'];
const rootProjects = ['config', 'common-deps'];
const saasPortalProjects = ['saas-portal', 'saas-portal-zno'];
const isSaasPortal = saasPortalProjects.includes(project);
const isSaasPortalZno = saasPortalProjects[1] === project;
const znoPortalProjects = {
  pc: 'znoplus',
  wap: 'znoplus-m',
};

const getProjectsList = () => {
  return fs
    .readdirSync(path.resolve(__dirname))
    .filter(v => excludedList.indexOf(v) === -1 || !v.startsWith('.'))
    .concat(rootProjects)
    .concat(['clearVersion'])
    .concat(['buildDone']);
};

const isRootProject = project => {
  return rootProjects.indexOf(project) !== -1;
};

const getProject = () => {
  let { project } = env;

  const projects = getProjectsList();

  // 列表中找不到，说明输入错误.
  if (projects.indexOf(project) === -1) {
    project = '';
  }

  return project;
};

const getCmd = (project, isChildMode = false) => {
  let { production, cn, port } = env;

  const maxsize = process.env.maxsize;
  if (isChildMode) {
    port += 100;
  }

  // "start:config": "webpack-dev-server --config ./cfg/webpack.config.dev.js --port 8233",
  // "build:config": "webpack --env.production --config ./cfg/webpack.config.js",

  // "start:navbar": "cd ./navbar/ && webpack-dev-server --config ./cfg/webpack.base.spa.js --port 8235",
  // "build:navbar": "cd ./navbar/ && webpack --env.production --config ./cfg/webpack.base.spa.js",
  const webpackExe =
    maxsize && maxsize !== 'undefined'
      ? `node --max-old-space-size=${maxsize} node_modules/webpack/bin/webpack.js`
      : 'webpack';
  const webpack = production
    ? `${webpackExe} --env.production --env.version=${_CURRENT_VERSION_}`
    : `webpack-dev-server --env.version=${_CURRENT_VERSION_}`;

  const langs = cn ? '--env.cn=true' : '';
  const isRoot = isRootProject(project);
  const isSaasPortal = saasPortalProjects.includes(project);

  // config, deps
  if (isRoot) {
    const rootWebpackConfigPath = `./cfg/webpack.${production ? project : `${project}.dev`}.js`;

    const cmd = `${webpack} ${langs} --config ${rootWebpackConfigPath}`;
    return production ? cmd : `${cmd} --port ${port}`;
  }

  // software 下的独立app
  if (subProject) {
    const devCmd = `cd ./software && npm run debug${cn ? 'cn' : ''} ${subProject}`;
    const productionCmd = `cd ./software && npm run build${cn ? 'cn' : ''} ${subProject}`;
    return production ? productionCmd : devCmd;
  }

  // saas-portal
  if (isSaasPortal) {
    const devCmd = 'npm run debugSaas';
    const subProject = isSaasPortalZno ? znoPortalProjects[PLANTFORM] : PLANTFORM;

    const developmentCmd = `cd ./${project}/${subProject}/ && ${devCmd}`;
    const productionCmd = `cd ./${project}/${subProject}/ && npm run buildSaas`;

    return production ? productionCmd : developmentCmd;
  }

  const cmd = isChildMode
    ? `cd ./${project}/ && ${webpack} ${langs} --env.child --config ./cfg/webpack.base.js`
    : `cd ./${project}/ && ${webpack} ${langs} --config ./cfg/webpack.base.spa.js`;

  return production ? cmd : `${cmd} --port ${port}`;
};

const beforeBuild = async project => {
  const { production } = env;
  process.env.singleSpa = true;

  _CURRENT_VERSION_ = getVersion();
  if (!isSaasPortal) {
    fs.emptyDirSync(path.resolve(__dirname, `build/${project}`));
  }

  fs.emptyDirSync(path.resolve(__dirname, `build/${project}`));

  if (!production) {
    await startProxy();
  }
};

const afterBuild = async project => {
  let { production } = env;
  const portalProject = isSaasPortalZno ? znoPortalProjects[PLANTFORM] : PLANTFORM;
  const distDir = path.join(__dirname, `${project}/${portalProject}/public`);
  const buildDir = path.join(__dirname, `build/`);
  const isDistDirExist = fs.pathExistsSync(distDir);
  const isBuildDirExist = fs.pathExistsSync(buildDir);
  if (isSaasPortal && isDistDirExist && isBuildDirExist && production) {
    fs.copySync(distDir, buildDir);
  }
  if (subProject) {
    fs.copySync(path.join(__dirname, `software/dist/${subProject}`), buildDir);
  }
};

const run = async () => {
  let { production } = env;
  const project = getProject();

  if (project === 'clearVersion') {
    clearVersion();
    return;
  }

  if (project === 'buildDone') {
    return console.log('\x1b[32mBUILD DONE\x1b[39m');
  }

  const execCmd = async project => {
    await beforeBuild(project);

    const cmd = getCmd(project);
    console.log('执行的环境是', env);
    console.log('执行的命令是', cmd);

    // 执行命令. 同步执行
    if (shell.exec(cmd).stdout.indexOf('webpack_build_error') !== -1) {
      console.log('webpack 打包出现错误!');
      shell.exit(1);
    }

    await afterBuild(project);

    if (independentProjects.includes(project)) {
      process.env.isChildMode = true;
      const childCmd = getCmd(project, true);

      shell.exec(childCmd, (code, stdout, stderr) => {
        const errors = [];
        const reg = /(error\s?in.*?\n.*?\n)/gi;
        while (reg.test(stdout)) {
          errors.push(RegExp.$1);
        }
        if (errors.length) {
          console.log('\x1b[31m');
          console.log('\r\nFatal Error: \r\n');
          console.log(errors.join('\r\n'));
          console.log('\x1b[39m');
          if (production) {
            process.exit(-1);
          }
        }
      });
    }
  };

  if (project || subProject) {
    execCmd(project);
  }
};

run();
