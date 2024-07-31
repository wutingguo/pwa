import { Map, fromJS } from 'immutable';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { HashRouter, Redirect, Route } from 'react-router-dom';

import equals from '@resource/lib/utils/compare';
import renderRoutes from '@resource/lib/utils/routeHelper';

import { XIcon, XPureComponent, XWithRoute } from '@common/components';

import EditorSidebar from '@apps/gallery/components/EditorSidebar';

import mainHandler from './handle/main';

import './index.scss';

let timer = null;

class CollectionDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      saveDisable: true,
      isDetailRequestDone: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id: encCollectionId },
      },
    } = this.props;
    this.getCollectionDetail(encCollectionId);
    this.doSetInterval();
  }

  componentWillReceiveProps(nextProps) {
    const prevId = this.props.match.params.id;
    const nextId = nextProps.match.params.id;
    const { collectionDetail } = nextProps;
    if (prevId && nextId && prevId != nextId) {
      this.getCollectionDetail(nextId);
    }
    const { loading, apply_all } = collectionDetail.get('watermarkLoading')?.toJS() || {};
    if (!equals(collectionDetail, nextProps.CollectionDetail)) {
      if (loading) {
        window.addEventListener('beforeunload', this.beforeunload);
        this.setState({ saveDisable: false });
      } else {
        window.removeEventListener('beforeunload', this.beforeunload);
        this.setState({ saveDisable: true });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload);
    clearInterval(timer);
    timer = null;
  }

  beforeunload = e => {
    // 自定义提示消息（浏览器会显示默认消息，但你可以添加自定义消息）
    const confirmationMessage = '您确定要离开此页面吗？';

    // 在一些浏览器中，必须将事件的returnValue属性设置为消息
    (e || window.event).returnValue = confirmationMessage;

    // 返回提示消息（在一些旧版浏览器中需要）
    return confirmationMessage;
  };

  doSetInterval = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      const { collectionDetail, boundProjectActions } = this.props;
      if (collectionDetail && collectionDetail.size > 0) {
        const params = {
          collection_id: collectionDetail.get('collection_uid'),
          collection_set_id: collectionDetail.get('currentSetUid'),
        };
        boundProjectActions.getCollectionStatusPolling(params);
      }
    }, 3000);
  };

  // 获取collection的详情.
  getCollectionDetail = encCollectionId => {
    const id = encCollectionId ? encCollectionId : this.props.match.params.id;
    const { boundProjectActions, collectionDetail } = this.props;
    const { setDetailContentLoading } = boundProjectActions;
    setDetailContentLoading({ loading: true });
    mainHandler.getCollectionDetail(id, boundProjectActions).then(async _res => {
      if (_res.ret_code && _res.ret_code === 200000) {
        const { data } = _res;
        const { enc_collection_uid, default_set } = data;
        const { getPinSetting, getSetPhotoList } = this.props.boundProjectActions;
        getPinSetting(enc_collection_uid);
        await getSetPhotoList(id, collectionDetail.get('currentSetUid') || default_set.set_uid);
        // 当列表接口请求完毕时再关闭loading
        setDetailContentLoading({ loading: false });
      } else {
        setDetailContentLoading({ loading: false });
      }
      this.setState({ isDetailRequestDone: true });

      // 请求watermark list
      const { getWatermarkList, updateWatermarkList } = boundProjectActions;
      getWatermarkList().then(res => {
        updateWatermarkList(res.data);
      });
    });
  };

  render() {
    const {
      history,
      match: { params },
      urls,
      loading,
      defaultImgs,
      collectionDetail,
      collectionsSettings,
      collectionDetailSets,
      boundGlobalActions,
      boundProjectActions,
    } = this.props;
    const { isDetailRequestDone } = this.state;
    const routeHtml = renderRoutes({
      isHash: false,
      props: {
        isDetailRequestDone,
        getCollectionDetail: this.getCollectionDetail,
        ...this.props,
      },
    });

    // sidebarProps
    const sidebarProps = {
      history,
      params,
      urls,
      loading,
      defaultImgs,
      collectionDetail,
      collectionsSettings,
      collectionDetailSets,
      boundGlobalActions,
      boundProjectActions,
    };

    return (
      <Fragment>
        <div className="gllery-editor-container">
          {/* 左侧的sidebar */}
          <EditorSidebar {...sidebarProps} />

          {routeHtml}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(CollectionDetail);
