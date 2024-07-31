import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React, { Component } from 'react';

const scrollLoadHOC = (
  WrappedComponent,
  { scrollContainerId = '', scrollContentIds = [], uniqueKey = 'enc_image_uid', pageSize = 50 }
) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        curSetImgsSize: 0,
        pagination: 1,
        pageSize,
        pageContent: fromJS([]),
      };
      this.errorMaxCount = 3;
      this.currentErrorCount = 0;
    }

    componentDidMount() {
      this.bindScroll();
      if (scrollContainerId && scrollContentIds.length) {
        const scrollContainer = document.getElementById(scrollContainerId);
        scrollContainer && scrollContainer.addEventListener('scroll', this.onScroll);
      }
    }

    componentWillUnmount() {
      this.unBindScroll();
    }

    bindScroll = () => {
      if (this.currentErrorCount >= this.errorMaxCount) {
        clearTimeout(this.timer);
        return;
      }
      this.timer = setTimeout(() => {
        if (scrollContainerId && scrollContentIds.length) {
          const scrollContainer = document.getElementById(scrollContainerId);
          if (!scrollContainer) {
            this.currentErrorCount += 1;
            this.bindScroll();
            return;
          }
          this.currentErrorCount = this.errorMaxCount;
          scrollContainer.addEventListener('scroll', this.onScroll);
        }
      }, 300);
    };

    unBindScroll = () => {
      clearInterval(this.timer);
      if (scrollContainerId && scrollContentIds.length) {
        const scrollContainer = document.getElementById(scrollContainerId);
        scrollContainer && scrollContainer.removeEventListener('scroll', this.onScroll);
      }
    };

    groupImgs = () => {
      const { pageContent, scrollData } = this.state;
      if (!(scrollData && scrollData.size)) {
        this.setState({
          pageContent: fromJS([]),
        });
        return;
      }
      const arr = this.pageArray(scrollData);
      if (pageContent.concat(arr).size) {
        const outArr = pageContent.concat(arr).reduce((res, item) => {
          const cur = item.get(uniqueKey);
          if (!res.find(_item => _item.get(uniqueKey) === cur)) {
            res = res.push(item);
          }
          return res;
        }, fromJS([]));
        this.setState({
          pageContent: outArr,
          curSetImgsSize: scrollData.size,
        });
      }
    };

    pageArray = groups => {
      const { pagination, pageSize } = this.state;
      const startIndex = (pagination - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return groups.slice(startIndex, endIndex);
    };

    toTop = () => {
      const container = document.getElementById(scrollContainerId);
      if (container) {
        container.scrollTop = 0;
      }
    };

    onScroll = e => {
      const { pageContent, curSetImgsSize } = this.state;
      const container = document.getElementById(scrollContainerId);
      const containerHeight = container.clientHeight;
      const scorllContentHeight = scrollContentIds.reduce((res, item) => {
        const itemContentHeight = document.getElementById(item);
        res += itemContentHeight.clientHeight;
        return res;
      }, 0);
      const scrollTop = container.scrollTop;
      const diff = containerHeight - (scorllContentHeight - scrollTop);
      if (diff > -150 && pageContent.size < curSetImgsSize) {
        this.setState(
          {
            pagination: this.state.pagination + 1,
          },
          () => {
            this.groupImgs();
          }
        );
      }
    };

    formatData = data => {
      if (data && data.size) {
        return data.map(item => item.get(uniqueKey));
      }
      return false;
    };

    // 提供修改数组某一项key的值
    updateData = (uniqueValue, modified = {}) => {
      if (!uniqueValue) {
        return;
      }
      const { pageContent } = this.state;
      const newContent = pageContent.map(item => {
        if (item.get(uniqueKey) === uniqueValue) {
          return item.merge(modified);
        }
        return item;
      });
      this.setState({
        pageContent: newContent,
      });
    };

    getData = (scrollData = fromJS([])) => {
      const { scrollData: currentData } = this.state;
      if (!isEqual(this.formatData(scrollData), this.formatData(currentData))) {
        this.toTop();
        this.setState(
          {
            scrollData,
            pagination: 1,
            pageContent: fromJS([]),
            curSetImgsSize: scrollData.size,
          },
          () => {
            this.groupImgs();
          }
        );
      }
    };

    render() {
      const { pageContent } = this.state;
      return (
        <WrappedComponent
          {...this.props}
          scrollData={pageContent}
          postData={this.getData}
          updateData={this.updateData}
        />
      );
    }
  };
};

export default scrollLoadHOC;
