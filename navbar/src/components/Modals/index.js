import React, { Component } from 'react';
import * as mainHandler from './handle/main';

class XModals extends Component {
  constructor(props) {
    super(props);
    this.getModals = () => mainHandler.getModals(this);
  }

  render() {
    const modalsJSX = this.getModals();
    return (
      <div className="modals">
        {modalsJSX}
      </div>
    );
  }
}

XModals.propTypes = {};

export default XModals;
