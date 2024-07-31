import React from 'react';
import styled from 'styled-components';

import { useLanguage } from '@common/components/InternationalLanguage';

import { XFileUpload } from '@common/components';

import FImageBox from '@apps/live/components/FImageBox';
import Add from '@apps/live/components/Icons/Add';
import { uploadFiles } from '@apps/live/services/photoLiveSettings';

import { AddItem, Containter, Icon, Lable, List, Tip } from './layout';

function getId() {
  return Math.random().toString(16).slice(2);
}

export default function FImageUpload(props) {
  const {
    value = [],
    onChange,
    baseUrl,
    max = 1,
    labelText,
    isShowTip = true,
    style,
    isShowSuccessIcon,
    orientation,
    children = null,
    boundGlobalActions,
    beforeUpload,
    curStyle,
    onSelect,
    onRemove,
    isShowAdd = true,
    accept,
    uploadParams,
  } = props;
  const { intl } = useLanguage();

  function onLoad({ key, result }) {
    let i = value.findIndex(item => item.key === key || item.imageId === key);
    if (value.length >= max) {
      i = 0;
    }

    if (i === -1) return;

    if (result.upload_complete && result.upload_complete.length > 0) {
      const { enc_image_id } = result.upload_complete[0].image_data;

      value[i].imageId = enc_image_id;
    } else {
      value[i].imageId = null;
    }
    onChange([...value]);
  }

  function getUploadedImgs(successInfo) {
    let newData = [...value];
    const { upload_complete } = successInfo;
    const filedata = upload_complete.map(file => ({
      imageId: file.image_data.enc_image_id,
      orientation: Number(file.image_data.exif_orientation) || 0,
      key: getId(),
    }));
    newData.push(...filedata);
    const len = newData.length;
    if (len >= max) {
      const i = len - max;
      newData = newData.slice(i, len);
    }
    onChange(newData);
  }

  // console.log('value::', value);
  const fileUploadProps = {
    inputId: 'imageUpload',
    isIconShow: false,
    uploadFilesByS3: true,
    getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    maxUploadFileNums: 1,
    style: { backgroundColor: '#fff', padding: 0 },
    onSelectFile: () => {},
    beforeUpload,
    accept,
    uploadParams,
  };
  return (
    <Containter>
      <List>
        {isShowAdd ? (
          <XFileUpload {...fileUploadProps}>
            <AddItem style={style}>
              <Icon>
                <Add fill="#222222" />
              </Icon>
              <Lable>{labelText || intl.tf('LP_UPLOADED')}</Lable>
            </AddItem>
          </XFileUpload>
        ) : null}
        {children}
        {Array.isArray(value)
          ? value.map((item, index) => {
              const isShowIcon =
                typeof isShowSuccessIcon === 'function'
                  ? isShowSuccessIcon(item, index)
                  : isShowSuccessIcon;
              const cStyle = isShowIcon ? { ...style, ...curStyle } : { ...style };
              return (
                <FImageBox
                  index={item.key || item.imageId}
                  key={item.key || item.imageId}
                  onLoad={onLoad}
                  status="loading"
                  code={item.imageId}
                  baseUrl={baseUrl}
                  size={2}
                  backgroundSize="contain"
                  style={{ width: '120px', height: '120px', ...cStyle }}
                  isShowSuccessIcon={isShowIcon}
                  orientation={item.orientation || orientation}
                  onClick={() => onSelect(item)}
                  onRemove={onRemove}
                />
              );
            })
          : null}
      </List>
      {isShowTip ? (
        <Tip>
          <p>{intl.tf('LP_ALBUM_COVER_MESSAGE')}</p>
          <p>{intl.tf('LP_ALBUM_COVER_MESSAGE_AFTER')}</p>
        </Tip>
      ) : null}
    </Containter>
  );
}
