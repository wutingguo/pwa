import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {get, isEmpty} from 'lodash';
import Create from './Create';
import CustomProductList from './List';
// import {computedNewCustomSize} from '@resource/lib/computed';
import {formInitialValue} from './config';

const EmptyContent =  memo(() => (
  <div className='custom-product-empty-content'>
    {t('NONE_SELECTED_CUSTOM_PRODUCT_MESSAGE')}
  </div>
));

export class CustomProductPage extends Component {
  constructor(props) {
    super(props);
    const {treeData} = props;
    let currentValue;
    if(Array.isArray(treeData)) {
      currentValue = get(treeData, [0, 'children', 0, 'key']);
    }
    this.state = {
      isCreate: false,
      currentValue, // 当前选中的自定义产品
      currentData: this.getCurrentDataByValue(currentValue),
      saveDisabled: false
    }
  }
  getFormRef = node => this.formRef = node;
  getCurrentDataByValue(value) {
    const {allProducts={}} = this.props;
    return allProducts[value] || {};
  }
  handleSelect = (value) => {
    const {treeData} = this.props;
    let currentValue;
    if(!value) {
      value = get(treeData, [0, 'children', 0, 'key']);
    }
    currentValue = Array.isArray(value) ? value[0] : value;
    const currentData = this.getCurrentDataByValue(currentValue);
    if(isEmpty(currentData)) {
      this.setState(() => ({
        isCreate: false,
        currentValue: null,
        currentData: {}
      }))
      return;
    }
    this.setState(() => ({
      isCreate: false,
      currentValue,
      currentData
    }), () => {
      this.formRef && this.formRef.resetFields();
    });
  }
  handleCreate = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerLabs_Click_Create'
    });
    const {categoryList=[]} = this.props;
    const defaultCategory = get(categoryList, [0, 'value']);
    this.setState(() => ({
      isCreate: true,
      currentValue: null,
      currentData: formInitialValue(defaultCategory)
    }), () => {
      this.formRef && this.formRef.resetFields();
    })
  }
  handleConfirmDelete = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerLabs_Click_Delete'
    });
    
    const {getTreeDate, boundProjectActions:{deleteLab}} = this.props;
    const {currentValue} = this.state;
    deleteLab({product_code: currentValue}).then(() => {
      getTreeDate && getTreeDate().then(() => {
        this.handleSelect();
      });
    });
  }
  handleDelete = () => {
    const {boundGlobalActions} = this.props;
    const {showConfirm, hideConfirm} = boundGlobalActions;
    const data = {
      title: t('LABS_DELETE'),
      message: t('ACTION_CANNOT_BE_UNDONE'),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('CANCEL'),
          className: 'pwa-btn white',
        },
        {
          text: t('DELETE'),
          className: 'pwa-btn',
          onClick: this.handleConfirmDelete
        }
      ]
    }
    showConfirm(data);
  }
  showVerifyModal() {
    const {boundGlobalActions} = this.props;
    const {showConfirm, hideConfirm} = boundGlobalActions
    const data = {
      message: t('VERIFY_TEMPLATE_BEFORE_SAVE_LAB'),
      close: hideConfirm,
      buttons: [
        {
          text: t('OK'),
          className: 'pwa-btn',
          onClick: hideConfirm
        }
      ]
    }
    showConfirm(data);
  }
  // async verifyBeforeSave({width, height, category}) {
  //   const {categoryList=[], boundProjectActions} = this.props;
  //   const {getTemplateSizeList} = boundProjectActions;
  //   const selectCateoryItem = categoryList.find(item => item.value == category) || {};
  //   const template = computedNewCustomSize(width, height);
  //   const result = await getTemplateSizeList({
  //     category: selectCateoryItem.category_code,
  //     product: 'THIRD_LAB_PHOTO_BOOK',
  //     is_cover_template: 0,
  //     cover: 'HC'
  //   })
  //   if(result && result.ret_code === 200000) {
  //     const templateSizeList = result.data;
  //     return templateSizeList.includes(template);
  //   }
  //   return false;
  // }
  onSubmit = async (values, sizeValue) => {
    const {getTreeDate, boundProjectActions:{createLab}} = this.props;
    this.setState(() => ({
      saveDisabled: true
    }));
    //保存前的尺寸校验， 暂不做校验，强行匹配
    // const verify = await this.verifyBeforeSave(sizeValue);
    // if(verify) {
    createLab(values).then((res) => {
      const {product_code:key} = res.data || {};
      getTreeDate && getTreeDate().then(() => {
        this.handleSelect(key);
        this.setState(() => ({
          saveDisabled: false
        }));
      });
    });
    // }else {
    //   this.showVerifyModal();
    //   this.setState(() => ({
    //     saveDisabled: false
    //   }));
    // }
  }
  render() {
    const {categoryList, productNameList, treeData} = this.props;
    const {isCreate, saveDisabled, currentValue, currentData} = this.state;
    const listProps = {
      treeData,
      currentValue,
      onSelect: this.handleSelect,
      onCreate: this.handleCreate,
      onDelete: this.handleDelete
    }
    const formClass = classNames({
      'hide': !currentValue && ! isCreate
    });
    const createFormProps = {
      className: formClass,
      isCreate,
      saveDisabled,
      categoryList,
      productNameList,
      initialValues: currentData,
      formRef: this.formRef,
      getFormRef: this.getFormRef,
      onSubmit: this.onSubmit
    }
    return (
      <div className='custom-product-page-wrapper'>
        <CustomProductList {...listProps} />
        <Create {...createFormProps} />
        {
          !currentValue && !isCreate ? <EmptyContent /> : null
        }
      </div>
    )
  }
}

export default CustomProductPage;
