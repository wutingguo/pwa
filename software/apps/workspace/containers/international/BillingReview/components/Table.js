import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Table extends Component {
  render() {
    const {
      className,
      rowClassName,
      rowKey,
      columns = [],
      dataSource = [],
      showHeader = true
    } = this.props;
    return (
      <table className={className}>
        {
          showHeader && (
            <thead>
              <tr>
                {
                  columns.map((col, j) => {
                    const { title, dataIndex, key } = col;
                    const colKey = key || dataIndex || j;
                    return <th key={colKey}>{title}</th>
                  })
                }
              </tr>
            </thead>
          )
        }
        <tbody>
          {
            dataSource.map((item, i) => {
              const newRowKey = rowKey ? item[rowKey] : (item.key || i);
              return (
                <tr className={rowClassName} key={newRowKey}>
                  {
                    columns.map((col, j) => {
                      const { className, dataIndex, key, render } = col;
                      const colKey = key || dataIndex || j;
                      const text = item[dataIndex];
                      const value = render ? render(text, i, item) : text;

                      return <td className={className} key={colKey}>{value}</td>
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

Table.propTypes = {
  className: PropTypes.string,
  rowClassName: PropTypes.string,
  rowKey: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    dataIndex: PropTypes.string,
    key: PropTypes.string,
    className: PropTypes.string,
    render: PropTypes.func
  })),
  dataSource: PropTypes.arrayOf(PropTypes.object),
  showHeader: PropTypes.bool
}

export default Table;