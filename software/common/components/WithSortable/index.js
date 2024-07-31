import React, { Component } from 'react';
import _ from 'lodash';

function withSortable(WrappedComponent) {
  return class Container extends Component {
    constructor(props) {
      super(props);
      this.state = {
        currentSortConfig: null
      };
      this.changeSort = this.changeSort.bind(this);
    }

    naturalSort(as, bs) {
      let a;
      let b;
      let a1;
      let b1;
      const rx = /(\d+)|(\D+)/g;
      const rd = /\d+/;
      a =
        String(as)
          .toLowerCase()
          .match(rx) || [];
      b =
        String(bs)
          .toLowerCase()
          .match(rx) || [];
      while (a.length && b.length) {
        a1 = a.shift();
        b1 = b.shift();
        if (rd.test(a1) || rd.test(b1)) {
          if (!rd.test(a1)) return 1;
          if (!rd.test(b1)) return -1;
          if (a1 != b1) return a1 - b1;
        } else if (a1 != b1) return a1 > b1 ? 1 : -1;
      }
      return a.length - b.length;
    }

    randomSort() {
      return Math.random() > 0.5 ? -1 : 1;
    }

    /**
     * 改变排序配置
     * @param {Object} config 当前排序配置
     *   {
     *      field:'test', //排序所依赖的字段
     *      fieldType:'string', //排序所依赖的字段的类型
     *      orderBy:'desc', //顺序，目前支持两种：desc,asc;默认为desc降序排列
     *      sortAction：function, //自定义排序方法，没有定义则使用默认排序方法
     *  }
     * @returns
     */
    changeSort(config) {
      const { currentSortConfig } = this.state;
      const { list, onSortedComplete } = this.props;
      const { field, fieldType, orderBy, sortAction } = config;
      if (
        (_.isEqual(currentSortConfig, config) || !list || !list.length) &&
        field !== 'random_order'
      )
        return;
      this.setState({
        currentSortConfig: config
      });
      const ascFunction = (a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if ((fieldType && fieldType === 'string') || typeof aValue === 'string') {
          return this.naturalSort(aValue, bValue);
        }
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        if (aValue === bValue) {
          return 0;
        }
      };

      const descFunction = (a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if ((fieldType && fieldType === 'string') || typeof aValue === 'string') {
          return this.naturalSort(bValue, aValue);
        }

        if (aValue > bValue) {
          return -1;
        }
        if (aValue < bValue) {
          return 1;
        }
        if (aValue === bValue) {
          return 0;
        }
      };

      let sortFunction = orderBy === 'asc' ? ascFunction : descFunction;
      if (sortAction && typeof sortAction === 'function') {
        sortFunction = sortAction;
      }
      if (orderBy === 'random') {
        sortFunction = this.randomSort;
      }
      const sortedList = list.sort(sortFunction);
      if (onSortedComplete && typeof onSortedComplete === 'function') {
        onSortedComplete(sortedList);
      }
    }

    render() {
      const insertProps = {
        currentSortConfig: this.state.currentSortConfig,
        changeSort: this.changeSort
      };
      return <WrappedComponent {...this.props} {...insertProps} />;
    }
  };
}
export default withSortable;
