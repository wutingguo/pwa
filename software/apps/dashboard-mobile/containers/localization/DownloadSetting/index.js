import cls from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import { Tabs, Cell, Dialog, Toast, Radio, Switch } from '@apps/dashboard-mobile/components';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';
import mainHandle from '../handle/main';
import { setsSettings } from '../handle/constants';
import './index.scss';
@connect(mapState, mapDispatch)
class DownloadSetting extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      download_setting: null
    };
  }

  componentDidMount() {
    const { collectionsSettings } = this.props;
    const {
      download_setting,
      enc_collection_uid,
      can_download_with_high_resolution
    } = collectionsSettings.toJS();
    this.props.setHeader('下载设置');
    this.setState({
      download_setting: {
        ...download_setting,
        enc_collection_uid,
        can_download_with_high_resolution
      }
    });
  }

  handleChangeValue = (value, key, setting, item) => {
    const { download_setting } = this.state;
    let newValue = value;
    const newSetting = {
      ...download_setting,
      [key]: newValue
    };
    if (
      !newSetting.common_gallery_download_status &&
      !newSetting.common_single_photo_download_status
    ) {
      Toast.info({
        message: `图库或单张照片下载至少有一个打开。关闭下载状态来禁止下载。`,
        duration: 2000
      });
      return false;
    }

    this.setState({
      download_setting: {
        ...download_setting,
        [key]: value
      }
    });

    if (key !== 'pin') {
      if (key === 'sets_setting') {
        this.updateSettings({ [key]: [item] }, setting, value);
      } else {
        this.updateSettings({ [key]: value }, setting, item);
      }
    }
  };

  //  转成后台接口需要的 ====> new_selected_download_status
  transformStatus = item => {
    if (item?.download_status === false && item?.selected_download_status === 0) {
      // 不支持下载
      item.new_selected_download_status = 2;
    } else if (item?.download_status === true && item?.selected_download_status === 0) {
      // 下载全部照片
      item.new_selected_download_status = 0;
    } else if (item?.selected_download_status === 1) {
      // 下载“已选”照片
      item.new_selected_download_status = 1;
    }
    return item;
  };

  // new_selected_download_status ====> 转成后台接口需要的
  handleStatus = item => {
    if (item?.new_selected_download_status === 2) {
      // 不支持下载
      item.download_status = false;
      item.selected_download_status = 0;
    } else if (item?.new_selected_download_status === 1) {
      // 下载“已选”照片
      item.selected_download_status = 1;
    } else if (item?.new_selected_download_status === 0) {
      // 下载全部照片
      item.download_status = true;
      item.selected_download_status = 0;
    }
    return item;
  };

  handleRadioValue = (params, key, judgeId) => {
    const { download_setting } = this.state;
    const list = cloneDeep(download_setting[key]);
    list.forEach((item, index) => {
      if (item[judgeId] === params[judgeId]) {
        list[index] = {
          ...item,
          ...params
        };
      }
    });
    const flag = list.filter(item => item.status);
    if ((!flag || !flag.length) && key === 'resolution') {
      Toast.info({
        message: `至少要选择一个尺寸.`,
        duration: 2000
      });
      return false;
    }

    // if (key === 'sets_setting') {
    //   this.handleChangeValue(params, key, '', list);
    // } else {
    this.handleChangeValue(list, key, '', params);
    // }
  };

  /**
   * 更新 settings
   * @param {*} that
   * @param {*} settingItem
   */
  updateSettings = (config, setting, item) => {
    const { download_setting } = this.state;
    const collectionUid = download_setting?.enc_collection_uid;
    const settingType = download_setting?.setting_type;

    const params = {
      collection_uid: collectionUid,
      setting_type: settingType,
      download_setting: config
    };
    mainHandle.updateSettings(this, params, setting, { params: item });
  };

  handleResetPassword = () => {
    const {
      boundProjectActions: { postResetGalleryPassword, getCollectionsSettings, resetPin }
    } = this.props;
    const { download_setting } = this.state;
    const encId = download_setting.enc_collection_uid;

    resetPin(encId).then(res => {
      const { ret_code, data } = res;
      if (ret_code === 200000) {
        this.handleChangeValue(data.pin, 'pin');
      }
    });
  };

  resetPassword = () => {
    Dialog.confirm({
      title: '提示',
      confirmButtonText: '重置密码',
      message: '当前的密码将立即失效，是否继续？',
      onCancel: () => console.log('cancel'),
      onConfirm: () => this.handleResetPassword()
    });
  };

  handleRenderRadio = (item, options, key) => {
    return (
      <Radio.Group defaultValue={item && item[key]} direction="horizontal">
        {options &&
          options.map((item, index) => {
            return (
              <Radio iconRender name={item.status}>
                {item.photo_size_name}
              </Radio>
            );
          })}
      </Radio.Group>
    );
  };

  render() {
    const { download_setting } = this.state;
    const { collectionsSettings } = this.props;
    const { isGalleryFree } = collectionsSettings.toJS();

    return (
      <div className={cls('download-setting')}>
        <Tabs
          color="#222"
          titleInactiveColor="#2e2e2e"
          lineWidth={66}
          sticky={true}
          background="#F6F6F6"
        >
          <Tabs.TabPane title="设置">
            <div className="row-box">
              <Cell
                title="下载状态"
                size="large"
                rightIcon={
                  <Switch
                    size={24}
                    checked={download_setting?.common_download_status}
                    onChange={checked =>
                      this.handleChangeValue(
                        checked,
                        'common_download_status',
                        checked ? '下载状态已开启' : '下载状态已关闭'
                      )
                    }
                  />
                }
              />
              <div className="explain">打开以允许您的客户下载此图中的照片</div>
            </div>
            {download_setting?.common_download_status && (
              <div className="content">
                <div className="row-box">
                  <Cell
                    title="下载密码"
                    size="large"
                    rightIcon={
                      <Switch
                        size={24}
                        checked={download_setting?.common_pin_status}
                        onChange={checked => {
                          if (!checked) {
                            Dialog.confirm({
                              title: '提示',
                              confirmButtonText: '关闭密码',
                              message:
                                '出于安全目的强烈建议打开下载密码，如果关闭密码保护将允许任何人访问照片集来下载照片。',
                              onCancel: () => console.log('cancel'),
                              onConfirm: () =>
                                this.handleChangeValue(false, 'common_pin_status', '下载密码已关闭')
                            });
                            return false;
                          }
                          this.handleChangeValue(true, 'common_pin_status', '下载密码已开启');
                        }}
                      />
                    }
                  />
                  {download_setting?.common_pin_status && (
                    <Cell
                      title="重置密码"
                      size="large"
                      rightIcon={<sapn onClick={this.resetPassword}>{download_setting?.pin}</sapn>}
                    />
                  )}
                  <div className="explain">您的客户需要输入这个4位数的密码才能下载</div>
                </div>
                <div className="row-box">
                  <Cell
                    title="图库下载"
                    size="large"
                    rightIcon={
                      <Switch
                        size={24}
                        checked={download_setting?.common_gallery_download_status}
                        onChange={checked =>
                          this.handleChangeValue(
                            checked,
                            'common_gallery_download_status',
                            checked ? '图库下载已开启' : '图库下载已关闭'
                          )
                        }
                      />
                    }
                  />
                  <Cell
                    title="单张照片下载"
                    size="large"
                    rightIcon={
                      <Switch
                        size={24}
                        checked={download_setting?.common_single_photo_download_status}
                        onChange={checked =>
                          this.handleChangeValue(
                            checked,
                            'common_single_photo_download_status',
                            checked ? '单张照片下载已开启' : '单张照片下载已关闭'
                          )
                        }
                      />
                    }
                  />
                </div>
                <div className="row-box">
                  <div className="row-title">可下载尺寸</div>
                  {download_setting?.resolution &&
                    download_setting?.resolution.length &&
                    download_setting?.resolution.map((item, index) => {
                      return (
                        <Radio.Group key={item.resolution_id} value={item.status}>
                          <Cell
                            clickable
                            title={item.name_cn}
                            icon={<Radio name={true} />}
                            onClick={() => {
                              if (isGalleryFree && item.resolution_id === 1) return false;
                              this.handleRadioValue(
                                { ...item, status: !item.status },
                                'resolution',
                                'resolution_id'
                              );
                            }}
                            rightIcon={
                              item.status &&
                              this.handleRenderRadio(
                                item,
                                item.common_download_photo_size,
                                'status'
                              )
                            }
                          />
                        </Radio.Group>
                      );
                    })}
                  <div className="explain">选择您允许下载的尺寸</div>
                </div>
              </div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane title="高级选项">
            <div className="row-box">
              <Cell title="限制照片集下载" size="large" label="禁用图库中的特定照片集的下载" />
            </div>
            {download_setting?.sets_setting &&
              download_setting?.sets_setting.map((item, index) => {
                const param =
                  String(item?.new_selected_download_status) !== 'undefined'
                    ? item
                    : this.transformStatus(item);
                return (
                  <div className="row-box">
                    <div className="row-title" title={item.set_name}>
                      {item.set_name}
                    </div>
                    <Radio.Group value={param.new_selected_download_status}>
                      {setsSettings &&
                        setsSettings.map((key, i) => {
                          return (
                            <Cell
                              clickable
                              title={key.name}
                              icon={<Radio name={key.value} />}
                              onClick={() => {
                                const params = this.handleStatus({
                                  ...item,
                                  new_selected_download_status: key.value
                                });
                                this.handleRadioValue(params, 'sets_setting', 'set_uid');
                              }}
                            />
                          );
                        })}
                    </Radio.Group>
                  </div>
                );
              })}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
export default DownloadSetting;
