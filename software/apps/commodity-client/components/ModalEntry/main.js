import React from 'react';

import XConfirmModal from '@resource/components/modals/XConfirmModal';
import SignInModal from '@resource/components/modals/XEstoreSignInModal';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@apps/commodity-client/constants/modalTypes';

import ChangeTitleModal from './ChangeTitleModal';
import CreateProjectNameModal from './CreateProjectNameModal';
import LookPriceModal from './LookPriceModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, urls } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.SIGN_IN_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<SignInModal {...props} />);
        break;
      }
      case localModalTypes.CREATE_PROJECT_NAME_MODAL: {
        const props = {
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<CreateProjectNameModal {...props} />);
        break;
      }
      case localModalTypes.LOOK_PRICE_MODAL: {
        const props = {
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<LookPriceModal {...props} />);
        break;
      }
      case localModalTypes.CHANGE_TITLE_MODAL: {
        const props = {
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ChangeTitleModal {...props} />);
        break;
      }
      case localModalTypes.CONFIRM_MODAL: {
        modalsJSX.push(<XConfirmModal data={modal} key={modal.get('id')} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
