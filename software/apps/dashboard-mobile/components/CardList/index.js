import moment from 'moment';
import React, { memo } from 'react';
import LazyLoad from 'react-lazy-load';

import { XIcon, XImg } from '@common/components';

import XDropdown from '@apps/dashboard-mobile/components/XDropdown';

import './index.scss';

const CardList = props => {
  const { item, action, collectionUid } = props;
  const isShowDefaultCover = item.getIn(['cover', 'isShowDefaultCover']);
  const coverUrlSmall = item.getIn(['cover', 'coverUrlSmall']);
  const defaultCoverUrlSmall = item.getIn(['cover', 'defaultCoverUrlSmall']);
  const coverUrl = isShowDefaultCover ? defaultCoverUrlSmall : coverUrlSmall;
  const imgRot = item.getIn(['cover', 'orientation']);
  const xImgProps = {
    src: coverUrl,
    imgRot,
    type: 'background',
  };
  const renderOptionItem = item => {
    const { type, action, label } = item;
    return (
      <li key={type}>
        <a className={type} onClick={() => action(item)}>
          <XIcon type={type} iconWidth={12} iconHeight={12} title={label} text={label} />
        </a>
      </li>
    );
  };
  const getDropdownProps = () => {
    return {
      label: '',
      arrow: 'right',
      dropdownList: [
        {
          type: 'sharing',
          label: '分享',
          action: () => action.handleShare(item),
        },
        {
          type: 'delete',
          label: '删除',
          action: () => action.handleDelete(item),
        },
      ],
      renderLable: label => (
        <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
      ),
      renderOptionItem,
      customClass: 'collection-handler',
    };
  };
  const event_time = item.get('event_time');
  const time =
    event_time === 946742399000
      ? __isCN__
        ? '无事件日期'
        : 'No Event Date'
      : __isCN__
      ? moment(event_time).format('YYYY-MM-DD')
      : moment(event_time).format('MMMM Do, YYYY');
  return (
    <div className="cardList">
      <div className="commonFlex imgBox" onClick={() => action.handleClick(item)}>
        <LazyLoad
          className="lazyload-container"
          once
          key={`lazyload-item-${item.get('collection_uid')}`}
        >
          <XImg {...xImgProps} />
        </LazyLoad>
      </div>
      <div className="collectName" onClick={() => action.handleClick(item)}>
        {item.get('collection_name')}
      </div>
      <div className="commonFlex other">
        <div className="number">
          <span style={{ marginRight: '10px' }}>{time}</span>
          <span>{item.get('photo_count')}张</span>
        </div>
        <XDropdown {...getDropdownProps()} />
      </div>
    </div>
  );
};

export default memo(CardList);
