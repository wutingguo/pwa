import React, { PureComponent } from 'react';

import TitleEditor from '@resource/components/TitleEditor';
import XIcon from '@resource/components/icons/XIcon';

import { bindFuncs } from '@resource/lib/utils/component';

import * as handlers from './handle/handler';
import * as menuItemsHandler from './handle/menuItems';

import './index.scss';

class Header extends PureComponent {
  constructor(props) {
    super(props);

    bindFuncs(this, handlers);
    bindFuncs(this, menuItemsHandler);
  }

  render() {
    const { property } = this.props;
    const titleEditorProps = {
      isAlwayShowIcon: true,
      title: property.get('title'),
      onEditTitle: this.onEditTitle,
    };
    return (
      <div className="header">
        <div className="go-back" onClick={this.onLeave}>
          {/* <XIcon type="back" iconWidth={16} iconHeight={16} /> */}
          <span>{'<'}</span>
          返回
        </div>
        <TitleEditor {...titleEditorProps} />
        {this.getRenderMenuItems()}
      </div>
    );
  }
}

export default Header;
