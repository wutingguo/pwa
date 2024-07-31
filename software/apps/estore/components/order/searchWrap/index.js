import React, { Component } from 'react';
import './index.scss';
import XSelect from '@resource/websiteCommon/components/dom/XSelect';
export default class OrderHeader extends Component {
  state = {};
  onStatusChange = (val, type) => {
    const { value } = val;
    const { actions } = this.props;
    const { changeFilter } = actions;
    this.setState(
      {
        [type]: val
      },
      () => {
        const filterProps = {
          ...this.state
        };
        changeFilter(filterProps);
      }
    );
  };
  inputChange = (type, e) => {
    const { actions } = this.props;
    const { changeFilter } = actions;
    this.setState(
      {
        [type]: e.target.value
      },
      () => {
        const filterProps = {
          ...this.state
        };
        changeFilter(filterProps);
      }
    );
  };

  render() {
    const { orderStatus, fulfillmentStatus } = this.props;
    const { order, status, customer, collection, fulfillment } = this.state;

    return (
      <div className="search_wrap">
        <div className="ipt_wrap">
          <input
            onChange={e => {
              this.inputChange('order', e);
            }}
            value={order}
          />
        </div>
        <div className="ipt_wrap">
          <XSelect
            searchable={false}
            options={orderStatus}
            value={status}
            clearable={false}
            onChanged={value => this.onStatusChange(value, 'status')}
          />
        </div>
        <div className="ipt_wrap">
          <input
            onChange={e => {
              this.inputChange('customer', e);
            }}
            value={customer}
          />
        </div>
        <div className="ipt_wrap">
          <input
            onChange={e => {
              this.inputChange('collection', e);
            }}
            value={collection}
          />
        </div>
        <div className="ipt_wrap">
          <XSelect
            searchable={false}
            options={fulfillmentStatus}
            value={fulfillment}
            clearable={false}
            onChanged={value => this.onStatusChange(value, 'fulfillment')}
          />
        </div>
      </div>
    );
  }
}
