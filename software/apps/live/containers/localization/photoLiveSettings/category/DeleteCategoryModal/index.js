import React, { useEffect, useState } from 'react';

import FButton from '@apps/live/components/FButton';
import FModal from '@apps/live/components/FDilog';
import FInput from '@apps/live/components/FInput';
import { Field, Form, useForm } from '@apps/live/components/Form';
import { deleteAlbumCategory } from '@apps/live/services/category';

import { Container, Footer, Tips, Title } from './layout';

export default function DeleteCategoryModal(props) {
  const { open, onCancel, onOk, intl, record, baseUrl, queryCategory } = props;

  const title = intl.tf('LP_CATEGORY_DELETE_TIP_TITLE');
  const tip = `${intl.tf('LP_CATEGORY_DELETE_TIP')}：`;
  const [form] = useForm();
  // console.log('record', record);
  const footer = (
    <Footer>
      <FButton
        style={{ marginRight: 40, background: '#fff', border: '1px solid #d8d8d8', color: '#222' }}
        className="btn"
        onClick={handleClose}
      >
        {intl.tf('LP_CATEGORY_CANCEL')}
      </FButton>
      <FButton className="btn" onClick={success}>
        {intl.tf('LP_CATEGORY_CONFIRM')}
      </FButton>
    </Footer>
  );
  async function success() {
    form.submit();
  }

  function handleClose() {
    form.resetFieldsValue();
    onCancel?.();
  }
  async function onFinish() {
    const params = {
      baseUrl,
      category_id: record?.id,
    };
    await deleteAlbumCategory(params);
    form.resetFieldsValue();
    queryCategory();
    onOk?.();
  }

  const validitor = value => {
    return value === record?.category_name;
  };

  return (
    <FModal
      width="400px"
      title={<Title>{title}</Title>}
      open={open}
      onCancel={handleClose}
      footer={footer}
    >
      <Container>
        <Tips>
          <p className="tip">
            <span>{tip}</span>
            <span style={{ fontWeight: 500, color: '#000' }}>{record?.category_name}</span>
          </p>
        </Tips>
        <Form onFinish={onFinish} form={form}>
          <Field
            name="category_name"
            rules={[{ validitor, message: intl.tf('LP_CATEGORY_NAME_DIFFERENT') }]}
          >
            <FInput
              max={30}
              autoFocus={true}
              placeholder={intl.tf('LP_CLASSIFICATION_NAME_INPUT_TIP')}
            />
          </Field>
        </Form>
      </Container>
    </FModal>
  );
}
