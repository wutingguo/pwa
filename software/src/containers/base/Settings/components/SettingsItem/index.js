import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import { withMenuList } from '@resource/components/pwa/XMenuList';
import './index.scss';

class SettingsItem extends XPureComponent {
  render() {
    const { item } = this.props;
    const title = item.get('text');
    return (
      <div className="settings-item">
        <span className="settings-item-name" title={title}>{title}</span>
      </div>
    )
  }
}

const List = withMenuList(SettingsItem);

export default List;