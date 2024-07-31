import React, { PureComponent } from 'react';

import { bindFuncs } from '@resource/lib/utils/component';

import * as handler from './handler/handler';
import * as itemsHandler from './handler/items';

import './index.scss';

class ButtonList extends PureComponent {
  constructor(props) {
    super(props);

    bindFuncs(this, handler);
    bindFuncs(this, itemsHandler);
  }

  render() {
    const { pageArray, ratio } = this.props;
    const page = pageArray?.toJS()[0];
    const sheetStyle = {
      width: page.width * ratio,
    };
    return (
      <ul className="button-list">
        <div className="button-box" style={sheetStyle}>
          {this.getRenderItems()}
        </div>
      </ul>
    );
  }
}

export default ButtonList;
