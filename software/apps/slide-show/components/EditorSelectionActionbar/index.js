import React, { Fragment } from 'react';
import Tooltip  from 'rc-tooltip';
import classnames from 'classnames';
import { XPureComponent, XIcon, XDropdown } from '@common/components';
import main from './handle/main';
import {optionsConfig} from './handle/config';
import './index.scss';

class EditorSelectionActionbar extends XPureComponent {

  constructor(props) {
    super(props);
    this.onClickView = this.onClickView.bind(this);
    this.onClickSelectAllImg = this.onClickSelectAllImg.bind(this);
    this.onClickClearSelectImg = this.onClickClearSelectImg.bind(this);
  }

  onClickView = () => {
    const { boundProjectActions, selectedImgCount } = this.props;

    window.logEvent.addPageEvent({
      name: 'SlideShowPhotos_Click_View',
      PhotoCount: selectedImgCount
    });

    const {showImageViewer} = boundProjectActions;
    showImageViewer();
  }

  onClickSelectAllImg = () => {
    window.logEvent.addPageEvent({
      name: 'SlideshowsChoosePhotos_Click_SelectAll'
    });
    
    const { boundProjectActions } = this.props;
    const {handleSelectAllImg} = boundProjectActions;

    window.logEvent.addPageEvent({
      name: 'SlideShowPhotos_Click_SelectAll'
    });
    
    handleSelectAllImg();
  }

  onClickClearSelectImg = () => {
    window.logEvent.addPageEvent({
      name: 'SlideshowsChoosePhotos_Click_CancelSelection'
    });

    const { boundProjectActions } = this.props;
    const {handleClearSelectImg} = boundProjectActions;

    window.logEvent.addPageEvent({
      name: 'SlideShowPhotos_Click_CancelSelection'
    });
    
    handleClearSelectImg();
  }

  getTitle = (text) => {
    const {selectedImgCount} = this.props;
    const title = selectedImgCount > 1 ? t('MULTI_PHOTO_DISABLED_TIP') : text;
    return title;
  }
  
  render() {
    const { selectedImgCount, setCount } = this.props;
    const iconStatus = selectedImgCount > 1 ? 'disable' : '';
    const wrapperCls = classnames({
      'slide-show-editor-selection-action-bar': !!selectedImgCount,
      'slide-show-editor-selection-action-bar-no-select': !selectedImgCount
    });

    return (
      <div className={wrapperCls}>
        <div>
          <span className="editor-selected-count">{selectedImgCount}  {t('SELECTED')}</span>
          <span className="editor-selected-all" onClick={this.onClickSelectAllImg}>{t('SELECT_ALL')} </span>
          <span className="editor-selected-clear" onClick={this.onClickClearSelectImg}>{t('CLEAR_SELECTION')} </span>
        </div>
        <div>
          {
            optionsConfig.map((item, index) => {
              const {iconType, tooltip, multiDisable, unfold, actionType} = item;
              const overlay = multiDisable ? this.getTitle(tooltip) : tooltip;
              let status = multiDisable ? iconStatus : undefined;
              if (iconType === 'move-photo' || iconType === 'copy-photo') {
                status = setCount === 1 ? 'disable' : undefined;
              }
              const onClick = actionType === 'showImageViewer' ? this.onClickView : main[actionType].bind(this);
              return unfold ? (
                <Tooltip key={index} placement="top" overlay={overlay} >
                  <span className="editor-selection-icon-wrapper">
                    <XIcon type={iconType} status={status} onClick={onClick} />
                  </span>
                </Tooltip>
              ) : null
            })
          }
        </div>
      </div>
    );
  }
}

export default EditorSelectionActionbar;
