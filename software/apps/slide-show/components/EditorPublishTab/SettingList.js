import React from 'react';
import { XPureComponent, withMenuList } from '@common/components';
import './index.scss';

class Item extends XPureComponent {
  render() {
    const { item } = this.props;

    return (
      <>
        <span>{item.get('text')}</span>
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
