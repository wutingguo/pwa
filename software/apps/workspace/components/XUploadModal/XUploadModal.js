import { isEqual, pick } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ToolTip from 'react-portal-tooltip';
import { uploadStatus } from '../../constants/strings';
import { getDegree } from '@resource/lib/utils/exif';
import { isAcceptFile } from '@resource/lib/utils/uploadFileCheck';
import XUploadMoreButton from '../XUploadMoreButton/index';
import XModal from '../XModal/index';
import XUploadItemList from './XUploadItemList';
import './XUploadModal.scss';

function formatFileName(fileName) {
  return fileName.replace(/[\&\/\_]+/g, '');
}

function checkLocalFileSizeAndType(file) {
  if (!file.isFromThirdparty) {
    const errorInfo = isAcceptFile(file);

    if (errorInfo.errorText) {
      return {
        errorText: errorInfo.errorText,
        isFatalError: !errorInfo.isAccept,
        status: uploadStatus.FAIL
      };
    }
  }
  return null;
}

function getNewUploadingImages(uploadingImages, oldUploadingImages) {
  if (!uploadingImages || !uploadingImages.length) return [];
  return uploadingImages
    .filter(o => {
      const isReadyInQueue = oldUploadingImages.some(k => k.file.guid === o.file.guid);
      return !isReadyInQueue;
    })
    .map(o => {
      const errorInfo = checkLocalFileSizeAndType(o.file);

      return Object.assign(
        {
          guid: o.file.guid,
          fileName: o.file.name,
          file: o.file,
          status: uploadStatus.PENDING,
          percent: 0,
          retryCount: 0
        },
        errorInfo
      );
    });
}

// function checkUploadAllComplete(uploadImages) {
//   const completeNum = uploadImages.filter(o => {
//     return o.status === uploadStatus.DONE;
//   }).length;

//   return uploadImages.length && completeNum === uploadImages.length;
// }

class XUploadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadImages: []
    };

    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onRetry = this.onRetry.bind(this);

    this.onCloseModal = this.onCloseModal.bind(this);
    this.setStateAsync = this.setStateAsync.bind(this);
  }

  async componentWillMount() {
    const { uploadImages } = this.state;
    // 过滤相同uid的，并且校验文件是否符合上传要求
    const newUploadingImages = getNewUploadingImages(this.props.uploadingImages, uploadImages);

    await this.setStateAsync({
      uploadImages: newUploadingImages
    });

    this.handleUploadingImages(newUploadingImages);
  }

  async componentWillReceiveProps(nextProps) {
    const { uploadImages } = this.state;

    if (!isEqual(this.props.uploadingImages, nextProps.uploadingImages)) {
      const newUploadingImages = getNewUploadingImages(nextProps.uploadingImages, uploadImages);

      await this.setStateAsync({
        uploadImages: uploadImages.concat(newUploadingImages)
      });

      this.handleUploadingImages(newUploadingImages);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { uploadImages } = nextState;

    const completeNum = uploadImages.filter(o => {
      return o.status === uploadStatus.DONE;
    }).length;
    const isUploadAllComplete = completeNum === uploadImages.length;

    if (isUploadAllComplete) {
      this.isUploading = false;
    }

    if (
      isUploadAllComplete &&
      (nextProps.needUploadNum <= 0 ||
        (nextProps.maxUploadNum !== Infinity && completeNum <= nextProps.maxUploadNum))
    ) {
      this.props.actions.onCloseModal(uploadImages);
    } else {
      this.isShowTip = true;
    }
  }

  async componentWillUnmount() {
    await this.setStateAsync({
      uploadImages: []
    });

    this.props.instance.reset();
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async onDeleteItem(fileGuid) {
    const { uploadImages } = this.state;
    const { instance, actions } = this.props;
    const { pendingPools, failedPools } = instance;
    const requestObj = pendingPools.concat(failedPools).find(obj => {
      return obj.file.guid === fileGuid;
    });

    if (requestObj) {
      instance.remove(requestObj);
    }

    actions.onCancelSingleFile(fileGuid);

    await this.setStateAsync({
      uploadImages: uploadImages.filter(obj => {
        return obj.guid !== fileGuid;
      })
    });
  }

  async onRetry(fileGuid) {
    const { instance } = this.props;
    const { failedPools } = instance;
    const requestObj = failedPools.find(obj => {
      return obj.file.guid === fileGuid;
    });
    if (requestObj) {
      instance.retry(requestObj);

      await this.setStateAsync({
        uploadImages: this.state.uploadImages.map(o => {
          if (o.guid === requestObj.file.guid) {
            return Object.assign({}, o, {
              retryCount: requestObj.retryCount + 1
            });
          }
          return o;
        })
      });
    }
  }

  onCloseModal() {
    const { actions, instance } = this.props;
    const { uploadImages } = this.state;

    const pendingAndProgressNum = uploadImages.filter(
      o => o.status === uploadStatus.PROGRESS || o.status === uploadStatus.PENDING
    ).length;

    if (!pendingAndProgressNum) {
      actions.onCloseModal(uploadImages);
    } else {
      actions.onShowConfirm({
        confirmMessage: t('IMAGE_NOT_UPLOAD_TO_CONTINUE'),
        onOkClick: () => {
          instance.reset();
          actions.onCancelAllFiles();
          actions.onCloseModal(uploadImages);
        },
        okButtonText: t('CANCEL_UPLOAD'),
        cancelButtonText: t('CONTINUE_UPLOAD')
      });
    }
  }

  handleUploadingImages(newUploadingImages) {
    this.isUploading = true;
    const { requestParams, uploadUrl, actions, instance } = this.props;
    const updateStatus = async (res, fileGuid) => {
      const { uploadImages } = this.state;

      await this.setStateAsync({
        uploadImages: uploadImages.map(o => {
          if (o.guid === fileGuid) {
            const newAttrs = {
              percent: res.percent,
              status: res.status
            };
            if (res.status === uploadStatus.FAIL) {
              newAttrs.errorText = res.errorText;
              newAttrs.isFatalError = !res.isAccept;
            }
            return Object.assign({}, o, newAttrs);
          }
          return o;
        })
      });
    };

    newUploadingImages.forEach(obj => {
      const { file } = obj;
      const { isFromThirdparty } = file;

      const fileName = formatFileName(obj.fileName);

      let data = Object.assign({}, requestParams, {
        filename: file,
        Filename: fileName
      });

      if (isFromThirdparty) {
        data = Object.assign({}, requestParams, {
          thirdpartyImageId: file.id,
          imageUrl: file.originalImageUrl,
          platform: file.platform,
          clientSource: 'PC',
          Filename: fileName
        });
      }

      instance.push({
        url: uploadUrl,
        data,
        file,
        authData: isFromThirdparty ? file : null,
        isFormData: !isFromThirdparty,
        success: async res => {
          const { img } = res.resultData;

          const newImageFile = {
            name: formatFileName(file.name),
            guid: file.guid,
            createTime: file.lastModified,
            uploadTime: Date.now(),
            usedCount: 0,
            totalSize: img.size,
            orientation: getDegree(img.exifOrientation),
            ...pick(img, ['shotTime', 'encImgId', 'width', 'height', 'thirdpartyImageId'])
          };

          actions.onUploadSuccess(newImageFile);

          await updateStatus(res, file.guid);
        },
        progress: async res => {
          await updateStatus(res, file.guid);
        },
        error: async res => {
          await updateStatus(res, file.guid);
        }
      });
    });
  }

  render() {
    const {
      isShown,
      needUploadNum,
      maxUploadNum,
      toolTipStyle,
      title,
      subTitle,
      actions
    } = this.props;
    const { uploadImages } = this.state;

    let completeNum = 0;
    let failedNum = 0;
    const incompleteUploadImages = [];
    uploadImages.forEach(obj => {
      if (obj.status === uploadStatus.DONE) {
        completeNum += 1;
      } else {
        incompleteUploadImages.push(obj);

        if (obj.status === uploadStatus.FAIL) {
          failedNum += 1;
        }
      }
    });

    const isShowToolTip = !this.isUploading && needUploadNum > 0 && this.isShowTip;

    const xmodalProps = {
      data: {
        title,
        className: 'x-upload-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose: this.onCloseModal
      }
    };

    return (
      <XModal {...xmodalProps}>
        <h4 className="sub-title">{subTitle}</h4>

        <div className="upload-list">
          <div className="list-head">
            <div className="list-row">
              <div className="column-file">{t('FILE')}</div>
              <div className="column-size">{t('UPLOADMODAL_SIZE')}</div>
              <div className="column-progress">{t('ITEMLIST_FILE_PROGRESS')}</div>
            </div>
          </div>

          <XUploadItemList
            needPlaceHolder={needUploadNum > 0}
            incompleteUploadImages={incompleteUploadImages}
            actions={{
              onDeleteItem: this.onDeleteItem,
              onRetry: this.onRetry,
              onShowHelp: actions.onShowHelp
            }}
          />
        </div>

        <div className="modal-foot">
          <div className="upload-summary">
            <span className="complete-num">
              {t('UPLOADMODAL_COMPLETE_COUNT', { n: completeNum })}
            </span>
            {failedNum ? (
              <span className="failed-num">{t('UPLOADMODAL_FILED_COUNT', { n: failedNum })}</span>
            ) : null}
          </div>

          {maxUploadNum > 1 ? (
            <div>
              <XUploadMoreButton
                actions={{
                  onAddImages: actions.onAddImages,
                  onClickAddPhoto: actions.onClickAddPhoto
                }}
              >
                <span id="toolTipParent" className="tooltip-parent" />
              </XUploadMoreButton>

              <ToolTip
                active={isShowToolTip}
                position="top"
                align="right"
                arrow="right"
                parent="#toolTipParent"
                style={toolTipStyle}
                tooltipTimeout={0}
              >
                {t('LESS_UPLOAD_PHOTOS', { needUploadNum })}
              </ToolTip>
            </div>
          ) : null}
        </div>
      </XModal>
    );
  }
}

XUploadModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  requestParams: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    albumId: PropTypes.number.isRequired,
    albumName: PropTypes.string.isRequired
  }).isRequired,
  uploadUrl: PropTypes.string.isRequired,
  uploadingImages: PropTypes.array.isRequired,
  actions: PropTypes.shape({
    onCloseModal: PropTypes.func.isRequired,
    onUploadSuccess: PropTypes.func.isRequired,
    onAddImages: PropTypes.func.isRequired,
    onShowConfirm: PropTypes.func.isRequired,
    onShowHelp: PropTypes.func,
    onUploadAllComplete: PropTypes.func
  }).isRequired,
  instance: PropTypes.object.isRequired,
  needUploadNum: PropTypes.number,
  maxUploadNum: PropTypes.number,
  title: PropTypes.string
};

XUploadModal.defaultProps = {
  needUploadNum: 0,
  maxUploadNum: Infinity,
  title: '图片上传',
  subTitle: '',
  toolTipStyle: {
    style: {
      boxShadow: '0 2px 4px 0 rgba(0,0,0,.13)',
      fontSize: 12,
      color: '#fff',
      backgroundColor: '#3a3a3a',
      padding: '4px 10px',
      borderRadius: 0,
      whiteSpace: 'nowrap',
      zIndex: 99999999999,
      lineHeight: '20px',
      transition: 'initial'
    },
    arrowStyle: {
      color: '#3a3a3a',
      borderColor: false,
      transition: 'initial'
    }
  }
};

export default XUploadModal;
