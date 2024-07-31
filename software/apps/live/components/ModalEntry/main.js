import React from 'react';

import XUploadModal from '@resource/components/modals/XUploadModal';

import {
  AGAIN_PRINT_WATERMARK_MODAL,
  AI_PHOTO_STATE_CHECK,
  CAMERAMAN_MODAL,
  COMMON_MODAL,
  DAYLIMIT15_MODAL,
  DIFFERENT_MODAL,
  FORMULATE_MODAL,
  GENERATE_DOWNLOAD_LINK,
  IAMGE_MODAL,
  LIVE_CONFIRM_MODAL,
  LIVE_PACKAGE_DOWNLOAD,
  LIVE_SHARE_MODAL,
  MOVE_MODAL,
  STYLE_MODAL,
  UPLOAD_MODAL,
} from '@apps/live/constants/modalTypes';

import AgainPrintWatermarkModal from './AgainPrintWatermarkModal';
import AiPhotoStateCheck from './AiPhotoStateCheck';
import ConfirmModal from './ConfirmModal';
import DifferentModal from './DifferentModal';
import GenerateDownloadLink from './GenerateDownloadLink';
import ImageModal from './ImageModal';
import MoveCategoryModal from './MoveCategoryModal';
import CameramanModal from './cameramanModal';
import CommonModal from './commonModal';
import DayLimit15Modal from './dayLimit15Modal';
import FormulateModal from './formulateModal';
import { getUploadModalParams } from './getParams';
import LiveShareModal from './liveShareModal';
import PackageDownload from './packageDownload';
import StyleModal from './styleModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];
  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, urls, baseUrl, callMethod } = that.props;
    switch (modal.get('modalType')) {
      case COMMON_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<CommonModal {...props} />);
        break;
      }
      case LIVE_SHARE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<LiveShareModal {...props} />);
        break;
      }
      case UPLOAD_MODAL: {
        const uploadModalProps = getUploadModalParams(that, modal);
        modalsJSX.push(<XUploadModal {...uploadModalProps} key={modal.get('id')} />);
        break;
      }
      case LIVE_PACKAGE_DOWNLOAD: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<PackageDownload {...props} />);
        break;
      }
      // CN的生成下载链接
      case GENERATE_DOWNLOAD_LINK: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<GenerateDownloadLink {...props} />);
        break;
      }
      case FORMULATE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          baseUrl,
        };
        modalsJSX.push(<FormulateModal {...props} />);
        break;
      }
      case STYLE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          baseUrl,
          callMethod,
        };
        modalsJSX.push(<StyleModal {...props} />);
        break;
      }
      case CAMERAMAN_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<CameramanModal {...props} />);
        break;
      }

      case IAMGE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<ImageModal {...props} />);
        break;
      }
      case DIFFERENT_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<DifferentModal {...props} />);
        break;
      }
      case DAYLIMIT15_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<DayLimit15Modal {...props} />);
        break;
      }
      case AI_PHOTO_STATE_CHECK: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AiPhotoStateCheck {...props} />);
        break;
      }
      // 新增移动照片全局弹窗
      case MOVE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<MoveCategoryModal {...props} />);
        break;
      }
      case AGAIN_PRINT_WATERMARK_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AgainPrintWatermarkModal {...props} />);
        break;
      }
      case LIVE_CONFIRM_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<ConfirmModal {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
