import cls from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

import './index.scss';

export default function SideAdvertisingBtn(props) {
  const { envUrls } = props;
  const [show, setShow] = useState(true);
  const baseUrl = envUrls.get('saasBaseUrl');
  // 获取活动信息
  const activityInfo = useSelector(state => state.activityInfo.get('customized_ad')?.toJS());
  const type = activityInfo?.current_ad_type;

  const record = useMemo(() => {
    if (activityInfo.current_ad_type === 0) return null;
    const r = activityInfo.items.find(item => item.ad_type === type);
    return r;
  }, [type]);

  useEffect(() => {
    // 只有自定义侧边广告才有文案动画效果
    if (record?.ad_type !== 2) return;
    init();
  }, [record]);

  function showAIRecognition() {
    const link = document.createElement('a');
    const operatorType = record?.button_function_type;
    const value = record?.button_function_value;
    if (operatorType === 1) {
      // 打开图片
      const imgSrc = getRotateImageUrl({ baseUrl, enc_image_uid: value, thumbnail_size: 1 });
      link.target = '_blank';
      link.href = imgSrc;
    } else if (operatorType === 2) {
      // 打开链接
      link.target = '_blank';
      link.href = value;
    } else if (operatorType === 3) {
      // 拨打电话
      link.href = `tel:${value}`;
    }
    link.click();
  }

  const src = getRotateImageUrl({
    baseUrl,
    enc_image_uid: record?.button_content_value,
    thumbnail_size: 1,
  });

  if (!record) {
    return null;
  }

  function init() {
    const { ad_time } = record;
    const timer = setTimeout(() => {
      setShow(false);
      clearTimeout(timer);
    }, ad_time * 1000);
  }
  // console.log(record, 'record', type);

  /**
   * 按钮内容为图片时，设置背景+照片直播
   * 按钮内容为文案时，显示文案内容
   */
  const renderButtonContent = record => {
    const { button_content_type, button_content_value } = record;
    if (button_content_type === 1) {
      return (
        <span
          style={{ backgroundImage: `url(${src})` }}
          className={cls('side_advertising_btn_inner_icon')}
        />
      );
    }

    return <span className={cls('side_advertising_btn_inner_icon')}>{button_content_value}</span>;
  };

  return (
    <div
      className={cls(type === 2 ? 'side_advertising_btn' : 'side_advertising_bottom')}
      onClick={showAIRecognition}
    >
      {type === 2 ? (
        <span className={cls('side_advertising_btn_inner')}>
          {/* <span
            style={{ backgroundImage: `url(${src})` }}
            className={cls('side_advertising_btn_inner_icon')}
          >
            照片
            <br />
            直播
          </span> */}
          {renderButtonContent(record)}
          {show ? (
            <span className={cls('side_advertising_btn_inner_text')}>{record.ad_text}</span>
          ) : null}
        </span>
      ) : null}
      {type === 3 ? (
        <div className={cls('side_advertising_btn_inner_text')}>{record.ad_text}</div>
      ) : null}
    </div>
  );
}
