
const fs = require('fs-extra');
const path = require('path');
const versionPath = path.resolve(__dirname, '.v');

const generatorVersion = () => {
  return Date.now();
}

const getVersion = () => {
  let version = fs.readJsonSync(versionPath, { throws: false })
  if (!version) {
    version = generatorVersion();
    fs.outputJsonSync(versionPath, version);
  }

  return version;
};

const clearVersion = () => {
  fs.outputJsonSync(versionPath, 0);
};

module.exports = {
  getVersion,
  clearVersion
};