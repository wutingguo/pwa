import React from 'react';
import { XPureComponent, withMenuList } from '@common/components';
import { settingFavoriteKey } from '@apps/gallery/components/EditorSidebar/handle/config';
import './index.scss';

class Item extends XPureComponent {
  render() {
    const { item } = this.props;
    const showStatus = item.get('key') === settingFavoriteKey;
    const favoriteEnabled = item.get('favoriteEnabled');
    // console.log("settingFavoriteKey....",settingFavoriteKey)
    return (
      <>
        <span>{item.get('text')}</span>
        {showStatus && favoriteEnabled !== '' && (
          <span className="favorite-status">{favoriteEnabled === 1 ? 'on' : 'off'}</span>
        )}
      </>
    );
  }
}
const List = withMenuList(Item);

class SettingList extends XPureComponent {
  render() {
    const { items, selectedKeys, onSelect } = this.props;

    const listProps = {
      dataSource: items,
      selectedKeys,
      onSelect
    };
    return <List {...listProps} />;
  }
}

export default SettingList;
