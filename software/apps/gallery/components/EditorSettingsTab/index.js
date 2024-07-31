import React from 'react';
import { XPureComponent, XCollectionCover } from '@common/components';
import SettingList from './SettingList';
import './index.scss';

class EditorSettingsTab extends XPureComponent {
  render() {
    const { items, selectedKeys, coverProps, collectionDetail, onSelect } = this.props;
    // console.log("items...",items.toJS())
    const setListProps = {
      items,
      selectedKeys,
      collectionDetail,
      onSelect
    };
    return (
      <div className="gllery-editor-sidebar-photos-wrapper">
        <SettingList {...setListProps} />
        <div className="gllery-editor-sidebar-photos-cover">
          <XCollectionCover {...coverProps} />
        </div>
      </div>
    );
  }
}

export default EditorSettingsTab;
