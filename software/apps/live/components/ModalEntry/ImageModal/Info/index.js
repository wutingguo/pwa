import cls from 'classnames';
import moment from 'moment';
import React from 'react';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import { XFileUpload } from '@common/components';

import DropDown from '@apps/live-photo-client/components/DropDown';
import IconClose from '@apps/live/components/Icons/IconClose';
import { encryptPhoneNumber } from '@apps/live/containers/localization/photoLiveSettings/photo-management/util';

import { Col, Container, Content, Footer, Header, Item, Label, Row, Text, Title } from './layout';

function getwhiteBalanceOpt(type, lang) {
  if (lang !== 'cn') return type;
  if (type == 1) {
    return '自动';
  } else if (type == 2) {
    return '手动';
  } else if (type === 'Auto white balance') {
    return '自动白平衡';
  }
  return type;
}
const exposureProgram = {
  Manual: '手动模式',
};

export default function Info(props) {
  const {
    detail,
    download,
    onHide,
    onClose,
    exifInfo = {},
    beforeUpload,
    getUploadedImgs,
    uploadData,
    boundGlobalActions,
    onDateLimit,
    onChangeMove,
    onDelete, // 查看大图新增删除
  } = props;
  const { intl, lang } = useLanguage();

  /**
   * 变更回调
   */
  const handleChange = () => {
    onChangeMove?.(detail);
  };

  /**
   * 删除回调
   */
  const handleDelete = () => {
    onDelete?.(detail);
  };

  function getInfo() {
    const info = [
      {
        title: intl.tf('LP_CREATION_INFORMATION'),
        children: [
          {
            label: intl.tf('LP_PHOTOGRAPHER'),
            text: detail?.pho_customer_name || encryptPhoneNumber(detail?.pho_customer_phone),
          },
        ],
      },
      {
        title: intl.tf('LP_BASOC_INFO'),
        children: [
          { label: intl.tf('LP_FILE_NAME'), text: detail?.content_name },
          { label: intl.tf('LP_PHOTO_ID'), text: detail?.enc_content_id },
          { label: intl.tf('LP_FILE_SIZE'), text: getFileSize(detail?.content_size) },
          {
            label: intl.tf('LP_PHOTO_NAME'),
            text: detail ? `${detail.width} × ${detail.height}` : intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_PHOTO_SUB_CATEGORY'),
            text: detail?.category_info?.category_name || '无',
            operation: intl.tf('LP_PHOTO_CHANGE'),
          },
        ],
      },
      {
        title: intl.tf('LP_EXIF_INFO'),
        children: [
          { label: intl.tf('LP_MODEL'), text: getModel(exifInfo?.Model) || intl.tf('LP_NONE') },
          {
            label: intl.tf('LP_FNUMBER'),
            text: exifInfo?.FNumber?.toFixed(2) || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_EXPOSUREPROGRAM'),
            text: exifInfo?.ExposureProgram || intl.tf('LP_NONE'),
          },
          { label: intl.tf('LP_ISO'), text: exifInfo?.ISOSpeedRatings || intl.tf('LP_NONE') },
          {
            label: intl.tf('LP_CAPTURE_TIME'),
            text: moment(detail?.shot_time).format('YYYY-MM-DD HH:mm:ss') || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_UPLOAD_TIME'),
            text: moment(detail?.create_time).format('YYYY-MM-DD HH:mm:ss') || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_SHUTTERSPEEDVALUE'),
            text: exifInfo?.ShutterSpeedValue || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_BRIGHTNESSVALUE'),
            text: exifInfo?.BrightnessValue || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_EXPOSUREBIASVALUE'),
            text: exifInfo?.ExposureBiasValue || intl.tf('LP_NONE'),
          },
          {
            label: intl.tf('LP_MAXAPERTUREVALUE'),
            text: exifInfo?.MaxApertureValue || intl.tf('LP_NONE'),
          },
          { label: intl.tf('LP_FOCALLENGTH'), text: exifInfo?.FocalLength || intl.tf('LP_NONE') },
          { label: intl.tf('LP_COLORSPACE'), text: exifInfo?.ColorSpace || intl.tf('LP_NONE') },
          {
            label: intl.tf('LP_WHITEBALANCE'),
            text: getwhiteBalanceOpt(exifInfo?.WhiteBalance, lang) || intl.tf('LP_NONE'),
          },
          { label: 'LesInfo', text: exifInfo?.name || intl.tf('LP_NONE') },
          { label: 'LenModel', text: exifInfo?.name || intl.tf('LP_NONE') },
        ],
      },
    ];
    return info;
  }

  function getModel(name) {
    if (!name) return null;
    const n = name.replace('\x00', 'N');

    return n;
  }
  function getFileSize(size) {
    let s = size / 1024 / 1024;
    let endStr = '';
    if (s > 1) {
      s = s.toFixed(2);
      endStr = 'MB';
    } else {
      s *= 1024;
      s = s.toFixed(2);
      endStr = 'KB';
    }
    return s + endStr;
  }
  const overlay = (
    <div>
      <Item onClick={() => download('origin')}>{intl.tf('LP_PHOTO_MANGEMENT_MASTER_PIC')}</Item>
      <Item onClick={() => download('noWatermark')}>
        {intl.tf('LP_PHOTO_MANGEMENT_UNWATERMARKED_GRAPH')}
      </Item>
    </div>
  );
  const infos = getInfo();

  const uploadProps = {
    multiple: false,
    inputId: 'replace',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: false,
    enc_album_id: detail?.enc_album_id,
    maxUploadFileNums: 1,
    values: uploadData,
    showModal: boundGlobalActions?.showModal,
  };
  // console.log('detail', detail);
  return (
    <Container>
      <Header>
        <span onClick={onClose}>
          <IconClose width={20} fill="#3A3A3A" />
        </span>
      </Header>
      <Content>
        {infos.map((info, index) => {
          return (
            <Row key={info.title} index={index}>
              <Title>{info.title}</Title>
              {info.children.map(child => {
                return (
                  <Col key={child.label}>
                    <Label>{child.label}</Label>
                    <Text>{child.text}</Text>
                    {/* 有移动分类显示 */}
                    {detail?.category_info && (
                      <Text onClick={handleChange} className="operation">
                        {child.operation}
                      </Text>
                    )}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </Content>
      <Footer>
        {/* 新增删除按钮 */}
        <XButton className="pm-btn pm-delete-btn" onClicked={handleDelete}>
          {intl.tf('LP_DELETE')}
        </XButton>
        <DropDown overlay={overlay} type="hover" style={{ background: '#fff', padding: '0px' }}>
          <XButton
            // style={{ width: 100, height: 40, margin: 0, color: '#fff', background: '#3A3A3A' }}
            className="pm-btn"
          >
            {intl.tf('LP_PHOTO_MANGEMENT_DOWNLOAD')}
          </XButton>
        </DropDown>
        {detail?.correct_status !== 2 ? (
          <XFileUpload
            {...uploadProps}
            className="pm-upload-img"
            interfaceType="replace_album_content"
            beforeUpload={files => beforeUpload(files, 'replace', [{ ...detail }])}
            getUploadedImgs={files => getUploadedImgs(files, 'replace', [{ ...detail }])}
          >
            <XButton
              // style={{
              //   background: '#3A3A3A',
              // }}
              className={cls('pm-btn pm-replace-btn')}
              onClicked={e => onDateLimit(e)}
            >
              {intl.tf('LP_REPLACE')}
            </XButton>
          </XFileUpload>
        ) : (
          <XButton
            style={{
              background: '#7B7B7B',
            }}
            className={cls('pm-btn pm-replace-btn')}
          >
            {intl.tf('LP_REPLACED')}
          </XButton>
        )}
        {/* <XButton
          style={{ width: 100, height: 46, margin: 0, color: '#fff', background: '#CC0200' }}
          onClick={onReplaceClick}
        >
          已替换
        </XButton> */}
        <XButton
          style={{
            // width: 100,
            // height: 40,
            // margin: 0,
            // color: '#fff',
            background: !detail?.client_show ? '#7B7B7B' : '#3A3A3A',
          }}
          onClick={onHide}
          className="pm-btn"
        >
          {detail?.client_show ? (
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
          {detail?.client_show ? intl.tf('LP_SHOWN') : intl.tf('LP_NOT_SHOWN')}
        </XButton>
      </Footer>
    </Container>
  );
}
