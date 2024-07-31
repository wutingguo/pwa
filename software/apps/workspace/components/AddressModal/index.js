import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XModal from '../XModal';
import Cascader from '../CascaderNew';
// import XLoading from 'src/components/common/XLoading';
import * as renderHelp from './_handle';
import './index.scss';

export default class AccountModal extends Component {
  constructor(props) {
    super(props);
    const { currentAccount, address_id, order_number } = props;
    this.state = {
      country: 'CN',
      sub_country: '',
      city: '',
      sub_city: '',
      town: '',
      street1: '',
      streets: [],
      street2: '',
      full_name: '',
      phone_number: '',
      zip_or_postal_code: '',
      a_type: order_number ? 'o_s_a' : 's_a',
      address_id,
      order_number,
      isShowLoading: false,
      warnText: ''
    };
    this.didMount = () => renderHelp.didMount(this);
    this.onCreate = () => renderHelp.onCreate(this);

    this.handleChange = e => renderHelp.handleChange(this, e);
    this.getAddressDetailData = () => renderHelp.getAddressDetailData(this);
    this.onTagClick = e => renderHelp.onTagClick(this, e);
    this.validatorFunc = () => renderHelp.validatorFunc(this);
    this.handleSelectAddress = address => renderHelp.handleSelectAddress(this, address);
  }

  componentDidMount() {
    this.didMount();
  }

  render() {
    const { isEdit, handleClose, baseUrl } = this.props;
    const {
      sub_country,
      sub_city,
      town,
      city,
      street1,
      street2,
      full_name,
      phone_number,
      zip_or_postal_code,
      isShowLoading,
      warnText,
      order_number
    } = this.state;

    const title = (isEdit || order_number) ? '编辑地址' : '新建地址';
    const xmodalProps = {
      data: {
        title,
        className: 'address-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose
      }
    };

    const casaderProps = {
      selectComplete: this.handleSelectAddress,
      placeholder: '所属地区：省/市/区（必填）',
      isSupportStreet: true,
      province: sub_country,
      city: city,
      area: sub_city,
      street: town,
      name: 'address',
      needMapStateToProps: true,
      baseUrl
    };

    return (
      <XModal {...xmodalProps}>
        <form ref={node => (this.form = node)} className="form">
          <div className="field">
            <div className="label">
              <span className="color-red">*</span>所在地区:
            </div>
            <div className="input">
              <Cascader {...casaderProps} />
            </div>
          </div>
          <div className="field detaile-address">
            <div className="label">
              <span className="color-red">*</span>详细地区:
            </div>
            <div className="input">
              <textarea name="street1" value={street1} onChange={this.handleChange} />
            </div>
          </div>
          <div className="input-container">
            <div className="field accept">
              <div className="label">
                <span className="color-red">*</span>收货人:
              </div>
              <div className="input">
                <input
                  type="text"
                  name="full_name"
                  value={full_name}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="field phone">
              <div className="label">
                <span className="color-red">*</span>手机号码:
              </div>
              <div className="input">
                <input
                  type="text"
                  name="phone_number"
                  value={phone_number}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="field postalCode">
            <div className="label">邮政编码:</div>
            <div className="input">
              <input
                type="text"
                name="zip_or_postal_code"
                value={zip_or_postal_code}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="input-container">
            {warnText ? (
              <div className="warn-text-container">
                <span>{warnText}</span>
              </div>
            ) : null}
          </div>
        </form>
        <div className="btns">
          <a className="button cancel" onClick={handleClose}>
            取消
          </a>
          <a className="button ok" onClick={this.onCreate}>
            确定
          </a>
        </div>
      </XModal>
    );
  }
}

AccountModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  isEdit: PropTypes.boolean
};

AccountModal.defaultProps = {
  isEdit: false,
};
