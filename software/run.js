const args = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const path = require('path');
const fs = require('fs-extra');
const clean = require('../resource/lib/node/clean');
const startProxy = require('../resource/tools/whistle');
const { prompt } = require('enquirer');
const { env = {} } = args;
const list = args._;
const isDashboard = list.length && list[0] === 'dashboard-mobile';

// 不需要单独build的项目列表.
const excludedList = ['gallery', 'slide-show', 'designer', 'workspace', 'selection', 'website'];
const useCDNProductWhiteList = ['gallery-client', 'gallery-client-mobile', 'slide-show-client', 'slide-show-client-mobile'];
const getProjectsList = () => {
  return fs
    .readdirSync(path.resolve(__dirname, './apps'))
    .filter(v => excludedList.indexOf(v) === -1);
};

const getProject = () => {
  const list = args._;
  let project = '';

  if (list.length) {
    project = list[0];

    if (project === 'src') {
      return project;
    }

    const projects = getProjectsList();

    // 列表中找不到，说明输入错误.
    if (projects.indexOf(project) === -1) {
      project = '';
    }
  }

  return project;
};

/**
 * 检查当前是否要build的模式是pwa.
 */
const isBuildPwa = project => {
  // const opts = args._;
  // if (opts && opts.length) {
  //   return opts[0] === 'pwa';
  // }

  return project === 'src';
};

const getCmd = (project, useCDN) => {
  const { production, cn } = env;


  const isClientProject = /-client/.test(project) || project === 'dashboard-mobile';
  const isMobileProject = /-client-mobile/.test(project) || project === 'dashboard-mobile';
  const isNotClientMobileProject = project === 'dashboard-mobile' ? 'true' : ''; //判断dashboard-mobile项目
  // pwa模式.
  process.env.pwa = isBuildPwa(project);

  // 当前的项目名称
  process.env.project = project;

  // 客户端应用.
  process.env.isClientProject = isClientProject;
  process.env.isMobileProject = isMobileProject;
  process.env.isNotClientMobileProject = isNotClientMobileProject;

  // debug: "webpack-dev-server --env.cn --config ./cfg/webpack.base.js",
  // prod: "webpack --env.production --env.cn --config ./cfg/webpack.base.js"
  const webpack = production ? 'webpack --env.production' : 'webpack-dev-server';
  const langs = cn ? '--env.cn' : '';
  const projectEnv = `--env.project=${project}`;
  const isClientProjectEnv = isClientProject ? `--env.isClientProject` : '';
  const isMobileProjectEnv = isMobileProject ? `--env.isMobileProject` : '';

  if (!cn && useCDNProductWhiteList.includes(project) && production) {
    return `${webpack} ${langs} ${projectEnv} ${isClientProjectEnv} ${isMobileProjectEnv} --config ./cfg/webpack.base.cdn.js `;
  }
  return `${webpack} ${langs} ${projectEnv} ${isClientProjectEnv} ${isMobileProjectEnv} --config ./cfg/webpack.base.js `;
};

function getDefaultCfgPath() {
  return path.resolve(process.cwd(), '../whistle.cfg.js');
}

const beforeBuild = async project => {
  const { production } = env;
  const keepFolders = [];
  await clean(`./dist/${project}`, keepFolders);

  if (!production) {
    const whistleConfigPath = getDefaultCfgPath();
    await startProxy(whistleConfigPath);
  }
};

const afterBuild = async project => {};

const run = async () => {
  const project = getProject();

  const execCmd = async project => {
    const cmd = getCmd(project);
    console.log('执行的环境是', env);
    console.log('执行的命令是', cmd);

    await beforeBuild(project);
    // 执行命令.
    shell.exec(cmd);
    console.log('执行完成');
    await afterBuild(project);
  };

  if (project) {
    execCmd(project);
  } else {
    const projects = getProjectsList();
    console.log('projects', projects);
    projects.unshift('src');
    prompt({
      type: 'autocomplete',
      name: 'PROJECT',
      message: 'Which project?',
      limit: 40,
      choices: projects,
    }).then(response => {
      execCmd(response.PROJECT);
    });
  }
};

run();

// npm run build pwa
// npm run debug pwa
