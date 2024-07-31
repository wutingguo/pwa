import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { XButton, XIcon, XPureComponent } from '@common/components';

import mainHandler from '@apps/aiphoto/containers/international/Collections/List/handle/main';

import './index.scss';

class CollectionDetailHeader extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShowPannel: false,
    };
  }
  componentDidMount() {
    window.addEventListener('click', this.hidePannel, false);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.hidePannel, false);
  }
  togglePannel = e => {
    this.setState({
      isShowPannel: !this.state.isShowPannel,
    });
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    return false;
  };
  hidePannel = () => {
    this.setState({
      isShowPannel: false,
    });
  };
  changeTab = (isOriginal, currentOriginal) => {
    if (isOriginal === currentOriginal) return false;
    const { collectionId, boundProjectActions } = this.props;
    boundProjectActions.getCollectionImageList(collectionId, currentOriginal).then(() => {
      boundProjectActions.updateCollectionOriginal(currentOriginal);
    });
  };

  renderBtn = () => {
    const { uploadBtn, uploadDirectory, collectionDetail } = this.props;
    const { isShowPannel } = this.state;
    const status = collectionDetail.get('collection_status');

    const pannelClass = classnames('sub-pannel', {
      ['is-show']: !!isShowPannel,
    });
    const addImageBtn = (
      <div className="add-aiphoto-btn-container">
        <XIcon type="add" text={t('ADD_PHOTOS')} onClick={this.togglePannel} />
        <ul className={pannelClass}>
          <li>{uploadBtn}</li>
          <li>{uploadDirectory}</li>
        </ul>
      </div>
    );
    const startBtn = (
      <XButton
        className="aiphoto-global-btn"
        onClicked={() => {
          window.logEvent.addPageEvent({
            name: 'AiPhotosCollection_Click_RetouchPhotos',
          });
          const opt = {
            collectionDetail,
            isPart: true,
            collection_id: collectionDetail.get('collection_id'),
          };
          mainHandler.startCollectionImage(this, opt);
        }}
      >
        {t('RETOUCH')}
      </XButton>
    );

    // 修图完成
    if (status === 2) {
      return [startBtn];
    }

    return [addImageBtn, startBtn];
  };

  renderText = () => {
    const { collectionDetail } = this.props;
    const status = collectionDetail.get('collection_status');
    const imageCount = collectionDetail.get('total_image_count');
    const correctedCount = collectionDetail.get('corrected_image_count');
    if (status === 1) {
      return `系统修图中(${correctedCount}/${imageCount})`;
    }
    if (status === 2) {
      return '修图完成';
    }
    if (status === 3) {
      return '已终止修图';
    }
    return '';
  };

  render() {
    const { className, hasHandleBtns = true, collectionDetail } = this.props;
    const totalCount = collectionDetail.get('total_image_count');
    const correctedCount = collectionDetail.get('corrected_image_count');
    const failedCount = collectionDetail.get('failed_image_count');
    const isOriginal = collectionDetail.get('is_original');
    const wrapperCls = classnames('collection-detail-header-wrapper', {
      [className]: !!className,
    });
    const totalClass = classnames('photo-detail-global-action-bar-title ellipsis', {
      active: isOriginal === 1,
    });
    const correctedClass = classnames('photo-detail-global-action-bar-title ellipsis', {
      active: isOriginal === 0,
    });
    const failedClass = classnames('photo-detail-global-action-bar-title ellipsis', {
      active: isOriginal === 2,
    });

    return (
      <div className={wrapperCls}>
        <div className="collection-detail-header-left">
          <span className={totalClass} onClick={() => this.changeTab(isOriginal, 1)}>
            {t('ORIGINAL_PHOTOS')}
            <span className="nb">({totalCount})</span>
          </span>
          {correctedCount > 0 && (
            <span className={correctedClass} onClick={() => this.changeTab(isOriginal, 0)}>
              {t('RETOUCHED_PHOTOS')}
              <span className="nb">({correctedCount})</span>
            </span>
          )}
          {failedCount > 0 && (
            <span className={failedClass} onClick={() => this.changeTab(isOriginal, 2)}>
              {t('RETOUCH_EORROR')}
              <span className="nb">({failedCount})</span>
            </span>
          )}
        </div>
        {hasHandleBtns ? (
          <div className="collection-detail-header-right">
            {/* <span className="status-text">{this.renderText()}</span> */}
            {this.renderBtn()}
          </div>
        ) : null}
      </div>
    );
  }
}
CollectionDetailHeader.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  collectionId: PropTypes.string.isRequired,
  uploadBtn: PropTypes.any,
};

export default CollectionDetailHeader;
