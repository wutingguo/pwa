import cls from 'classnames';
import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { IntlConditionalDisplay } from '@common/components/InternationalLanguage';

import { XFileUpload } from '@common/components';

import Checkbox from './Checkbox';
// AI、置顶、TOP图片
import AIImage from './images/AI.png';
import cancelPinnedIcon from './images/cancelPinned.png';
import pinnedIcon from './images/pinned.png';
import topCNImage from './images/top-cn.png';
import topUSImage from './images/top-us.png';
import { getPickerStatus } from './util';

const ListItem = ({
  data,
  onChange,
  className,
  style,
  beforeUpload,
  getUploadedImgs,
  columnsValue,
  intl,
  lang,
  onPinned,
  onPicker, // 挑图函数
}) => {
  const handleChange = (type, e) => {
    onChange(type, data, e);
  };

  const uploadProps = {
    multiple: false,
    inputId: 'replace',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: false,
    enc_album_id: data?.enc_album_id,
    maxUploadFileNums: 1,
    values: data?.uploadData,
    showModal: data?.boundGlobalActions?.showModal,
  };

  const height = 964 / columnsValue;

  function getUploadText(intl, data) {
    if (intl.lang === 'en') {
      return (
        <svg
          t="1696744740393"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2810"
          id="mx_n_1696744740394"
          width="18"
          height="18"
          style={{ position: 'relative', top: '2px' }}
        >
          <path
            d="M859.04 352H95.936a32 32 0 1 0 0 64h832a32 32 0 0 0 24.448-52.64l-189.088-224a32 32 0 0 0-48.896 41.28L859.04 352zM164.896 640H928a32 32 0 1 0 0-64H96a32 32 0 0 0-24.448 52.64l189.088 224a32 32 0 0 0 48.896-41.28L164.896 640z"
            fill="#ffffff"
            p-id="2811"
          ></path>
        </svg>
      );
    }
    if (data?.correct_status === 2) {
      return intl.tf('LP_PHOTO_MANGEMENT_REPLACED');
    }
    return intl.tf('LP_PHOTO_MANGEMENT_REPLACE');
  }

  /**
   * 置顶方法
   * @param {string} id enc_album_content_rel_id
   * @param {boolean} is_pinned 是否置顶
   */
  const handlePinned = (id, is_pinned = false) => {
    onPinned(id, is_pinned);
  };

  /**
   * 单个挑图方法
   * @param {2|3} type 2: 挑图通过 3: 挑图未通过
   * @param {Object} item 图片数据
   */
  const handlePicker = (type, item) => {
    const { enc_content_id } = item;
    const ids = [enc_content_id];
    onPicker?.(type, ids);
  };

  return (
    <div
      className={cls('pm-list-item', className)}
      style={{ width: `calc(100% / ${columnsValue})` }}
    >
      <div
        className="image-wrapper"
        style={{
          height: `${height}px`,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      >
        <div
          onClick={() => handleChange('modal')}
          className="pm-list-item-img"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${data.src || ''})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        {/* 底部图标和图片名称以及AI */}
        <div className="pm-list-item-content">
          {/* 置顶[CN]/TOP[US] */}
          {data?.pinned === 1 && (
            <img className="pm-list-item-top" src={lang !== 'cn' ? topUSImage : topCNImage} />
          )}
          <div className="pm-list-item-middle">
            <span className="pm-list-item-inner">{data?.content_name}</span>
            {/* 取消照片ID的显示 */}
            {/* <span className="pm-list-item-inner">{data?.show_enc_content_id}</span> */}
          </div>
          {data?.correct_status === 2 && data?.correct_content_source === 'AI' && (
            <img className="pm-list-item-ai" src={AIImage} />
          )}
        </div>
        {/* 挑图状态 */}
        <div className={getPickerStatus(data)?.className} onClick={() => handleChange('modal')}>
          {getPickerStatus(data)?.label}
        </div>
        {/* 选择框-不被挑图状态和上方select下拉框遮盖 */}
        <Checkbox
          className="pm-list-item-checkbox"
          checked={data?.checked}
          onChange={() => handleChange('select')}
        ></Checkbox>
        {/* 置顶、取消置顶图标-不被挑图状态和上方select下拉框遮盖 */}
        <img
          className="pm-list-item-pinned"
          src={data?.pinned === 1 ? cancelPinnedIcon : pinnedIcon}
          onClick={() => handlePinned(data?.enc_album_content_rel_id, !data?.pinned)}
        />
      </div>
      <div className="action-btns">
        <XButton className="pm-btn pm-download-btn">
          {intl.lang === 'cn' ? (
            intl.tf('LP_PHOTO_MANGEMENT_DOWNLOAD')
          ) : (
            <svg
              t="1696744309022"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2296"
              width="18"
              height="18"
              style={{ position: 'relative', top: '2px' }}
            >
              <path
                d="M960 629.888v316.736H64V629.888h76.8v239.936h742.4V629.888H960zM552 515.392l142.784-142.72 54.336 54.272-236.416 236.352-0.32-0.32-0.32 0.256L275.712 426.88l54.272-54.336L475.2 517.76V63.872h76.8v451.52z"
                fill="#ffffff"
                p-id="2297"
              ></path>
            </svg>
          )}

          <div className="pm-btn-menu">
            <XButton
              className="pm-menu-btn pm-origin-btn"
              onClicked={() => handleChange('origin')}
              style={{ width: lang !== 'cn' ? 180 : '' }}
            >
              {intl.tf('LP_PHOTO_MANGEMENT_MASTER_PIC')}
            </XButton>
            <XButton
              className="pm-menu-btn pm-no-watermark-btn"
              onClicked={() => handleChange('noWatermark')}
              style={{ width: lang !== 'cn' ? 180 : '' }}
            >
              {intl.tf('LP_PHOTO_MANGEMENT_UNWATERMARKED_GRAPH')}
            </XButton>
          </div>
        </XButton>
        {/* CN-直播 挑图 */}
        <IntlConditionalDisplay reveals={['cn']}>
          <XButton className={`pm-btn pm-download-btn ${getPickerStatus(data, true)?.className}`}>
            <span>{getPickerStatus(data, true)?.label}</span>
            <div className="pm-btn-menu">
              <XButton className="pm-menu-btn" onClicked={() => handlePicker(2, data)}>
                通过挑图
              </XButton>
              <XButton className="pm-menu-btn" onClicked={() => handlePicker(3, data)}>
                不通过挑图
              </XButton>
            </div>
          </XButton>
        </IntlConditionalDisplay>
        <XFileUpload
          {...uploadProps}
          className="pm-upload-img"
          interfaceType="replace_album_content"
          beforeUpload={files => beforeUpload(files, 'replace', [{ ...data }])}
          getUploadedImgs={files => getUploadedImgs(files, 'replace', [{ ...data }])}
        >
          <XButton
            className={cls('pm-btn pm-replace-btn', data?.correct_status === 2 && 'bgc-red')}
            onClicked={e => handleChange('replace', e)}
            title={intl.lang === 'en' && 'Replace'}
          >
            {getUploadText(intl, data)}
          </XButton>
        </XFileUpload>
        <XButton
          className={cls('pm-btn pm-show-btn', !data?.client_show && 'bgc-red')}
          onClicked={() => handleChange('show')}
          title={intl.lang === 'en' && (data?.client_show ? 'Shown' : 'Not shown')}
        >
          {data?.client_show ? (
            <svg
              t="1696745812125"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8968"
              width="18"
              height="14"
            >
              <path
                d="M512 128c282.752 0 512 230.4 512 384s-229.248 384-512 384-512-230.4-512-384 229.248-384 512-384z m0 192a192 192 0 1 0 0 384 192 192 0 0 0 0-384z m0 64a128 128 0 1 1 0 256 128 128 0 0 1 0-256z"
                fill="#ffffff"
                p-id="8969"
              ></path>
            </svg>
          ) : (
            <svg
              t="1696746062285"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9150"
              width="18"
              height="14"
            >
              <path
                d="M1024 512c0 153.6-229.248 384-512 384a547.328 547.328 0 0 1-205.76-40.96l157.248-157.248a192 192 0 0 0 234.368-234.368l189.568-189.568C972.16 348.608 1024 438.976 1024 512z m-137.664-374.336c11.456 11.52 12.736 29.312 3.84 42.24l-3.84 4.544L184.448 886.272a33.088 33.088 0 0 1-50.56-42.24l3.84-4.544L839.488 137.6a33.088 33.088 0 0 1 46.72 0zM512 128c73.216 0 142.784 15.424 205.76 40.96L560.512 326.208a192 192 0 0 0-234.368 234.24L136.512 750.08C51.776 675.392 0 584.96 0 512c0-153.6 229.248-384 512-384z m9.6 511.68L639.552 521.6A128 128 0 0 1 521.6 639.68z m-19.2-255.36L384.384 502.4A128 128 0 0 1 502.4 384.384z"
                fill="#ffffff"
                p-id="9151"
              ></path>
            </svg>
          )}
          {/* {data?.client_show
            ? columnsValue === 8
              ? ''
              : '已显示'
            : columnsValue === 8
            ? ''
            : '未显示'} */}
        </XButton>
      </div>
    </div>
  );
};

export default ListItem;
