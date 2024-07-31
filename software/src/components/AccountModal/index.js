import classNames from 'classnames';
import { template } from 'lodash';
import React, { Component, PropTypes } from 'react';

import { getWWWorigin } from '@resource/lib/utils/url';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import { ADD_CHILD_ACCOUNT, EDIT_CHILD_ACCOUNT } from '../../constants/apiUrl';
import XModal from '../XModal/index';

import './index.scss';

export default class AccountModal extends Component {
  constructor(props) {
    super(props);

    const { currentAccount } = props;

    this.state = {
      name: currentAccount && currentAccount.name ? currentAccount.name : '',
      email: currentAccount && currentAccount.email ? currentAccount.email : '',
      password: '',
      errorMsg: '',
      showPassword: false,
      isNameValid: true,
      isEmailValid: true,
      isPasswordValid: true,
      isEditFailed: false,
      isAddFailed: false,
    };

    this.onNameChanged = this.onNameChanged.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.addOrEditChildAccount = this.addOrEditChildAccount.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  onNameChanged(e) {
    const { value } = e.target;
    const { maxNameLength } = this.props;
    const reg =
      /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`.trim().replace(reg, '').substring(0, maxNameLength);
    this.setState({
      name: newName,
      isNameValid: true,
    });
  }

  onEmailChange(e) {
    const { value } = e.target;
    const newEmail = `${value}`.trim();
    this.setState({
      email: newEmail,
      isEmailValid: true,
    });
  }

  onPasswordChange(e) {
    const { value } = e.target;
    const reg = /\W|_/gim;
    const newPassword = `${value}`.trim().replace(reg, '');
    this.setState({
      password: newPassword,
    });
  }

  togglePassword() {
    this.setState({
      showPassword: !this.state.showPassword,
      isPasswordValid: true,
    });
  }

  addOrEditChildAccount(params) {
    const { isEdit } = this.props;
    const url = isEdit
      ? template(EDIT_CHILD_ACCOUNT)({ baseUrl: getWWWorigin() })
      : template(ADD_CHILD_ACCOUNT)({ baseUrl: getWWWorigin() });
    return new Promise((resolve, reject) => {
      xhr
        .post(url, params)
        .then(res => {
          if (res && res.data) {
            resolve(res.data);
          } else {
            if (res.errorMessage) {
              this.setState({
                errorMsg: res.errorMessage,
              });
            }
            reject();
          }
        })
        .catch(reject);
    });
  }

  onCreate() {
    const { isEdit, actions, currentAccount } = this.props;
    const { handleClose, updateChildAccount } = actions;
    const { name, email, password } = this.state;

    this.setState({
      isNameValid: true,
      isEmailValid: true,
      isPasswordValid: true,
      isEditFailed: false,
      isAddFailed: false,
      errorMsg: '',
    });

    if (!name.trim()) {
      this.setState({
        isNameValid: false,
      });
      return;
    }

    if (!email.trim()) {
      this.setState({
        isEmailValid: false,
      });
      return;
    }

    if (!isEdit && !password.trim()) {
      this.setState({
        isPasswordValid: false,
      });
      return;
    }

    if (password.trim() && password.trim().length < 4) {
      this.setState({
        isPasswordValid: false,
      });
      return;
    }

    if (
      currentAccount &&
      currentAccount.name === name &&
      currentAccount.email === currentAccount.email &&
      !password
    ) {
      handleClose();
    } else {
      this.addOrEditChildAccount({
        name,
        email,
        password,
        customerUid: currentAccount ? currentAccount.customerId : '',
      })
        .then(data => {
          updateChildAccount(data);
          handleClose();
        })
        .catch(err => {
          if (isEdit) {
            this.setState({
              isEditFailed: true,
            });
          } else {
            this.setState({
              isAddFailed: true,
            });
          }
        });
    }
  }

  render() {
    const { text, maxAcountLength, accountLength, isEdit, maxNameLength, actions } = this.props;
    const { handleClose, handleOk } = actions;
    const {
      name,
      email,
      password,
      showPassword,
      isNameValid,
      isEmailValid,
      isPasswordValid,
      isEditFailed,
      isAddFailed,
      errorMsg,
    } = this.state;
    const title = isEdit ? '修改企业子账户' : '创建企业子账户';
    const xmodalProps = {
      data: {
        title,
        className: 'account-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false,
      },
      actions: {
        handleClose,
      },
    };

    const passwordClass = classNames('toggle-password', {
      hide: showPassword,
    });

    return (
      <XModal {...xmodalProps}>
        {!isEdit ? (
          <div className="sub-title">
            您最多可拥有{maxAcountLength}个子账户，你还可以创建
            <span className="highlight">{maxAcountLength - accountLength}</span>
            个子账户
          </div>
        ) : null}
        <div className="form">
          <div className="field">
            <div className="label">子账户名称</div>
            <div className="input border">
              <textarea
                placeholder="请输入子账户名称，比如金夫人上海南京路"
                onChange={this.onNameChanged}
                value={name}
              >
                {name}
              </textarea>
              <span className="tip">
                {name.length}/{maxNameLength}
              </span>
            </div>
          </div>
          <div className="field">
            <div className="label">子账户邮箱</div>
            <div className="input">
              <input placeholder="请输入子账户邮箱" value={email} onChange={this.onEmailChange} />
            </div>
          </div>
          <div className="field">
            <div className="label">子账户密码</div>
            <div className="input">
              {showPassword ? (
                <input
                  placeholder="请输入密码"
                  value={password}
                  maxLength={20}
                  onChange={this.onPasswordChange}
                />
              ) : (
                <input
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={this.onPasswordChange}
                  maxLength={20}
                  autoComplete="new-password"
                />
              )}
              {password ? (
                <a href="javascript:;" className={passwordClass} onClick={this.togglePassword} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="btns">
          <div className="error-tips">
            {isNameValid ? '' : '请输入子账户名称'}
            {isEmailValid ? '' : '请输入子账户邮箱'}
            {isPasswordValid ? '' : password.trim() ? '子账户密码不得少于4位' : '请输入子账户密码'}
            {isEditFailed ? `编辑失败${!!errorMsg ? ',' : ''}${errorMsg}` : ''}
            {isAddFailed ? `添加失败${!!errorMsg ? ',' : ''}${errorMsg}` : ''}
          </div>
          {!isEdit ? (
            <a href="javascript:;" onClick={handleClose} className="cancel">
              取消
            </a>
          ) : null}
          <a href="javascript:;" onClick={this.onCreate} className="ok">
            {isEdit ? '保存' : '立即创建'}
          </a>
        </div>
      </XModal>
    );
  }
}

// AccountModal.propTypes = {
//   actions: PropTypes.shape({
//     handleClose: PropTypes.func.isRequired,
//     handleOk: PropTypes.func.isRequired
//   }).isRequired,
//   maxAcountLength: PropTypes.number,
//   accountLength: PropTypes.number,
//   isEdit: PropTypes.boolean
// };

AccountModal.defaultProps = {
  maxAcountLength: 3,
  accountLength: 0,
  isEdit: false,
  maxNameLength: 50,
};
