import classNames from 'classnames';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';
import CheckBox from '@resource/components/XCheckBox/RcCheckBox';

import { applyFormInfo, payWechatSubmit, payWechatUploadImg } from '@common/servers/payWeChat';

import Form, { Field, useForm } from '@apps/live/components/Form';

import { applymentStateCode, submitTypeList } from './config';
import authorizeImg from './img/authorize.png';
import codeImg from './img/code.png';
import { formatApiData, transFormData } from './main';
import {
  // BusinessInfo,
  BankAccountInfo,
  ContactInfo,
  SubjectInfo,
} from './paySection';

import './index.scss';

const PayFormInfo = props => {
  const { baseUrl, boundGlobalActions, applystate, authenticateUrl, setLoading } = props;
  const [form] = useForm();
  const formRef = useRef(null);
  const [applystateCode, setApplystateCode] = useState(applystate);
  const [protocol, setProtocol] = useState(false);
  const [web_info, setWeb_info] = useState({});
  async function onFinish(values) {
    const submitObj = formatApiData(values, web_info);
    // console.log('////submitObj', submitObj);
    payWechatSubmit({
      baseUrl,
      params: submitObj,
    }).then(res => {
      // console.log('res', res);
      if (res.ret_code === 200000) {
        setApplystateCode(applymentStateCode[1]);
      } else {
        boundGlobalActions.addNotification({
          message: res.ret_msg,
          level: 'error',
          autoDismiss: 2,
        });
      }
    });
  }
  function handleSubmit() {
    // console.log('form', form);
    form.submit();
  }

  const activeIndex = useMemo(() => {
    if (!!applystateCode) {
      setProtocol(true);
    }
    if (!applystateCode || applystateCode === applymentStateCode[0]) {
      return 1;
    } else if (applystateCode !== applymentStateCode[6]) {
      return 2;
    }
    return 3;
  }, [applystateCode]);
  useEffect(() => {
    if (applystateCode === applymentStateCode[0]) {
      setLoading(true);
      // 当为APPLYMENT_STATE_EDITTING时 展示重新提交状态 获取提交信息
      applyFormInfo({ baseUrl }).then(data => {
        transFormData(data, form, setWeb_info);
        setLoading(false);
      });
    }
  }, [applystateCode]);
  // useEffect(() => {
  //   // 前端处理授权书图片自动上传
  //   if (!!applystateCode) return; //只有applystateCode为空即初次提交表单信息时上传授权书
  //   const image = new Image();
  //   image.src = authorizeImg;
  //   image.onload = function () {
  //     const { width, height } = image;
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
  //     canvas.width = width;
  //     canvas.height = height;
  //     ctx.drawImage(image, 0, 0, width, height);
  //     canvas.toBlob(res => {
  //       const fileRes = new File([res], 'authorize.png', { type: 'image/png' });
  //       const form = new FormData();
  //       form.append('file', fileRes);
  //       payWechatUploadImg({
  //         baseUrl,
  //         params: form,
  //       })
  //         .then(defaultImg => {
  //           const { media_id, enc_image_id } = defaultImg;
  //           setWeb_info({
  //             enc_image_id,
  //             media_id,
  //           });
  //         })
  //         .catch(e => console.log(e));
  //     });
  //   };
  // }, []);
  const onApplyAgain = () => {
    setApplystateCode(applymentStateCode[0]);
  };
  // const defaultwrapCol = {
  //     labelCol: 1,
  //     textCol: 5,
  // }
  const onChangeProtocol = value => {
    setProtocol(value);
  };
  return (
    <div className="payForm">
      <div className="formHead">
        <div
          className={classNames('stepList', {
            active: activeIndex > 0,
          })}
        >
          <div>1</div>
          <div>创建申请单</div>
        </div>
        <div className="line"></div>
        <div
          className={classNames('stepList', {
            active: activeIndex > 1,
          })}
        >
          <div>2</div>
          <div>签约授权</div>
        </div>
        <div className="line"></div>
        <div
          className={classNames('stepList', {
            active: activeIndex > 2,
          })}
        >
          <div>3</div>
          <div>完成</div>
        </div>
      </div>
      {activeIndex === 1 && (
        <div className="step1">
          <Form
            ref={formRef}
            form={form}
            onFinish={onFinish}
            // wrapCol={defaultwrapCol}
            layout="h"
            // formStateChange={getValues}
          >
            <SubjectInfo {...props} form={form} />
            <ContactInfo />
            <BankAccountInfo {...props} form={form} />
          </Form>
          <div className="submitBtnBox">
            <CheckBox onChange={e => onChangeProtocol(e.target.checked)} checked={protocol}>
              我已阅读并同意遵守《
              <a
                target="_blank"
                href="/clientassets-cunxin-saas/gallery/material-file/wechatProtocol.pdf"
              >
                微信支付使用协议
              </a>
              》
            </CheckBox>
            <XButton
              className="submitBtn"
              disabled={!protocol}
              width={200}
              height={40}
              onClick={handleSubmit}
            >
              提交
            </XButton>
          </div>
        </div>
      )}
      {activeIndex === 2 && (
        <div className="step2">
          {applystateCode === applymentStateCode[1] && (
            <>
              <div>申请已提交微信审核中，预计1-2个工作日内完成</div>
              <img src={codeImg} alt="code" />
              <div className="tipDesc">
                您可通过超级管理员手机号，扫码进入商家助手，查看审核进度
              </div>
            </>
          )}
          {[applymentStateCode[3], applymentStateCode[4]].includes(applystateCode) && (
            <>
              <img src={authenticateUrl} alt="code" />
              <div className="tipDesc">请使用超级管理员账号扫码，根据提示完成签约授权</div>
            </>
          )}
          {applystateCode === applymentStateCode[2] && (
            <>
              <img src={codeImg} alt="code" />
              <div className="tipDesc">
                商户申请未通过，可扫码前往微信商家助手查询未通过原因，
                <br />
                {/* 修改后 
                <span className="applyAgain" onClick={onApplyAgain}>
                  重新提交申请
                </span> */}
                重新提交请
                <span className="applyAgain" id="pwa_btn_udesk_im">
                  联系在线客服
                </span>
              </div>
            </>
          )}
        </div>
      )}
      <div className="step3"></div>
    </div>
  );
};

export default memo(PayFormInfo);
