import { Arrow, Edit } from '@react-vant/icons';
import cls from 'classnames';
import { cloneDeep } from 'lodash';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XPureComponent from '@resource/components/XPureComponent';

import { paySettingList } from '@common/servers/payWeChat';

import { XIcon } from '@common/components';

import { Card, Cell, Switch } from '@apps/dashboard-mobile/components';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import mainHandle from '../handle/main';

import './index.scss';

@connect(mapState, mapDispatch)
class AddingTablets extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      collection_rule_setting: null,
      offline: false,
      online: false,
    };
  }

  componentDidMount() {
    const { collectionsSettings } = this.props;
    const { collection_rule_setting, enc_collection_uid } = collectionsSettings.toJS();
    this.props.setHeader('加片设置');
    const list = collection_rule_setting?.add_image_packages || [];
    list.sort((a, b) => a.gallery_image_num - b.gallery_image_num);
    this.getSetting();
    this.setState({
      collection_rule_setting: {
        ...collection_rule_setting,
        add_image_packages: list,
        enc_collection_uid,
      },
    });
  }
  getSetting = () => {
    const { baseUrl, userInfo } = this.props;
    // console.log('this.props', this.props);
    paySettingList({
      baseUrl,
      customer_id: userInfo.get('uidPk'),
    }).then(res => {
      if (res) {
        this.setState({
          offline: !!res.filter(item => !item.pay_type)[0]['pay_switch'], //线下
          online: !!res.filter(item => !!item.pay_type)[0]['pay_switch'], //微信
        });
      }
    });
  };
  handleEditMode = type => {
    this.props.history.replace({
      pathname: '/software/gallery/addition-rule',
    });
  };

  updateSettings = value => {
    const { collection_rule_setting } = this.state;
    const setting = '选片规则';
    const collectionUid = collection_rule_setting?.enc_collection_uid;

    if (
      value &&
      (!collection_rule_setting?.gallery_image_extra ||
        !collection_rule_setting?.add_image_packages.length)
    ) {
      this.props.history.replace({
        pathname: '/software/gallery/addition-rule',
      });
    }
    const params = {
      collection_uid: collectionUid,
      setting_type: 5,
      collection_rule_setting: {
        gallery_rule_switch: value,
      },
    };

    this.setState({
      collection_rule_setting: {
        ...collection_rule_setting,
        gallery_rule_switch: value,
      },
    });
    mainHandle.updateSettings(this, params, setting);
  };

  renderSingleMode = () => {
    const { collection_rule_setting } = this.state;
    return (
      <div className="card-cont">
        <div className="subtitle">加片收费</div>
        <div className="card-list">
          <div className="card-row">
            超过免费选片张数，每加片
            <span className="font-bold">1</span> 张 收费
            <span className="font-bold"> {collection_rule_setting?.gallery_image_extra}</span>
            &nbsp;元
          </div>
        </div>
      </div>
    );
  };

  renderPackageMode = add_image_packages => {
    return (
      <div className="card-cont">
        <div className="subtitle">套餐详情</div>
        <div className="card-list">
          {add_image_packages &&
            add_image_packages.map((item, index) => {
              return (
                <div className="card-row" key={item.uidpk}>
                  客户加片
                  <span className="card-numder"> {item?.gallery_image_num}</span> 张 套餐价格
                  <span className="card-price"> {item?.price}</span> 元
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  render() {
    const { collection_rule_setting, editMode, offline, online } = this.state;

    return (
      <div className={cls('adding-tablets')}>
        <div className="row-box">
          <Cell
            title="选片费用"
            size="large"
            rightIcon={
              <Switch
                size={24}
                checked={collection_rule_setting?.gallery_rule_switch}
                onChange={checked =>
                  this.updateSettings(!collection_rule_setting?.gallery_rule_switch)
                }
              />
            }
          />
          <div className="tipDesc">
            开启后，将按照配置的加片规则向客户收取选片费用，支持多种支付方式。
          </div>
        </div>
        {collection_rule_setting?.gallery_rule_switch && (
          <div className="row-box">
            <div className="explain">加片规则</div>
            <Card>
              <Card.Header border extra={<Arrow />} onClick={() => this.handleEditMode(editMode)}>
                {collection_rule_setting?.gallery_rule_type ? '套餐模式' : '按张计算'}
              </Card.Header>
              <Card.Body style={{}}>
                <div className="sheets">
                  免费选片张数&nbsp;&nbsp;
                  <span className="card-numder">{collection_rule_setting?.gallery_image_num}</span>
                </div>
                {collection_rule_setting?.gallery_rule_type
                  ? this.renderPackageMode(collection_rule_setting?.add_image_packages)
                  : this.renderSingleMode()}
                <div className="payWay">
                  <div className="payWayTitle">支持付款方式</div>
                  <div className="payWayDesc">如需更改客户付款方式，前往工作台“支付管理”</div>
                  <div className="payWayList">
                    {offline && (
                      <div className="offLine">
                        <XIcon type="off-line-pay" />
                        <div>线下支付</div>
                      </div>
                    )}
                    {online && (
                      <div>
                        <XIcon type="on-line-pay" />
                        <div>微信支付</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    );
  }
}
export default AddingTablets;
