import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { XPureComponent, XDropdown, XIcon } from '@common/components';
import { EDIT_MODAL, COPY_LIST_MODAL, BASE_MODAL } from '@apps/gallery/constants/modalTypes';
import EditFavoriteModalCont from './EditFavoriteModalCont';
import { getPropertyValue } from '@apps/gallery/utils/helper';
import { getUrl } from '@resource/lib/saas/image';
import { SAAS_DOWNLOAD_CSV_FILE, SAAS_DOWNLOAD_CSV_FILE_CN } from '@resource/lib/constants/apiUrl';
import { getDropdownList } from './config';
import '../index.scss';

class FavoriteAction extends XPureComponent {
  // 下载客人的 .CSV 文件
  handleExport = async (hasPhoto= false) => {
    const {
      match,
      urls,
      item,
      updateExportRecord,
      alreadyExportModal,
      boundGlobalActions
    } = this.props;
    const {
      params: { id: collection_uid }
    } = match;
    const guest_uid = getPropertyValue(item, 'guest_uid');
    const favorite_uid = getPropertyValue(item, 'favorite_uid');
    const urlParams = {
      guest_uid,
      collection_uid,
      favorite_uid
    };
    const { photos = 0 } = item;
    if (photos < 1) {
      boundGlobalActions.addNotification({
        message: t('FAVORITE_NO_PHOTO'),
        level: 'success',
        autoDismiss: 2
      });
      return false;
    }
    // eslint-disable-next-line no-debugger
    debugger
    if (__isCN__) {
      urlParams.languageCode = 'zh';
      urlParams.countryCode = 'CN';
    }
    if (hasPhoto) {
      const { data: hasExportRecord } = await updateExportRecord(favorite_uid);
      if (hasExportRecord) {
        const { expired_time, request_uuid } = hasExportRecord;
        const currentTimestamp = new Date().getTime();
        if (currentTimestamp < expired_time) {
          alreadyExportModal(request_uuid, () => this.exportAgainByNewWay(favorite_uid));
          return;
        }
      }
      this.exportAgainByNewWay(favorite_uid);
      window.logEvent.addPageEvent({
        name: 'GalleryActivities_Click_DownloadPhotos'
      });
      return;
    }
    window.logEvent.addPageEvent({
      name: 'GalleryActivities_Click_ExportCSV'
    });
    const fetchUrl = __isCN__ ? SAAS_DOWNLOAD_CSV_FILE_CN : SAAS_DOWNLOAD_CSV_FILE;
    const url = getUrl(fetchUrl, urlParams);
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    window.location.href = _.template(url)({ galleryBaseUrl });
  };
  exportAgainByNewWay = async favorite_uid => {
    const { boundProjectActions } = this.props;
    const windowReference = window.open();
    const res = await boundProjectActions.getFavoritePackage(favorite_uid);
    if (res.ret_code === 200000) {
      windowReference.location = `/software/gallery/download?uid=${res.data}`;
    }
  };
  // 显示复制list弹框
  handleShowCopyList = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryActivities_Click_LRCopyList'
    });

    const {
      boundGlobalActions: { showModal },
      item
    } = this.props;
    const image_names = getPropertyValue(item, 'image_names');
    showModal(COPY_LIST_MODAL, { names: image_names });
  };
  // 预览 gallery
  handleViewGallery = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryActivities_Click_ViewInGallery'
    });

    const { collectionPreviewUrl } = this.props;
    window.open(collectionPreviewUrl);
  };
  // 显示复制 collection 弹框
  handleCopyCollection = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryActivities_Click_Copy'
    });

    const { history, item, boundGlobalActions, boundProjectActions } = this.props;
    const data = {
      title: t('COPY_TO_NEW_COLLECTION'),
      message: t('COLLECTION_NAME'),
      requiredTip: t('CREATE_COLLECTION_REQUIRED_TIP'),
      illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
      handleSave: value => {
        const favorite_uid = getPropertyValue(item, 'favorite_uid');
        boundProjectActions
          .copyToCollection({
            bodyParams: {
              collection_name: value,
              favorite_uid
            },
            showLoading: boundGlobalActions.showGlobalLoading,
            hideLoading: boundGlobalActions.hideGlobalLoading
          })
          .then(res => {
            boundGlobalActions.hideModal(EDIT_MODAL);
            if (res.data) {
              const { enc_collection_uid } = res.data;
              history.push(`/software/gallery/collection/${enc_collection_uid}/photos`);
            }
          });
      }
    };

    boundGlobalActions.showModal(EDIT_MODAL, data);
  };
  // 显示编辑弹框
  showEditModal = () => {
    const {
      boundGlobalActions: { showModal },
      item
    } = this.props;
    const data = {
      email: getPropertyValue(item, 'email'),
      phone: getPropertyValue(item, 'phone'),
      favorite_name: getPropertyValue(item, 'favorite_name')
    };
    showModal(BASE_MODAL, {
      modalProps: {
        title: t('EDIT_FAVORITE'),
        footer: null,
        renderChildren: () => <EditFavoriteModalCont data={data} />
      }
    });
  };
  render() {
    const { className, item, type } = this.props;
    const props = {
      customClass: 'favorite-dropdown-wrapper',
      label: '',
      arrow: 'right',
      dropdownList: getDropdownList({
        type,
        exportFile: () => this.handleExport(),
        showCopyList: this.handleShowCopyList,
        viewGallery: this.handleViewGallery,
        copyCollection: this.handleCopyCollection,
        exportFilePhoto: () => this.handleExport(true)
      }),
      renderLable: () => <XIcon className="favorite-more-icon" type="more-1" />
    };
    const wrapperCls = classnames({ [className]: !!className });
    return (
      <div className={wrapperCls}>
        <XIcon
          className="favorite-edit-icon"
          type="rename"
          onClick={() => this.showEditModal(item)}
        />
        <XDropdown {...props} />
      </div>
    );
  }
}
export default FavoriteAction;
