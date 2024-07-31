import React from 'react';
import { get } from 'lodash';
import XPureComponent from '@resource/components/XPureComponent';
import { getWWWorigin } from '@resource/lib/utils/url';
import equals from '@resource/lib/utils/compare';
import singleSpaNavbar from '@src/containers/base/App/single-spa/action';

import './index.scss';

export default class IntegrateWWWPage extends XPureComponent {
  constructor(props) {
    super(props);
    this.iframeId = 'wwwPageIframe';
  }

  setTitle(cnTtitle) {
    document.title = __isCN__ ? cnTtitle : 'Projects';
  }

  /**
   * saas和www的iframe通信.
   */
  onMessage = ev => {
    const { history } = this.props;
    const appName = get(ev, 'data.appName');
    const pageUrl = get(ev, 'data.pageUrl');
    const isWeb = get(ev, 'data.isWeb');

    switch (appName) {
      case 'software': {
        // pageUrl: /create-new-project.html?xx
        const str = pageUrl.replace('.html', '');
        history.push(`/software${str}`);
        this.updateIframeSrc(pageUrl, isWeb);
        break;
      }
      case 'designer': {
        history.push(pageUrl);
        // 开发环境下不要reload, 导致调试困难.
        // if (!__DEVELOPMENT__) {
        location.reload();
        // }
        break;
      }
      case 'saas-web': {
        window.onbeforeunload = null;
        location.href = `/saas-web${pageUrl}`;
      }
      default: {
        break;
      }
    }
  };

  updateIframeSrc = (pageName, isWeb = false) => {
    this.setTitle('寸心云服 | 工作台---影像软件云平台，引领影楼、工作室步入云时代');
    // 直接替换src值, iframe不会重新reload.
    const iframe = document.getElementById(this.iframeId);
    if (iframe) {
      iframe.src = 'about:blank';
      setTimeout(() => {
        let src = isWeb ? `saas-web/yx/${pageName}` : `prod-assets/app/saas-store/${pageName}`;
        src = src.replace('//', '/');
        src = `${getWWWorigin()}${src}`;

        // 将地址栏中的search字段, 带入到iframe中去.
        const { search = '' } = location;
        const strs = [src];
        if (search && src.indexOf('?') === -1) {
          // 避免重复添加query
          strs.push(search);
        }

        // 去除问号.?? -> ?
        iframe.src = strs.join('?').replace('??', '?');
      }, 10);
    }
  };

  componentWillReceiveProps(nextProps) {
    const { currentRoute: oldRoute } = this.props;
    const { currentRoute: newRoute } = nextProps;
    const isEqual = equals(oldRoute, newRoute);
    if (!isEqual) {
      const { pageName } = newRoute;
      if (pageName) {
        this.updateIframeSrc(`${pageName}.html`);
      }
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage);
    singleSpaNavbar.updateNavbarItems(this);

    const { currentRoute = {} } = this.props;
    const { pageName, isWeb } = currentRoute;
    if (!pageName) {
      return '';
    }

    this.updateIframeSrc(`${pageName}.html`, isWeb);
  }

  render() {
    const style = {
      width: '100%',
      height: '100%',
      border: 'none'
    };

    return <iframe id={this.iframeId} style={style} />;
  }
}
