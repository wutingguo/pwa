const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const { prompt } = require('enquirer');
const exec = require('child_process').exec;
const args = require('minimist')(process.argv.slice(2));
const { env = {} } = args;
const { updateDependencies } = require('./tools/dependency');

let {  cn } = env;

const repositoryUrls = {
	resource: 'http://gitlab.artisanstate.com/front/H5/shared.git',
	// designer: 'http://gitlab.artisanstate.com/front/H5/cxeditor.git',
	cn: 'http://gitlab.artisanstate.com/front/H5/cunxin-apps.git',
	us: 'http://gitlab.artisanstate.com/front/H5/zno-apps.git'
};

const stores = ['cn', 'us'];
const requireResourceProjects = ['./'];

const ZNOrequireDependencyProjects = ['./', 'navbar', 'software'];
const CNrequireDependencyProjects = ['./', 'navbar', 'software', 'saas-portal'];
const requireDependencyProjects = cn ? CNrequireDependencyProjects : ZNOrequireDependencyProjects

exec('npm i', () => {
	start();
});

function start () {
	if (env.checkout) {
		const params = args._;
		if (params.length) {
			checkout(params[0]);
		} else {
			console.log('\033[31mPlease enter branch you want to checkout!\033[39m');
		}
	} else {
		const isInstalled = fs.existsSync('.install');

		// 已安装 则更新
		if (env.update || isInstalled) {
			update();
		} else {
			// 未安装选择美国或者中国项目安装
			prompt({
			  type: 'autocomplete',
			  name: 'store',
			  message: `Which project(${stores.join('/')})?`,
			  limit: 40,
			  choices: stores
			}).then(response => {

				// 克隆项目
				install(response.store);
				
				// 安装依赖
				shell.exec('npm run install-all');

				console.log('\033[32mProject install successfull!!\033[39m');
			});
		}
	}
}

function execCmd(cmd, okMsg = '') {
	const code = shell.exec(cmd).code;

	if (code !== 0) {
		shell.echo('\033[31mCommand execute failed!\033[39m');
		shell.exit(1);
		return;
	}

	okMsg && console.log(okMsg)
}

function install(store) {
	// 克隆项目
	installDesigner(store);
	installResources();

	// 生成文件
	fs.outputFile('.install', '1');
}

function installDesignerApps(store) {
	const storeUrl = repositoryUrls[store];
	if (storeUrl) {
		const cmd = `git clone ${storeUrl} designer/src/apps`;
		shell.exec(cmd);
		console.log('\033[32mdesigner apps clone complete!\033[39m');
	} else {
		console.log('\033[31mNo repository url config for store:' +  store + ' under designer!\033[39m');
	}
}

function installDesigner(store = 'cn') {
	const { designer: designerUrl } = repositoryUrls;
	if (designerUrl) {
		const cmd = `git clone ${designerUrl} designer`;
		shell.exec(cmd);
		console.log('\033[32mdesigner clone complete!\033[39m');

		installDesignerApps(store);
	} else {
		console.log('\033[31mdesignerNo repository url config for designer!\033[39m');
	}
}


function installResources() {
	const { resource: resourceUrl } = repositoryUrls;
	requireResourceProjects.forEach(o => {
		const resourcePath = path.join(o, 'resource');
		const cmd = `git clone ${resourceUrl} ${resourcePath}`;
		shell.exec(cmd);
		console.log('\033[32m' + resourcePath + ' clone complete!\033[39m');
	});
}

function update() {
	// 更新pwa 
	execCmd('git pull', '\033[32mpwa update successfull!\033[39m');

	// 更新designer
	// cn && execCmd('cd designer && git pull', '\033[32mdesigner update successfull!\033[39m');
	// cn && execCmd('cd designer/src/apps && git pull', '\033[32msrc/apps update successfull!\033[39m');


	cn && execCmd('cd saas-portal && git pull', '\033[32msaas-portal update successfull!\033[39m');
	// 更新所有项目的resource
	requireResourceProjects.forEach(o => {
		const resourcePath = path.join(o, 'resource');
		execCmd(`cd ${resourcePath} && git pull`);
		console.log('\033[32m' + resourcePath + ' update successfull!\033[39m');
	});

	updateDependencies(requireDependencyProjects);
	
	console.log('\033[32mupdate complete!\033[39m');
}

function checkout(branch) {
	// 更新pwa 
	execCmd(`git pull && git checkout ${branch}`, '\033[32mpwa swiched to ' + branch + ' successfull!\033[39m');

	// 更新designer
	// execCmd(`cd designer && git pull && git checkout ${branch}`, '\033[32mdesigner swiched to ' + branch + 'successfull!\033[39m');
	// execCmd(`cd designer/src/apps && git pull && git checkout ${branch}`, '\033[32msrc/apps swiched to ' + branch + 'successfull!\033[39m');

	// 更新所有项目的resource
	requireResourceProjects.forEach(o => {
		const resourcePath = path.join(o, 'resource');
		execCmd(`cd ${resourcePath} && git pull && git checkout ${branch}`);
		console.log('\033[32m' + resourcePath + ' switched to ' + branch + ' successfull!\033[39m');
	});

	updateDependencies(requireDependencyProjects);

	console.log('\033[32mSwich to ' + branch + ' complete!\033[39m');
}