import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';

import { getSlideShowImageUrl } from '@resource/lib/saas/image';

import { SAAS_WEBSITE_IMAGE_URL } from '@resource/lib/constants/apiUrl';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XIcon, XImg } from '@common/components';

import './index.scss';

const websiteStatus = {
  1: {
    color: '#0077CC',
    backgroundColor: '#E0E7F4',
    text: 'Unpublished',
    btnText: 'Publish Website',
  },
  2: {
    color: 'rgb(191,191,191)',
    backgroundColor: 'rgb(191,191,191, .2)',
    text: 'Publishing',
    btnText: 'Publishing',
  },
  3: {
    color: '#35BC41',
    backgroundColor: '#DDF2DF',
    text: 'Published',
  },
  4: {
    color: '#FF9000',
    backgroundColor: '#FBEFDF',
    text: 'New Edits Exist',
    btnText: 'Update Edits',
  },
};

class CardList extends Component {
  constructor(props) {
    super(props);
  }

  renderCollectionCard = () => {
    const { items, galleryBaseUrl, handleEdit, handlePublish, renderCard, ...res } = this.props;

    const handleShare = domainUrl => {
      if (domainUrl) window.open(`${location.protocol}//${domainUrl}`, '_blank');
    };

    return items.map(item => {
      const coverUrlSmall = getSlideShowImageUrl({
        galleryBaseUrl: location.origin + '/',
        enc_image_uid: item?.thumbnail,
        isWaterMark: false,
        originUrl: SAAS_WEBSITE_IMAGE_URL,
        thumbnail_size: thumbnailSizeTypes.SIZE_1500,
      });

      const xImgProps = {
        src: item?.thumbnail ? coverUrlSmall : '1',
        backgroundColor: '#AAAAAA',
        className: item?.thumbnail && 'website-image',
        type: 'background',
      };

      const defaultDomain = item.domains.filter(domain => domain.type === 1);
      const customDomain = item.domains.filter(domain => domain.type === 2);
      // 由状态管理了
      const domainUrl =
        (customDomain[0]?.status && customDomain[0]?.name) || defaultDomain[0]?.name;

      if (renderCard) {
        return renderCard({
          key: item.get('enc_image_uid') || item.get('id'),
          item,
          handleEdit,
          ...res,
        });
      }

      const itemStatus = websiteStatus[item.publish_status] || {};

      const statusStyle = {
        color: itemStatus.color,
        backgroundColor: itemStatus.backgroundColor,
      };

      return (
        <div className="card-container" key={item.id}>
          <LazyLoad className="lazyload-container" once key={`lazyload-item-${item.id}`}>
            <XImg {...xImgProps} />
          </LazyLoad>
          <div className="content">
            <div className="details">
              <div className="website_name">{item.website_name}</div>
              {item.publish_status !== 1 && (
                <div className="website_domain">
                  <span className="domain">{domainUrl}</span>
                  <XIcon
                    className="doamin_icon"
                    type="jump"
                    iconWidth={16}
                    iconHeight={16}
                    onClick={() => handleShare(domainUrl)}
                  />
                </div>
              )}
              <div className="website_status" style={{ ...statusStyle }}>
                {itemStatus.text}
              </div>
            </div>
            <div className="btns">
              <span className="website_btn" onClick={() => handleEdit(item)}>
                {t('EDIT_WEBSITE')}
              </span>
              {itemStatus.btnText && (
                <span
                  className="website_btn"
                  style={item.publish_status === 2 ? { ...statusStyle } : {}}
                  onClick={() => handlePublish(item)}
                >
                  {itemStatus.btnText}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { style } = this.props;
    return (
      <div className="cards-wrap" style={style}>
        {this.renderCollectionCard()}
      </div>
    );
  }
}

CardList.propTypes = {
  items: PropTypes.object.isRequired,
  handleEdit: PropTypes.func,
  handlePublish: PropTypes.func,
  style: PropTypes.object,
};

CardList.defaultProps = {
  items: {},
};

export default CardList;
