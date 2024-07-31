import React, { useEffect } from 'react';

import FButton from '@apps/live/components/FButton';
import FDilog from '@apps/live/components/FDilog';
import FInput from '@apps/live/components/FInput';
import { Field, Form, useForm } from '@apps/live/components/Form';
import useLiveSetting from '@apps/live/hooks/useLiveSetting';
import { addFaceGroup, updateCustomerInfo } from '@apps/live/services/photoLiveSettings';

import { Footer } from './layout';

const wrapCol = {
  labelCol: 6,
  textCol: 14,
};
export default function UpdateInfoModal(props) {
  const { visible, onOk, onCancel, baseUrl, enc_broadcast_id, enc_album_id, info } = props;
  const [form] = useForm();
  const { showLoading, hideLoading } = useLiveSetting();
  const hasEdit = !!info;

  useEffect(() => {
    if (hasEdit && visible) {
      form.setFieldsValue({
        full_name: info?.full_name,
        phone_number: info?.phone_number,
        email: info?.email,
      });
    }
    if (!visible) {
      form.resetFieldsValue();
    }
  }, [hasEdit, visible]);
  async function onFinish(values) {
    console.log('🚀 ~ UpdateInfoModal ~ values:', values);
    showLoading();
    try {
      if (hasEdit) {
        const params = {
          baseUrl,
          detail_id: info?.detail_id,
          submit_id: info?.submit_Id || undefined,
          enc_album_id,
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number,
        };
        await updateCustomerInfo(params);
      } else {
        const params = {
          baseUrl,
          enc_broadcast_id,
          create_source: 1,
          ...values,
        };
        await addFaceGroup(params);
      }
      hideLoading();
    } catch (err) {
      hideLoading();
      console.error(err);
    }
    onOk?.();
  }
  function handleOk() {
    form.submit();
  }
  const footer = (
    <Footer>
      <FButton style={{ width: 160, height: 40 }} onClick={handleOk}>
        OK
      </FButton>
    </Footer>
  );
  return (
    <FDilog open={visible} footer={footer} onCancel={onCancel} width="500px">
      <Form wrapCol={wrapCol} form={form} onFinish={onFinish} layout="h" style={{ padding: 10 }}>
        <Field
          name="full_name"
          label="Full Name"
          rules={{ required: true, message: 'Full Name is required' }}
        >
          <FInput />
        </Field>
        <Field
          name="phone_number"
          label="Phone Number"
          rules={{ required: true, message: 'Phone Number is required' }}
        >
          <FInput />
        </Field>
        <Field name="email" label="Email" rules={{ required: true, message: 'Email is required' }}>
          <FInput />
        </Field>
      </Form>
    </FDilog>
  );
}
