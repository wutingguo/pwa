import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useMessage, useRequest } from '@common/hooks';

import Switch from '@apps/gallery/components/Switch';
import FImageBox from '@apps/live/components/FImageBox';
import FImageUpload from '@apps/live/components/FImageUpload';
import FInput from '@apps/live/components/FInput';
import Form, { Field, useForm } from '@apps/live/components/Form';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { queryAdver, updateAdver } from '@apps/live/services/photoLiveSettings';

import guide from './imgs/guide.png';
import { Content, Footer, Info, List, SwitchInfo } from './layout';

// 表单布局
const wrapCol = {
  labelCol: 5,
  textCol: 19,
};

export default function EndAdvertisement(props) {
  const { urls, baseInfo, boundGlobalActions } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const sassBaseUrl = urls.get('saasBaseUrl');
  const [form] = useForm();
  const [placeholder, message] = useMessage();
  const [checked, setChecked] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isShowDefault, setIsShowDefault] = useState(true);
  const { run, loading } = useRequest(updateAdver, { baseUrl });
  useEffect(() => {
    if (loading || !baseInfo?.album_id) return;
    queryInfo();
  }, [loading, baseInfo?.album_id]);

  async function onFinish(values) {
    const { adver_desc, adver_title, adver_cover } = values;
    if (checked) {
      if (!adver_title) {
        message.error('Ending广告标题不能为空');
        return;
      }
      if (!adver_desc) {
        message.error('品牌介绍不能为空');
        return;
      }
      if (!adver_cover) {
        message.error('Ending广告品牌LOGO不能为空');
        return;
      }
      if (!adver_cover[0]?.imageId) {
        message.error('Ending广告品牌LOGO不能为空');
        return;
      }
    }
    const imageId =
      adver_cover == null
        ? ''
        : adver_cover.length == 0
        ? ''
        : adver_cover && typeof adver_cover[0].imageId === 'string'
        ? adver_cover[0].imageId
        : '';
    const params = {
      id: detail.id,
      status: checked ? 1 : 0,
      title: adver_title ? adver_title : '',
      brand_desc: adver_desc ? adver_desc : '',
      enc_album_id: baseInfo.enc_album_id,
      logo_image_id: imageId ? imageId : '',
    };
    await run(params);
    message.success('保存成功！');
  }
  async function queryInfo() {
    console.log('baseUrl', baseUrl, baseInfo);
    const res = await queryAdver({ baseUrl, enc_album_id: baseInfo.enc_album_id });
    if (!res) return;
    const { status, title, brand_desc, logo_image_id } = res;
    if (!!logo_image_id) {
      setIsShowDefault(false);
    } else {
      setIsShowDefault(true);
    }
    setDetail(res);
    form.setFieldsValue({
      adver_title: title,
      adver_desc: brand_desc,
      adver_cover: logo_image_id ? [{ imageId: logo_image_id, key: 1 }] : null,
    });
    setChecked(status == 0 ? false : true);
  }

  function submitForm() {
    form.submit();
  }

  function uploadChange(e) {
    setIsShowDefault(false);
  }
  function onRemove(e) {
    form.setFieldsValue({
      adver_cover: [],
    });
  }
  function select(e) {
    form.setFieldsValue({
      adver_cover: [],
    });
  }
  function beforeUpload(files) {
    const size = files[0].size / 1024 / 1024;
    const file = files[0];
    const types = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!types.includes(file.type)) {
      message.error('仅支持png、jpg、jpeg');
      return false;
    }
    if (size >= 5) {
      message.error('LOGO大小不超过5M');
      return false;
    }
    return true;
  }
  const onSwitch = value => {
    setChecked(value);
  };
  const coverLabel = (
    <span>
      <span>品牌LOGO</span>
    </span>
  );
  const switchLabel = (
    <SwitchInfo>
      <span style={{ marginTop: '-16px', marginRight: '26px' }}>广告开关</span>
      <Switch onSwitch={v => onSwitch(v)} checked={checked} />
    </SwitchInfo>
  );
  const titleLabel = (
    <span>
      <span>广告标题</span>
    </span>
  );
  const defaultUrl = `${sassBaseUrl}clientassets-cunxin-saas/portal/images/pc/live/placeholder.png`;
  return (
    <WithHeaderComp title="Ending广告">
      <Content>
        <List>
          <Form
            form={form}
            layout="h"
            wrapCol={wrapCol}
            onFinish={onFinish}
            style={{ width: '440px' }}
          >
            <Field name="adver_switch" label={switchLabel}></Field>
            <Field name="adver_title" label={titleLabel}>
              <FInput max={10} placeholder="照片直播" />
            </Field>
            <Field name="adver_desc" label="品牌介绍">
              <FInput.Textarea rows={5} max={100} placeholder="请输入品牌介绍" />
            </Field>
            <Field name="adver_cover" label={coverLabel} style={{ width: '400px' }}>
              <FImageUpload
                // values=
                baseUrl={baseUrl}
                isShowTip={false}
                isShowSuccessIcon
                orientation={detail?.orientation}
                onChange={uploadChange}
                boundGlobalActions={boundGlobalActions}
                beforeUpload={beforeUpload}
                onRemove={onRemove}
                onSelect={select}
              >
                {/* {isShowDefault ? (
                                    <FImageBox
                                        defaultUrl={defaultUrl}
                                        isShowSuccessIcon
                                        style={{ width: '120px', height: '120px', marginRight: 10 }}
                                    />
                                ) : null} */}
              </FImageUpload>
            </Field>
            <div className="image_text_rows">
              <div className="image_text_col">LOGO推荐使用150PX * 150PX，大小不超过5M</div>
            </div>
          </Form>
        </List>
        <img style={{ width: '500px', marginLeft: '100px' }} src={guide} />
      </Content>
      <Footer>
        <XButton width={200} height={40} onClick={submitForm} disabled={loading}>
          保存设置
        </XButton>
      </Footer>
      {placeholder}
    </WithHeaderComp>
  );
}
