import { fromJS } from 'immutable';
import React from 'react';

import XEditor from '@resource/components/XEditor';
import XConfirmModal from '@resource/components/modals/XConfirmModal';
import SignInModal from '@resource/components/modals/XEstoreSignInModal';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@apps/gallery-client-mobile/constants/modalTypes';

import BindEmailModal from './BindEmailModal';
import BindEmailModalCN from './BindEmailModalCN';
import ChooseImgModal from './ChooseImgModal';
import DownloadChooseImgModal from './DownloadChooseImgModal';
import DownloadGalleryModal from './DownloadGalleryModal';
import OutLoginModal from './OutLoginModal';
import PaymentModal from './PaymentModal';
import TipsModal from './TipsModal';
import ViewFavoriteListModal from './ViewFavoriteListModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, collectionSetting } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.BIND_EMAIL_MODAL: {
        const LoginModal = __isCN__ ? BindEmailModalCN : BindEmailModal;
        modalsJSX.push(
          <LoginModal data={modal} key={modal.get('id')} collectionSetting={collectionSetting} />
        );
        break;
      }
      case localModalTypes.VIEW_FAVORITE_LIST_MODAL: {
        const { favoriteImageList, coverInfo, sets, favorite, favoriteSetting, qs } = that.props;
        const currentSetIndex = modal.get('currentSetIndex');
        const cnExtraProps = modal.get('cnExtraProps') || fromJS({});
        const set = sets.get(currentSetIndex);
        const imgs = modal.get('images');

        // 真实的需要从后台接口中获取到所有添加到收藏夹的图片
        const images = imgs.get(set.get('set_uid'));
        const setFavoriteImageList = favoriteImageList
          .map(m => {
            const item = images.find(k => k.get('enc_image_uid') === m.get('enc_image_uid'));

            if (!item) {
              return item;
            }

            return item.merge({
              comment: m.get('comment'),
            });
          })
          .filter(v => !!v);
        const props = {
          data: __isCN__
            ? modal.merge(cnExtraProps)
            : modal.merge({
                images: setFavoriteImageList,
                cover: coverInfo,
                set,
                favorite,
                favoriteSetting,
              }),
          key: modal.get('id'),
          favoriteImageList,
          boundGlobalActions,
          boundProjectActions,
          qs,
          label_list: favorite.get('list_label_count')?.toJS(),
          label_img_list: favorite.get('label_img_list')?.toJS(),
        };
        const newProps = { ...that.props, ...props, images: imgs };
        modalsJSX.push(<ViewFavoriteListModal {...newProps} />);
        // modalsJSX.push(<ViewFavoriteListModal {...props} images={imgs} />);
        break;
      }
      case localModalTypes.DOWNLOAD_GALLERY_MODAL: {
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
      case localModalTypes.LOGIN_OUT_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<OutLoginModal {...props} />);
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
        const EstoreSignInModal = SignInModal;
        modalsJSX.push(<EstoreSignInModal {...props} />);
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
      case localModalTypes.CONFIRM_MODAL: {
        modalsJSX.push(
          <XConfirmModal data={modal} key={modal.get('id')} className="xconfirm-wap-modal" />
        );
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
      case localModalTypes.PAYMENT_METHODS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<PaymentModal {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
