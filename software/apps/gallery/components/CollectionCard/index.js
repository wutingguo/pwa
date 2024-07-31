import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import LazyLoad from 'react-lazy-load';

import equals from '@resource/lib/utils/compare';

import { XDropdown, XImg, XLoading } from '@common/components';

import main from './handle/main';

import './index.scss';

class CollectionCard extends Component {
  getDropdownProps = () => main.getDropdownProps(this);

  render() {
    const { item, handleClick } = this.props;
    const collectionUid = item.get('enc_collection_uid');
    const collectionName = item.get('collection_name');
    const photoCount = item.get('photo_count');
    const event_time = item.get('event_time');

    const isShowDefaultCover = item.getIn(['cover', 'isShowDefaultCover']);
    const defaultCoverUrlSmall = item.getIn(['cover', 'defaultCoverUrlSmall']);
    const coverUrlSmall = item.getIn(['cover', 'coverUrlSmall']);
    const coverUrl = isShowDefaultCover ? defaultCoverUrlSmall : coverUrlSmall;
    const imgRot = item.getIn(['cover', 'orientation']);
    const xImgProps = {
      src: coverUrl,
      imgRot,
      type: 'background',
    };
    // 如果字段值是946742399000（2000-01-01: 23:59:59），则认为是`No Event Date`
    const time =
      event_time === 946742399000
        ? __isCN__
          ? '无事件日期'
          : 'No Event Date'
        : __isCN__
        ? moment(event_time).format('YYYY-MM-DD')
        : moment(event_time).format('MMMM Do, YYYY');
    return (
      <div className="collection-card">
        <div className="collection-cover" onClick={() => handleClick(collectionUid)}>
          <LazyLoad className="lazyload-container" once key={`lazyload-item-${collectionUid}`}>
            <XImg {...xImgProps} />
          </LazyLoad>
        </div>
        <div className="collection-detail">
          <div className="topic-handle">
            <span
              className="topic ellipsis"
              onClick={() => handleClick(collectionUid)}
              title={collectionName}
            >
              {collectionName}
            </span>
            <XDropdown {...this.getDropdownProps()} />
          </div>
          <div className="status ellipsis">
            <span style={{ marginRight: '0.5rem' }}>{time}</span>
            {photoCount} {t('PHOTOS_COUNT_SUFFIX')}
          </div>
        </div>
      </div>
    );
  }
}

CollectionCard.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

CollectionCard.defaultProps = {
  item: {},
};

export default CollectionCard;
