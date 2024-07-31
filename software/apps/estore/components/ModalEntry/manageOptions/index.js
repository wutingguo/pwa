import React, { Component } from 'react';
import { XModal, XPureComponent } from '@common/components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './index.scss';
class ManagerOptionsModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      attrList: props.data.get('attrList').toJS()
    };
  }

  handleRadioChange(e) {
    const { attrList, currentTabIndex } = this.state;
    const { value, checked, id } = e.target;
    attrList[currentTabIndex].values.forEach(item => {
      item.selected = false;
      if (value != item.value_term_code) {
        const ele = document.getElementById(item.value_term_code);
        ele.checked = false;
      }
    });
    const attrValue = attrList[currentTabIndex].values.find(item => item.value_term_code == value);
    attrValue.selected = checked;
    this.setState({
      attrList
    });
  }

  getRenderRadiosHTML(item) {
    const { values } = item;
    const html = [];
    if (values && values.length) {
      values.map(ele =>
        html.push(
          <div key={ele.display_name} className="input-content">
            <input
              id={ele.value_term_code}
              type="radio"
              defaultChecked={ele.selected}
              onChange={this.handleRadioChange.bind(this)}
              value={ele.value_term_code}
            />
            <span className="text">{ele.display_name}</span>
          </div>
        )
      );
    }
    return html;
  }

  handleCheckboxChange(e) {
    const { attrList, currentTabIndex } = this.state;
    const { value, checked, id } = e.target;
    const attrValue = attrList[currentTabIndex].values.find(item => item.value_term_code == value);
    attrValue.selected = checked;
    this.setState({
      attrList
    });
  }

  getRenderCheckboxHTML(item) {
    const { values } = item;
    const html = [];
    if (values && values.length) {
      values.forEach(ele => {
        const checkboxProps = {
          onClicked: this.handleCheckboxChange,
          checked: ele.selected,
          text: ele.display_name
        };
        html.push(
          <div key={ele.display_name} className="input-content">
            <input
              id={ele.value_term_code}
              type="checkbox"
              defaultChecked={ele.selected}
              onChange={this.handleCheckboxChange.bind(this)}
              value={ele.value_term_code}
            />
            <span className="text">{ele.display_name}</span>
          </div>
        );
      });
    }
    return html;
  }

  handleTabChange(index) {
    this.setState({
      currentTabIndex: index
    });
  }

  confirm = () => {
    const { attrList } = this.state;
    const { data } = this.props;
    const confirm = data.get('confirm');
    confirm(attrList);
  };

  render() {
    const { attrList } = this.state;
    const { data } = this.props;
    const close = data.get('close');
    return (
      <XModal className="estore-manager-options-modal-wrapper" opened={true} onClosed={close}>
        <div className="text title">{t('PRODUCT_OPTIONS')}</div>
        <Tabs onSelect={this.handleTabChange.bind(this)}>
          <div className="tab-header">
            <TabList>
              {attrList.map(item => (
                <Tab key={item.attr_id}>
                  <span className="estore-label">{item.display_name}</span>
                </Tab>
              ))}
            </TabList>
          </div>
          <div className="tab-content">
            {attrList.map(item => {
              return (
                <TabPanel key={`${item.attr_id}`}>
                  <div>
                    {item.value_select_type == 1
                      ? this.getRenderCheckboxHTML(item)
                      : this.getRenderRadiosHTML(item)}
                  </div>
                </TabPanel>
              );
            })}
          </div>
        </Tabs>
        <div className="btns-container">
          <div className="cancel" onClick={close}>
            {t('CANCEL')}
          </div>
          <div className="confirm" onClick={this.confirm}>
            {t('CONFIRM')}
          </div>
        </div>
      </XModal>
    );
  }
}

export default ManagerOptionsModal;
