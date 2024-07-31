import classnames from 'classnames';
import Tooltip from 'rc-tooltip';
import React, { Fragment } from 'react';

import { XDropdown, XIcon, XPureComponent } from '@common/components';

import { getWatermarkLoading } from '@apps/gallery/utils/mapStateHelper';

import { optionsConfig } from './handle/config';
import main from './handle/main';

import './index.scss';

class EditorSelectionActionbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.onClickClearSelectVideo = this.onClickClearSelectVideo.bind(this);
  }

  onClickClearSelectVideo = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.handleSelectionVideo();
  };

  getTitle = text => {
    const { selectedImgCount } = this.props;
    const title = selectedImgCount > 1 ? t('MULTI_PHOTO_DISABLED_TIP') : text;
    return title;
  };

  getRemmendStatus = (recommend = 1) => {
    const { collectionDetail } = this.props;
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const isCanRecommendList = selectedImgList.filter(i => !i.get('recommend') === !!recommend);
    return isCanRecommendList.size > 0 ? undefined : 'disable';
  };

  render() {
    const { selectedImgCount, setCount, collectionDetail } = this.props;
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const selectedVideo = collectionDetail.getIn(['gallery_video_info', 'isSelectVideo']);

    const iconStatus = selectedImgCount > 1 ? 'disable' : '';
    const wrapperCls = classnames({
      'editor-selection-action-bar': selectedVideo,
      'editor-selection-action-bar-no-select': !selectedVideo,
    });

    return (
      <div className={wrapperCls}>
        <div>
          <span className="editor-selected-count">1 {t('SELECTED')}</span>
          {/* <span className="editor-selected-all" onClick={this.onClickSelectAllImg}>
            {t('SELECT_ALL')}{' '}
          </span> */}
          <span className="editor-selected-clear-video" onClick={this.onClickClearSelectVideo}>
            {t('CLEAR_SELECTION')}{' '}
          </span>
        </div>
        <div>
          {optionsConfig.map((item, index) => {
            const { iconType, tooltip, multiDisable, unfold, actionType } = item;
            const overlay = multiDisable ? this.getTitle(tooltip) : tooltip;
            let status = multiDisable ? iconStatus : undefined;
            const onClick = main[actionType].bind(this);
            return unfold ? (
              <Tooltip key={index} placement="top" overlay={overlay}>
                <span className="editor-selection-icon-wrapper">
                  <XIcon type={iconType} status={status} onClick={onClick} />
                </span>
              </Tooltip>
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

export default EditorSelectionActionbar;
