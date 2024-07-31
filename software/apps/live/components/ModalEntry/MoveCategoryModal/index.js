import React, { useState } from 'react';

import { RcRadioGroup } from '@resource/components/XRadio';

import { XFileUpload } from '@common/components';

import FButton from '@apps/live/components/FButton';
import FModal from '@apps/live/components/FDilog';

import { Container, Footer, Title } from './layout';

/**
 * @typedef {object} MoveCategoryModalProps
 * @property {Function} close 取消
 * @property {Function} onOk 确认
 * @property {object} intl 国际化
 * @property {Array} radioOptions 分类选项
 * @property {number} selectedValue 选中分类id
 * @param {MoveCategoryModalProps} props
 */
export default function MoveCategoryModal(props) {
  const { data, boundGlobalActions } = props;
  const {
    close,
    onOk,
    intl,
    radioOptions,
    selectedValue,
    type,
    baseInfo,
    beforeUpload,
    getUploadedImgs,
  } = data.toJS();
  const title = intl.tf('LP_ALBUM_SELECT_TARGET_CATEGORY');
  const [value, setValue] = useState(selectedValue); // 选中的值

  /**
   * 改变radio事件
   * @param {object} e 变化的值
   */
  const handleChange = e => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  /**
   * 取消回调
   */
  const handleClose = () => {
    close?.();
  };

  /**
   * 确认回调
   */
  const handleOk = () => {
    onOk?.(value);
  };

  const uploadProps = {
    multiple: true,
    inputId: 'add',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: false,
    enc_album_id: baseInfo?.enc_album_id,
    album_category_id: value, // 分类id-全部照片
    // getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    maxUploadFileNums: 4,
    // beforeUpload,
    values: [],
  };

  function handleBeforeUpload(files) {
    handleClose();
    return beforeUpload(files, 'add');
  }
  const categroyButton = (
    <XFileUpload
      {...uploadProps}
      uploadParams={{
        isCheckRepeatByInterface: true, // 是否通过接口检查重复
      }}
      className="pm-upload-img"
      interfaceType="add_album_content"
      beforeUpload={files => handleBeforeUpload(files)}
      getUploadedImgs={files => getUploadedImgs(files, 'add')}
    >
      <FButton className="btn" disabled={!value}>
        {intl.tf('CONTINUE')}
      </FButton>
    </XFileUpload>
  );

  const footer = (
    <Footer>
      <FButton
        style={{
          marginRight: 40,
          background: '#fff',
          border: '1px solid #d8d8d8',
          color: '#222',
        }}
        className="btn"
        onClick={handleClose}
      >
        {intl.tf('CANCEL')}
      </FButton>
      {type === 'category' ? (
        categroyButton
      ) : (
        <FButton className="btn" onClick={handleOk} disabled={!value}>
          {intl.tf('CONTINUE')}
        </FButton>
      )}
    </Footer>
  );

  return (
    <FModal
      width="500px"
      title={<Title>{title}</Title>}
      open
      onCancel={handleClose}
      footer={footer}
      style={{ borderRadius: 0 }}
      titleStyle={{ minHeight: 0, marginBottom: 20 }}
      maskStyle={{ zIndex: 50001 }}
      wrapContentStyle={{ zIndex: 50001 }}
    >
      <Container>
        {radioOptions?.length > 0 ? (
          <RcRadioGroup
            wrapperClass="znoRadio"
            onChange={handleChange}
            value={value}
            options={radioOptions}
          />
        ) : (
          <p className="noData">{intl.tf('LP_NOT_DATA')}</p>
        )}
      </Container>
    </FModal>
  );
}
