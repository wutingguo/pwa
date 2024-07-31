const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const { lab: mainLab, submodules = {}, deploy } = require('./.deploy.json');

class Deploy {
  constructor() {
    this.params = this.parseParams();

    this.beforeBuild();
    this.build();
    this.afterBuild();
  }

  success() {
    console.log('BUILD: SUCCESS');
  }

  beforeBuild() {
    this.update();
    this.updateDepsForAll();
  }

  build() {
    const { language = '', platform = 'pc', maxsize, subProject = '' } = this.params;
    const lang = language === 'cn' ? `:${language}` : '';
    process.env.maxsize = maxsize;
    if (subProject) {
      this.exec(`cd software && npm run build${lang} ${subProject}`);
    } else {
      this.exec(`npm run build${lang}:${platform}`);
    }
  }

  afterBuild() {
    this.moveToDeploy();
    this.success();
  }

  exec(cmd, options = {}) {
    execSync(cmd, { stdio: 'inherit' });
  }

  parseParams() {
    const pArr = process.argv.slice(2);
    const ret = {};
    pArr.forEach(item => {
      const arr = item.split('=');
      if (arr.length === 1) {
        ret[arr[0]] = true;
      } else {
        ret[arr[0]] = arr[1];
      }
    });
    return ret;
  }

  checkIsExsit(filepath) {
    return fs.existsSync(filepath);
  }

  checkIsEmpty(filepath) {
    return fs.readdirSync(filepath).length === 0;
  }

  moveToDeploy() {
    const { subProject } = this.params;
    const { deploypath, distpath, subjectdistpath, uselanguage = false } = deploy;
    const { language = 'en' } = this.params;
    const deployPath = path.resolve(__dirname, deploypath);
    const distPath = uselanguage
      ? path.resolve(
          __dirname,
          subProject ? subjectdistpath + '/' + subProject : distpath,
          language
        )
      : path.resolve(__dirname, subProject ? subjectdistpath + '/' + subProject : distpath);
    this.exec(`rm -rf ${deployPath}`);
    this.exec(`mv ${distPath} ${deployPath}`);
  }

  update() {
    const { subProject = '' } = this.params;
    this.exec(
      `git reset --hard && git fetch --all && git checkout ${this.branch} && git pull ${mainLab} ${this.branch}:${this.branch} --force`
    );
    this.updateOrInstallSubmodules();
  }

  updateOrInstallSubmodules() {
    const { language: transLan = 'en', subProject } = this.params;
    Object.keys(submodules).forEach(subKey => {
      const { lab, parentpath = '', language, link, subDep } = submodules[subKey];
      if (subProject && !subDep) {
        return;
      }
      const dirName = (link || subKey).replace(/.*:/, '');
      const subDir = path.resolve(__dirname, parentpath);
      const subPath = path.resolve(__dirname, parentpath, dirName);
      const isNeedInit = lab && (!language || (language && language === transLan));
      if (isNeedInit) {
        const isInited = this.checkIsExsit(subPath) && !this.checkIsEmpty(subPath);
        if (isInited) {
          this.exec(
            `cd ${subPath} && git reset --hard && git fetch --all && git checkout ${this.branch} && git pull ${lab} ${this.branch}:${this.branch} --force`
          );
        } else {
          this.exec(`cd ${subDir} && git clone -b ${this.branch} ${lab} ${dirName}`);
        }
      }
    });
  }

  updateDepsForAll() {
    const { language: transLan = 'en', subProject } = this.params;
    this.updateDep();

    Object.keys(submodules).forEach(subKey => {
      const { lab, parentpath = '', deps, link, language, subDep } = submodules[subKey];
      if (subProject && !subDep) {
        return;
      }
      const dirName = (link || subKey).replace(/.*:/, '');
      const isNeedUpdate = !language || (language && language === transLan);
      if (isNeedUpdate && deps) {
        this.updateDep(`./${parentpath ? `${parentpath}/` : ''}${dirName}`);
      }
    });
  }

  cachePackage(appPath = './') {
    const baseDir = path.join(__dirname, appPath);
    const packageFilePath = path.join(baseDir, 'package.json');
    const cacheFilePath = path.join(baseDir, '.package.cache.json');

    fs.copyFileSync(packageFilePath, cacheFilePath);
  }

  updateDep(appPath = './') {
    const { language = '' } = this.params;
    const baseDir = path.join(__dirname, appPath);
    const isInstalled = this.checkIsInstalledDep(appPath);
    if (!isInstalled || this.collectDepUpates(appPath).length) {
      this.exec(`cd ${baseDir} && npm i`);
      this.cachePackage(appPath);
    }
  }

  collectDepUpates(appPath = './') {
    const baseDir = path.join(__dirname, appPath);
    const packageFilePath = path.join(baseDir, 'package.json');
    const cacheFilePath = path.join(baseDir, '.package.cache.json');
    const requiredPackage = require(packageFilePath);
    const cachedPackage = require(cacheFilePath);
    const requireDependencies = {
      ...requiredPackage.dependencies,
      ...requiredPackage.devDependencies,
    };
    const cachedDependencies = { ...cachedPackage.dependencies, ...cachedPackage.devDependencies };
    const updates = [];

    Object.keys(requireDependencies).forEach(key => {
      const required = requireDependencies[key];
      const cached = cachedDependencies[key];
      const isUpdated = [!cached, cached !== required].some(Boolean);
      if (isUpdated) {
        updates.push({
          dep: key,
          version: required,
        });
      }
    });

    return updates;
  }

  checkIsInstalledDep(appPath = './') {
    const packagePath = path.join(__dirname, appPath, './.package.cache.json');
    return this.checkIsExsit(packagePath);
  }

  installDeps(appPath = './', deps) {
    const cmds = deps.reduce((a, c) => {
      const t = a + ` ${c.dep}${c.version}`;
      return t;
    }, 'npm i');
    const baseDir = path.join(__dirname, appPath);
    this.exec(`cd ${baseDir} && ${cmds}`);
  }

  get branch() {
    const arr = this.params.branch.split(/\//g);
    const name = arr[arr.length - 1];
    return name;
  }
}

new Deploy();
