import React, { Component } from 'react';
import equals from '@resource/lib/utils/compare';

function withSelector(WrappedComponent) {
  return class Select extends Component {
    constructor(props) {
      super(props);

      this.state = {
        selectBox: null,

        selectedList: [],
        dataList: null,

        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,

        isShowBoxMask: false,
        maskBoxStyle: null
      };

      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.resetXY = this.resetXY.bind(this);
      this.getCollideStatus = this.getCollideStatus.bind(this);
      this.getSelectedList = this.getSelectedList.bind(this);
      this.getMaskStyle = this.getMaskStyle.bind(this);
    }

    // TODO: 数据抽离到父组件传入
    componentDidMount() {
      const { id, collectionDetail } = this.props;
      const selectBox = id && document.querySelector(`#${id}`);

      this.setState({
        selectBox,
        dataList: collectionDetail.get('frameList') && collectionDetail.get('frameList').toJS()
      });
    }

    componentWillReceiveProps(nextProps) {
      const { collectionDetail } = this.props;
      const { collectionDetail: nextCollectionDetail } = nextProps;

      const isEqual = equals(collectionDetail, nextCollectionDetail);
      if (!isEqual) {
        this.setState({ dataList: nextCollectionDetail.get('frameList').toJS() });
      }
    }

    handleMouseDown(event) {
      // 边界判断：框选位置是内部元素不执行操作
      if (event.target.className.includes('LazyLoad')) return false;

      this.setState({
        startX: event.clientX,
        startY: event.clientY,
        endX: event.clientX,
        endY: event.clientY,
        isShowBoxMask: true
      });

      document.body.addEventListener('mousemove', this.handleMouseMove);
      document.body.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove(event) {
      const endX = event.clientX;
      const endY = event.clientY;
      this.setState({
        endX,
        endY
      });
      this.getMaskStyle(endX, endY);
    }

    handleMouseUp(event) {
      const { startX, startY, endX, endY } = this.state;

      document.body.removeEventListener('mousemove', this.handleMouseMove);
      document.body.removeEventListener('mouseup', this.handleMouseUp);

      if (startX === endX && endY === startY) return;

      this.getSelectedList();
      this.resetXY();
      this.setState({
        isShowBoxMask: false,
        maskBoxStyle: {
          width: 0,
          height: 0,
          left: 0,
          top: 0
        }
      });
    }

    // 获取选中的元素列表
    getSelectedList() {
      const { maskId, cardClassName, boundProjectActions } = this.props;
      const { selectedList, dataList } = this.state;

      const domMask = document.querySelector(`#${maskId}`);
      const domList = document.querySelectorAll(`.${cardClassName}`);

      const rectMask = domMask && domMask.getBoundingClientRect();
      const addList = [];
      const delList = [];

      domList.forEach((node, index) => {
        const rectLi = node.getBoundingClientRect();
        const id = dataList[index]?.guid;

        if (this.getCollideStatus(rectLi, rectMask)) {
          if (selectedList.includes(id)) {
            delList.push(id);
          } else {
            addList.push(id);
          }
        }
      });

      const finalSelectedList = selectedList.concat(addList).filter(id => !delList.includes(id));

      finalSelectedList.forEach(id => boundProjectActions.changeSelectedImg(id));
    }

    // 获取元素框选状态
    getCollideStatus(rect1, rect2) {
      const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
      const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
      const minX = Math.min(rect1.x, rect2.x);
      const minY = Math.min(rect1.y, rect2.y);

      // 判断两矩形是否相交或者存在包含关系
      if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
        return true;
      }
      return false;
    }

    // 获取框选box阴影样式
    getMaskStyle(endX, endY) {
      const { startX, startY, selectBox } = this.state;

      const boxScreenLeft = selectBox && selectBox.getBoundingClientRect().left;
      const boxScreenTop = selectBox && selectBox.getBoundingClientRect().top;

      this.setState({
        maskBoxStyle: {
          width: `${Math.abs(endX - startX)}px`,
          height: `${Math.abs(endY - startY)}px`,
          left: `${Math.min(startX, endX) - boxScreenLeft}px`,
          top: `${Math.min(startY, endY) - boxScreenTop}px`,

          border: '1px dashed #3a3a3a',
          backgroundColor: 'rgba(0, 0, 0, .2)',
          position: 'absolute',
          zIndex: 999
        }
      });
    }

    resetXY() {
      this.setState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      });
    }

    render() {
      const { maskBoxStyle, isShowBoxMask } = this.state;

      const data = {
        maskBoxStyle,
        isShowBoxMask,
        handleMouseDown: this.handleMouseDown
      };

      return <WrappedComponent {...data} {...this.props} />;
    }
  };
}

export default withSelector;
