import { isEqual } from 'lodash';
import React from 'react';
import { uploadStatus } from '../../constants/strings';
import initUploadPool from '@resource/lib/utils/uploadPool';
import urlEncode from '@resource/lib/utils/urlEncode';
import XUploadModal from './XUploadModal';
 
const trackableUploadModal = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      const { actions, uploadingImages } = this.props;

      // 开始上传图片埋点
      logEvent.addPageEvent({
        name: 'StartUploadPhotos',
        uploadingImages: uploadingImages.length
      });

      const originalInstance = initUploadPool(4);
      const originalPushMethod = originalInstance.push;
      const newPushMethod = dataObj => {
        const file = dataObj.data.filename;
        const isFromThirdparty = Boolean(!file);
        const source = isFromThirdparty ? dataObj.data.Filename : 'local';

        let startMetaArr = [];

        const fileSize = !isFromThirdparty
          ? `${Math.round(file.size / 1024)}kb`
          : '';

        if (!isFromThirdparty) {
          startMetaArr = [Date.now(), file.name, fileSize, source];
        } else {
          startMetaArr = [Date.now(), source];
        }

        // 图片开始上传时的埋点.
        logEvent.addPageEvent({
          name: 'StartUploadEachPhoto',
          metainfo: startMetaArr.join(',')
        });

        const success = res => {
          let successMetaArr = [];

          if (!isFromThirdparty) {
            successMetaArr = [Date.now(), file.name, fileSize, res.cost];
          } else {
            successMetaArr = [Date.now(), res.cost];
          }


          logEvent.addPageEvent({
            name: 'CompleteUploadEachPhoto',
            metainfo: successMetaArr.join(',')
          });

          dataObj.success(res);
        };

        const error = res => {
          let errorMetaArr = [];

          if (!isFromThirdparty) {
            errorMetaArr = [Date.now(), file.name, fileSize, res.cost];
          } else {
            errorMetaArr = [Date.now(), res.cost];
          }

          logEvent.addPageEvent({
            name: 'FaildedUploadEachPhoto',
            metainfo: errorMetaArr.join(',')
          });

          dataObj.error(res);
        };

        const newData = Object.assign({}, dataObj, {
          success,
          error,
          data: isFromThirdparty ? urlEncode(dataObj.data) : dataObj.data
        });

        originalPushMethod(newData);
      };

      this.onCloseModal = this.onCloseModal.bind(this);

      this.state = {
        instance: Object.assign({}, originalInstance, {
          push: newPushMethod
        }),
        actions: Object.assign({}, actions, {
          onCloseModal: this.onCloseModal,
          onClickAddPhoto: () => {
            this.addTimer && clearTimeout(this.addTimer);
            this.addTimer = setTimeout(() => {
              // logEvent.addPageEvent({
              //   name: 'AddMorePhotos'
              // });
              // 点击上传更多 埋点
              logEvent.addPageEvent({ name: 'YX_PC_StickerManager_Click_AddMoreSticker' }, true);
            }, 100);
          },
          onCancelSingleFile: () => {
            // logEvent.addPageEvent({
            //   name: 'CancelSingleFile'
            // });
            // 取消单个文件上传 埋点
            logEvent.addPageEvent({name: 'YX_PC_StickerManager_Click_CancelSingleUpload'}, true);
          },
          onCancelAllFiles: () => {
            logEvent.addPageEvent({
              name: 'CancelAllFilesByXClicked'
            });
          }
        })
      };
    }

    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props.uploadingImages, nextProps.uploadingImages)) {
        logEvent.addPageEvent({
          name: 'StartUploadPhotos',
          uploadingImages: nextProps.uploadingImages.length
        });
      }
    }

    onCloseModal(uploadImages) {
      let completeNum = 0;
      let failedNum = 0;

      uploadImages.forEach(obj => {
        if (obj.status === uploadStatus.DONE) {
          completeNum += 1;
        } else if (obj.status === uploadStatus.FAIL) {
          failedNum += 1;
        }
      });

      const { actions, needUploadNum } = this.props;
      // 关闭弹框 埋点
      logEvent.addPageEvent({name: 'YX_PC_StickerManager_Click_CloseStickerPopup'}, true);

      logEvent.addPageEvent({
        name: 'PhotosUploadComplete',
        completeNum,
        failedNum,
        hasUploadingImg: needUploadNum > 0
      });

      logEvent.addPageEvent({
        name: 'CloseMonitor'
      });

      actions.onCloseModal(uploadImages);
    }

    render() {
      const { instance, actions } = this.state;

      return (
        <Component {...this.props} instance={instance} actions={actions} />
      );
    }
  };
};

export default trackableUploadModal(XUploadModal);
