const path = require('path');
const { getHookPath, setHookPath } = require('./resource/tools/hooks');

console.log('                                               ');
console.log('***********************************************');
console.log('***********************************************');
console.log('-----------------------------------------------');
console.log('To install everything run `npm run install-all`');
console.log('-----------------------------------------------');
console.log('***********************************************');
console.log('***********************************************');
console.log('                                               ');

// 指定submodule子项目使用主项目的hooks
const parentHookPath = path.resolve(__dirname, './.git/hooks/');
const childModules = ['./resource/'];
childModules.forEach(rpath => {
  const childpath = path.resolve(__dirname, rpath);
  const hooksPath = path.relative(childpath, parentHookPath);
  setHookPath(childpath, hooksPath);
});
