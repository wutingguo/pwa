import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import { XPureComponent } from '@common/components';

import DropdownMenu from '@apps/dashboard-mobile/components/vant/DropdownMenu';
import Field from '@apps/dashboard-mobile/components/vant/Field';
// import { Field, Icon, DropdownMenu, Toast } from 'react-vant';
import Toast from '@apps/dashboard-mobile/components/vant/Toast';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';
import DatePicker from '@apps/gallery/components/DatePicker';

import mainHandler from './handle/main';

import './index.scss';

@connect(mapState, mapDispatch)
class CreatCollect extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      inputValue: '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      closeDatePicker: true,
      autoExpiryDate: null,
      convertAutoExpiryDate: '',
      presetId: null,
      maxOrdering: 0,
      presetOption: [{ text: '无预设', value: 0 }],
    };
  }
  getAutoExpiryProps = () => mainHandler.getAutoExpiryProps(this);
  getDatePickerProps = () => mainHandler.getDatePickerProps(this);
  handleChangeName = value => {
    this.setState({
      name: value,
    });
  };
  hadleDatePicker = e => {
    // e.stopPropagation;
    this.setState({
      closeDatePicker: false,
    });
  };
  addEventListenerFn = () => {
    // this.setState({
    //   closeDatePicker: true,
    // });
  };
  handlePreset = item => {
    this.setState({
      presetId: item.preset,
    });
  };
  handleCreat = () => {
    if (!this.state.name.trim()) {
      Toast.info('选片库名称为必填项。');
      return;
    }
    const { name, presetId, autoExpiryDate, maxOrdering = 0 } = this.state;
    const { boundProjectActions, history } = this.props;
    const time = autoExpiryDate ? moment(autoExpiryDate).valueOf() : null;
    boundProjectActions.createCollection(name, true, presetId, maxOrdering, time).then(res => {
      history.push('/software/gallery/collection');
    });
  };
  componentDidMount() {
    this.props.setPageHeaders(4);
    // setHeader('创建选片库')
    mainHandler.init(this);
    window.addEventListener('click', this.addEventListenerFn);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.addEventListenerFn);
  }
  render() {
    const { name, closeDatePicker, convertAutoExpiryDate, presetOption } = this.state;
    return (
      <div className="creatCollect">
        <div className="list">
          <div className="itemList">
            <Field
              value={name}
              type="text"
              label="选片库名称"
              placeholder="请输入选片库名称"
              onChange={this.handleChangeName}
              clearable
              labelClass={'labelClass'}
              style={{ padding: 0 }}
            />
          </div>
          <div className="itemList">
            <label>时间日期</label>
            <div className="right" onClick={this.hadleDatePicker}>
              {convertAutoExpiryDate ? (
                <span style={{ color: '#222' }}>{convertAutoExpiryDate}</span>
              ) : (
                <span>选择日期 (选填)</span>
              )}
              <span>{'>'}</span>
            </div>
            <div className="date-picker-wrap">
              {!closeDatePicker && <DatePicker {...this.getDatePickerProps()} />}
            </div>
          </div>
          <div className="itemList" style={{ borderBottom: 'none' }}>
            <label>选片库预设</label>
            <div className="right" style={{ color: '#222' }}>
              <DropdownMenu
                activeColor="#222"
                defaultValue={{ preset: 0 }}
                onChange={v => this.handlePreset(v)}
              >
                <DropdownMenu.Item name="preset" options={presetOption} />
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="btn" onClick={this.handleCreat}>
          创建选片库
        </div>
      </div>
    );
  }
}

export default CreatCollect;
