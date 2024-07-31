const path = require('path');
const shell = require('shelljs');

function updateDependencies(needResourceProjects) {
	needResourceProjects.forEach(p => {
		const { updates, isOutdated } = collectDepUpates(p);

    if (isOutdated) {
      console.log('\033[31mUpdate dependencies', (p !== './' ? '' : ' for project ' + p), '\033[39m');

      if (updates.length) {
        const cmds = updates.reduce(function(a, c, i) {
          a += `npm i ${c.dep}@${c.version}`;
          if (i !== updates.length-1) {
            a += ' && ';
          }
          return a;
        }, '');
        execCmd(`cd ${p} && ${cmds}`, '\033[32mUpdate dependencies successfull!\033[39m');
      } else {
        execCmd(`cd ${p} && npm i`, '\033[32mUpdate dependencies successfull!\033[39m');
      }
    }
	});
}

function collectDepUpates(appPath = './') {
  const result = { isOutdated: false, updates: [] };
	try {
		const package = require(path.join(process.cwd(), appPath, 'package.json'));
		const installedPackage = require(path.join(process.cwd(), appPath, 'package-lock.json'));

		const requireDependencies = {...package.dependencies, ...package.devDependencies};
		const requireDependencyKeys = Object.keys(requireDependencies);

		const installedDependencies = installedPackage.dependencies;
		const installedDependencyKeys = Object.keys(installedDependencies);

		requireDependencyKeys.map(dep => {
			const requireVersion = requireDependencies[dep];
			if (installedDependencyKeys.includes(dep)) {
				const installedVersion =installedDependencies[dep]['version'];

				if (requireVersion.startsWith('~')) {
					const matches = requireVersion.match(/\d+/g);
					if (matches && matches.length) {
						let reg = createVersionExp(matches, 1);
            console.log(reg)
						if (!reg.test(installedVersion)) {
              result.updates.push({
                dep,
                version: requireVersion
              });
						}
            reg = null;
					}
				} else if (requireVersion.startsWith('^')) {
					const matches = requireVersion.match(/\d+/g);
					if (matches && matches.length) {
            const isStartWithSero = checkIsStartWithSero(matches);
            const ignoreSliceCount = isStartWithSero ? 1 : 2;
						let reg = createVersionExp(matches, ignoreSliceCount);
						if (!reg.test(installedVersion)) {
              result.updates.push({
                dep,
                version: requireVersion
              });
						}
            reg = null;
					}
				} else if (requireVersion !== '*' && requireVersion !== installedVersion) {
					result.updates.push({
            dep,
            version: requireVersion
          });
				}
			} else {
        result.updates.push({
          dep,
          version: requireVersion
        });
      }
		});

    result.isOutdated = !!result.updates.length;
	} catch(e) {
		result.isOutdated = true;
	}

  return result;
}

function checkIsStartWithSero(versionArr) {
  const index = versionArr.findIndex(v => {
    return v !== '0';
  });
  return index !== 0;
}

function createVersionExp(versionArr, ignoreSliceCount = 3) {
	versionArr.length = 3;
	const startIndex = versionArr.length - ignoreSliceCount;
	if (startIndex >= 0) {
		for (let i=startIndex; i<versionArr.length; i++) {
			versionArr[i] = '\\d+';
		}
		return new RegExp('^' + versionArr.join('\\.'));
	}

	throw new Error('package version is invalid!');
}

function execCmd(cmd, okMsg = '') {
	const code = shell.exec(cmd).code;

	if (code !== 0) {
		shell.echo('\033[31m命令执行出错！\033[39m');
		shell.exit(1);
		return;
	}

	okMsg && console.log(okMsg)
}

module.exports = { updateDependencies };
