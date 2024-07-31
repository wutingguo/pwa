import React from 'react';
import Table from 'rc-table';
import { XPureComponent } from '@common/components';

class DownloadRecordTable extends XPureComponent {
  render() {
    const { className, data, columns } = this.props;
    const tableProps = {
      className,
      columns,
      rowKey: 'uidpk',
      data
    };
    return <Table {...tableProps} />;
  }
}
export default DownloadRecordTable;
