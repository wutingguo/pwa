import { Map, fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { HashRouter, Redirect, Route } from 'react-router-dom';

import equals from '@resource/lib/utils/compare';
import renderRoutes from '@resource/lib/utils/routeHelper';

import { XIcon, XPureComponent, XWithRoute } from '@common/components';

import EditorSidebar from '@apps/gallery/components/EditorSidebar';

import mainHandler from './handle/main';

import './index.scss';

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
  }

  beforeunload = e => {
    // 自定义提示消息（浏览器会显示默认消息，但你可以添加自定义消息）
    const confirmationMessage = '您确定要离开此页面吗？';

    // 在一些浏览器中，必须将事件的returnValue属性设置为消息
    (e || window.event).returnValue = confirmationMessage;

    // 返回提示消息（在一些旧版浏览器中需要）
    return confirmationMessage;
  };

  componentWillReceiveProps(nextProps) {
    const prevId = this.props.match.params.id;
    const nextId = nextProps.match.params.id;
    const { collectionDetail } = nextProps;
    // const {
    //   imageArray
    //  } = this.props;
    //  const {
    //   imageArray: nextImageArray
    //  } = nextProps;
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
  }

  // 获取collection的详情.
  getCollectionDetail = encCollectionId => {
    const { boundProjectActions, collectionDetail } = this.props;
    const id = encCollectionId ? encCollectionId : this.props.match.params.id;
    const { setDetailContentLoading } = boundProjectActions;
    setDetailContentLoading({ loading: true });
    mainHandler.getCollectionDetail(id, boundProjectActions).then(_res => {
      const { getWatermarkList, updateWatermarkList, getSetPhotoList, getSetVideoInfo } =
        boundProjectActions;
      if (_res.ret_code && _res.ret_code === 200000) {
        const { data } = _res;
        const { default_set } = data;
        getSetVideoInfo({
          collection_set_id: default_set.set_uid,
        }).then(videoInfo => {
          const { video_source, video_id } = videoInfo;
          if (video_source === 2) {
            boundProjectActions.getSlideshowInfo(video_id);
          }
        });
        getSetPhotoList(id, collectionDetail.get('currentSetUid') || default_set.set_uid);
      }
      this.setState({ isDetailRequestDone: true });
      setDetailContentLoading({ loading: false });
      // 请求watermark list
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
