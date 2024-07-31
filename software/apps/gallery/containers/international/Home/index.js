import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import { actionTypes } from '@resource/pwa/utils/strings';
import { postMessageToSW } from '@resource/pwa/utils/serviceworker/helper';

class Home extends XPureComponent {
  state = { data: [] };

  showReactNotification = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.addNotification({
      message: 'successful',
      level: 'success',
      autoDismiss: 2
    });
  };

  // 测试应用再打开后, 数据还原.
  onClockIncream = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.incream();
  };

  backupStore = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.saveStoreToCache('gallery').then(data => {
      this.showReactNotification('备份成功');
    });
  };

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
    };
    boundGlobalActions.showConfirm(data);
  };

  sendTo = () => {
    postMessageToSW({
      type: actionTypes.getDatabaseImages
    });
  };

  messageHandle = event => {
    const { type, items } = event.data;

    switch (type) {
      case actionTypes.getDatabaseImages: {
        this.setState({ data: items });
        break;
      }
      default: {
        break;
      }
    }
  };

  componentDidMount() {
    navigator.serviceWorker.addEventListener('message', this.messageHandle);
  }

  render() {
    const {test} = this.props;

    return (
      <Fragment>
        <h1>this is gallery app</h1>
        <hr />
        <button onClick={this.sendTo}>send data to sw</button>
        <div>Render data from sw: {this.state.data}</div>

        <hr />
        <button onClick={this.backupStore}>缓存store</button>

        <hr />
        <button onClick={this.showConfirmModal}>显示弹框</button>
        <button onClick={this.showReactNotification}>显示react通知</button>

        <hr />
        <button onClick={this.onClockIncream}>clock</button>
        <h2>gallery: {test.get('count')}</h2>
      </Fragment>
    );
  }
}

export default Home;
