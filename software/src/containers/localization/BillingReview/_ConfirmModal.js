import React from 'react';

import XPureComponent from '@resource/components/XPureComponent';

export default class Modal extends XPureComponent {
  componentDidMount() {
    const { 
      boundGlobalActions,
      data 
    } = this.props;

    boundGlobalActions.showConfirm(data);
  }

  render() {
    return null;
  }
}