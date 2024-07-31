import React, { Component, Fragment } from 'react';
import { XFileUpload, XIcon } from '@common/components';
import { saasProducts } from '@resource/lib/constants/strings';
import { checkSubscription } from '@resource/lib/utils/checkSubscription';
import main from './handle/main';
import Watermark from './img/default-watermark.jpg';
import './index.scss';

class WatermarkList extends Component {
  componentDidMount() {
    this.getWatermarkList();
  }

  onAddImages = files => main.onAddImages(this, files);
  getWatermarkList = () => main.getWatermarkList(this);
  filterList = () => main.filterList(this);
  deleteWatermark = (...opt) => main.deleteWatermark(this, ...opt);
  editWatermark = (...opt) => main.editWatermark(this, ...opt);

  getIsFree = () => main.getIsFree(this);
  showUpgradeModal = () => main.showUpgradeModal(this);

  uploadFileClicked = () => {
    // 埋点
  };

  preCheck = () => {
    if (!__isCN__) {
      return true;
    }
    const { boundGlobalActions, urls, mySubscription, collectionDetail } = this.props;
    const watermarkList = collectionDetail.get('watermarkList');
    console.log('watermarkList: ', watermarkList.toJS());
    const params = {
      boundGlobalActions,
      urls,
      mySubscription,
      className: 'creat-gallery-limit-modal',
      upgradTip: t('GALLERY_WATERMARK_UPGRADE_TIP'),
      upgradBtn: t('SLIDESHOW_UPGRADE_BTN'),
      productName: saasProducts.gallery
    };
    if (watermarkList.size === 3) {
      params.checkIsPro = true;
    }
    return checkSubscription(params);
  };

  render() {
    const fileUploadProps = {
      className: 'add-watemark-upload',
      multiple: '',
      inputId: 'multiple',
      text: t('ADD_WATERMARK'),
      preCheck: this.preCheck,
      uploadFileClicked: this.uploadFileClicked,
      addImages: this.onAddImages,
      useNewUpload: true,
      accept: 'image/x-png,image/png'
    };

    return (
      <div className="watermark-list">
        <div className="item default">
          <div className="pic">
            <img src={Watermark} />
          </div>
          <div className="name">
            <div className="text">{t('SETTINGS_DEFAULT_WATERMARK')}</div>
          </div>
        </div>
        {this.filterList().map(item => {
          return (
            <div className="item" key={item.get('watermark_uid')}>
              <div className="pic">
                <img src={item.get('markSrc')} />
              </div>
              <div className="name">
                <div className="text" title={item.get('label')}>
                  {item.get('label')}
                </div>
                <div className="extra">
                  <XIcon
                    type="rename"
                    iconWidth={16}
                    iconHeight={16}
                    onClick={() => this.editWatermark(item)}
                  />
                  <XIcon
                    type="delete"
                    iconWidth={16}
                    iconHeight={16}
                    onClick={() => this.deleteWatermark(item)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {this.filterList().size < (__isCN__ ? 5 : 1) ? (
          <div className="item add">
            {this.getIsFree() && !__isCN__ ? (
              <XIcon
                type="add"
                iconWidth={12}
                iconHeight={12}
                theme="black"
                title={t('ADD_WATERMARK')}
                text={t('ADD_WATERMARK')}
                onClick={this.showUpgradeModal}
              />
            ) : (
              <XFileUpload {...fileUploadProps} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default WatermarkList;
