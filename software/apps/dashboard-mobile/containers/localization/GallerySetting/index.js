import cls from 'classnames';
import { cloneDeep, debounce, isNumber, iteratee } from 'lodash';
import moment from 'moment';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { XIcon, XPureComponent } from '@common/components';

import { Calendar, Cell, Dialog, Field, Radio, Switch } from '@apps/dashboard-mobile/components';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';
import DatePicker from '@apps/gallery/components/DatePicker';

import { collect_type_options, optionalType } from '../handle/constants';
import mainHandle from '../handle/main';

import './index.scss';

@connect(mapState, mapDispatch)
class GallerySetting extends XPureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      currentDate: {
        type: 'event_time',
        date: null,
      },
      closeDatePicker: true,
      errorMessage: '',
      informationEdit: null,
      collection_setting: {},
      login_information_config: null,
    };
  }

  today = new Date();
  minDate = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate());
  maxDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());

  componentDidMount() {
    const { collectionsSettings } = this.props;
    const { collection_setting, enc_collection_uid } = collectionsSettings.toJS();
    this.props.setHeader('基础设置');
    this.setState({
      collection_setting: { ...collection_setting, enc_collection_uid },
      login_information_config: collection_setting?.login_information_config,
    });
  }

  handleDelete(item) {
    const { boundProjectActions } = this.props;
    const { deleteWatermark, updateWatermarkList } = boundProjectActions;
    deleteWatermark(item).then(res => {
      if (res) {
        this.init();
      }
    });
  }

  handleRenderRadio = (item, options, key) => {
    const optionList =
      item?.information_id === 1 ? options.filter((i, index) => index === 0) : options;

    return (
      <Radio.Group
        rootClassName={cls(key === 'is_required' && 'cell-radio')}
        defaultValue={item && item[key]}
        direction="horizontal"
        onChange={e => this.handleValue(item, key, e)}
      >
        {optionList &&
          optionList.map((item, index) => {
            return (
              <Radio iconRender name={item.name}>
                {item.label}
              </Radio>
            );
          })}
      </Radio.Group>
    );
  };

  handleRenderCell = (item, options) => {
    return (
      <Radio.Group
        key={item.information_id}
        value={item.is_choose}
        onChange={e => this.handleValue(item, 'is_choose', !item?.is_choose)}
      >
        <Cell
          clickable
          title={
            <span className="cell-label">
              <span className="cell-name">{item.information_name}</span>
              {item.can_edit && (
                <span className="icon">
                  <XIcon
                    type="edit"
                    iconHeight={12}
                    iconWidth={12}
                    onClick={() =>
                      this.setState({
                        informationEdit: item,
                      })
                    }
                  />
                </span>
              )}
            </span>
          }
          icon={<Radio name={true} />}
          rightIcon={item.is_choose && this.handleRenderRadio(item, options, 'is_required')}
        />
      </Radio.Group>
    );
  };

  handleValue = (params, key, value) => {
    const { login_information_config, collection_setting } = this.state;
    if (params?.information_id === 1) return false;
    const config = cloneDeep(login_information_config);
    if (key === 'collect_type') {
      config.collect_type = value;
    } else {
      const list = config.setting_details;
      list.forEach((item, index) => {
        if (item.information_id === params.information_id) {
          list[index] = {
            ...item,
            [key]: value,
          };
        }
      });
      config.setting_details = cloneDeep(list);
    }
    this.setState({
      login_information_config: {
        ...config,
      },
    });

    this.updateSettings({ login_information_config: config }, '客户信息收集');
  };

  updateSettings = debounce((config, setting) => {
    const { collection_setting } = this.state;
    const collectionUid = collection_setting?.enc_collection_uid;
    const settingType = collection_setting?.setting_type;
    const params = {
      collection_uid: collectionUid,
      setting_type: settingType,
      collection_setting: config,
    };
    mainHandle.updateSettings(this, params, setting);
  }, 1000);

  handleChangeValue = (value, key, setting) => {
    const { collection_setting } = this.state;
    const config = cloneDeep(collection_setting);
    if (key === 'expire_time' || key === 'event_time') {
      value = new Date(value).getTime();
    }
    config[key] = value;
    this.setState({
      collection_setting: config,
    });

    if (key !== 'gallery_password' && config?.collection_name)
      this.updateSettings({ [key]: value }, setting);
  };

  handleChangeName = (value, key) => {
    const { collection_setting } = this.state;
    const config = cloneDeep(collection_setting);
    config[key] = value;
    this.setState({
      collection_setting: config,
    });
  };

  handleLabel = value => {
    const { informationEdit } = this.state;
    this.setState({
      errorMessage: '名称为必填项',
      informationEdit: {
        ...informationEdit,
        information_name: value,
      },
    });
  };

  handleLabelConfirm = () => {
    const { informationEdit } = this.state;
    if (!informationEdit?.information_name) return;
    this.handleValue(informationEdit, 'information_name', informationEdit?.information_name);
    this.setState({
      errorMessage: '',
      informationEdit: null,
    });
  };

  handleResetPassword = () => {
    const {
      boundProjectActions: { postResetGalleryPassword, getCollectionsSettings },
    } = this.props;
    const { collection_setting } = this.state;
    const encId = collection_setting.enc_collection_uid;

    postResetGalleryPassword(encId).then(res => {
      const { ret_code, data } = res;
      if (ret_code === 200000) {
        this.handleChangeValue(data.gallery_password, 'gallery_password', '修改成功');
        getCollectionsSettings(encId);
      }
    });
  };

  resetPassword = () => {
    Dialog.confirm({
      title: '提示',
      confirmButtonText: '重置密码',
      message: '当前的密码将立即失效，是否继续？',
      onCancel: () => console.log('cancel'),
      onConfirm: () => this.handleResetPassword(),
    });
  };

  handleDate = (type, value) => {
    this.setState({
      closeDatePicker: false,
      currentDate: {
        type: type,
        date: value === 946742399000 ? new Date().getTime() : value,
      },
    });
  };

  getDatePickerProps = () => {
    const { currentDate } = this.state;
    const datePickerProps = {
      date: currentDate?.date ? new Date(currentDate?.date) : new Date(),
      minDate: null,
      onDateChange: date => this.onDateChange(date, currentDate),
      onDateToday: () => this.onDateToday(),
      onDateClear: () => this.onDateClear(),
      onDateClose: () => this.onDateClose(),
    };
    return datePickerProps;
  };

  onDateChange = (date, currentDate) => {
    const { collection_setting } = this.state;
    this.setState({
      collection_setting: {
        ...collection_setting,
        [currentDate.type]: new Date(date).getTime(),
      },
      currentDate: {
        ...currentDate,
        date: date,
      },
    });
  };

  onDateToday = () => {};

  onDateClear = () => {
    const { collection_setting, currentDate } = this.state;
    if (currentDate?.type === 'event_time') {
      this.setState({
        collection_setting: {
          ...collection_setting,
          [currentDate?.type]: 946742399000,
        },
        currentDate: {
          type: 'event_time',
          date: null,
        },
      });
    }
  };

  onDateClose = () => {
    const { currentDate } = this.state;
    this.setState({
      closeDatePicker: true,
      currentDate: {
        type: '',
        date: null,
      },
    });
    const tempConfig = {
      ...currentDate,
    };
    if (currentDate?.type === 'event_time' && !currentDate?.date) {
      tempConfig.date = 946742399000;
    }
    this.handleChangeValue(new Date(tempConfig?.date).getTime(), tempConfig?.type);
  };

  render() {
    const {
      login_information_config = {},
      collection_setting,
      informationEdit,
      closeDatePicker,
      currentDate,
    } = this.state;
    const { setting_details } = login_information_config || {};

    return (
      <div className={cls('gallery-setting')}>
        <div className="row-box">
          <Field
            value={collection_setting?.collection_name}
            controlAlign="right"
            label="选片库名称"
            placeholder="请输入选片库名称"
            onChange={e => this.handleChangeName(e, 'collection_name')}
            onBlur={e => this.handleChangeValue(e.target.value, 'collection_name', '选片库名称')}
          />
          {!collection_setting?.collection_name && (
            <div className="explain error">选片库名称为必填项。</div>
          )}
          <div className="explain">挑选一些简短而精美的句子。想象一下，为相册封面选择标题。</div>
        </div>
        <div className="row-box">
          {/* <Calendar
            isLink
            minDate={this.minDate}
            maxDate={this.maxDate}
            title="事件日期"
            value={new Date(collection_setting?.event_time)}
            showConfirm={false}
            onConfirm={value => this.handleChangeValue(value, 'event_time', '事件日期')}
          ></Calendar> */}
          <Cell
            title="事件日期"
            size="large"
            rightIcon={
              <span onClick={() => this.handleDate('event_time', collection_setting?.event_time)}>
                {collection_setting?.event_time !== 946742399000
                  ? moment(collection_setting?.event_time).format('YYYY-MM-DD')
                  : '请选择事件日期'}
              </span>
            }
          />
          <div className="explain">选择选片库的事件日期，如婚礼日期。</div>
        </div>
        <div
          className="date-picker-wrap"
          style={{ top: currentDate?.type === 'expire_time' ? '57%' : '43%' }}
        >
          {!closeDatePicker && <DatePicker {...this.getDatePickerProps()} />}
        </div>
        <div className="row-box">
          {/* <Calendar
            isLink
            title="到期时间"
            minDate={this.minDate}
            maxDate={this.maxDate}
            value={new Date(collection_setting?.expire_time)}
            showConfirm={false}
            onConfirm={value => this.handleChangeValue(value, 'expire_time', '到期时间')}
          ></Calendar> */}
          <Cell
            title="到期时间"
            size="large"
            rightIcon={
              <span onClick={() => this.handleDate('expire_time', collection_setting?.expire_time)}>
                {collection_setting?.expire_time
                  ? moment(collection_setting?.expire_time).format('YYYY-MM-DD')
                  : '请选择到期时间'}
              </span>
            }
          />
          <div className="explain">您的收藏夹到晚上11:59时，其状态将自动更改为隐藏</div>
        </div>
        <div className="row-box">
          <Cell
            title="选片密码"
            size="large"
            rightIcon={
              <Switch
                size={24}
                checked={collection_setting?.gallery_password_switch}
                onChange={checked =>
                  this.handleChangeValue(checked, 'gallery_password_switch', '下载密码开关')
                }
              />
            }
          />
          {collection_setting?.gallery_password_switch && (
            <Cell
              title="重置密码"
              size="large"
              rightIcon={
                <span onClick={this.resetPassword}>{collection_setting?.gallery_password}</span>
              }
            />
          )}
          <div className="explain">您的客户需要输入此8位选片密码才能开始选片</div>
        </div>
        <div className="row-box">
          <div className="row-title">客户信息收集</div>
          <div className="row-sub-title">您将收集客户的以下信息，并统计在选片反馈中</div>
          {setting_details &&
            setting_details.map((item, index) => this.handleRenderCell(item, optionalType))}
          <div className="row-title">您希望在何时收集客户信息</div>
          {login_information_config?.collect_type && (
            <Cell
              clickable
              title={this.handleRenderRadio(
                login_information_config,
                collect_type_options,
                'collect_type'
              )}
            />
          )}
        </div>
        <Dialog
          visible={!!informationEdit}
          showCancelButton
          title="自定义客户信息收集"
          confirmButtonText="保存"
          onCancel={() => this.setState({ informationEdit: null })}
          onConfirm={() => this.handleLabelConfirm()}
        >
          <div style={{ padding: '20px' }}>
            <Field
              label="名称"
              clearable={true}
              value={informationEdit?.information_name}
              placeholder=""
              required={true}
              border={true}
              labelWidth={30}
              onClear={() => this.handleLabel('')}
              onChange={value => this.handleLabel(value)}
              // errorMessage={errorMessage}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}
export default GallerySetting;
