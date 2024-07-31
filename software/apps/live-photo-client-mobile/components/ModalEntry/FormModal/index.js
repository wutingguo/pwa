import React from 'react';
import { useSelector } from 'react-redux';

import { Authority } from '@common/utils/localStorage';

import Banner from '@apps/live-photo-client-mobile/components/Banner';
import { CUSTOM_FORM_MODAL } from '@apps/live-photo-client-mobile/constants/modalTypes';
import { submitFormInfo } from '@apps/live-photo-client-mobile/servers';
import FButton from '@apps/live/components/FButton';
import Form, { Field, useForm } from '@apps/live/components/Form';

import FInput from './FInput';

import './index.scss';

// 本地存储第一次登记表单
const auth = new Authority();

export default function FormModal(props) {
  const { data, urls, boundGlobalActions, onSuccess: onSuccessFormProps } = props;
  const { onSuccess: onSuccessFromData } = data?.toJS() || {};
  const onSuccess = onSuccessFormProps || onSuccessFromData;
  const activityInfo = useSelector(state => state.activityInfo);

  const baseUrl = urls.get('saasBaseUrl');

  // 获取enc_broadcast_id作为键存储，一个号只能登记一次
  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  const registerID = `${enc_broadcast_id}-register-form`;

  const formConfigVo = activityInfo.get('form_config_vo')?.toJS();
  const banner = activityInfo.get('banner_vo');

  const { field_config, button_text, title, enc_album_id, banner_enabled } = formConfigVo || {};

  const [form] = useForm();

  async function onFinish(values) {
    const submitInfo = [];
    for (const [key, value] of Object.entries(values || {})) {
      submitInfo.push({
        field_id: +key.slice(1),
        field_value: value,
      });
    }

    const params = {
      enc_album_id,
      submit_info: submitInfo,
      baseUrl,
    };
    const res = await submitFormInfo(params);
    if (res?.ret_code === 200000) {
      auth.setCode(registerID, 1);
      boundGlobalActions?.hideModal(CUSTOM_FORM_MODAL);
      onSuccess?.();
    }
  }

  function onSubmit() {
    form.submit();
  }

  const formConfig = field_config || [];
  return (
    <div className="form_modal">
      <div className="form_content">
        {banner && banner_enabled ? (
          <div className="form_banner">
            <Banner activityInfo={activityInfo} banner={banner} envUrls={urls} />
          </div>
        ) : null}
        <div className="form_title">{title}</div>
        <div className="form_box">
          <Form onFinish={onFinish} form={form}>
            {formConfig.map(item => {
              return <FormItem item={item} />;
            })}
          </Form>
        </div>
        <div className="form_buttons">
          <FButton className="form_submit" onClick={onSubmit}>
            {button_text}
          </FButton>
        </div>
      </div>
    </div>
  );
}

function FormItem(props) {
  const { item } = props;
  const { field_name, field_type, field_length, required, uidpk } = item;
  let rules;

  if (required === 1) {
    rules = [
      {
        required: true,
        message: `请输入${field_name}`,
      },
    ];
  }

  return (
    <Field
      className="field_line"
      required={required === 1}
      name={'x' + uidpk}
      label={field_name}
      rules={rules}
    >
      <FInput
        containerStyle={{ fontSize: '24px' }}
        className="input"
        max={field_length}
        placeholder={`请填写`}
        type={field_type === 1 ? 'text' : 'number'}
      />
    </Field>
  );
}
