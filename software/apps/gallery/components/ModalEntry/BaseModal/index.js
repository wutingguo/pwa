import React, { Component } from 'react';
import { XBaseModal } from '@common/components';
import { BASE_MODAL } from '@apps/gallery/constants/modalTypes';

class BaseModal extends Component {
  onCancel = () => {
    const { data, boundGlobalActions } = this.props;
    const onCancel = data.get('onCancel');
    if (!onCancel) {
      boundGlobalActions.hideModal(BASE_MODAL);
    } else {
      onCancel();
    }
  };

  render() {
    const { data } = this.props;
    let renderChildren = () => {};
    let props = {
      onClosed: this.onCancel
    };
    let modalProps = data.get('modalProps') || {};
    modalProps.forEach((value, key) => {
      if (key === 'renderChildren') {
        renderChildren = value;
      } else {
        props[key] = value;
      }
    });

    return <XBaseModal {...props}>{renderChildren()}</XBaseModal>;
  }
}

export default BaseModal;
