import React, { Component } from 'react';
import { XBaseModal } from '@common/components';
import './index.scss';
import { WEBSITE_TEMPLATE_MODAL } from '@apps/website/constants/modalTypes';

class TemplateModal extends Component {
  onCancel = () => {
    const { data, boundGlobalActions } = this.props;
    const onCancel = data.get('onCancel');
    if (!onCancel) {
      boundGlobalActions.hideModal(WEBSITE_TEMPLATE_MODAL);
    } else {
      onCancel();
    }
  };

  render() {
    const { data } = this.props;
    let props = {
      onClosed: this.onCancel,
      wrapperClassName: 'template-modal',
      footer: false,
      isHideIcon: true,
    };

    return <XBaseModal {...props} style={{ width: '100%', height: '100vh'}}>
        <iframe 
          frameborder="0"
          allow="fullscreen; picture-in-picture; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen width='100%' height='100%' src={`${window.location.origin}/website-design`} border="0"></iframe>
      </XBaseModal>;
  }
}

export default TemplateModal;
