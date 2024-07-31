import { startCase } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';

import XSelect from '@resource/components/XSelect';

import { XButton, XIcon, XInput, XModal } from '@common/components';

import { createPreset, getTagIdOptions, subjectEnum } from '../../WebsitePresets/service';

import './index.scss';

const AddWebsitePresetModal = props => {
  const { data } = props;
  const close = data.get('close');
  const baseUrl = data.get('baseUrl');
  const subject = data.get('subject');

  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [tagIdOptions, setTagIdOptions] = useState([]);

  const handleInputChange = e => {
    setName(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleCreate = async () => {
    if (!name || !String(tagId)) return;
    try {
      await createPreset({ baseUrl, name, tagId, subject });
      close();
    } catch (e) {
      console.log(e);
      setErrorMessage(e.message);
    }
  };

  const init = useCallback(async () => {
    const options = await getTagIdOptions({ baseUrl, subject, addAllOption: false });
    setTagIdOptions(options);
  }, [baseUrl, subject]);

  useEffect(() => {
    init();
  }, [init]);

  const selectProps = {
    className: '',
    placeholder: 'Please select...',
    searchable: false,
    options: tagIdOptions,
    onChanged: o => setTagId(o.value),
    value: tagId,
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

  const title = `Create New ${subjectLabel}`;

  return (
    <XModal
      className="add-website-preset-modal"
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
        <div>
          <div className="control-label">
            {subject === subjectEnum.website ? 'Category' : 'Type'}
          </div>
          <XSelect {...selectProps} />
        </div>
      </div>
      <div className="modal-footer">
        <XButton className="white pwa-btn" onClicked={close}>
          {t('CANCEL')}
        </XButton>
        <XButton className="pwa-btn" onClicked={handleCreate} disabled={!String(tagId) || !name}>
          {t('CREATE')}
        </XButton>
      </div>
    </XModal>
  );
};

export default memo(AddWebsitePresetModal);
