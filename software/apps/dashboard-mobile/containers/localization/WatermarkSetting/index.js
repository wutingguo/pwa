import cls from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@apps/dashboard-mobile/components';
import XPureComponent from '@resource/components/XPureComponent';
import ImageCard from '@apps/dashboard-mobile/components/ImageCard';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import mainHandle from './handle/main';
import Watermark from './default-watermark.jpg';

import './index.scss';

@connect(mapState, mapDispatch)
class WatermarkSetting extends XPureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      watermarkList: null
    };
  }

  componentDidMount() {
    this.props.setHeader('水印列表');
    this.init();
  }

  async init() {
    const list = await mainHandle.getWatermarkList(this);
    this.setState({
      watermarkList: list
    });
  }

  handleEdit(item) {
    const { watermarkList } = this.state;
    this.props.history.replace({
      pathname: '/software/gallery/watermark-edit',
      state: { ...item, watermarkList }
    });
  }

  handleDelete(item) {
    const { boundProjectActions } = this.props;
    const { deleteWatermark } = boundProjectActions;
    deleteWatermark(item).then(res => {
      if (res) {
        this.init();
      }
    });
  }

  render() {
    const { watermarkList } = this.state;
    const { urls } = this.props;
    return (
      <div className={cls('watermark-setting')}>
        <ImageCard
          key={'default1'}
          isShowImgName
          actions={null}
          item={{
            image_url: Watermark,
            watermark_name: '默认水印'
          }}
        ></ImageCard>
        {watermarkList &&
          watermarkList.length &&
          watermarkList.map(item => {
            const actions = [
              {
                type: 'rename',
                label: ' 编辑',
                action: () => this.handleEdit(item)
              },
              {
                type: 'delete',
                label: ' 删除',
                action: () => {
                  Dialog.confirm({
                    title: '删除水印',
                    confirmButtonText: '删除',
                    message: '确认删除水印， 删除水印后不可恢复',
                    onCancel: () => console.log('cancel'),
                    onConfirm: () => this.handleDelete(item)
                  });
                }
              }
            ];
            if (!item?.can_edit) return null;
            return (
              <ImageCard
                key={item.watermark_uid}
                isShowImgName
                actions={actions}
                urls={urls}
                item={item}
              ></ImageCard>
            );
          })}
      </div>
    );
  }
}
export default WatermarkSetting;
