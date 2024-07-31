import React from 'react';
import * as modalTypes from '@resource/lib/constants/modalTypes';
import XContactUsModal from '@resource/components/modals/XContactUsModal';
import XHowThisWorksModal from '@resource/components/modals/XHowThisWorksModal';
import XGuildLineTips from '@resource/components/modals/XGuildLineTips';
import XConfirmModal from '@resource/components/modals/XConfirmModal';
import QrcodeModal from '@resource/components/modals/QrcodeModal';
import XSaasCheckoutModal from '@resource/components/modals/XSaasCheckoutModal';

export const getModals = that => {
  const { modals, qs, boundGlobalActions, urls, baseUrl, userInfo } = that.props;
  const modalsJSX = [];
  const layoutType = 'navbar';

  modals.forEach((modal, index) => {
    switch (modal.get('modalType')) {
      case modalTypes.FEEDBACK_MODAL: {
        const modelProps = {
          property: qs,
          boundGlobalActions,
          baseUrl,
          close: boundGlobalActions.hideFeedback,
          data: modal,
          key: modal.get('id'),
          userInfo
        };
        modalsJSX.push(<XContactUsModal {...modelProps} />);
        break;
      }
      case modalTypes.HOW_THIS_WORKS: {
        const modalProps = {
          isShown: true,
          closeHowThisWorksModal() {
            boundGlobalActions.hideModal(modalTypes.HOW_THIS_WORKS);
          }
        };
        modalsJSX.push(<XHowThisWorksModal {...modalProps} />);
        break;
      }
      case modalTypes.GUILD_LINE_TIPS: {
        const modalProps = {
          isShown: true,
          closeHelpGuideline() {
            boundGlobalActions.hideModal(modalTypes.GUILD_LINE_TIPS);
          }
        };
        modalsJSX.push(<XGuildLineTips {...modalProps} />);
        break;
      }
      case modalTypes.CONFIRM_MODAL: {
        modalsJSX.push(<XConfirmModal data={modal} key={modal.get('id')} />);
        break;
      }
      case modalTypes.QR_CODE_MODAL: {
        const modalProps = {
          key: modal.get('id'),
          boundGlobalActions
        };
        modalsJSX.push(<QrcodeModal {...modalProps} />);
        break;
      }
      case modalTypes.SAAS_CHECKOUT_MODAL: {
        const props = {
          isShown: true,
          urls,
          userInfo,
          boundGlobalActions,
          key: modal.get('id'),
          layoutType,
          ...modal.toJS()
        };
        modalsJSX.push(<XSaasCheckoutModal {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
