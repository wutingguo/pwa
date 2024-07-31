import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useMessage, useRequest } from '@common/hooks';

import FImageBox from '@apps/live/components/FImageBox';
import FImageUpload from '@apps/live/components/FImageUpload';
import FInput from '@apps/live/components/FInput';
import Form, { Field, useForm } from '@apps/live/components/Form';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { getShare, updateShare } from '@apps/live/services/photoLiveSettings';
import img01 from '@apps/live/static/background/wechat-share.png';

import { Content, Footer, Info, List } from './layout';

export default function WechatShare(props) {
  const { urls, baseInfo, boundGlobalActions } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const sassBaseUrl = urls.get('saasBaseUrl');
  const [form] = useForm();
  const { run, loading } = useRequest(updateShare, { baseUrl });
  const [placeholder, message] = useMessage();

  const [detail, setDetail] = useState(null);
  const [isShowDefault, setIsShowDefault] = useState(true);

  useEffect(() => {
    if (loading || !baseInfo?.broadcast_id) return;
    queryInfo();
  }, [loading, baseInfo?.broadcast_id]);

  async function onFinish(values) {
    const { share_cover, ...rest } = values;
    const cover = share_cover?.[0] ? share_cover[0].imageId : '';
    const params = {
      ...rest,
      broadcast_id: baseInfo?.broadcast_id,
      share_cover: cover,
    };
    await run(params);
    message.success('保存成功！');
    // console.log(values);
  }
  async function queryInfo() {
    const params = {
      baseUrl,
      id: baseInfo?.broadcast_id,
    };
    const res = await getShare(params);
    if (!res) return;
    const { share_title, share_desc, share_cover } = res;
    const cover = share_cover ? share_cover.split(',').map(imageId => ({ imageId })) : [];

    if (!!share_cover) {
      setIsShowDefault(false);
    } else {
      setIsShowDefault(true);
    }

    setDetail(res);
    form.setFieldsValue({
      share_title,
      share_desc,
      share_cover: cover,
    });
  }

  function submitForm() {
    form.submit();
  }

  function uploadChange() {
    setIsShowDefault(false);
  }

  function beforeUpload(files) {
    const size = files[0].size / 1024 / 1024;
    if (size >= 5) {
      message.error('请上传小于5M的图片');
      return false;
    }
    return true;
  }

  const coverLabel = (
    <span>
      <span>分享封面</span>
      <span style={{ fontSize: 14, color: '#7B7B7B', marginLeft: 10 }}>
        推荐尺寸：宽300px，高300px
      </span>
    </span>
  );

  const titleLabel = (
    <span>
      <span>分享标题</span>
      <span style={{ fontSize: 14, color: '#7B7B7B' }}>（建议20个字以内，以免分享后显示不全）</span>
    </span>
  );
  const defaultUrl = `${sassBaseUrl}clientassets-cunxin-saas/portal/images/pc/live/placeholder.png`;
  return (
    <WithHeaderComp title="微信分享">
      <Content>
        <List>
          <Form form={form} onFinish={onFinish}>
            <Field name="share_cover" label={coverLabel}>
              <FImageUpload
                baseUrl={baseUrl}
                isShowTip={false}
                isShowSuccessIcon
                orientation={detail?.orientation}
                onChange={uploadChange}
                boundGlobalActions={boundGlobalActions}
                beforeUpload={beforeUpload}
              >
                {isShowDefault ? (
                  <FImageBox
                    defaultUrl={defaultUrl}
                    isShowSuccessIcon
                    style={{ width: '120px', height: '120px', marginRight: 10 }}
                  />
                ) : null}
              </FImageUpload>
            </Field>
            <Field name="share_title" label={titleLabel}>
              <FInput max={200} placeholder="请输入分享标题" />
            </Field>
            <Field name="share_desc" label="分享描述">
              <FInput.Textarea rows={5} max={200} placeholder="请输入分享描述" />
            </Field>
          </Form>
        </List>
        <Info>
          <img src={img01} width={544} />
        </Info>
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
