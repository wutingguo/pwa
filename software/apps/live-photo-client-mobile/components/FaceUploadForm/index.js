import cls from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import useBoundGlobalActions from '@common/hooks/useBoundGlobalActions';

import { Authority } from '@common/utils/localStorage';

import { useMessage } from '@common/hooks';

import loadingSrc from '@apps/live-photo-client-mobile/components/ModalEntry/ImageViewer/img/loading.gif';
import {
  AVATAR_SEARCH_DRAWER,
  CLAUSE_DRAWER,
} from '@apps/live-photo-client-mobile/constants/modalTypes';
import { submitFaceInfo, uploadFileCombine } from '@apps/live-photo-client-mobile/servers';
import FButton from '@apps/live/components/FButton';
import Form, { useForm } from '@apps/live/components/Form';

import FormItem from './FormItem';
import { Container, Content, Footer, Loading, Title, UploadBody } from './layout';
import { MAXSIZE, faceFormConfigs, judgeImageSuffix, uploadAccetps } from './opts';

/**
 * 表单缓存
 * 前端输入了基本信息（姓名、电话、Email）需要记录该信息，再次进入自动填写完成
 */
const auth = new Authority();

/**
 * 人脸上传表单
 * @typedef {Object} FaceUploadFormProps
 * @property {Function} onClose 关闭弹窗回调
 * @param {FaceUploadFormProps} props
 */
const FaceUploadForm = props => {
  const { onClose } = props;
  // 消息提示
  const [placeholder, message] = useMessage({ style: { fontSize: 24 } });
  // 获取全局actions
  const boundGlobalActions = useBoundGlobalActions();
  // url携带的字段
  const urlParams = new URLSearchParams(window.location.search);
  const enc_broadcast_id = urlParams.get('enc_broadcast_id');
  // 缓存记录
  const faceUploadID = `${enc_broadcast_id}-face-upload-form`;
  // baseUrl
  const urls = useSelector(state => state.root?.system.env.urls);
  const baseUrl = urls.get('saasBaseUrl');
  // 表单信息
  const [form] = useForm();
  // 上传loading
  const [loading, setLoading] = useState(false);
  // 同意阅读协议
  const [readed, setReaded] = useState(false);
  // 上传ref
  const inputRef = useRef();

  /**
   * 前端记录填写人脸上传表单信息，用于下次自动填写
   */
  const setFaceUploadForm = () => {
    const formData = auth.getCode(faceUploadID);
    if (formData) {
      form.setFieldsValue(formData);
    }
  };

  /**
   * 初始化
   */
  useEffect(() => {
    setFaceUploadForm();
  }, []);

  /**
   * 点击上传按钮事件
   * 需要校验表单，校验成功才能上传
   */
  const uploadImage = () => {
    // data为null则校验不成功
    const data = form.getFormData();
    if (!data) {
      return;
    }
    inputRef.current.click();
  };

  /**
   * 跳转到人脸搜索页面
   * @param {Object} param0
   * @param {Object} param0.image_data 上传的人脸图片信息
   * @param {string} param0.submit_id 提交id
   */
  const goToFaceSearchPage = ({ image_data, submit_id }) => {
    // 放在后面相当于dispatch是异步action
    const { showModal, hideModal } = boundGlobalActions;
    showModal(AVATAR_SEARCH_DRAWER, {
      handleClose: () => {
        hideModal(AVATAR_SEARCH_DRAWER);
      },
      imageId: image_data.enc_image_id,
      baseUrl,
      imageInfo: image_data, // 当前图片信息
      selfieCheckInEnable: true, // 打开了隐私模式
      submitId: submit_id, // 上传提交id
    });
  };

  /**
   * 上传事件
   */
  const handleFileChange = async e => {
    const files = e.target.files;
    const file = files[0];
    // 判断图片格式
    if (judgeImageSuffix(file)) {
      message.error(t('LIVE_AI_FACE_IMAGE_TYPE_TIP'));
      return;
    }
    // 判断图片大小
    if (file.size > MAXSIZE) {
      message.error(t('LIVE_AI_FACE_IMAGE_SIZE_TIP'));
      return;
    }
    // 上传
    try {
      setLoading(true);
      const params = {
        baseUrl,
        file,
        enc_broadcast_id,
      };
      const res = await uploadFileCombine(params);
      const { upload_result } = res;
      const { image_data } = upload_result[0];
      const formData = form.getFormData();
      auth.setCode(faceUploadID, formData);
      const submitParams = {
        baseUrl,
        enc_broadcast_id,
        ...formData,
        enc_image_id: image_data?.enc_image_id,
        create_source: 2,
      };
      const submitRes = await submitFaceInfo(submitParams);
      setLoading(false);
      onClose(); // 关闭弹窗
      goToFaceSearchPage({
        image_data,
        submit_id: submitRes?.data,
      }); // 进入人脸搜索页面
    } finally {
      setLoading(false);
    }
  };

  /**
   * 阅读协议事件
   */
  const handleChange = e => {
    const { checked } = e.target;
    setReaded(checked);
  };

  /**
   * 打开协议弹窗
   */
  const openClause = () => {
    const { showModal, hideModal } = boundGlobalActions;
    showModal(CLAUSE_DRAWER, {
      handleClose: () => {
        hideModal(CLAUSE_DRAWER);
      },
    });
  };

  return (
    <Container>
      {/* 上传loading */}
      {loading && (
        <Loading>
          <img src={loadingSrc} />
        </Loading>
      )}
      {/* 表单项 */}
      <Form form={form}>
        {faceFormConfigs.map(item => (
          <FormItem key={item.name} {...item} />
        ))}
      </Form>
      {/* 上传人脸 */}
      <Content>
        <Title>{t('LIVE_AI_FACE_RECOGNITION')}</Title>
        <UploadBody>
          <img className="upload_image_avatar" src="./images/faceAvatar.png" />
          <div className="upload_image_avatar_msg">{t('LIVE_AI_FACE_UPLOAD_TIP')}</div>
          <FButton
            className={cls('upload_image_btn', { disabled: !readed || loading })}
            onClick={uploadImage}
          >
            {t('LIVE_AI_FACE_UPLOAD_TIP_2')}
          </FButton>
          {/* 隐藏的input-file */}
          <input
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: 'none' }}
            type="file"
            accept={uploadAccetps.join(',')}
          />
        </UploadBody>
      </Content>
      {/* 协议 */}
      <Footer>
        <input
          id="checkbox"
          className="upload_image_clause_check"
          type="checkbox"
          checked={readed}
          onChange={handleChange}
        />
        <label for="checkbox" className="upload_image_clause_text">
          {t('LIVE_AI_FACE_UPLOAD_TERMS')}
          <span className="upload_image_clause_area" onClick={openClause}>
            《AI Face Recognition Terms of Use》
          </span>
        </label>
      </Footer>
      {/* 提示弹窗 */}
      {placeholder}
    </Container>
  );
};

export default FaceUploadForm;
