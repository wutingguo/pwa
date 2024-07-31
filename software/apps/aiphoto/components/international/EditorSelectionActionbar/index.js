import React, { Fragment } from 'react';
import Tooltip from 'rc-tooltip';
import classnames from 'classnames';
import { XPureComponent, XIcon, XCheckBox } from '@common/components';
import main from './handle/main';
import { optionsConfig } from './handle/config';
import './index.scss';

class EditorSelectionActionbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.onClickView = this.onClickView.bind(this);
    this.onClickSelectAllImg = this.onClickSelectAllImg.bind(this);
    this.onClickClearSelectImg = this.onClickClearSelectImg.bind(this);
  }

  onClickView = () => {
    // const { boundProjectActions, selectedImgCount } = this.props;
    // const { showImageViewer } = boundProjectActions;
    // showImageViewer();
  };

  onClickSelectAllImg = () => {
    const {
      boundGlobalActions: { addNotification },
      collectionDetail
    } = this.props;
    const allImgCount = collectionDetail.getIn(['photos', 'allImgCount']);
    if (allImgCount < 1) {
      addNotification({
        message: t('NOT_SELECT_PHOTOS'),
        level: 'success',
        autoDismiss: 2
      });
      return false;
    }

    const { boundProjectActions } = this.props;
    const { handleSelectAllImg } = boundProjectActions;

    handleSelectAllImg();
  };

  onClickClearSelectImg = selectedImgCount => {
    // if (selectedImgCount < 1) return false;
    const { boundProjectActions } = this.props;
    const { handleClearSelectImg } = boundProjectActions;

    handleClearSelectImg();
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

  onClick = (actionType, selectedImgCount, imageList) => {
    if (imageList.size < 1 || (selectedImgCount < 1 && actionType !== 'editImageViewer')) {
      const {
        boundGlobalActions: { addNotification }
      } = this.props;
      addNotification({
        message: t('NOT_SELECT_PHOTOS'),
        level: 'success',
        autoDismiss: 2
      });
      return false;
    }
    const action = main[actionType].bind(this);
    action();
  };

  iconCls = (actionType, selectedImgCount) => {
    return classnames('editor-selection-icon-wrapper', {
      'no-select': !selectedImgCount
    });
  };

  checkHide = ({ checked }) => {
    const { boundProjectActions: { updateCollectionHideRetoucher, handleClearSelectImg } } = this.props;
    handleClearSelectImg();
    const eventName = checked ? 'AiPhotosCollection_Click_CheckHideRetouched' : 'AiPhotosCollection_Click_UncheckHideRetouched'
    window.logEvent.addPageEvent({
      name: eventName
    });
    updateCollectionHideRetoucher(checked)
  }

  render() {
    const { selectedImgCount, collectionStatus, imageList, collectionDetail } = this.props;
    const wrapperCls = classnames('editor-selection-action-bar', {
      'no-select': !selectedImgCount
    });
    const isOriginal = collectionDetail.get('is_original');
    const checkboxProps = {
      className: 'hide-retoucher-checkbox theme-1',
      text: t('HIDE_RETOUCHER'),
      onClicked: this.checkHide,
      checked: collectionDetail.get('hideRetoucher')
    };

    return (
      <div className={wrapperCls}>
        <div className="left">
          {selectedImgCount > 0 && (
            <span className="editor-selected-count">
              {selectedImgCount} {t('SELECTED')}
            </span>
          )}
          <span className="editor-selected-all" onClick={() => this.onClickSelectAllImg()}>
            {t('SELECT_ALL')}{' '}
          </span>
          {selectedImgCount > 0 && (
            <span className="editor-selected-clear" onClick={() => this.onClickClearSelectImg()}>
              {t('CLEAR_SELECTION')}{' '}
            </span>
          )}
          {!!isOriginal && <XCheckBox {...checkboxProps} />}
        </div>
        <div>
          {optionsConfig.map((item, index) => {
            const { tooltip, unfold, actionType, logEventName } = item;

            if (actionType === 'onDelete' && (collectionStatus === 1 || collectionStatus === 2)) {
              return null;
            }

            return unfold ? (
              <span
                className={this.iconCls(actionType, selectedImgCount)}
                onClick={() => {
                  if (logEventName) {
                    window.logEvent.addPageEvent({
                      name: logEventName
                    });
                  }
                  this.onClick(actionType, selectedImgCount, imageList);
                }}
              >
                {tooltip}
              </span>
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

export default EditorSelectionActionbar;
