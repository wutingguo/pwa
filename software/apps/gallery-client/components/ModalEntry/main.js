import React from 'react';

import XConfirmModal from '@resource/components/modals/XConfirmModal';
import SignInModal from '@resource/components/modals/XEstoreSignInModal';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@apps/gallery-client/constants/modalTypes';

import BindEmailModal from './BindEmailModal';
import BindEmailModalCN from './BindEmailModalCN';
import ChooseImgModal from './ChooseImgModal';
import DownloadChooseImgModal from './DownloadChooseImgModal';
import DownloadGalleryModal from './DownloadGalleryModal';
import PaymentFailedModal from './PaymentFailedModal';
import ShopCartEmptyModal from './ShopCartEmptyModal';
// import ChooseImgModal from '@resource/components/modals/ChooseImgModal';
import TipsModal from './TipsModal';
import ViewFavoriteListModal from './ViewFavoriteListModal';
import XEstoreSignInModalCN from './XEstoreSignInModalCN';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const {
      boundGlobalActions,
      boundProjectActions,
      favoriteImageList,
      favorite,
      urls,
      collectionSetting,
    } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.BIND_EMAIL_MODAL: {
        const LoginModal = __isCN__ ? BindEmailModalCN : BindEmailModal;
        modalsJSX.push(
          <LoginModal data={modal} key={modal.get('id')} collectionSetting={collectionSetting} />
        );
        break;
      }
      case localModalTypes.VIEW_FAVORITE_LIST_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          favoriteImageList,
          boundGlobalActions,
          boundProjectActions,
          label_list: favorite.get('list_label_count')?.toJS(),
          label_img_list: favorite.get('label_img_list')?.toJS(),
        };
        const newProps = { ...that.props, ...props }
        modalsJSX.push(<ViewFavoriteListModal {...newProps} />);
        break;
      }
      case localModalTypes.SIGN_IN_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          collectionSetting,
        };
        const EstoreSignInModal = __isCN__ ? XEstoreSignInModalCN : SignInModal;
        modalsJSX.push(<EstoreSignInModal {...props} />);
        break;
      }
      case localModalTypes.PAYMENT_FAILED_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<PaymentFailedModal {...props} />);
        break;
      }
      case localModalTypes.SHOP_CART_EMPTY_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ShopCartEmptyModal {...props} />);
        break;
      }
      case localModalTypes.DOWNLOAD_GALLERY_MODAL: {
        // escapeClose: true,
        // isShown: true,
        // initialStep,
        // email,
        // img_name,
        // enc_image_uid,
        // collectionId,
        // collection_uid: collectionUid,
        // set_id: set_uid,
        // galleryBaseUrl: urls.get('galleryBaseUrl'),
        // downloadType: download_type,
        // downloadName: null,
        // downloadUrl: null,
        // lastGeneratedTime: null,
        // setsAndResolution: null,
        // onClosed: () => hideModal(DOWNLOAD_GALLERY_MODAL)
        // console.log('modal', modal.toJS());
        // const
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<DownloadGalleryModal {...props} />);
        break;
      }
      case localModalTypes.CONFIRM_MODAL: {
        modalsJSX.push(<XConfirmModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.TIPS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<TipsModal {...props} />);
        break;
      }
      case localModalTypes.CHOOSE_IMG_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ChooseImgModal {...props} />);
        break;
      }
      case localModalTypes.DOWNLOAD_CHOOSE_IMG_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<DownloadChooseImgModal {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
