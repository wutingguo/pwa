import React, { useEffect } from 'react';

import XButton from '@resource/components/XButton';

import { XModal } from '@common/components';

import FGroupRadio, { FRadio } from '@apps/live/components/FGroupRadio';
import FInput from '@apps/live/components/FInput';
import FInputNumber from '@apps/live/components/FInputNumber';
import { Field, Form, useForm } from '@apps/live/components/Form';

import { defaultFieldConfig, editFormCol, validitorFieldName } from '../opts';

import { Container, Footer, Text } from './layout';

/**
 * 收集项表单弹窗
 * @typedef {Object} EditFormProps
 * @property {Function} onClose 关闭弹窗
 * @property {Function} onOk 提交表单
 * @property {Object} record 编辑项回显
 * @property {Array} fieldConfig 所有收集项
 * @param {EditFormProps} props
 */
const EditForm = props => {
  const { onClose, onOk, record, fieldConfig } = props;
  // 表单收集项
  const [form] = useForm();

  /**
   * 初始化表单值
   */
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.setFieldsValue(defaultFieldConfig);
    }
  }, []);

  /**
   * 表单提交事件
   */
  const onFinish = values => {
    const newValues = { ...record, ...values };
    onOk?.(newValues, !record);
  };

  /**
   * 确定回调
   */
  const handleSubmit = () => {
    form.submit();
  };

  // 标题
  const title = record ? '编辑收集项' : '添加收集项';

  return (
    <XModal opened onClosed={onClose}>
      <Container>
        <Text>{title}</Text>
        <Form form={form} layout="h" wrapCol={editFormCol} onFinish={onFinish}>
          <Field
            required
            name="field_name"
            label="收集项名称"
            rules={[
              { required: true, message: '收集项名称不能为空' },
              {
                validitor: value => validitorFieldName(fieldConfig, value, record),
                message: '收集项名称不能重复',
              },
            ]}
          >
            <FInput placeholder="请输入收集项名称" max={10} />
          </Field>
          <Field
            required
            name="field_length"
            label="收集内容长度"
            rules={[{ required: true, message: '收集内容长度不能为空' }]}
          >
            <FInputNumber placeholder="请输入收集内容长度" min={1} max={50} isInteger={true} />
          </Field>
          <Field
            required
            name="field_type"
            label="收集内容类型"
            rules={[{ required: true, message: '收集内容类型不能为空' }]}
          >
            <FGroupRadio>
              <FRadio value={1}>普通文本</FRadio>
              <FRadio value={2}>联系方式/手机号/电话号</FRadio>
            </FGroupRadio>
          </Field>
          <Field
            required
            name="required"
            label="收集项是否必填"
            rules={[{ required: true, message: '收集项是否必填不能为空' }]}
          >
            <FGroupRadio>
              <FRadio value={1}>必填</FRadio>
              <FRadio value={2}>选填</FRadio>
            </FGroupRadio>
          </Field>
        </Form>
        <Footer>
          <XButton width={160} height={40} className="white" onClicked={onClose}>
            取消
          </XButton>
          <XButton width={160} height={40} onClicked={handleSubmit}>
            确定
          </XButton>
        </Footer>
      </Container>
    </XModal>
  );
};

export default EditForm;
