import React, { useEffect, useState } from 'react';

import FButton from '@apps/live/components/FButton';
import FModal from '@apps/live/components/FDilog';
import FInput from '@apps/live/components/FInput';
import { Field, Form, useForm } from '@apps/live/components/Form';
import { saveAlbumCategory } from '@apps/live/services/category';

import { Container, Footer, Tips, Title } from './layout';

export default function UpdateCategoryModal(props) {
  const {
    open,
    onCancel,
    onOk,
    intl,
    type = 'add',
    record,
    baseUrl,
    albumId,
    queryCategory,
    message,
  } = props;
  const addText = intl.tf('LP_ADD_CLASSIFICATION');
  const editText = intl.tf('LP_EDIT_CLASSIFICATION');
  const title = type === 'add' ? addText : editText;
  const [form] = useForm();

  useEffect(() => {
    if (type === 'edit' && open) {
      form.setFieldsValue({ category_name: record?.category_name });
    }
  }, [type, record, open]);

  function success() {
    form.submit();
  }

  function handleClose() {
    form.resetFieldsValue();
    onCancel?.();
  }

  async function onFinish(data) {
    const { category_name } = data;
    const params = {
      baseUrl,
      enc_album_id: albumId,
      id: record?.id,
      category_name,
    };
    try {
      await saveAlbumCategory(params);
    } catch (e) {
      if (e.ret_code === 400336) {
        message.error(intl.tf('LP_CATEGORY_NOT_EXIST'));
        return;
      }
      message.error(e.ret_msg);
      return;
    }

    form.resetFieldsValue();
    onOk?.();
    queryCategory();
  }
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

  return (
    <FModal
      width="400px"
      title={<Title>{title}</Title>}
      open={open}
      onCancel={handleClose}
      footer={footer}
    >
      <Container>
        <Form form={form} onFinish={onFinish}>
          <Field
            name="category_name"
            rules={[{ required: true, message: intl.tf('LP_CATEGORY_NAME_NOT_EMPTY') }]}
          >
            <FInput
              max={30}
              autoFocus={true}
              placeholder={intl.tf('LP_CLASSIFICATION_NAME_INPUT')}
            />
          </Field>
        </Form>

        <Tips>
          <p className="tip">{intl.tf('LP_MAX_CLASSIFICATION_LIMIT')}</p>
          <p className="tip">{intl.tf('LP_RECOMMEND_ADD_MORE_ALBUM')}</p>
        </Tips>
      </Container>
    </FModal>
  );
}
