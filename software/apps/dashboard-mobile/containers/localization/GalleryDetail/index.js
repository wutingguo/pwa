import { fromJS } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import XPureComponent from '@resource/components/XPureComponent';

import { Cell } from '@apps/dashboard-mobile/components';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import { feedbackList, settingList } from '../handle/constants';

import './index.scss';

const needCollectUid = ['/software/gallery/favorite-setting/', '/software/gallery/favorite/'];
const needCollectId = ['/software/gallery/download/'];
class GalleryDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleWatermark = () => {
    this.props.history.push('/software/gallery/watermark-setting');
  };

  handleClick = item => {
    const { collectionsSettings = fromJS({}) } = this.props;
    const collectionUid = collectionsSettings.get('enc_collection_uid');
    const collectionId = collectionsSettings.get('collection_uid');
    if (needCollectUid.includes(item.url)) {
      this.props.history.push(`${item.url}${collectionUid}`);
    } else if (needCollectId.includes(item.url)) {
      this.props.history.push(`${item.url}${collectionId}`);
    } else {
      this.props.history.push(item.url);
    }
  };

  render() {
    return (
      <div className="gallery-detail">
        <div className="row-box">
          <div className="explain">设置</div>
          {settingList.map((item, index) => {
            return <Cell title={item.name} isLink onClick={() => this.handleClick(item)}></Cell>;
          })}
        </div>
        <div className="row-box">
          <div className="explain">选片反馈</div>
          {feedbackList.map((item, index) => {
            return <Cell title={item.name} isLink onClick={() => this.handleClick(item)}></Cell>;
          })}
        </div>
      </div>
    );
  }
}
export default GalleryDetail;
