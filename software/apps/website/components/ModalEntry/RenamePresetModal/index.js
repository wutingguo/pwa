import { startCase } from 'lodash';
import React, { memo, useState } from 'react';

import { XButton, XIcon, XInput, XModal } from '@common/components';

import { renamePreset } from '../../WebsitePresets/service';

import './index.scss';

const RenamePresetModal = props => {
  const { data } = props;
  const close = data.get('close');
  const onAfterRename = data.get('onAfterRename');

  const baseUrl = data.get('baseUrl');
  const subject = data.get('subject');
  const id = data.get('id');
  const oldName = data.get('name') || '';

  const [name, setName] = useState(oldName);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = e => {
    setName(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!name) return;
    try {
      await renamePreset({
        baseUrl,
        subject,
        id,
        name,
      });
      close();
      onAfterRename && onAfterRename();
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
    }
  };

  const inputProps = {
    className: '',
    value: name,
    placeholder: '',
    onChange: handleInputChange,
    // hasSuffix: true,
    // isShowSuffix: true,
    isShowTip: !!errorMessage,
    tipContent: errorMessage,
    suffixIcon: <XIcon type="input-clear" iconWidth={12} iconHeight={12} />,
  };

  const subjectLabel = startCase(subject);

  const title = `Rename ${subjectLabel}`;

  return (
    <XModal
      className="rename-website-preset-modal"
      opened
      onClosed={() => close()}
      escapeClose
      isHideIcon={false}
    >
      <div className="modal-title">{title}</div>
      <div className="modal-body">
        <div style={{ marginBottom: 16 }}>
          <div className="control-label">{subjectLabel} Name</div>
          <XInput {...inputProps} />
        </div>
      </div>
      <div className="modal-footer">
        <XButton className="white pwa-btn" onClicked={close}>
          {t('CANCEL')}
        </XButton>
        <XButton className="pwa-btn" onClicked={handleSubmit} disabled={!name}>
          {t('SUBMIT')}
        </XButton>
      </div>
    </XModal>
  );
};

export default memo(RenamePresetModal);
