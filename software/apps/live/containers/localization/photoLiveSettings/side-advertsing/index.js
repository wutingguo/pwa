import React, { useEffect, useMemo, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useMessage } from '@common/hooks';

import FInput from '@apps/live/components/FInput';
import { Field, Form, useForm, useWatch } from '@apps/live/components/Form';
import GroupRadio, { Radio } from '@apps/live/components/GroupRadio';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { getAdList, updateAdList } from '@apps/live/services/photoLiveSettings';

import InputNumber from '../launch-page/LogoSection/InputNumber';

import ContentBtn from './ContentBtn';
import OperatorBtn from './OperatorBtn';
import side from './imgs/side.png';
import tip from './imgs/tip.png';
import { Container, Footer, SettingBox, View } from './layout';

export default function SideAdvertsing(props) {
  const { boundGlobalActions, urls, albumInfo: baseInfo } = props;

  const [form] = useForm();
  const [placeholder, message] = useMessage();
  const type = useWatch('ad_type', form);

  const [info, setInfo] = useState({});
  // const [defaultValueObj, setDefaultValueObj] = useState({});
  const baseUrl = urls.get('galleryBaseUrl');
  const wrapCol = {
    labelCol: 5,
    textCol: 18,
  };

  useEffect(() => {
    if (!baseInfo?.enc_album_id) return;
    queryInfo();
  }, [baseInfo?.enc_album_id]);

  async function queryInfo() {
    const { enc_album_id } = baseInfo;
    const params = {
      enc_album_id,
      baseUrl,
    };
    try {
      const res = await getAdList(params);
      const { current_ad_type, items } = res;
      setInfo(res);
      const record = items.find(item => item.ad_type === current_ad_type);
      if (!record) return;
      const fieldData = initData(record, current_ad_type);
      // setDefaultValueObj(record);
      form.setFieldsValue({ ...fieldData });
    } catch (err) {
      console.log('err', err);
    }
  }

  const defaultValueObj = useMemo(() => {
    let obj = {};
    if (type === 1 || !info.items?.length) return obj;
    obj = info.items.find(item => item.ad_type === type);
    return obj;
  }, [info, type]);

  function initData(record, type) {
    const {
      ad_type,
      ad_time,
      ad_text,
      button_content_type,
      button_content_value,
      button_function_type,
      button_function_value,
    } = record;
    if (type === 2) {
      return {
        ad_type,
        ad_time,
        ad_text,
        button_content_type,
        button_content_value,
        button_function_type,
        button_function_value,
      };
    } else if (type === 3) {
      return {
        ad_type,
        ad_text,
        button_function_type,
        button_function_value,
      };
    }
    return {};
  }

  function handleSubmit() {
    // console.log('form', form);
    form.submit();
  }

  async function onFinish(values) {
    const { enc_album_id } = baseInfo || {};
    const { items } = info;
    const current = items.find(item => item.ad_type === values.ad_type);
    const ad_item =
      values.ad_type === 1
        ? undefined
        : {
            id: current.id,
            ...values,
          };
    const params = {
      baseUrl,
      current_ad_type: values.ad_type,
      enc_album_id,
      ad_item,
    };
    try {
      await updateAdList(params);
      message.success('保存成功！');
    } catch (err) {
      console.error(err);
    }
    console.log('Success:', values);
  }

  const src = type === 2 ? tip : type === 3 ? side : '';
  return (
    <WithHeaderComp title="侧边广告">
      <Container>
        <SettingBox>
          <Form form={form} layout="h" wrapCol={wrapCol} onFinish={onFinish}>
            <Field label="广告类型" name="ad_type" layout="v" defaultValue={1}>
              <GroupRadio>
                <Radio value={1}>无广告</Radio>
                <Radio value={2}>自定义侧面广告</Radio>
                <Radio value={3}>自定义底部广告</Radio>
              </GroupRadio>
            </Field>
            {type === 2 ? (
              <>
                <Field
                  label="广告持续时间"
                  name="ad_time"
                  defaultValue={defaultValueObj.ad_time || 1}
                  rules={[{ required: true, message: '广告持续时间不能为空！' }]}
                  required
                >
                  {(value, onChange) => {
                    return (
                      <div className="setting_date">
                        <div style={{ width: 120 }}>
                          <InputNumber
                            width="100%"
                            min={1}
                            max={10}
                            value={value}
                            onChange={v => onChange(isNaN(parseInt(v, 10)) ? '' : parseInt(v, 10))}
                          />
                        </div>
                        <div className="setting_date_tip">广告展示时间，可设置1-10秒</div>
                      </div>
                    );
                  }}
                </Field>
                <Field
                  required
                  label="广告文案"
                  name="ad_text"
                  rules={[{ required: true, message: '广告文案不能为空！' }]}
                  defaultValue={defaultValueObj.ad_text}
                >
                  <FInput placeholder="请输入广告内容" max={20} />
                </Field>
                <Field
                  required
                  label="按钮内容"
                  name="button_content_type"
                  defaultValue={defaultValueObj.button_content_type || 1}
                >
                  <ContentBtn
                    baseUrl={baseUrl}
                    boundGlobalActions={boundGlobalActions}
                    defaultValueObj={defaultValueObj}
                    name="button_content_type"
                  />
                </Field>
                <Field
                  required
                  label="按钮功能"
                  name="button_function_type"
                  defaultValue={defaultValueObj.button_function_type || 1}
                >
                  <OperatorBtn
                    baseUrl={baseUrl}
                    boundGlobalActions={boundGlobalActions}
                    defaultValueObj={defaultValueObj}
                    name="button_function_type"
                  />
                </Field>
              </>
            ) : null}
            {type === 3 ? (
              <>
                <Field
                  required
                  label="广告文案"
                  name="ad_text"
                  rules={[{ required: true, message: '广告文案不能为空！' }]}
                  defaultValue={defaultValueObj.ad_text}
                >
                  <FInput placeholder="请输入广告内容" max={20} />
                </Field>
                <Field
                  required
                  label="按钮功能"
                  name="button_function_type"
                  defaultValue={defaultValueObj.button_function_type || 1}
                >
                  <OperatorBtn
                    baseUrl={baseUrl}
                    boundGlobalActions={boundGlobalActions}
                    defaultValueObj={defaultValueObj}
                  />
                </Field>
              </>
            ) : null}
          </Form>
        </SettingBox>
        <View>
          <img src={src} />
        </View>
        <Footer>
          <XButton width={200} height={40} onClick={handleSubmit}>
            保存设置
          </XButton>
        </Footer>
        {placeholder}
      </Container>
    </WithHeaderComp>
  );
}
