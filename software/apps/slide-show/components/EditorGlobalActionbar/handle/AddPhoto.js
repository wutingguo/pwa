import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { Fragment } from 'react';

import { XDropdown, XFileUpload, XIcon, XPureComponent } from '@common/components';

export default class AddPhoto extends XPureComponent {
  getDropdownData = () => {
    const { uploadFromComputer, uploadFromGallery, uploadFromProject } = this.props;

    const c_btn = {
      label: t('UPLOAD_FROM_COMPUTER'),
      value: {
        field: 1,
      },
      action: debounce(uploadFromComputer, 200),
    };
    const g_btn = {
      label: t('UPLOAD_FROM_ZNO_GALLERY'),
      value: {
        field: 2,
      },
      action: uploadFromGallery,
    };
    const p_btn = {
      label: t('UPLOAD_FROM_ZNO_PROJECT'),
      value: {
        field: 3,
      },
      action: uploadFromProject,
    };
    return [c_btn, g_btn, p_btn];
  };

  renderLable = label => {
    return (
      <div className="module-wrap">
        <XIcon type="add" theme="black" text={label} />
      </div>
    );
  };

  renderOptionItem = item => {
    const { computerFileUploadProps } = this.props;
    const labelClassName = classNames('option-item', item.className);

    // uploadFromComputer
    if (item.value.field === 1) {
      return (
        <li key={item.id || item.label} className="add-computer-photo">
          <label className={labelClassName} onClick={() => item.action(item)}>
            <XFileUpload {...computerFileUploadProps} />
            {item.label}
          </label>
        </li>
      );
    }
    // uploadFromGallery
    return (
      <li key={item.id || item.label}>
        <label className={labelClassName} onClick={() => item.action(item)}>
          {item.label}
        </label>
      </li>
    );
  };

  render() {
    const dropdownList = this.getDropdownData();
    const selectedValue = dropdownList[0];

    const dropdownProps = {
      dropdownList,
      selectedValue,
      label: t('ADD_PHOTOS'),
      customClass: 'addphoto-dropdown-selection',
      renderLable: this.renderLable,
      renderOptionItem: this.renderOptionItem,
    };

    return <XDropdown {...dropdownProps} />;
  }
}
