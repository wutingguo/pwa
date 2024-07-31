import React from 'react';
import { connect } from 'react-redux';

import { XIcon, XPureComponent } from '@common/components';

import Dialog from '@apps/dashboard-mobile/components/vant/Dialog';
import Field from '@apps/dashboard-mobile/components/vant/Field';
import Switch from '@apps/dashboard-mobile/components/vant/Switch';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import mainHandle from './handle/main';

import './index.scss';

@connect(mapState, mapDispatch)
class FavoriteSetting extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenFavoriteStatus: false,
      isOpenNotes: false,
      isShowNoteSwitch: false,
      labels: [],
      errorMessage: '',
      labelValue: '',
      visible: false,
      labelParams: {},
      enc_collection_uid: '',
      isOpenFavoriteViewImg: true,
      isOpenPreviewSave: false,
    };
  }
  init = () => mainHandle.init(this);
  onNotesSwitch = value => mainHandle.onNotesSwitch(this, value);
  onFavoriteStatusSwitch = value => mainHandle.onFavoriteStatusSwitch(this, value);
  onFavoriteViewImg = value => mainHandle.onFavoriteViewImg(this, value);
  onOpenPreviewSave = value => mainHandle.onOpenPreviewSave(this, value);
  onLabelsSwitch = (value, label_code) => mainHandle.onLabelsSwitch(this, value, label_code);
  handleLabel = value => {
    this.setState({
      labelValue: value,
    });
    if (!value) {
      this.setState({
        errorMessage: '标签名称为必填项',
      });
    } else {
      this.setState({
        errorMessage: '',
      });
    }
  };
  handleLabelConfirm = () => {
    const { labelParams, labelValue } = this.state;
    if (!labelValue) return;
    const tempLabelParams = {
      ...labelParams,
      label_name: labelValue,
    };
    // console.log('TempLabelParams', tempLabelParams);
    mainHandle.handleRename(this, tempLabelParams, () => {
      this.setState({
        visible: false,
      });
    });
  };
  updateLabel = labelParams => {
    const { label_name } = labelParams;
    this.setState({
      visible: true,
      labelValue: label_name,
      labelParams,
    });
    // window.logEvent.addPageEvent({
    //   name: 'GalleryFavorite_Click_EditTagName',
    // });
  };
  componentDidMount() {
    const { match, setPageHeaders } = this.props;
    const { params } = match;
    setPageHeaders(1);
    this.setState(
      {
        enc_collection_uid: params.id,
      },
      () => {
        this.init();
      }
    );
  }
  render() {
    const {
      visible,
      isShowNoteSwitch,
      isOpenFavoriteStatus,
      isOpenFavoriteViewImg,
      isOpenPreviewSave,
      isOpenNotes,
      labels,
      labelValue,
      errorMessage,
    } = this.state;
    return (
      <div className="favoriteSetting">
        <div className="commonFlex itemList">
          <div>{t('FAVORITE_STATUS')}</div>
          <Switch
            checked={isOpenFavoriteStatus}
            onChange={value => this.onFavoriteStatusSwitch(value)}
          />
        </div>
        <div className="desc">{t('FAVORITE_STATUS_TIP')}</div>
        {isShowNoteSwitch && (
          <div>
            <div className="commonFlex itemList">
              <div>{t('NOTES')}</div>
              <Switch checked={isOpenNotes} onChange={value => this.onNotesSwitch(value)} />
            </div>
            <div className="desc">{t('NOTES_TIP')}</div>
            <div className="customize">
              <div className="title">自定义标签</div>
              {labels.map(item => (
                <div className="commonFlex itemList" key={item.id}>
                  <div className="commonFlex" style={{ justifyContent: 'flex-start' }}>
                    <span className="label_name">{item.label_name}</span>
                    <span className="icon">
                      <XIcon
                        type="edit"
                        iconHeight={12}
                        iconWidth={12}
                        onClick={() =>
                          this.updateLabel({
                            label_code: item.label_code,
                            modify_type: 1,
                            label_name: item.label_name,
                          })
                        }
                      />
                    </span>
                  </div>
                  <Switch
                    checked={item.label_enable}
                    onChange={value => this.onLabelsSwitch(value, item.label_code)}
                  />
                </div>
              ))}
            </div>
            <div className="desc" style={{ padding: '12px' }}>
              允许客户向自己喜欢的照片您的自定义标签，您可以将标签名更改为适合您业务的名称。
            </div>
          </div>
        )}
        <div className="commonFlex itemList" style={{ marginTop: '20px' }}>
          <div>是否展示照片名称</div>
          <Switch
            checked={isOpenFavoriteViewImg}
            onChange={value => this.onFavoriteViewImg(value)}
          />
        </div>
        <div className="desc">{t('FAVORITE_VIEW_IMAGE_DESC')}</div>
        <div className="commonFlex itemList" style={{ marginTop: '20px' }}>
          <div>保存预览图</div>
          <Switch checked={isOpenPreviewSave} onChange={value => this.onOpenPreviewSave(value)} />
        </div>
        <div className="desc">{t('FAVORITE_PREVIEW_SAVE_DESC')}</div>
        <Dialog
          visible={visible}
          showCancelButton
          title="编辑自定义标签"
          onCancel={() => this.setState({ visible: false })}
          confirmButtonText="保存"
          confirmButtonColor="#000"
          cancelButtonColor="#666"
          onConfirm={this.handleLabelConfirm}
        >
          <div style={{ padding: '20px' }}>
            <Field
              label="标签名称"
              clearable={true}
              value={labelValue}
              placeholder=""
              required={true}
              border={true}
              labelWidth={60}
              onChange={value => this.handleLabel(value)}
              errorMessage={errorMessage}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}
export default FavoriteSetting;
