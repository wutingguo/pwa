import React, { Component } from 'react';
import { fromJS } from 'immutable';
import XPureComponent from '@resource/components/XPureComponent';
import SettingsItem from '../SettingsItem';
import './index.scss';

class SettingsList extends XPureComponent {
  render () {
    const { items, selectedKeys, onSelect } = this.props;

    const listProps = {
      dataSource: fromJS(items),
      selectedKeys,
      onSelect
    };

    return (
      <div className="global-settings-siderbar-contanier">
        <SettingsItem { ...listProps } />
      </div>
    )
  }
}

export default SettingsList;