import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import { useMessage } from '@common/hooks';

import FModal from '@apps/live/components/FDilog';
import { saveLiveSkin } from '@apps/live/services/photoLiveSettings';

import TemplateBox from './TemplateBox';
import ThemeSetting from './ThemeSetting';
import { Container } from './layout';

export default function FormulateModal(props) {
  const { data, boundGlobalActions } = props;
  const [placeholder, message] = useMessage();
  const { intl } = useLanguage();
  const { close, onOk, baseUrl, type, value: initValue } = data.toJS();
  const [values, setValues] = useState({
    album_skin_name: '',
    primary_font_color: '#7B7B7B',
    other_font_color: '#222',
    bg_color: '#fff',
    bg_image_id: undefined,
    decorate_image_id: undefined,
    decorate_color: '#fff',
  });

  useEffect(() => {
    if (type !== 'edit') return;
    Object.keys(values).forEach(key => {
      values[key] = initValue[key];
    });
    values.album_skin_id = initValue.album_skin_id;
    setValues({ ...values });
    // console.log('type', type);
  }, [type]);

  async function onSuccess() {
    if (values.album_skin_name.trim().length === 0) {
      message.error(intl.tf('LP_AT_NAME_NOT_EMPTY'));
      return;
    }
    const params = {
      baseUrl,
      ...values,
    };
    await saveLiveSkin(params);
    onOk && onOk(values);
  }
  function onCancel() {
    close && close();
  }

  // 改变表单数据
  function onChange(key, value) {
    const newValues = { ...values };
    if (key === 'bg_image_id') {
      newValues['bg_color'] = undefined;
    } else if (key === 'bg_color') {
      newValues['bg_image_id'] = undefined;
    }

    if (key === 'decorate_image_id') {
      newValues['decorate_color'] = undefined;
    } else if (key === 'decorate_color') {
      newValues['decorate_image_id'] = undefined;
    }

    newValues[key] = value;
    setValues(newValues);
  }
  // console.log('values', values);
  const footer = (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <XButton
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #d8d8d8',
          width: 160,
          height: 40,
        }}
        onClick={onCancel}
        type="button"
      >
        {intl.tf('LP_CATEGORY_CANCEL')}
      </XButton>
      <XButton onClick={onSuccess} type="button" width={160} height={40}>
        {intl.tf('LP_CATEGORY_CONFIRM')}
      </XButton>
    </div>
  );
  return (
    <FModal
      title={intl.lang == 'cn' ? '制定相册风格' : 'Style'}
      open={true}
      titleStyle={{ textAlign: 'center' }}
      footer={footer}
      onCancel={onCancel}
      style={{ minWidth: 900, top: '10%' }}
    >
      <Container>
        <TemplateBox
          boundGlobalActions={boundGlobalActions}
          onChange={onChange}
          values={values}
          baseUrl={baseUrl}
        />
        <ThemeSetting onChange={onChange} values={values} />
      </Container>
      {placeholder}
    </FModal>
  );
}
