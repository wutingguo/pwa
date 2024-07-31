import Tooltip from 'rc-tooltip';
import React, { Fragment } from 'react';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { packageListMapV2, saasProducts } from '@resource/lib/constants/strings';

import { XPureComponent, XSelect } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import main from './handle/main';

import './index.scss';

class BeforeUploadDom extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beforeDomTag: true,
      watermarkValue: 0,
      shardingStatus: false,
    };
  }
  onEndAddImages = watermarkValue => main.onEndAddImages(this, watermarkValue);

  changeWarkmark = ({ value }) => {
    this.setState({ watermarkValue: value });
  };
  onBeforeNext = () => {
    const { watermarkValue, shardingStatus } = this.state;
    const { params, collectionDetail, callBack } = this.props;
    const watermarkList = collectionDetail?.get('watermarkList');
    this.onEndAddImages(watermarkValue, shardingStatus);
    callBack && callBack(watermarkValue, shardingStatus);
    // 当点击确定按钮时重置水印为无水印
    this.setState({
      watermarkValue: 0,
    });
    window.logEvent.addPageEvent({
      name: __isCN__
        ? 'GalleryPhotos_AddWatermark_Click_StartUploadButton'
        : 'GalleryPhotos_AddWatermark_Click_StartUploadButton',
      CollectionID: collectionDetail.get('collection_uid'),
      IsWarterMark: watermarkValue === watermarkList.toJS()[0]?.value ? 0 : 1,
    });
  };
  onChanged = checked => {
    const { urls, boundGlobalActions, mySubscription } = this.props;
    const { addNotification } = boundGlobalActions;
    if (checked) {
      const galleryPlanLevel = mySubscription
        .get('items')
        .find(sub => sub.get('product_id') === saasProducts.gallery);
      const isHigh = galleryPlanLevel?.get('plan_level') > 30;
      if (!isHigh) {
        addNotification({
          message: `升级选片软件高级版本，方可使用智能分片功能`,
          level: 'error',
          autoDismiss: 3,
        });
        this.setState(
          {
            shardingStatus: checked,
          },
          () => {
            setTimeout(() => {
              this.setState({
                shardingStatus: !checked,
              });
            }, 300);
          }
        );
      }
    }
    this.setState({
      shardingStatus: checked,
    });
  };
  render() {
    const { collectionDetail, files } = this.props;
    const { shardingStatus } = this.state;
    const watermarkList = collectionDetail?.get('watermarkList');

    const selectProps = {
      className: 'bud-watermark-select',
      placeholder: t('SELECT_WATERMARK'),
      value: this.state.watermarkValue,
      searchable: false,
      options: watermarkList.toJS(),
      onChanged: this.changeWarkmark,
    };
    const switchProps = {
      checked: shardingStatus,
      onSwitch: checked => this.onChanged(checked),
      // iconProps: {
      //   iconHeight: 13,
      //   iconWidth: 26,
      // },
    };

    return (
      <div className="beforeUploadDom">
        <h3 className="modal-title">{t('GALLERY_UPLOADBEFOREDOM_TITLE')}</h3>
        <h4 className="sub-title">
          {t('GALLERY_UPLOADBEFOREDOM_NUMBER', { fileUpload: files.length })}
        </h4>
        <div className="bud-content">
          <div>{t('GALLERY_UPLOADBEFOREDOM_ADD_WATERMARK')}</div>
          <XSelect {...selectProps} />
          <Tooltip
            zIndex={99999}
            placement="top"
            trigger={['hover']}
            overlay={
              <div
                style={{
                  fontSize: '0.29rem',
                  fontWeight: 400,
                  padding: '0.1rem',
                  boxSizing: 'border-box',
                  width: '4.6rem',
                }}
              >
                {t('GALLERY_UPLOADBEFOREDOM_TOOLTIP')}
              </div>
            }
          >
            <div className="toolTipIcon">!</div>
          </Tooltip>
        </div>
        {__isCN__ && (
          <div className="smart-content">
            <div>{t('智能分片')}</div>
            <div className="smart-switch">
              <Switch {...switchProps}></Switch>
              <div className="switch-tips">
                开启后，上传过程中将进行AI识别预处理，明显减少后续分片时间
              </div>
            </div>
          </div>
        )}

        <div className="bud-foot">
          <button onClick={this.onBeforeNext}>{t('GALLERY_UPLOADBEFOREDOM_STARTUPLOAD')}</button>
        </div>
      </div>
    );
  }
}

export default BeforeUploadDom;
