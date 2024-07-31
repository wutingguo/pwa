import * as singleSpa from 'single-spa';
import { isEqual } from 'lodash';
import { saasAppNames } from '@resource/lib/constants/strings';
import IdleCallback from '@resource/lib/utils/idleCallback';

import translator from '@src/utils/translator';

let appNames;
let idleCallbackInstance;
let stateChangeTimer;
let previousActiveAppNames;

// 定义隐藏header 的路径集合
const needHideNavBarPaths = ['theme-editor', 'ai-matting'];

const getAppNames = () => {
  if (!appNames) {
    appNames = singleSpa.getAppNames();
  }
  return appNames;
};

const getIdleCallbackInstance = () => {
  if (!idleCallbackInstance) {
    idleCallbackInstance = IdleCallback.getInstance({ timeout: 3000 });
  }
  return idleCallbackInstance;
};

const getActiveAppNames = () => {
  const activeAppNames = [saasAppNames.navbar];

  // pathname: "/software/projects"
  // 将sofware取出来.
  const pathname = location.pathname;
  const pNames = pathname.split('/').filter(v => v);
  if (pNames.length) {
    activeAppNames.push(pNames[0]);
  }

  return activeAppNames;
};

/**
 * 在body节点上class属性, 设置已挂载app的名称. 比如class="navbar-app"
 */
const updateBodyClassName = async () => {
  const mountedAppNames = getActiveAppNames();
  const pathName = location.pathname;
  const isHideNavBar = needHideNavBarPaths.some(path => pathName.includes(path));
  const apps = document.getElementsByClassName('active-app');

  // 监听路径变化，用来显示、隐藏header
  if (apps && apps.length > 0) {
    if (isHideNavBar) {
      apps.navbar.style.height = 0;
      apps.software.style.top = 0;
    } else {
      apps.navbar.style.height = '48px';
      apps.software.style.top = '48px';
    }
  }
  if (isEqual(previousActiveAppNames, mountedAppNames)) {
    return;
  }
  // 保存当前的, 方便下一次比较.
  previousActiveAppNames = mountedAppNames;

  const bodyNode = document.querySelector('body');
  const appLoading = document.querySelector('#app-loading');

  // 显示app-loading.
  appLoading.classList = '';

  // 给app的节点设置none或active-app的class.
  const names = getAppNames();
  const pathname = location.pathname;
  // 在网络空闲的时候. 认为项目已经加载完成了.
  const instance = getIdleCallbackInstance();
  for (let appName of names) {
    instance.pushEvent(() => {
      let className = 'none';
      const isMounted = !!mountedAppNames.find(v => appName === v);

      if (isMounted) {
        className = 'active-app';
      }

      const node = document.querySelector(`#${appName}`);
      node.classList = className;

      // 隐藏app-loading.
      appLoading.classList = 'hide';
    });
  }
  instance.schedulePendingEvents();

  bodyNode.classList = mountedAppNames.map(v => `${v}-app`).join(' ');
};

const redirectToDefault = () => {
  const { pathname } = location;
  if (pathname === '/index.html' || pathname === '/') {
    const defaultPageName = __isCN__ ? 'my-projects' : 'projects';
    singleSpa.navigateToUrl(`/software/${defaultPageName}`);
  } else {
    updateBodyClassName();
  }
};

const setWebsiteMode = (isEdit = false, navbar, software) => {
  if (navbar && isEdit) {
    navbar.style.display = 'none';
    software.style.top = 0;
  } else {
    navbar.style.display = 'block';
    software.style.top = '48px';
  }
};

const init = () => {
  // 在body节点上, 为已挂载的节点添加对应的class名称.
  window.addEventListener('popstate', ev => {
    clearTimeout(stateChangeTimer);
    stateChangeTimer = setTimeout(updateBodyClassName, 300);
  });

  // 判断当前的url. 如果是根目录, 就跳转到默认的页面.
  window.addEventListener('load', ev => {
    redirectToDefault();
  });

  const navbar = document.getElementById('navbar');
  const software = document.getElementById('software');

  // 判断当前的url. 如果是根目录, 就跳转到默认的页面.
  window.addEventListener('message', event => {
    if (['true', 'false'].includes(String(event.data))) {
      setWebsiteMode(event.data, navbar, software)
    }
  });

  // i18n. 添加全部的t方法.
  translator.init();
};

export default {
  init
};
