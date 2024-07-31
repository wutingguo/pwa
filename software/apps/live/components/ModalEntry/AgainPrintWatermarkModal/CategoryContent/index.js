import React, { useEffect, useState } from 'react';

import XSelect from '@resource/components/XSelect';

import { useMessage } from '@common/hooks';

import FButton from '@apps/live/components/FButton';
import { getAlbumCategory } from '@apps/live/services/category';
import { createRewatermarkTask } from '@apps/live/services/photoLiveSettings';

import { Container } from './layout';

export default function CategoryContent(props) {
  const { baseInfo, baseUrl, intl, handleClose, goToStep } = props;
  const [categoryList, setCategoryList] = useState();
  const [category, setCategory] = useState();
  const [placeholder, message] = useMessage();

  useEffect(() => {
    getCategoryList();
  }, [baseInfo?.enc_album_id]);
  /**
   * 获取所有分类筛选项
   */
  const getCategoryList = async () => {
    if (!baseInfo) return;

    const { enc_album_id } = baseInfo;
    const params = { enc_album_id, baseUrl };
    const res = await getAlbumCategory(params);

    let defaultCategory;
    const opt = res.map(item => {
      if (item.category_type === 1) {
        defaultCategory = item.id;
      }
      return {
        ...item,
        label: item.category_name,
        value: item.id,
      };
    });

    setCategory(defaultCategory);
    setCategoryList(opt);
  };

  function onChange(record) {
    setCategory(record.id);
  }

  async function nextClick() {
    try {
      const params = {
        enc_album_id: baseInfo.enc_album_id,
        baseUrl,
        category_id: category,
      };
      const res = await createRewatermarkTask(params);
      if (res === -1) {
        message.error(intl.tf('LP_WATERMARK_NOT_IMAGE'));
        return;
      }
      goToStep(3);
    } catch (err) {
      console.log('🚀 ~ nextClick ~ err:', err);
    }
    // console.log(props, 'props');
  }
  return (
    <Container>
      <div className="select_line">
        <label className="select_lable">{intl.tf('LP_WATERMARK_SUB_ALBUM')}</label>
        <XSelect
          onChange={onChange}
          options={categoryList}
          placeholder="请选择分类"
          className="select_item"
          value={category}
        />
      </div>
      <div className="bottom_btns">
        <FButton className="btn_cancel" onClick={handleClose}>
          {intl.tf('LP_WATERMARK_CANCEL')}
        </FButton>
        <FButton className="btn_next" onClick={nextClick}>
          {intl.tf('LP_WATERMARK_NEXT')}
        </FButton>
      </div>
      {placeholder}
    </Container>
  );
}
