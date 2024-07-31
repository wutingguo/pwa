import React, { Component } from 'react';

import './index.scss';

class SubAccountList extends Component {
  constructor(props) {
    super(props);

    this.getRenderList = this.getRenderList.bind(this);
  }

  getRenderList() {
    const { list, showAccountModal } = this.props;
    const html = [];

    list.forEach((item, index) => {
      const { name, customerId } = item;
      html.push(
        <div className="account-item" key={index} onClick={showAccountModal.bind(this, item)}>
          <div className="name">{name}</div>
          <div className="id">账号ID：{customerId}</div>
        </div>
      );
    });

    return html;
  }

  render() {
    const { showAccountModal, list } = this.props;
    return (
      <div className="section sub-account-list">
        <div className="section-title">多账户管理</div>
        <div className="section-subtitle">为企业账户支持多人或多店协作，支持生成子账户</div>
        <div className="section-content">
          {this.getRenderList()}
          <div className="add-account account-item" onClick={showAccountModal}>
            <div className="label">
              <span />
              创建企业子账户
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SubAccountList.propTypes = {};

SubAccountList.defaultProps = {};

export default SubAccountList;
