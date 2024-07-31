import React from 'react';
import { XPureComponent, XMenuList } from '@common/components';

class PhotoSetList extends XPureComponent {
  render() {
    const { items, onSelect, selectedKeys } = this.props;

    const listProps = {
      dataSource: items,
      selectedKeys,
      onSelect
    };
    return <XMenuList {...listProps} />;
  }
}

export default PhotoSetList;
