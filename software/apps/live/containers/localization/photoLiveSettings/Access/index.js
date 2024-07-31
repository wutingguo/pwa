import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import { XCheckBox } from '@common/components';
import { useMessage } from '@common/hooks';

import FInput from '@apps/live/components/FInput';
import { Field, Form, useForm } from '@apps/live/components/Form';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { getAccessInfo, saveAccessSetting } from '@apps/live/services/photoLiveSettings';

import { Bottom, Container, FormBox, GroupCheckBox, SettingBox, View } from './layout';

const src01 = '/clientassets-cunxin-saas/portal/images/pc/live/access/access_tip.jpg';
const src01_en = '/clientassets/cloud/pc/access/access_tip.jpg';

export default function Access(props) {
  const { baseInfo, urls, history } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const { intl } = useLanguage();
  const [form] = useForm();
  const [placeholder, message] = useMessage();

  const [info, setInfo] = useState(null);

  const [setingType, setSettingType] = useState(1);

  function handleClick(type) {
    setSettingType(type);
  }
  // console.log('baseInfo', baseInfo);
  useEffect(() => {
    queryAccessInfo();
  }, [baseInfo?.enc_broadcast_id]);

  useEffect(() => {
    init();
  }, [info, setingType]);

  function init() {
    if (!info && setingType === 1) return;
    form.setFieldsValue({
      ...info,
    });
  }

  async function queryAccessInfo() {
    const { enc_broadcast_id } = baseInfo || {};
    if (!enc_broadcast_id) return;
    const params = {
      enc_broadcast_id,
      baseUrl,
    };
    const res = await getAccessInfo(params);
    const { password, access_title, password_input_tip, password_enable, selfie_check_in_enable } =
      res;
    if (password_enable) {
      setSettingType(password_enable ? 2 : 1);
    }
    if (selfie_check_in_enable) {
      setSettingType(3);
    }
    setInfo({
      password,
      access_title: access_title || intl.tf('LP_ACCESS_WELCOME_WATCH'),
      password_input_tip: password_input_tip || intl.tf('LP_ACCESS_PASSWORD_INPUT_TIP_2'),
    });
  }

  async function onFinish(values) {
    const params = {
      ...values,
      password_enable: setingType === 2,
      enc_broadcast_id: baseInfo?.enc_broadcast_id,
      baseUrl,
      selfie_check_in_enable: setingType === 3,
    };
    await saveAccessSetting(params);
    queryAccessInfo();
    message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
  }

  function validatorPassword(value, type) {
    if (type === 'password') {
      if ((value && value.length < 4) || value.length > 8) {
        return false;
      }
    } else if (type === 'access_title') {
      if (value && value.length > 40) {
        return false;
      }
    } else if (type === 'password_input_tip') {
      if (value && value.length > 40) {
        return false;
      }
    }
    return true;
  }

  function onSave() {
    if (setingType === 1 || setingType === 3) {
      onFinish(info);
      return;
    }
    form.submit();
  }

  function goFaceManagement() {
    const id = baseInfo?.enc_broadcast_id;
    history.push(`/software/live/photo/${id}/face-management`);
  }
  return (
    <WithHeaderComp title={intl.tf('LP_ACCESS_SETTINGS')}>
      <Container>
        <GroupCheckBox>
          <XCheckBox
            checked={setingType === 1}
            onClicked={({ checked }) => handleClick(1, checked)}
            style={{ marginTop: 20 }}
            text={intl.tf('LP_PUBLIC_ACCESS')}
            className="black"
          />
          <XCheckBox
            checked={setingType === 2}
            onClicked={({ checked }) => handleClick(2, checked)}
            style={{ marginTop: 20 }}
            text={intl.tf('LP_PASSWORD_ACCESS')}
            className="black"
          />
          <IntlConditionalDisplay reveals={['en']}>
            <div className="check_face_management_box">
              <XCheckBox
                checked={setingType === 3}
                onClicked={({ checked }) => handleClick(3, checked)}
                style={{ marginTop: 20 }}
                text={'Selfie Check-in'}
                className="black"
              />
              {setingType === 3 ? (
                <>
                  <div className="check_face_management_tip">
                    The Selfie Check-In system automatically identifies and sorts uploaded faces,
                    creating personalized photo albums. Event attendees are required to submit a
                    selfie for access and can subsequently view only photos containing their own
                    image, enhancing privacy and relevance.
                  </div>
                  <XButton width={152} height={32} onClick={goFaceManagement}>
                    Face Management
                  </XButton>
                </>
              ) : null}
            </div>
          </IntlConditionalDisplay>
        </GroupCheckBox>
        {setingType === 2 ? (
          <SettingBox>
            <FormBox>
              <Form form={form} onFinish={onFinish} layout="h">
                <Field
                  required
                  label={intl.tf('LP_ACCESS_PASSWORD_SETTING')}
                  name="password"
                  rules={[
                    { required: true, message: intl.tf('LP_ACCESS_PASSWORD_INPUT_TIP_2') },
                    {
                      validitor: v => validatorPassword(v, 'password'),
                      message: intl.tf('LP_ACCESS_PASSWORD_INPUT_TIP'),
                    },
                  ]}
                >
                  <FInput placeholder={intl.tf('LP_ACCESS_PASSWORD_INPUT_TIP')} />
                </Field>
                <Field
                  required
                  label={intl.tf('LP_ACCESS_SETTING_TITLE')}
                  name="access_title"
                  rules={[
                    { required: true, message: intl.tf('LP_ACCESS_INPUT_TITLE') },
                    {
                      validitor: v => validatorPassword(v, 'access_title'),
                      message: intl.tf('LP_ACCESS_INPUT_TITLE_TIP'),
                    },
                  ]}
                >
                  <FInput placeholder={intl.tf('LP_ACCESS_INPUT_TITLE')} />
                </Field>
                <Field
                  required
                  label={intl.tf('LP_ACCESS_SETTING_TIP')}
                  name="password_input_tip"
                  rules={[
                    { required: true, message: intl.tf('LP_ACCESS_INPUT_TIP') },
                    {
                      validitor: v => validatorPassword(v, 'password_input_tip'),
                      message: intl.tf('LP_ACCESS_INPUT_TIP_TIP'),
                    },
                  ]}
                >
                  <FInput placeholder={intl.tf('LP_ACCESS_INPUT_TIP')} />
                </Field>
              </Form>
            </FormBox>
            <View>
              <img src={intl.lang === 'en' ? src01_en : src01} width="100%" />
            </View>
          </SettingBox>
        ) : null}
        <Bottom>
          <XButton width={200} height={40} onClick={onSave}>
            {intl.tf('LP_SAVE_SETTING')}
          </XButton>
        </Bottom>
        {placeholder}
      </Container>
    </WithHeaderComp>
  );
}
