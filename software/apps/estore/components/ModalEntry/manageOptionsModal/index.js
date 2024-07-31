import React, { useEffect, useState } from 'react';

import { XCheckBox } from '@common/components';

import estoreService from '@apps/estore/constants/service';

import CommonModal from '../commonModal/index';

import './index.scss';

const ManageProductOptionsModal = props => {
  const [cur, setCur] = useState(0);
  const [originalOptionsTemp, setOriginalOptionsTemp] = useState([]);
  const [existedOptions, setExistedOptions] = useState([]);
  const [localOptions, setLocalOptions] = useState([]);

  const { urls, data, boundGlobalActions } = props;
  const optionStates = data.get('optionStates').toJS() || [];
  const backupOptionStates = data.get('backupOptionStates').toJS() || [];
  const baseUrl = urls.get('estoreBaseUrl');
  const pushOption = data.get('pushOption');
  const close = data.get('close');

  useEffect(() => {
    estoreService.getDigitalProductTemplate({ baseUrl }).then(res => {
      setOriginalOptionsTemp(JSON.parse(res.customized_default_attrs));
    });
    if (backupOptionStates.length) {
      setOptions(backupOptionStates, setExistedOptions);
    }
  }, []);

  useEffect(() => {
    if (optionStates.length) {
      setOptions(optionStates, setLocalOptions);
    }
  }, [JSON.stringify(optionStates)]);

  const setOptions = (opts, fn) => {
    const combineSpuAttrs = [];
    opts.forEach(item => {
      if (item.spu_attr_values && item.spu_attr_values.length) {
        item.spu_attr_values.forEach(subItem => {
          combineSpuAttrs.push({
            ...subItem,
            term_code: item.term_code,
          });
        });
      }
    });
    fn(combineSpuAttrs);
  };

  const changeLabel = idx => {
    setCur(idx);
  };

  const changeSelected = obj => {
    const { checked, value } = obj;
    const optGroups = originalOptionsTemp[cur].customized_spu_attr_value_list;
    const opt = optGroups.find(_item => _item.value_term_code === value);
    let newOptions = localOptions;
    if (checked) {
      const isExiseted = existedOptions.find(item => item.value_term_code === value);
      newOptions = newOptions.concat(
        isExiseted || {
          ...opt,
          term_code: originalOptionsTemp[cur].term_code,
        }
      );
    } else {
      newOptions = newOptions.filter(item => item.value_term_code !== value);
    }
    setLocalOptions(newOptions);
  };

  const modalProps = {
    title: 'Product Options',
    errInfo: !optionStates.length,
    onOk: () => {
      const outOptions = optionStates.map(item => {
        const findOpts = localOptions.filter(_item => _item.term_code === item.term_code);
        return {
          ...item,
          spu_attr_values: findOpts,
        };
      });
      const isEmpty = outOptions.find(item => !item.spu_attr_values.length);
      if (isEmpty) {
        boundGlobalActions.addNotification({
          message: 'At least one value should be selected for each option.',
          level: 'error',
          autoDismiss: 2,
        });
        return;
      }
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUManageOptionsPop_Click_Confirm',
      });
      pushOption(outOptions);
      close('ok');
    },
  };
  // console.log('originalOptionsTemp: ', originalOptionsTemp);

  let checkProps = [];
  if (originalOptionsTemp[cur] && originalOptionsTemp[cur].customized_spu_attr_value_list) {
    checkProps = originalOptionsTemp[cur].customized_spu_attr_value_list.map(item => {
      const isExisted = !!localOptions.find(
        _item => _item.value_term_code === item.value_term_code
      );
      // const currentGroup = localOptions.filter(
      //   _item => _item.term_code === originalOptionsTemp[cur].term_code
      // );
      // const disabled = currentGroup.length === 1 && isExisted;
      return {
        ...item,
        checked: isExisted,
        // checkboxDisabled: disabled,
        className: 'black-theme',
        value: item.value_term_code,
        key: item.value_term_code,
        text: item.display_name,
        onClicked: changeSelected,
      };
    });
  }

  return (
    <CommonModal className="manageProductOptions" {...props} {...modalProps}>
      <div className="labels">
        {optionStates.map((item, idx) => (
          <div
            className={`label ${cur === idx ? 'cur' : ''}`}
            key={item.term_code}
            onClick={() => changeLabel(idx)}
          >
            {item.display_name}
          </div>
        ))}
      </div>
      <div className="checksWrapper">
        {checkProps.map(item => (
          <XCheckBox {...item} />
        ))}
      </div>
    </CommonModal>
  );
};

export default ManageProductOptionsModal;
