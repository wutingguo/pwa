import React, { Component, Fragment } from 'react';
import { fromJS, Map } from 'immutable';
import { withRouter } from 'react-router';
import { Route, HashRouter, Redirect } from 'react-router-dom';
import {
  XPureComponent,
  XIcon,
  XWithRoute
} from '@common/components';
import renderRoutes from '@resource/lib/utils/routeHelper';

import EditorSidebar from '@apps/slide-show/components/EditorSidebar';

import equals from '@resource/lib/utils/compare';
import mainHandler from './handle/main';

import './index.scss';

class CollectionDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDetailRequestDone: false
    };
  }

  componentDidMount() {
    const {match:{params:{id:encCollectionId}}, boundProjectActions } = this.props;
    const { getSlideshowList } = boundProjectActions;
    getSlideshowList();
    this.getCollectionDetail(encCollectionId);
    this.getTransitionModes();
    if(__isCN__) {
      this.getPostCardList();
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const prevId = this.props.match.params.id;
  //   const nextId = nextProps.match.params.id;
  //   if(prevId && nextId && (prevId != nextId)) {
  //     this.getCollectionDetail(nextId);
  //   }
  // }
  

  // // 获取collection的详情.
  getCollectionDetail = (encCollectionId) => {
    const {boundProjectActions} = this.props;
    const { setDetailContentLoading } = boundProjectActions;
    setDetailContentLoading({ loading: true });
    mainHandler.getCollectionDetail(encCollectionId, boundProjectActions).then(() => {
      this.setState({ isDetailRequestDone: true });
      setDetailContentLoading({ loading: false });
      // 请求watermark list
      // const {getWatermarkList, updateWatermarkList} = boundProjectActions;
      // getWatermarkList().then(res => {
      //   updateWatermarkList(res.data);
      // });
    })
  };

  getTransitionModes = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.getTransitionModes();
  };

  getPostCardList = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.getPostCardList()
  };

  
  render() {
    const { 
      history,
      match: {params},
      urls,
      loading,
      defaultImgs,
      currentSegment,
      collectionDetail,
      collectionsSettings,
      collectionDetailSets, 
      boundGlobalActions, 
      boundProjectActions
    } = this.props;
    const { isDetailRequestDone } = this.state;

    const routeHtml = renderRoutes({
      isHash: false,
      props: { isDetailRequestDone, ...this.props}
    });
    
    // sidebarProps
    const sidebarProps = {
      history,
      params,
      urls,
      loading,
      defaultImgs,
      currentSegment,
      collectionDetail,
      collectionsSettings,
      collectionDetailSets,
      boundGlobalActions, 
      boundProjectActions
    };

    return (
      <Fragment>
        <div className="slide-show-editor-container">
          {/* 左侧的sidebar */}
          <EditorSidebar {...sidebarProps} />

          {routeHtml}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(CollectionDetail);
