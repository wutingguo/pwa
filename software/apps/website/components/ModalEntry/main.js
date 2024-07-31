import React from 'react';

import { CreateModal, EditModal } from '@common/components';

import * as localModalTypes from '@apps/website/constants/modalTypes';

import AddPresetModal from './AddPresetModal';
import AlertModal from './AlertModal';
import TemplateModal from './templateModal';
import CustomModal from './CustomModal';
import RenamePresetModal from './RenamePresetModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, mySubscription, urls } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.ADD_PRESET_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls
        };
        modalsJSX.push(<AddPresetModal {...props} />);
        break;
      }
      case localModalTypes.RENAME_PRESET_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls
        };
        modalsJSX.push(<RenamePresetModal {...props} />);
        break;
      }
      case localModalTypes.CREATE_MODAL: {
        modalsJSX.push(<CreateModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.EDIT_MODAL: {
        modalsJSX.push(
          <EditModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }
      case localModalTypes.WEBSITE_ALERT_MODAL: {
        modalsJSX.push(
          <AlertModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }

      case localModalTypes.WEBSITE_TEMPLATE_MODAL: {
        modalsJSX.push(
          <TemplateModal
            data={modal}
            key={modal.get('id')}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case localModalTypes.WEBSITE_CUSTOM_MODAL: {
        modalsJSX.push(
          <CustomModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }

      default:
        break;
    }
  });

  return modalsJSX;
};
