import { template } from 'lodash';
import Tooltip from 'rc-tooltip';
import React, { Component } from 'react';

import ChangePhoneModal from '@resource/components/changePhoneModal';

import XPersonalModal from '@resource/components/pwa/XPersonalModal';

import { getWWWorigin } from '@resource/lib/utils/url';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import { EDIT_ACCOUNT_INFO, GET_ACCOUNT_INFO, GET_CHILD_ACOUNNTS } from '../../constants/apiUrl';
import AccountModal from '../AccountModal';
import AlertModal from '../AlertModal';
import SubAccountList from '../SubAccountList';

import './index.scss';

class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      isEditName: false,
      isValidName: false,
      name: '',
      maxTextLength: 50,
      isShowModal: false,
      modalType: null,
      childAccountList: [],
      isShowAlert: false,
    };

    this.editAccountInfo = this.editAccountInfo.bind(this);
    this.handkeEditName = this.handkeEditName.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.getChildAccounts = this.getChildAccounts.bind(this);
  }

  componentDidMount() {
    this.getAccountInfo();
    this.getChildAccounts();
  }

  closeModal = () => {
    this.setState({
      isShowModal: false,
      modalType: null,
    });
  };

  showModal = modalType => {
    this.setState({
      isShowModal: true,
      modalType,
    });
  };

  getAccountInfo() {
    const { baseUrl } = this.props;
    const url = template(GET_ACCOUNT_INFO)({ baseUrl });
    xhr.pureget(url).then(res => {
      if (res && res.customerId) {
        this.setState({
          accountInfo: res,
          name: res.studioName,
        });
      }
    });
  }
  getChildAccounts() {
    const url = template(GET_CHILD_ACOUNNTS)({ baseUrl: getWWWorigin() });
    xhr.get(url).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          childAccountList: res.data,
        });
      }
    });
  }
  editAccountInfo(params = {}) {
    const { baseUrl } = this.props;
    const url = template(EDIT_ACCOUNT_INFO)({ baseUrl });
    return new Promise((resolve, reject) => {
      xhr
        .post(url, params)
        .then(res => {
          if (res.errorCode == 0) {
            resolve(res);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }

  handkeEditName() {
    this.setState({
      isEditName: true,
    });
  }

  onNameChange(e) {
    const { value } = e.target;
    const { maxTextLength } = this.state;
    const reg =
      /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`.trim().replace(reg, '').substring(0, maxTextLength);
    this.setState({
      name: newName,
      isValidName: false,
    });
  }

  onSubmitName() {
    const { name, accountInfo } = this.state;

    if (!name.trim()) {
      this.setState({
        isValidName: true,
      });
      return;
    }

    const { securityToken, timestamp, email = '', phoneNumber } = accountInfo;
    const params = {
      studioName: name,
      token: securityToken,
      timestamp,
      email,
      phoneNumber,
    };
    this.editAccountInfo(params)
      .then(() => {
        this.setState({
          isEditName: false,
        });
      })
      .catch(err => {
        this.setState({
          isEditName: false,
        });
      });
  }
  showAccountModal = (currentAccount = null) => {
    const { childAccountList } = this.state;
    if (childAccountList.length >= 3 && (!currentAccount || !currentAccount.name)) {
      this.setState({
        isShowAlert: true,
      });
    } else {
      this.setState({
        currentAccount,
        isShowAccountModal: true,
      });
    }
  };
  handleModalClose = () => {
    this.setState({
      isShowAccountModal: false,
      currentAccount: null,
      isShowAlert: false,
    });
  };
  updateChildAccount = account => {
    const { childAccountList } = this.state;
    const index = childAccountList.findIndex(item => item.customerId === account.customerId);
    if (index !== -1) {
      childAccountList[index] = account;
    } else {
      childAccountList.push(account);
    }
    this.setState({
      childAccountList,
    });
  };
  render() {
    const {
      accountInfo,
      name,
      isEditName,
      isValidName,
      isShowModal,
      modalType,
      isShowAccountModal,
      isShowAlert,
      currentAccount,
      childAccountList,
    } = this.state;
    const { baseUrl, userInfo, boundGlobalActions } = this.props;
    const { sub_account } = userInfo.get('accountInfo');
    const { email = '', phoneNumber = '', createTime = '', isMakerPlan } = accountInfo;
    const modalProps = {
      env: { baseUrl },
      modalType,
      onClosed: this.closeModal,
      userInfo,
      boundGlobalActions,
    };
    const alertModalProps = {
      actions: {
        handleClose: this.handleModalClose,
        handleOk: this.handleModalClose,
        handleCancel: this.handleModalClose,
      },
      html: '您创建的子账户数量已达到上限<br />如需更多账户的开通，请联系客服',
      btnText: '我知道了',
    };
    const modalAccountProps = {
      actions: {
        handleClose: this.handleModalClose,
        updateChildAccount: this.updateChildAccount,
      },
      accountLength: childAccountList.length,
      isEdit: currentAccount && currentAccount.customerId,
      currentAccount,
    };
    return (
      <div className="section account-info">
        <div className="section-title">您的基础信息</div>
        <div className="section-content">
          <ul>
            <li>
              <div className="label">账户名: </div>
              <div className="value name">
                {isEditName ? (
                  <input
                    value={name}
                    onChange={this.onNameChange}
                    onBlur={this.onSubmitName}
                    autoFocus
                  />
                ) : (
                  <Tooltip key={0} placement="topLeft" overlay={name}>
                    <span>{name}</span>
                  </Tooltip>
                )}
                {isValidName ? <span className="tip">姓名不能为空</span> : ''}
              </div>
              {!isEditName && !sub_account ? (
                <a href="javascript:;" className="edit edit-name" onClick={this.handkeEditName}>
                  修改
                </a>
              ) : null}
            </li>
            <li>
              <div className="label">登录邮箱: </div>
              <div className="value">{email}</div>
            </li>
            {phoneNumber && <ChangePhoneModal currentPhoneNumber={phoneNumber} />}
            {/* <li>
              <div className="label">绑定手机: </div> 
              <div className="value">
                {phoneNumber}
                <span
                  onClick={() => window.location.href = `${baseUrl}changePhoneNumberMVC/jumpPage.ep`}
                  className="edit"
                >
                  修改
              </span>
              </div>
            </li> */}
            <li>
              <div className="label">密码: </div>
              <div className="value">
                ********
                {!sub_account && (
                  <span onClick={() => this.showModal('password')} className="edit">
                    修改
                  </span>
                )}
              </div>
            </li>
            <li>
              <div className="label">注册时间</div>
              <div className="value">{createTime}</div>
            </li>
            <li>
              <div className="label">会员类型</div>
              <div className="value">{isMakerPlan == '1' ? '专享会员' : '普通会员'}</div>
            </li>
          </ul>
        </div>
        {isShowModal && modalType && <XPersonalModal {...modalProps} />}
        {!sub_account && (
          <SubAccountList list={childAccountList} showAccountModal={this.showAccountModal} />
        )}
        {isShowAccountModal ? <AccountModal {...modalAccountProps} /> : null}
        {isShowAlert ? <AlertModal {...alertModalProps} /> : null}
      </div>
    );
  }
}

export default AccountInfo;
