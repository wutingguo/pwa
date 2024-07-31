import React from 'react';
import { template, isEqual } from 'lodash';
import classnames from 'classnames';
import { XPureComponent, XDropdown, XIcon } from '@common/components';
import { submitGallery } from '@common/servers';
import Switch from '@apps/gallery/components/Switch';
import { getPropertyValue } from '@apps/gallery/utils/helper';
import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';
import * as modalTypes from '@resource/lib/constants/modalTypes';
import { getUrl } from '@resource/lib/saas/image';
import { SAAS_DOWNLOAD_CSV_FILE_CN } from '@resource/lib/constants/apiUrl';
import { saasProducts, packageListMapV2 } from '@resource/lib/constants/strings';
import { getDropdownList } from './config';
import '../index.scss';

class FavoriteAction extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalSwitch: false
    };
  }

  componentDidMount() {
    const { item } = this.props;
    this.setState({
      modalSwitch: !item.submit_status
    });
  }

  componentDidUpdate(preProps) {
    const { item } = this.props;
    const { item: preItem } = preProps;
    if (!isEqual(item, preItem)) {
      this.setState({
        modalSwitch: !item.submit_status
      });
    }
  }

  changeSwitch = status => {
    const { boundGlobalActions, item } = this.props;
    const { hideModal } = boundGlobalActions;
    this.setState(
      {
        modalSwitch: status
      },
      () => {
        hideModal(CONFIRM_MODAL);
        this.setModal(item);
      }
    );
  };

  renderModalMessage = () => {
    const { modalSwitch } = this.state;
    console.log('modalSwitch: ', modalSwitch);
    return (
      <div className="setModalMessage">
        <div className="message">若允许客户重新提交选片，可开启开关</div>
        <Switch onSwitch={() => this.changeSwitch(!modalSwitch)} checked={modalSwitch} />
      </div>
    );
  };
  setModal = item => {
    const { modalSwitch } = this.state;
    const { boundGlobalActions, urls, collectionDetail } = this.props;
    const { showModal, hideModal } = boundGlobalActions;
    showModal(CONFIRM_MODAL, {
      message: this.renderModalMessage(),
      close: () => hideModal(CONFIRM_MODAL),
      buttons: [
        {
          text: t('OK'),
          onClick: () => {
            const galleryBaseUrl = urls.get('galleryBaseUrl');
            const newStatus = modalSwitch ? 0 : 1;
            const params = {
              galleryBaseUrl,
              collection_uid: collectionDetail.get('enc_collection_uid'),
              guest_uid: item.guest_uid,
              submit_status: newStatus,
              content: [],
              is_client: true
            };
            submitGallery(params).then(() => {
              this.props.getAllFavoriteData();
            });
            hideModal(CONFIRM_MODAL);
          }
        }
      ]
    });
  };

  showUpdateModal = modalData => {
    const { boundGlobalActions, urls } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');
    const data = modalData || {
      message: (
        <div style={{ textAlign: 'center' }}>
          导出记录功能需选片标准版及以上版本方可使用
          <br /> 请升级您的版本以使用此功能。{' '}
        </div>
      ),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('UPGRADE'),
          className: 'pwa-btn',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'DesignerLabs_Click_Upgrade'
            });
            boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
              product_id: saasProducts.gallery,
              level: packageListMapV2.basic,
              cycle: 1,
              escapeClose: true,
              onClosed: () => {
                boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                boundGlobalActions.getMySubscription(saasBaseUrl);
              }
            });

            // this.props.history.push(`/software/checkout-plan`);
          }
        }
      ]
    };
    showConfirm(data);
  };

  exportAgainByNewWay = async favorite_uid => {
    const { boundProjectActions } = this.props;
    const windowReference = window.open();
    const res = await boundProjectActions.getFavoritePackage(favorite_uid);
    if (res.ret_code === 200000) {
      windowReference.location = `/software/gallery/download?uid=${res.data}`;
    }
  };

  // 下载客人的 .CSV 文件
  handleExport = async (hasPhoto = false) => {
    const {
      match,
      urls,
      item,
      boundGlobalActions,
      mySubscription,
      updateExportRecord,
      alreadyExportModal
    } = this.props;
    const galleryDesc = mySubscription
      .get('items')
      .find(sub => sub.get('product_id') === saasProducts.gallery);
    const isOrder = galleryDesc?.get('plan_level') > 10;
    const { photos = 0 } = item;
    if (photos < 1) {
      boundGlobalActions.addNotification({
        message: t('FAVORITE_NO_PHOTO'),
        level: 'success',
        autoDismiss: 2
      });
      return false;
    }
    if (!isOrder) {
      this.showUpdateModal();
      return;
    }

    window.logEvent.addPageEvent({
      name: hasPhoto
        ? 'GalleryFeedback_Click_ExportPhotosRecord'
        : 'GalleryFeedback_Click_ExportRecord'
    });

    const {
      params: { id: collection_uid }
    } = match;
    const guest_uid = getPropertyValue(item, 'guest_uid');
    const favorite_uid = getPropertyValue(item, 'favorite_uid');
    const urlParams = {
      guest_uid,
      collection_uid,
      favorite_uid,
      languageCode: 'zh',
      countryCode: 'CN'
    };

    if (hasPhoto) {
      const { data: hasExportRecord } = await updateExportRecord(favorite_uid);
      console.log('hasExportRecord: ', hasExportRecord);
      if (hasExportRecord) {
        const { expired_time, request_uuid } = hasExportRecord;
        const currentTimestamp = new Date().getTime();
        if (currentTimestamp < expired_time) {
          alreadyExportModal(request_uuid, () => this.exportAgainByNewWay(favorite_uid));
          return;
        }
      }
      this.exportAgainByNewWay(favorite_uid);
      return;
    }

    const fetchUrl = SAAS_DOWNLOAD_CSV_FILE_CN;
    const url = getUrl(fetchUrl, urlParams);
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    window.location.href = template(url)({ galleryBaseUrl });
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
        exportFilePhoto: () => this.handleExport(true)
      }),
      renderLable: () => (
        <div className="favorite-dropdown-icon">
          导出
          <XIcon type="dropdown" iconWidth={6} iconHeight={6} />
        </div>
      )
    };
    const wrapperCls = classnames({ [className]: !!className });
    return (
      <div className={wrapperCls}>
        <div className="setTable" onClick={() => this.setModal(item)}>
          设置
        </div>
        <XDropdown {...props} />
      </div>
    );
  }
}
export default FavoriteAction;
