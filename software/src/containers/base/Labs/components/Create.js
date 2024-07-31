import React, {PureComponent} from 'react';
import classNames from 'classnames';
import FormComponent from '@resource/components/XFormComponent';
import SelectV1 from '@resource/components/XSelectV1'
import { XIcon } from '@common/components';
import {getFormConfig, customSettingKey, precisionMap, customSettingUnitOptions, customSheetNumberRange} from './config';

const changeByUnitKeys = [
  customSettingKey.width,
  customSettingKey.height,
  customSettingKey.bleedLine,
  customSettingKey.safeLine
];

class Create extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUnit: 'inch',
      precisionByUnit: 6
    }
  }
  handleChangePixel = (value) => {
    const {formRef} = this.props;
    const {currentUnit:prevUnit} = this.state;
    const formValues = formRef.getFieldsValue(changeByUnitKeys);
    const newValue = {};
    changeByUnitKeys.forEach(key => {
      let fieldValue = formValues[key];
      newValue[key] = this.convertValue(fieldValue, prevUnit, value);
    });
    formRef.setFieldsValue(newValue);
    this.setState(() => ({
      currentUnit: value,
      precisionByUnit: precisionMap[value]
    }), () => {
      formRef.validateFields(changeByUnitKeys);
    });
  }
  convertValue(value, prevUnit, nextUnit) {
    /** 单位转换
     * inch to px 
     * inch to mm
     * mm to px
     * mm to inch
     * px to inch
     * px to mm
     */
    // 1(inch) = 300(px) = 25.4(mm);
    let newValue;
    if(!value || (Number(value)+'') === 'NaN') {
      return value;
    }
    if(prevUnit === 'inch' && nextUnit === 'px') {
      newValue = Math.round(value * 300);
    }else if(prevUnit === 'inch' && nextUnit === 'mm') {
      newValue = Math.round(value * 25.4);
    }else if(prevUnit === 'mm' && nextUnit === 'px') {
      newValue = Math.round(value / 25.4 * 300);
    }else if(prevUnit === 'mm' && nextUnit === 'inch') {
      newValue = Math.round(value / 25.4 * 1000000) / 1000000;
    }else if(prevUnit === 'px' && nextUnit === 'inch') {
      newValue = Math.round(value / 300 * 1000000) / 1000000;
    }else if(prevUnit === 'px' && nextUnit === 'mm') {
      newValue = Math.round(value * 25.4 / 300);
    }else if(prevUnit === undefined && (nextUnit == 'mm' || nextUnit === 'px')) {
      newValue = Math.round(value);
    }else {
      newValue = value;
    }
    return newValue;
  }
  handleSubmit = () => {
    const {saveDisabled, formRef, onSubmit} = this.props;
    let unit = undefined;
    if(saveDisabled) {
      return;
    }
    // 增加字段校验
    formRef.validateFields().then(values => {
      const [newValues, sizeValue] = [{}, {}];
      // 转换value
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          let value = values[key];
          // 对pages字段做特殊处理
          if(key === customSettingKey.pages) {
            value = {
              current: value,
              ...customSheetNumberRange
            }
          }
          if(key === customSettingKey.category) {
            sizeValue.category = value;
          }
          if(key === customSettingKey.unit) {
            unit = customSettingUnitOptions.find(item => item.value == value).label;
            const width = values[customSettingKey.width];
            const height = values[customSettingKey.height];
            sizeValue.width = this.convertValue(width, value, 'px');
            sizeValue.height = this.convertValue(height, value, 'px');
          }
          if(key.indexOf('.') != -1) {
            const [key1, key2] = key.split('.');
            newValues[key1] = {
              ...(newValues[key1] || {}),
              [key2]: value
            }
          }else {
            newValues[key] = value;
          }
        }
      }
      window.logEvent.addPageEvent({
        name: 'DesignerLabs_Click_Save',
        unit
      });
      onSubmit && onSubmit(newValues, sizeValue);
    }, err => {
      console.log('reject:', err);
    });
  }
  render() {
    const {className, isCreate, categoryList, productNameList, initialValues={}, getFormRef} = this.props;
    const {currentUnit, precisionByUnit} = this.state;
    const title = isCreate ? t('CREATE_NEW_CUSTOM_PRODUCT') : initialValues[customSettingKey.productName];
    const formItemsConfig = getFormConfig({
      categoryList,
      productNameList,
      currentUnit,
      precisionByUnit: isCreate ? precisionByUnit : undefined,
      convertValue: this.convertValue,
      handleChangePixel: this.handleChangePixel
    });
    const saveProps = {
      className: 'custom-setting-header-save-btn',
      type: 'save',
      text: t('LABS_SAVE'),
      onClick: this.handleSubmit
    }
    const formProps = {
      className: 'custom-setting-fields',
      disabled: !isCreate,
      formItemsConfig,
      initialValues,
      getFormRef,
      SelectV1
    }
    const wrapperClas = classNames(className, 'custom-setting-form-container')
    return (
      <div className={wrapperClas}>
        <div className='custom-setting-header'>
          <div className='custom-setting-header-title ellipsis' title={title}>{title}</div>
          {!!isCreate && <XIcon {...saveProps} />}
        </div>
        <FormComponent {...formProps} />
      </div>
    )
  }
}

export default Create;
