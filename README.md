## 技术栈
- systemjs: https://www.tapd.cn/21244281/launch/launch_form/view/1121244281001000065
- single-spa: https://single-spa.js.org/docs/getting-started-overview

## 需要解决的问题
### 项目拆解成4个
- src
- navbar
- software


### 原有项目改造成single-spa
- webpack的配置
- 启动文件

### 应用间通信问题
- navbar store

### 不同应用之间css隔离问题
- 添加css namespace

### software集成到single-spa
- hash更改成history


### saas和zno的通信
- postmessage.

## setup
- clone zno-pwa
```
git clone http://git.artisanstate.com/front/H5/zno-pwa.git
```
- checkout resource到根目录.
```
git clone http://git.artisanstate.com/front/H5/shared.git resource
```
```
  
## 相关命令
- npm run install-all: 安装依赖
- npm run dev:pc: 调试, 开发模式
- npm run build:pc: 编译.
- npm run update 批量更新所有模块
- npm run checkout 分支名 批量切换所有模块的分支

## fiddler配置
​``` xml
<?xml version="1.0" encoding="utf-8"?>
<AutoResponder LastSave="2020-10-14T13:43:31.8512968+08:00" FiddlerVersion="5.0.20202.18177">
  <ResponseRule Match="regex:https://saas.cnzno.com.tt/(cloudapi|api|clientassets|imgservice)(.*?)" Action="https://saas.cnzno.com.tt/$1$2" Enabled="true" />
    <ResponseRule Match="regex:https://saas.cnzno.com.tt/(.*?)\.(js|css|png|jpg|svg|json)" Action="D:\project\zno-pwa\build\zno-pwa\$1.$2" Enabled="true" />
    <ResponseRule Match="regex:https://saas.cnzno.com.tt/.*" Action="D:\project\zno-pwa\build\zno-pwa\index.html" Enabled="true" />
    <ResponseRule Match="regex:https://www.cnzno.com.tt/prod-assets/app/cxeditor/" Action="D:\project\zno-pwa\build\designer\" Enabled="true" />
    <ResponseRule Match="https://www.cnzno.com.tt/prod-assets/app/saas-store/" Action="D:\project\cunxin\znoplus\public\assets\index.html" Enabled="false" />
  </State>
</AutoResponder>
```

## 待解决的问题
#### 1.子项目的独立发布问题.
#### 2. single-spa自定义事件无法触发.

## 重点案例分析
### 如何调试和打包发布.
### 如何改造成一个single-spa的项目. webpack如何改造.
### 应用间如何通信
### 如何做到样式隔离
### 加载后短暂的页面错乱问题. 

## 其他补充.
### js模块化的几种方式.
- Commonjs
- AMD
- CMD
- UMD
- ES6 modules

#### Commonjs
CommonJS是一种同步化获取模块的模块加载方式，nodejs自带的模块管理就是CommonJS，基本语法：  

```
module.exports = { 
  test: function(){}
}
```

#### AMD（Asynchronous Module Definition）是由Require js提出的, 通过异步来引入模块， 基本语法
导出moduleA
```
define(function(){
  return {
    test: function(){}
  }
});
```

导入moduleA
```
require(['moduleA'], function(moduleA){

})
```

#### CMD由玉伯提出的（seajs）按需加载模块，和AMD的区别在于CMD是使用的时候才去加载，而AMD是在开始就声明需要依赖哪些模块

```
// require可以去引入别的模块，exports和module与CommonJS类似，放置导出的东西

define(function(require, exports, module){
  const moduelA = require('/modulea);

  module.exports = {
    test: function(){}
  };
})
```

#### UMD（Universal Module Definition）是AMD和CommonJS的综合，AMD通常在浏览器端使用，异步加载模块，CommonJS通常在服务端使用，同步加载模块，为了能兼容，所以想出了这么一个通用的解决方案

#### ES6 module
导出
```
export default () => {};
```

导入:
```
import test from './test';
```

### 在zno-pwa根目录下面运行npm run dev:pc 前需要在zno-pwa  software  nvabar目录下执行npm i