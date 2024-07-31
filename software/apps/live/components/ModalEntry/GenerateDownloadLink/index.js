import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';
import XSelect from '@resource/components/XSelect';

import { XModal } from '@common/components';

import { getAlbumCategory } from '@apps/live/services/category';
import { nextDownloadPackage } from '@apps/live/services/photoLiveSettings';

import { ModalContent } from './layout';

/**
 * 图片版本options
 */
const picVersionOptions = [
  {
    label: '全部原图',
    value: 1,
  },
  {
    label: '人工已修图',
    value: 2,
  },
  {
    label: 'AI已修图',
    value: 3,
  },
  {
    label: '直播图',
    value: 4,
  },
];

export default function GenerateDownloadLink(props) {
  const { data, urls } = props;
  const {
    close,
    title,
    className,
    style,
    onOk,
    cancelText,
    okText,
    okCallBack,
    baseInfo,
    onError,
  } = data.toJS();
  const baseUrl = urls.get('galleryBaseUrl');

  // 图片版本
  const [pic_version, setPicVersion] = useState(1);
  const [category, setCategory] = useState(1);
  const [categoryList, setCateGoryList] = useState([]);

  useEffect(() => {
    if (!baseInfo?.enc_album_id) return;
    getCategoryList();
  }, [baseInfo?.enc_album_id]);
  /**
   * 下一步回调
   */
  const nextClick = async () => {
    const { enc_album_id } = baseInfo;
    const params = {
      baseUrl,
      enc_album_id: enc_album_id,
      pic_version,
      category_id: category,
    };
    try {
      await nextDownloadPackage(params);
      onOk && onOk();
      okCallBack && okCallBack();
    } catch (e) {
      onOk && onOk();
      onError && onError(e);
    }
  };

  /**
   * 关闭回调
   * @param  {...any} arg
   */
  const onClose = (...arg) => {
    close && close(...arg);
  };

  /**
   * 获取所有分类筛选项
   */
  const getCategoryList = async () => {
    const baseInfoParams = baseInfo;
    const { enc_album_id } = baseInfoParams;
    const params = { enc_album_id, baseUrl };
    try {
      const res = await getAlbumCategory(params);
      let flag = false;
      const options = res.map(item => {
        if (item.category_type === 1 && !flag) {
          setCategory(item.id);
          flag = true;
        }
        return {
          label: item.category_name,
          value: item.id,
        };
      });
      setCateGoryList(options || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <XModal className={className} styles={style} opened={true} onClosed={() => onClose('icon')}>
      <div
        className="modal-title"
        style={{ textAlign: 'center', fontWeight: 400, marginBottom: 32 }}
      >
        {typeof title === 'function' ? title() : title}
      </div>
      <div className="modal-body">
        <ModalContent>
          {/* 图片版本 */}
          <div className="pic_version">
            <span className="label">子相册</span>
            <XSelect
              options={categoryList}
              value={category}
              onChanged={({ value }) => setCategory(value)}
            />
          </div>
          <div className="pic_version">
            <span className="label">图片版本</span>
            <XSelect
              options={picVersionOptions}
              value={pic_version}
              onChanged={({ value }) => setPicVersion(value)}
            />
          </div>
        </ModalContent>
      </div>
      <div className="modal-footer">
        <XButton className="white" onClicked={onClose}>
          {cancelText || t('CANCEL')}
        </XButton>
        <XButton onClicked={nextClick}>{okText || t('CONFIRM')}</XButton>
      </div>
    </XModal>
  );
}
