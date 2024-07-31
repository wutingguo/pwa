import React from 'react';

import ChooseImgModal from '@resource/components/modals/ChooseImgModal';
import XUploadModal from '@resource/components/modals/XUploadModal';
import SaasEstoreUploader from '@resource/components/modals/app/SaasEstoreUploader';

import * as modalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@apps/estore/constants/modalTypes';

import AddCouponProduct from './AddCouponProduct';
import CouponModal from './CouponModal';
import TrackInfoModal from './TrackInfoModal';
import AddPriceSheetModal from './addPriceSheet';
import AddShipModal from './addShip';
import AddShippingModal from './addShipping';
import AddTaxesModal from './addTaxes';
import ApplyBulkMarkupModal from './applyBulkMarkup';
import AssignToCollection from './assignToCollections';
import CommonModal from './commonModal';
import DiscountModal from './discountModal';
import DoubleCheckAssign from './doubleCheckAssign';
import DownloadModal from './downloadModal';
import EditProductOptionsModal from './editProductOptionsModal';
import { getUploadModalParams } from './getParams';
import GoodsCostModal from './goodsCostModal';
import ManagerOptionsModal from './manageOptions';
import ManageOptionsModal from './manageOptionsModal';
import PriceSheetSetting from './priceSheetSetting';
import ProductInfoModal from './productInfo';
import SendPhotoDownloadsModal from './sendPhotoDownloads';
import SetupPaypalModal from './setupPaypal';
import SetupStripeModal from './setupStripe';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];
  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, urls } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.MANAGE_OPTIONS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<ManageOptionsModal {...props} />);
        break;
      }

      case localModalTypes.UPLOAD_MODAL: {
        const uploadModalProps = getUploadModalParams(that, modal);
        console.log('uploadModalProps: ', uploadModalProps);
        modalsJSX.push(<XUploadModal {...uploadModalProps} key={modal.get('id')} />);
        break;
      }

      case localModalTypes.EDIT_PRODUCT_OPTIONS: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<EditProductOptionsModal {...props} />);
        break;
      }

      case localModalTypes.APPLY_BULK_MARKUP_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ApplyBulkMarkupModal {...props} />);
        break;
      }
      case localModalTypes.PRODUCT_INFO_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ProductInfoModal {...props} />);
        break;
      }
      case localModalTypes.MANAGER_OPTIONS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ManagerOptionsModal {...props} />);
        break;
      }
      case localModalTypes.ADD_PRICE_SHEET_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AddPriceSheetModal {...props} />);
        break;
      }
      case localModalTypes.PRICE_SHEET_SETTING: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<PriceSheetSetting {...props} />);
        break;
      }
      case localModalTypes.TRACK_INFO_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<TrackInfoModal {...props} />);
        break;
      }
      case localModalTypes.ADD_TAXES_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AddTaxesModal {...props} />);
        break;
      }
      case localModalTypes.SETUP_SHIPPING_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AddShippingModal {...props} />);
        break;
      }
      case localModalTypes.ADD_COST_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<GoodsCostModal {...props} />);
        break;
      }
      case localModalTypes.SHOW_DISCOUNT_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<DiscountModal {...props} />);
        break;
      }
      case localModalTypes.COMMON_MODAL: {
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
      case localModalTypes.SETUP_PAYPAL_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<SetupPaypalModal {...props} />);
        break;
      }

      case localModalTypes.SETUP_STRIPE_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<SetupStripeModal {...props} />);
        break;
      }

      case localModalTypes.ADD_SHIPPING_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AddShipModal {...props} />);
        break;
      }

      case localModalTypes.ASSIGN_TO_COLLECTIONS: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<AssignToCollection {...props} />);
        break;
      }

      case localModalTypes.DOUBLE_CHECK_ASSIGN: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<DoubleCheckAssign {...props} />);
        break;
      }
      case localModalTypes.DOWNLOADMODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<DownloadModal {...props} />);
        break;
      }
      case localModalTypes.SEND_PHOTO_DOWNLOADS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
        };
        modalsJSX.push(<SendPhotoDownloadsModal {...props} />);
        break;
      }

      case modalTypes.CHOOSE_IMG_MODAL: {
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
      case localModalTypes.COUPON_FORM_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<CouponModal {...props} />);
        break;
      }
      case localModalTypes.COUPON_ADDPRODUCT_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<AddCouponProduct {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
