import React, { Component } from 'react';
import { saveOrderAddress } from '../../utils/service';
import AddressModal from '../AddressModal';
import AlertModal from '../AlertModal';

function EditOrderAddressWrapper(WrapComponent) {
  return class EditOrderAddress extends Component {
    constructor() {
      super(...arguments);

      this.state = {
        addressModalProps: null,
        isEditFailed: false
      };

      this.showAddressModal = this.showAddressModal.bind(this);
      this.closeAddressModal = this.closeAddressModal.bind(this);
      this.onEditAddress = this.onEditAddress.bind(this);
      this.closeAlert = this.closeAlert.bind(this);
    }

    showAddressModal(order_number) {
      this.setState({
        addressModalProps: {
          order_number
        }
      });
    }

    closeAddressModal() {
      this.setState({
        addressModalProps: null
      });
    }

    closeAlert() {
      this.setState({
        isEditFailed: false
      });
    }

    onEditAddress(params) {
      const { refreshData } = this.props;
      saveOrderAddress(params)
        .then(() => {
          refreshData && refreshData();
        })
        .catch(err => {
          this.setState({
            isEditFailed: true
          });
        });
    }

    render() {
      const { addressModalProps, isEditFailed } = this.state;
      const addressModalActions = {
        handleClose: this.closeAddressModal,
        handleOk: this.onEditAddress,
        baseUrl: this.props.baseUrl
      };

      const alertModalActions = {
        handleClose: this.closeAlert,
        handleOk: this.closeAlert,
      }
      return (
        <div>
          { addressModalProps ? <AddressModal {...addressModalProps} {...addressModalActions} actions={addressModalActions} /> : null }
          { isEditFailed ? <AlertModal text="地址修改失败，请稍后重试！" actions={alertModalActions} /> : null }
          <WrapComponent ref={node => this.wrapNode = node} {...this.props} showEditAddressModal={this.showAddressModal} />
        </div>
      );
    }
  }
}


export default EditOrderAddressWrapper;
