import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import { actionTypes } from '@resource/pwa/utils/strings';
import { postMessageToSW } from '@resource/pwa/utils/serviceworker/helper';
import monitor from '@resource/pwa/utils/monitor';
import mapState from '@src/redux/selector/mapState';
import mapDispatch from '@src/redux/selector/mapDispatch';
import icon from '@resource/pwa/static/zno/images/icon-72x72.png';

@connect(mapState, mapDispatch)
class Home extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      usage: '', // 目前已使用的存储空间
      quota: '', // 可用存储空间
      caches: '',
      indexedDB: '',
      serviceWorkerRegistrations: ''
    };
  }

  showReactNotification = (message) => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.addNotification({
      message: message || 'successful',
      level: 'success',
      autoDismiss: 2
    });
  }

  showConfirmModal = () => {
    const { boundGlobalActions } = this.props;

    const data = {
      close: boundGlobalActions.hideConfirm,
      message: 'this is test message',
      buttons: [
        {
          className: 'white',
          text: t('CONTINUE'),
          onClick: boundGlobalActions.hideConfirm
        },
        {          
          text: t('CANCEL'),
          onClick: boundGlobalActions.hideConfirm
        }        
      ]
    }
    boundGlobalActions.showConfirm(data);
  }

  sendTo = () => {
    postMessageToSW({
      type: actionTypes.getDatabaseImages
    });
  };

  messageHandle = event => {
    const { type, items, msg } = event.data;

    switch (type) {
      case actionTypes.getDatabaseImages: {
        this.setState({ data: items });
        break;
      }
      case actionTypes.checkHealth: {
        console.log('checkHealth');
        postMessageToSW({ type: actionTypes.keepHealth });
        break;
      }
      case actionTypes.registerSuccess: {
        console.log('registerSuccessMsg: ', msg);
        break;
      }
      default: {
        break;
      }
    }
  };

  componentDidMount() {
    navigator.serviceWorker.addEventListener('message', this.messageHandle);

    // 断网处理
    window.addEventListener('offline', this.offlineEvent);
  
    // 网络恢复
    window.addEventListener('online', this.onlineEvent);

    // 离开或刷新页面
    window.addEventListener('beforeunload', () => {
      console.log('unregisterPage');
      postMessageToSW({ type: actionTypes.unregisterPage });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('offline', () => {});
    window.removeEventListener('online', () => {});
    window.removeEventListener('beforeunload', () => {});
  }

  // 获取本地存储空间相关参数
  getStorage = () => {
    monitor.storageEstimateWrapper().then(
      (storage) => {
        const {
          usage,
          quota,
          usageDetails: {
            caches,
            indexedDB,
            serviceWorkerRegistrations
          }
        } = storage;
        this.setState({
          quota,
          usage,
          caches,
          indexedDB,
          serviceWorkerRegistrations
        })
    });
  };

  backupStore = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.saveStoreToCache('pwa').then(data => {
      this.showReactNotification('备份成功');
    });
  };

  restoreStore = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getStoreFromCache('pwa').then(data => {
      this.showReactNotification('还原成功');
    });
  };

  // 测试应用再打开后, 数据还原.
  onClockIncream = () => {
    const {boundProjectActions} = this.props;
    boundProjectActions.incream();
  };

  // 离线
  offlineEvent() {
    // 页面 notification 提示
    const config = {
      title: '掉线通知',
      icon,
      body: '您现在已处于离线状态'
    };
    monitor.notifyMe(config);
  
    // 页面向 sw post 掉线 message
    postMessageToSW({
      type: 'offline'
    })
  }

  // 上线
  onlineEvent() {
    // 页面 notification 提示
    const config = {
      title: '网络恢复',
      icon,
      body: '您的网络已恢复',
      showTime: 3000
    };
    monitor.notifyMe(config);

    // 页面向 sw post 掉线 message
    postMessageToSW({
      type: 'online'
    })
  }

  // 注册当前页面
  tryToRegister() {
    postMessageToSW({
      type: actionTypes.registerPage,
      reportData: {
        url: location.href
      }
    });
  }

  render() {
    const { clock } = this.props;

    const { quota, usage, caches, indexedDB, serviceWorkerRegistrations } = this.state;
    return (
      <Fragment>
        <h1>this is pwa app</h1>
        <hr />
        <button onClick={this.sendTo}>send data to sw</button>
        <div>Render data from sw: {this.state.data}</div>

        <hr />
        <button onClick={this.backupStore}>缓存store</button>
        <button onClick={this.restoreStore}>还原store上的数据</button>

        <hr />
        <button onClick={this.showConfirmModal}>显示弹框</button>
        <button onClick={this.showReactNotification}>显示react通知</button>

        <hr />
        <button onClick={this.getStorage}>本地存储空间使用情况</button>
        <div>可用的存储空间： {quota}</div>
        <div>目前已经使用了的存储空间： {usage}</div>
        <div>caches: {caches}</div>
        <div>indexedDB: {indexedDB}</div>
        <div>serviceWorkerRegistrations: {serviceWorkerRegistrations}</div>
        <button onClick={this.tryToRegister}>监控页面崩溃</button>

        <hr/>
        <button onClick={this.onClockIncream}>clock</button>
        <pre>{clock.get('count')}</pre>
      </Fragment>
    );
  }
}

export default Home;
