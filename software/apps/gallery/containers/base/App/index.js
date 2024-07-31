import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import XPureComponent from '@resource/components/XPureComponent';

import renderRoutes from '@resource/lib/utils/routeHelper';

import ModalEntry from '@apps/gallery/components/ModalEntry';
import mapDispatch from '@apps/gallery/redux/selector/mapDispatch';
import mapState from '@apps/gallery/redux/selector/mapState';

import withMatch from './handle/withMatch';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  state = { data: [] };

  componentDidMount() {
    if (!__isCN__) {
      const { boundGlobalActions } = this.props;
      console.log('this.props: ', this.props);
      // boundGlobalActions.get_default_brand();
    }
  }

  componentDidUpdate(preProps) {
    // us 采用的 subdomain ，所以分享链接需要额外处理一下
    if (!__isCN__) {
      const { collectionDetail: preCollectionDetail } = preProps;
      const { collectionDetail, boundProjectActions } = this.props;
      const pre_collection_uid = preCollectionDetail.get('enc_collection_uid');
      const enc_collection_uid = collectionDetail.get('enc_collection_uid');
      if (pre_collection_uid !== enc_collection_uid && enc_collection_uid) {
        boundProjectActions.getEmailShareDirectLink(enc_collection_uid);
      }
    }
  }

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
      // AuthorizedRoute: XAuthorizedRoute
    });
    return (
      <Fragment>
        {/* 渲染的主体区域. */}
        {routeHtml}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withMatch(withRouter(App));
