import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { XPureComponent, XIcon } from '@common/components';
import './index.scss';

class CollectionDetailHeader extends XPureComponent {
  onView = () => {
    const { onView } = this.props;
    onView && onView();
  };

  onShare = () => {
    const { handleShare } = this.props;
    handleShare && handleShare();
  };

  onDownload = () => {
    const { handleDownload } = this.props;
    handleDownload && handleDownload();
  };

  onPublish = () => {
    const { handlePublish } = this.props;
    handlePublish && handlePublish();
  };

  onContinue = () => {
    const { history, collectionId, handleContinue } = this.props;
    const { push } = history;

    handleContinue && handleContinue();
    push(`/software/slide-show/collection/${collectionId}/publish`);
  };

  onRevert = () => {
    const { handleRevert } = this.props;
    handleRevert && handleRevert();
  };

  render() {
    const {
      className,
      title,
      actionBtn,
      hasHandleBtns = true,
      showDownload = false,
      showPublish = false,
      showView = true,
      showShare = true,
      showContinue = true,
      showPostCard = true,
      showRevert = false,

      disableShare = false,
      disableDownload = false,
      disablePublish = false,
      publishText = t('PUBLISH'),

      isSegmentDataReady
    } = this.props;
    const wrapperCls = classnames('slideshow-collection-detail-header-wrapper', {
      [className]: !!className
    });
    // const postCardChangeButtonProps = {
    //   transitionModes,
    //   boundProjectActions,
    //   transition_mode: currentSegment.getIn(['setting', 'transition_mode']),
    //   transition_duration: currentSegment.getIn(['setting', 'transition_duration'])
    // };

    return (
      <div className={wrapperCls}>
        <div className="collection-detail-header-left">{title}</div>
        {hasHandleBtns ? (
          <div className="collection-detail-header-right">
            {actionBtn}
            {showView && (
              <XIcon
                className="collection-detail-header-view"
                type="view"
                theme="black"
                text={t('PREVIEW')}
                onClick={this.onView}
                status={isSegmentDataReady ? '' : 'disable'}
              />
            )}

            {/* 分享 */}
            {showShare && (
              <XIcon
                className="collection-detail-header-share"
                type="share"
                theme="black"
                text={t('SHARE')}
                status={disableShare}
                onClick={this.onShare}
              />
            )}

            {/* 分享 */}
            {showDownload && (
              <XIcon
                className="collection-detail-header-download"
                type="slide-show-download"
                theme="black"
                text={t('DOWNLOAD')}
                status={disableDownload}
                onClick={this.onDownload}
              />
            )}

            {/* 分享 */}
            {showPublish && (
              <XIcon
                className="collection-detail-header-publish"
                type="publish"
                theme="black"
                status={disablePublish}
                text={publishText}
                onClick={this.onPublish}
              />
            )}

            {showContinue && (
              <XIcon
                type="continue"
                theme="black"
                text={t('CONTINUE')}
                onClick={this.onContinue}
                status={isSegmentDataReady ? '' : 'disable'}
              />
            )}

            {showRevert && (
              <div className="revert-btn-wrapper" onClick={this.onRevert}>
                <span className="revert-btn-text">{t('SLIDESHOW_REVERT_EDITS')}</span>
                <XIcon type="revert" />
              </div>
            )}
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
  title: PropTypes.any,
  actionBtn: PropTypes.any
};

export default CollectionDetailHeader;
