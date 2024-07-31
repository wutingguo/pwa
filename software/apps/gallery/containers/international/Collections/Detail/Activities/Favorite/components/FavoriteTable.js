import React from 'react';
import Table from 'rc-table';
import {XPureComponent} from '@common/components';
import FavoriteAction from './FavoriteAction';
import {getTableColumns} from './config';

class FavoriteTable extends XPureComponent {
  renderAction = (item) => {
    const {className, ...res} = this.props;
    return <FavoriteAction className="favorite-all-table-action" item={item} {...res} />
  }
  render() {
    const {urls, defaultImgs, className, data} = this.props;
    const tableProps = {
      className,
      columns: getTableColumns(urls, defaultImgs, this.renderAction),
      rowKey: 'favorite_uid',
      data: data.toJS()
    }
    return <Table {...tableProps} />
  }
}
export default FavoriteTable;