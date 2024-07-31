import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazy-load';
import { XDropdown, XIcon, XImg, XLink } from '@common/components';
import main from './handle/main';

import './index.scss';

class CollectionCard extends Component {
  getDropdownProps = () => main.getDropdownProps(this);
  handlePreview = opt => main.handlePreview(this, opt);

  render() {
    const { item, handleClick } = this.props;

    const slideshowUid = item.get('id');
    const collectionName = item.get('slides_name');
    const coverImg = item.get('cover_img');
    const coverImgId = coverImg ? coverImg.get('id') : null;
    const isGenerated = item.get('slideshowStatus') >= 2 ? true : false;

    const coverUrlSmall = item.getIn(['cover_img', 'coverUrlSmall']);
    const imgRot = item.getIn(['cover_img', 'orientation']);

    const xImgProps = {
      src: coverUrlSmall,
      imgRot,
      backgroundColor: '#AAAAAA',
      type: coverImgId === 0 || coverImgId === null ? 'backgroundColor' : 'background'
    };

    return (
      <div className="collection-card">
        <div
          className="collection-cover"
          onClick={isGenerated ? () => {} : () => handleClick(slideshowUid)}
        >
          <LazyLoad className="lazyload-container" once key={`lazyload-item-${slideshowUid}`}>
            <XImg {...xImgProps} />
          </LazyLoad>
          {isGenerated ? (
            <div className="preview-edit">
              <XLink
                className="preview-wrap"
                onClick={this.handlePreview}
                href={`/software/slide-show/preview/${slideshowUid}`}
                target="_blank"
              >
                <XIcon type="play" iconWidth={36} iconHeight={48} />
              </XLink>
              <span className="edit-wrap">
                <XIcon
                  type="rename-light"
                  iconWidth={16}
                  iconHeight={16}
                  onClick={() => handleClick(slideshowUid)}
                />
              </span>
            </div>
          ) : (
            <div className="continue-editing-wrap">
              <span
                className="continue-editing ellipsis"
                title={t('SLIDESHOW_CONTINUE_EDITING')}
                onClick={() => handleClick(slideshowUid)}
              >
                {t('SLIDESHOW_CONTINUE_EDITING')}
              </span>
            </div>
          )}
        </div>
        <div className="collection-detail">
          <div className="topic-handle">
            <span
              className="topic ellipsis"
              onClick={() => handleClick(slideshowUid)}
              title={collectionName}
            >
              {collectionName}
            </span>
            <XDropdown {...this.getDropdownProps()} />
          </div>
        </div>
      </div>
    );
  }
}

CollectionCard.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleSharing: PropTypes.func.isRequired
};

CollectionCard.defaultProps = {
  item: {}
};

export default CollectionCard;
