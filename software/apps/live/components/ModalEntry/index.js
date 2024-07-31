import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';

import { getModals } from './main';

class Modals extends XPureComponent {
  getModals = () => getModals(this);
  render() {
    const modalsJSX = this.getModals();
    return <div className="modals">{modalsJSX}</div>;
  }
}

export default Modals;
