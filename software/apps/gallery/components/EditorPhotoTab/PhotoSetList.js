import React from 'react';
import _ from 'lodash';
import { XPureComponent, XIcon, withDragMenuList } from '@common/components';
import './index.scss';

class Item extends XPureComponent {
  handleRenameSet = (item) => {
    const handleRenameSet = _.get(this.props, ['itemAction', 'handleRenameSet']);
    !!handleRenameSet && handleRenameSet(item);
  }

  handleDeleteSet = (item) => {
    const handleDeleteSet = _.get(this.props, ['itemAction', 'handleDeleteSet']);
    !!handleDeleteSet && handleDeleteSet(item);
  }

  render() {
    const {item, itemsize} = this.props;
    const title = item.get('set_name');
    const photoCount = item.get('photo_count');
    return (
      <>
        <div className="photos-set-item fw-medium">
          {itemsize !== 1 ? <XIcon type="drag-sort" iconHeight={12} /> : null}
          <span className="photos-set-item-title ellipsis" title={title}>{title}</span>
          <span className="fw-light">(</span>
            {photoCount}
          <span className="fw-light">)</span>
        </div>
        <div className="icon-display">
          <div className="icon-wrap">
            {itemsize !== 1 ? <XIcon type="delete-with-hover" iconHeight={12} onClick={() => {this.handleDeleteSet(item)}} /> : null}
            <XIcon type="rename-with-hover" onClick={() => {this.handleRenameSet(item)}} />
          </div>
        </div>
      </>
    )
  }
}
const List = withDragMenuList(Item);

class PhotoSetList extends XPureComponent {

  render() {
    const { items, handleRenameSet, handleDeleteSet, onSelect, onDragEnd, selectedKeys, defaultSetUid, } = this.props;
    // console.log('selectedKeys: ', selectedKeys);
    if(!items || !items.size) {
      return <div></div>
    }

    const menuListProps = {
      itemClassName: 'photo-sets-item',
      dataSource: items,
      selectedKeys,
      onSelect,
      itemsize: items.size,
      defaultsetuid: defaultSetUid,
      onDragEnd,
      itemAction: {
        handleRenameSet,
        handleDeleteSet
      }
    }
    return <List {...menuListProps}/>
  }
}

export default PhotoSetList;