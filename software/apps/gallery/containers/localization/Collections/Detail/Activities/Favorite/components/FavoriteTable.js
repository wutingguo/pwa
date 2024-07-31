import Table from 'rc-table';
import React from 'react';

import { XPureComponent } from '@common/components';

import FavoriteAction from './FavoriteAction';
import { getTableColumns } from './config';

class FavoriteTable extends XPureComponent {
  renderAction = item => {
    const { className, ...res } = this.props;
    return <FavoriteAction className="favorite-all-table-action" item={item} {...res} />;
  };
  render() {
    const { urls, defaultImgs, className, data } = this.props;
    const other_information_name = data.toJS().length && data.toJS()[0].other_information_name;
    const tableProps = {
      className,
      columns: getTableColumns(urls, defaultImgs, this.renderAction, { other_information_name }),
      rowKey: 'favorite_uid',
      data: data.toJS(),
      emptyText: () => <div>{t('NO_DATA')}</div>,
    };
    return <Table {...tableProps} />;
  }
}
export default FavoriteTable;
