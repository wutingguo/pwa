import classnames from 'classnames';
import Tooltip from 'rc-tooltip';
import React, { Fragment } from 'react';

import { XDropdown, XIcon, XPureComponent } from '@common/components';

import { getWatermarkLoading } from '@apps/gallery/utils/mapStateHelper';

import { optionsConfig } from './handle/config';
import main from './handle/main';
import { applyOriginalImg } from './servers';

import './index.scss';

class EditorSelectionActionbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.onClickView = this.onClickView.bind(this);
    this.onClickSelectAllImg = this.onClickSelectAllImg.bind(this);
    this.onClickClearSelectImg = this.onClickClearSelectImg.bind(this);
  }

  onClickView = () => {
    const { boundProjectActions, selectedImgCount, collectionDetail } = this.props;
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);

    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_View',
      PhotoCount: selectedImgCount,
    });

    boundProjectActions.showImageViewer({
      imageViewerDefaultId: selectedImgList.getIn([0, 'enc_image_uid']),
    });
    if (__isCN__) {
      boundProjectActions.handleClearSelectImg();
    }
  };

  onClickSelectAllImg = () => {
    const { boundProjectActions } = this.props;
    const { handleSelectAllImg } = boundProjectActions;
    const watermarkLoading = getWatermarkLoading(this.props, 'selectAll');
    if (watermarkLoading) {
      return false;
    }

    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_SelectAll',
    });

    handleSelectAllImg();
  };

  onClickClearSelectImg = () => {
    const { boundProjectActions } = this.props;
    const { handleClearSelectImg } = boundProjectActions;

    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_CancelSelection',
    });

    handleClearSelectImg();
  };

  getTitle = text => {
    const { selectedImgCount } = this.props;
    const title = selectedImgCount > 1 ? t('MULTI_PHOTO_DISABLED_TIP') : text;
    return title;
  };

  renderOptionItem = item => {
    const { selectedImgCount } = this.props;
    const iconStatus = selectedImgCount > 1 ? 'disable' : '';

    const { iconType, label, unfold, multiDisable, action, actionType } = item;
    let status = multiDisable ? iconStatus : undefined;
    return !unfold ? (
      <li key={iconType}>
        <a onClick={action} className={status ? `action-${status}` : ''}>
          <XIcon
            type={iconType}
            status={status}
            iconWidth={14}
            iconHeight={14}
            title={label}
            text={label}
          />
        </a>
      </li>
    ) : null;
  };

  // 下拉参数
  getDropdownProps = () => {
    const dropdownList = optionsConfig.map(config => {
      config.action = main[config.actionType] ? main[config.actionType].bind(this) : () => {};
      config.label = config.tooltip;
      return config;
    });
    return {
      label: '',
      arrow: 'right',
      dropdownList,
      renderLable: label => (
        <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
      ),
      renderOptionItem: this.renderOptionItem,
      customClass: 'editor-selection-action-bar-dropdown',
    };
  };

  applyOrigin = status => {
    const { collectionDetail, urls, boundProjectActions, getCollectionDetail } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const collectionUid = collectionDetail.getIn(['collection_uid']);
    const encUid = collectionDetail.get('enc_collection_uid');
    const setUid = collectionDetail.getIn(['currentSetUid']);
    const selectImgLists = selectedImgList.reduce((res, item) => {
      if (item.get('correct_status') === 2 && item.get('enc_image_uid')) {
        res.push(item.get('enc_image_uid'));
      }
      return res;
    }, []);
    applyOriginalImg(galleryBaseUrl, {
      collection_uid: collectionUid,
      set_uid: setUid,
      enc_image_list: selectImgLists,
      apply_original_img: status, // 0-不用原片，1-使用原片
    }).then(() => {
      getCollectionDetail(encUid);
    });
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
    const isShowApplyOrigin = selectedImgList.filter(item => item.get('correct_status') === 2);
    const isShowApplyCorrect = isShowApplyOrigin.find(
      item => item.get('apply_original_img') === 1 && item.get('enc_corrected_image_uid')
    );
    const iconStatus = selectedImgCount > 1 ? 'disable' : '';
    const wrapperCls = classnames({
      'editor-selection-action-bar': !!selectedImgCount,
      'editor-selection-action-bar-no-select': !selectedImgCount,
    });

    const applyInfo = isShowApplyCorrect
      ? {
          overlay: t('APPLY_ORIGIN_IMG', '应用修图'),
          icon: 'apply-correct',
          status: 0,
        }
      : {
          overlay: t('APPLY_ORIGIN_IMG', '应用原图'),
          icon: 'apply-origin',
          status: 1,
        };

    const applyFn = () => (
      <Tooltip placement="top" overlay={applyInfo.overlay}>
        <span className="editor-selection-icon-wrapper">
          <XIcon type={applyInfo.icon} onClick={() => this.applyOrigin(applyInfo.status)} />
        </span>
      </Tooltip>
    );

    return (
      <div className={wrapperCls}>
        <div>
          <span className="editor-selected-count">
            {selectedImgCount} {t('SELECTED')}
          </span>
          <span className="editor-selected-all" onClick={this.onClickSelectAllImg}>
            {t('SELECT_ALL')}{' '}
          </span>
          <span className="editor-selected-clear" onClick={this.onClickClearSelectImg}>
            {t('CLEAR_SELECTION')}{' '}
          </span>
        </div>
        <div>
          {__isCN__ && !!isShowApplyOrigin.size && applyFn()}
          {optionsConfig.map((item, index) => {
            const { iconType, tooltip, multiDisable, unfold, actionType } = item;
            const overlay = multiDisable ? this.getTitle(tooltip) : tooltip;
            let status = multiDisable ? iconStatus : undefined;
            if (iconType === 'move-photo' || iconType === 'copy-photo') {
              status = setCount === 1 ? 'disable' : undefined;
            }
            if (iconType === 'to-recommend' || iconType === 'cancel-recommend') {
              status = this.getRemmendStatus(item.recommend);
            }
            const onClick =
              actionType === 'showImageViewer' ? this.onClickView : main[actionType].bind(this);
            return unfold ? (
              <Tooltip key={index} placement="top" overlay={overlay}>
                <span className="editor-selection-icon-wrapper">
                  <XIcon type={iconType} status={status} onClick={onClick} />
                </span>
              </Tooltip>
            ) : null;
          })}
          <XDropdown {...this.getDropdownProps()} />
        </div>
      </div>
    );
  }
}

export default EditorSelectionActionbar;
