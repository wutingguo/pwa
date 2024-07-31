import EXIF from 'exif-js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import { XModal } from '@common/components';

import { getImageUrl } from '@apps/live-photo-client/utils/helper';

import Info from './Info';
import View from './View';
import { Container } from './layout';

export default function ImageModal(props) {
  const { data, urls, boundGlobalActions } = props;
  const {
    close,
    initialSlide = 0,
    onHide,
    // onReplaceClick,
    download,
    beforeUpload,
    getUploadedImgs,
    uploadData,
    onDateLimit,
    onChangeMove,
    onDelete, // 查看大图新增删除
  } = data.toJS();
  const list = useSelector(state => state.live.albumList);
  const baseUrl = urls.get('galleryBaseUrl');

  const [detail, setDetail] = useState(null);
  const [exifInfo, setExifInfo] = useState({});

  // 国际化语言
  const { intl } = useLanguage();
  // 当前预览图片的index
  const [currentIndex, setCurrentIndex] = useState(initialSlide);

  // console.log('baseInfo----', props);
  function onSlideChange(swiper) {
    const { activeIndex } = swiper;
    setDetail(list[activeIndex]);
    // console.log('activeIndex', activeIndex);
  }
  function onClose() {
    close && close();
    // console.log('close');
  }
  // console.log('list', list);
  useEffect(() => {
    // console.log({list, currentIndex});
    setDetail(list[currentIndex]);
  }, [list, currentIndex]);
  useEffect(() => {
    getCameraInfo();
  }, [detail]);

  function getCameraInfo() {
    if (!detail) return;
    if (exifInfo[detail.enc_content_id]) return;
    let url = getImageUrl(baseUrl, detail.enc_content_id, 1);
    const img = new Image();
    img.src = url;
    img.onload = res => {
      EXIF.getData(img, function () {
        const info = EXIF.getAllTags(this);
        exifInfo[detail.enc_content_id] = JSON.parse(JSON.stringify(info));
        setExifInfo({ ...exifInfo });
        // console.log('EXIF', )
        // EXIF.getTag('exifInfo', exifInfo);
      });
    };
  }

  /**
   *
   * @param {*} type source noWater
   */
  function _download(type) {
    console.log('type', type, detail);
    download(type, detail);
  }

  // function _onReplaceClick() {
  //   console.log('replaceClick');
  //   onReplaceClick(detail);
  // }

  async function _onHide() {
    const result = await onHide(detail);
    setDetail({
      ...detail,
      client_show: result,
    });
    console.log('result', result, detail);
  }

  /**
   * 查看大图删除回调
   * 删除后切换到下一张图片
   * 删除最后一张图片或列表中最后一张图片后自动返回到审查与修图的照片列表页
   * @param {Object} deleteInfo 删除照片的信息
   */
  async function handleDelete(deleteInfo) {
    const id = deleteInfo?.enc_album_content_rel_id;
    await onDelete([id]);
    const deleteIndex = list.findIndex(item => item.enc_album_content_rel_id === id);
    const total = list.length;
    if (deleteIndex + 1 === total || total === 1) {
      // 退出查看大图弹窗
      onClose();
      return;
    }
    setCurrentIndex(deleteIndex);
  }

  /**
   * 显示删除确认弹窗
   */
  function showDeleteModal(deleteInfo) {
    boundGlobalActions.showConfirm({
      title: intl.tf('LP_DELETE_CONFIRM'),
      message: intl.tf('LP_DELETE_CONFIRM_MESSAGE'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: () => handleDelete(deleteInfo),
          className: 'white',
          text: intl.tf('CONTINUE'),
        },
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
        },
      ],
    });
  }

  const modalProps = {
    isHideIcon: true,
    escapeClose: false,
    styles: { width: '100%', height: '100%', padding: 0 },
  };
  // console.log('detail', detail, list);
  return (
    <XModal {...modalProps} opened>
      {/* <div className="modal-title"> </div> */}
      <Container>
        <View
          baseUrl={baseUrl}
          onSlideChange={onSlideChange}
          initialSlide={initialSlide}
          list={list}
        />
        <Info
          boundGlobalActions={boundGlobalActions}
          uploadData={uploadData}
          detail={detail}
          download={_download}
          // onReplaceClick={_onReplaceClick}
          onHide={_onHide}
          onClose={onClose}
          onDateLimit={onDateLimit}
          getUploadedImgs={getUploadedImgs}
          beforeUpload={beforeUpload}
          exifInfo={exifInfo[detail?.enc_content_id]}
          onChangeMove={onChangeMove}
          onDelete={showDeleteModal}
        />
      </Container>
      {/* <div className="modal-footer">
      </div> */}
    </XModal>
  );
}
