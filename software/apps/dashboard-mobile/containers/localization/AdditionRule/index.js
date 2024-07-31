import { Arrow, DeleteO } from '@react-vant/icons';
import cls from 'classnames';
import React, { Fragment } from 'react';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import { Radio, Card, Input, Cell, Field } from '@apps/dashboard-mobile/components';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';
import './index.scss';

import mainHandle from '../handle/main';
import { gallery_rule_type_options } from '../handle/constants';

@connect(mapState, mapDispatch)
class AdditionRule extends XPureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      editMode: true,
      errorMsg: '',
      collection_rule_setting: null
    };
  }

  componentDidMount() {
    const { collectionsSettings } = this.props;
    const { collection_rule_setting, enc_collection_uid } = collectionsSettings.toJS();
    this.props.setHeader('编辑加片规则');

    const list = collection_rule_setting?.add_image_packages || [];
    list.sort((a, b) => a.gallery_image_num - b.gallery_image_num);
    this.setState({
      collection_rule_setting: {
        ...collection_rule_setting,
        add_image_packages: list,
        enc_collection_uid
      }
    });
  }

  handleDelete(params) {
    const { collection_rule_setting } = this.state;
    const list = cloneDeep(collection_rule_setting?.add_image_packages);
    const index = list.findIndex(
      item =>
        (params.uidpk && item.uidpk === params.uidpk) || (params.tid && item.tid === params.tid)
    );

    if (index !== -1) {
      list.splice(index, 1);
    }
    this.handleChangeValue(list, 'add_image_packages');
  }

  handleAdd() {
    const { collection_rule_setting } = this.state;
    const list = cloneDeep(collection_rule_setting?.add_image_packages);
    if (list.length >= 4) {
      this.setState({
        errorMsg: '最多创建4个'
      });
      return false;
    }
    list.push({
      collection_id: null,
      gallery_image_num: 0,
      price: 0,
      sort: null,
      uidpk: null,
      tid: Math.floor(1000 + Math.random() * 9000)
    });
    this.handleChangeValue(list, 'add_image_packages');
  }

  /**
   * 更新 settings
   * @param {*} that
   * @param {*} settingItem
   */
  updateSettings = () => {
    const { collection_rule_setting, errorMsg } = this.state;
    const setting = '加片规则';
    const collectionUid = collection_rule_setting?.enc_collection_uid;
    if (errorMsg && errorMsg !== '最多创建4个') return false;
    const emptyFlag = {
      emptyNum: '套餐加片数量不可为空',
      emptyPrice: '套餐价格不可为空',
    };
    const emptyNum = collection_rule_setting?.add_image_packages.filter(
      (item, index) => !item.gallery_image_num
    );
    const emptyPrice = collection_rule_setting?.add_image_packages.filter(
      (item, index) => !item.price
    );
    if (!!emptyNum.length || !!emptyPrice.length) {
      this.setState({
        errorMsg: emptyFlag[emptyNum[0] && 'emptyNum'] || emptyFlag[emptyPrice[0] && 'emptyPrice']
      });
      return false;
    }
    const params = {
      collection_uid: collectionUid,
      setting_type: 5,
      collection_rule_setting: {
        ...collection_rule_setting,
        gallery_rule_switch: true
      }
    };
    mainHandle.updateSettings(this, params, setting, { url: '/software/gallery/adding-tablets' });
    // this.props.history.push({
    //   pathname: '/software/gallery/adding-tablets'
    // });
  };

  handleCancel = () => {
    const { history } = this.props;
    history.push('adding-tablets');
  };

  handleChangeValue = (value, key, errorMsg = '') => {
    const { collection_rule_setting } = this.state;
    this.setState({
      errorMsg,
      collection_rule_setting: {
        ...collection_rule_setting,
        [key]: value
      }
    });
  };

  handleChangeNumber = (value, params, type, i) => {
    const { collection_rule_setting } = this.state;
    let errorMsg = '';
    if (!Number(value) && type === 'gallery_image_extra') {
      errorMsg = '加片收费金额不能为空';
    }
    const list = cloneDeep(collection_rule_setting?.add_image_packages);
    if (type !== 'gallery_image_extra') {
      if (!Number(value)) errorMsg = '套餐价格不可为空';
      list.forEach((item, index) => {
        if (
          (params.uidpk && item.uidpk === params.uidpk) ||
          (params.tid && item.tid === params.tid)
        ) {
          list[index] = {
            ...list[index],
            [type]: Number(value)
          };
        }
      });
      // if (type === 'gallery_image_num') {
      //   list.sort((a, b) => a.gallery_image_num - b.gallery_image_num);
      // }
    }

    this.handleChangeValue(
      type === 'gallery_image_extra' ? value : list,
      type === 'gallery_image_extra' ? type : 'add_image_packages',
      errorMsg
    );
  };

  handleNumberBlur = () => {
    const { collection_rule_setting } = this.state;
    const list = cloneDeep(collection_rule_setting?.add_image_packages);
    list.sort((a, b) => a.gallery_image_num - b.gallery_image_num);
    this.setState({
      collection_rule_setting: {
        ...collection_rule_setting,
        add_image_packages: list
      }
    });
  };

  renderHeaderRight = editMode => {
    const { collection_rule_setting } = this.state;
    if (editMode && collection_rule_setting)
      return (
        <Radio.Group
          defaultValue={collection_rule_setting?.gallery_rule_type}
          direction="horizontal"
          onChange={e => this.handleChangeValue(e, 'gallery_rule_type')}
        >
          {gallery_rule_type_options &&
            gallery_rule_type_options.map((item, index) => {
              return (
                <Radio key={index} iconRender name={item.name}>
                  {item.label}
                </Radio>
              );
            })}
        </Radio.Group>
      );
    return <Arrow />;
  };

  renderSingleMode = () => {
    const { collection_rule_setting, errorMsg } = this.state;
    return (
      <div className="card-cont">
        <div className="card-list">
          <div className="card-row">
            超过免费选片张数，每加片1张收费&nbsp;
            <Input
              className="card-row-input"
              type="digit"
              value={collection_rule_setting?.gallery_image_extra}
              onChange={value =>
                this.handleChangeNumber(value, collection_rule_setting, 'gallery_image_extra')
              }
              placeholder="0"
            />
            &nbsp;元
          </div>
          {errorMsg && <div className="error">{errorMsg}</div>}
        </div>
      </div>
    );
  };

  renderPackageMode = add_image_packages => {
    const { errorMsg } = this.state;
    return (
      <div className="card-cont">
        <div className="card-list">
          {add_image_packages &&
            add_image_packages.map((item, index) => {
              return (
                <div
                  className={cls('card-row', item.uidpk || item.tid)}
                  key={item.uidpk || item.tid}
                >
                  客户加片&nbsp;
                  <Input
                    className="card-row-input"
                    type="digit"
                    value={item?.gallery_image_num}
                    onChange={value =>
                      this.handleChangeNumber(value, item, 'gallery_image_num', index)
                    }
                    onBlur={this.handleNumberBlur}
                    placeholder="0"
                  />
                  &nbsp; 张 &nbsp;&nbsp;&nbsp;&nbsp;套餐价格&nbsp;
                  <Input
                    className="card-row-input"
                    type="digit"
                    value={item?.price}
                    onChange={value => this.handleChangeNumber(value, item, 'price', index)}
                    placeholder="0"
                  />
                  &nbsp; 元
                  <DeleteO
                    color="#222222"
                    fontSize={20}
                    className="card-row-delete"
                    onClick={() => this.handleDelete(item)}
                  />
                </div>
              );
            })}
          {errorMsg && <div className="error">{errorMsg}</div>}
          <div className="card-row-btn" onClick={() => this.handleAdd()}>
            + 增加套餐
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { collection_rule_setting, editMode } = this.state;

    return (
      <div className={cls('addition-rule')}>
        <div className="row-box">
          <Field
            value={collection_rule_setting?.gallery_image_num}
            controlAlign="right"
            label="免费张数"
            type="number"
            // onChange={e => this.handleChangeNumber(e, 'gallery_image_num')}
            onChange={e => this.handleChangeValue(e, 'gallery_image_num')}
          />
        </div>
        <div className="row-box" style={{ marginTop: '20px' }}>
          <Card>
            <Card.Header border extra={this.renderHeaderRight(editMode)}>
              加片模式
            </Card.Header>
            <Card.Body style={{}}>
              {collection_rule_setting?.gallery_rule_type
                ? this.renderPackageMode(collection_rule_setting?.add_image_packages)
                : this.renderSingleMode()}
            </Card.Body>
          </Card>
        </div>
        <div className="buttons">
          <div className="cancel btn" onClick={this.handleCancel}>
            取消
          </div>
          <div className="save btn" onClick={this.updateSettings}>
            保存
          </div>
        </div>
      </div>
    );
  }
}
export default AdditionRule;
