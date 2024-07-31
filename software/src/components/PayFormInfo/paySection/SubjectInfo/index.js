import React, { memo, useEffect, useRef, useState } from 'react';

import CheckBox from '@resource/components/XCheckBox/RcCheckBox';

import { useWatch } from '@apps/live/components/Form';

import { idCardType, organizeCardType, submitTypeList } from '../../config';
import { PayDate, PayField, PayInputField, PayUploadField, SelectDown } from '../index';

// import { emailReg, phoneReg } from '@resource/lib/constants/reg';
import './index.scss';

const SubjectInfo = props => {
  //监听字段值改变控制UI变化
  const { form } = props;
  const {
    id_doc_type,
    subject_type = submitTypeList[0]['value'],
    period_end_long,
    period_begin,
    period_end,
    card_period_begin,
    card_period_end,
    period_end_id_card_long,
    doc_period_begin,
    doc_period_end,
    period_end_doc_long,
  } = useWatch(
    [
      'id_doc_type',
      'subject_type',
      'period_end_long',
      'period_begin',
      'period_end',
      'card_period_begin',
      'card_period_end',
      'period_end_id_card_long',
      'doc_period_begin',
      'doc_period_end',
      'period_end_doc_long',
    ],
    form
  );
  return (
    <div className="payFormSection subjectInfo">
      <div className="title">主体信息</div>
      <PayField
        {...props}
        name="subject_type"
        label="选择主体类型"
        defaultValue={submitTypeList[0]['value']}
        child={(value, onChange) => {
          return (
            <div style={{ width: '7.38rem' }}>
              <SelectDown
                // defaultSelect={submitTypeList[0]}
                selectValue={value}
                onChange={onChange}
                dropdownList={submitTypeList}
              />
            </div>
          );
        }}
        required
        desc={['营业执照上的主体类型一般为个体户、个体工商户、个体经营']}
      />
      {/* 主体身份 */}
      {subject_type &&
      [submitTypeList[0]['value'], submitTypeList[1]['value']].includes(subject_type) ? (
        <>
          {/* 个体工商户和企业 */}
          <PayUploadField
            {...props}
            name="license_copy"
            rules={[{ required: true, message: '营业执照为空！' }]}
            label="营业执照"
            required
          />
          <PayInputField
            {...props}
            name="license_number"
            rules={[{ required: true, message: '注册号/统一社会信用代码为空！' }]}
            label="注册号/统一社会信用代码"
            required
          />
          <PayInputField
            {...props}
            name="license_address"
            // rules={[{ required: true, message: '注册地址为空！' }]}
            label="注册地址"
            // required
            desc={['请依据营业执照/登记证书，填写注册地址']}
          />
        </>
      ) : (
        <>
          {/* 主体为政府机关/事业单位/其他组织时展示登记证书类型 */}
          <PayField
            // {...props}
            name="cert_type"
            label="登记证书类型"
            // defaultValue={idCardType[0]['value']}
            child={(value, onChange) => {
              return (
                <div style={{ width: '7.38rem' }}>
                  <SelectDown
                    placeholder="请选择"
                    defaultSelect={{}}
                    onChange={onChange}
                    dropdownList={organizeCardType[subject_type]}
                  />
                </div>
              );
            }}
            required
          />
          <PayUploadField
            {...props}
            name="cert_copy"
            rules={[{ required: true, message: '登记证书照片为空！' }]}
            label="登记证书照片"
            required
          />
          <PayInputField
            {...props}
            name="cert_number"
            rules={[{ required: true, message: '证书号为空！' }]}
            label="证书号"
            required
          />
          <PayInputField
            {...props}
            name="company_address"
            rules={[{ required: true, message: '注册地址为空！' }]}
            label="注册地址"
            required
            desc={['请依据登记证书，填写注册地址']}
          />
        </>
      )}
      <PayInputField
        {...props}
        name="legal_person"
        label="经营者/法人姓名"
        rules={[{ required: true, message: '经营者/法人姓名为空！' }]}
        required
      />
      <PayInputField
        {...props}
        name="merchant_name"
        rules={[{ required: true, message: '商户名称为空！' }]}
        label="商户名称"
        required
      />
      <PayInputField
        {...props}
        name="merchant_shortname"
        rules={[{ required: true, message: '商户简称为空！' }]}
        label="商户简称"
        desc={[
          '商家简称为客户付款界面显示的收款方简称',
          ' 1.不支持单纯以人名来命名，若为个体户经营，可用“个体户+经营者名称”或“经营者名称+业务”命名，如“个体户张三”或“张三餐饮店”；',
          ' 2.不支持无实际意义的文案，如“XX特约商户”、“800”、“XX客服电话XXX”。',
        ]}
        required
      />

      <div className="dateFormBox">
        <PayField
          {...props}
          className="startDate"
          name="period_begin"
          // rules={[{ required: true, message: '开始时间为空！' }]}
          label="经营者/法人证有效期"
          child={(value, onChange) => {
            return (
              <PayDate
                selectDay={value}
                value={period_begin && new Date(period_begin)}
                minDate={new Date('')}
                maxDate={new Date(period_end)}
                onChange={onChange}
              />
            );
          }}
          // required
        />

        {!period_end_long && (
          <>
            <div className="middleText">至</div>
            <PayField
              {...props}
              className="endDate"
              name="period_end"
              label=""
              // rules={[{ required: true, message: '结束时间为空！' }]}
              child={(value, onChange) => {
                return (
                  <PayDate
                    selectDay={value}
                    value={period_end && new Date(period_end)}
                    minDate={new Date(period_begin)}
                    onChange={onChange}
                  />
                );
              }}
              // required
            />
          </>
        )}
        <PayField
          {...props}
          className="longEndDate"
          name="period_end_long"
          label=""
          child={(value, onChange) => {
            return (
              <CheckBox checked={value} onChange={e => onChange(e.target.checked)}>
                长期有效
              </CheckBox>
            );
          }}
        />
        {/* <div className='dateRightLabel'>长期有效</div> */}
      </div>

      {/* 法定代表人证件 */}
      {/* 这里只允许传法人所以证件持有人类型字段不传 */}
      {/* <PayField
            // {...props}
            name="id_holder_type"
            label='法定代表人证件持有人类型'
            // defaultValue={idCardType[0]['value']}
            child={(value, onChange) => {
                return <div style={{ width: '7.38rem' }}>
                    <SelectDown placeholder='请选择' defaultSelect={{}} onChange={onChange} dropdownList={idCardType} />
                </div>
            }}
            required
        /> */}
      <PayField
        // {...props}
        name="id_doc_type"
        label="法定代表人证件类型"
        defaultValue={idCardType[0]['value']}
        child={(value, onChange) => {
          return (
            <div style={{ width: '7.38rem' }}>
              <SelectDown
                placeholder="请选择"
                selectValue={value}
                defaultSelect={idCardType[0]}
                onChange={onChange}
                dropdownList={idCardType}
              />
            </div>
          );
        }}
        required
      />

      {id_doc_type === 'IDENTIFICATION_TYPE_IDCARD' && (
        <>
          {/* 身份证 */}
          <PayUploadField
            {...props}
            // labelStyle={{
            //     visibility: 'hidden',
            // }}
            rules={[{ required: true, message: '身份证人像面照片为空！' }]}
            name="id_card_copy"
            label="身份证人像面照片"
            required
          />
          <PayUploadField
            {...props}
            // labelStyle={{
            //     visibility: 'hidden',
            // }}
            rules={[{ required: true, message: '身份证国徽面照片为空！' }]}
            name="id_card_national"
            label="身份证国徽面照片"
            required
          />
          <PayInputField
            {...props}
            name="id_card_name"
            rules={[{ required: true, message: '身份证姓名为空！' }]}
            label="身份证姓名"
            required
          />
          <PayInputField
            {...props}
            name="id_card_number"
            rules={[{ required: true, message: '身份证号码为空！' }]}
            label="身份证号码"
            required
          />
          {/* 主体类型为企业时，需要填写。 */}
          {/* {subject_type && subject_type === submitTypeList[1]['value'] &&
                    <PayInputField
                        {...props}
                        name="id_card_address"
                        rules={[{ required: true, message: '身份证居住地址为空！' }]}
                        label='身份证居住地址'
                        required
                    />} */}
          <PayInputField
            {...props}
            name="id_card_address"
            rules={[{ required: true, message: '身份证居住地址为空！' }]}
            label="身份证居住地址"
            required
          />
          <div className="dateFormBox">
            <PayField
              {...props}
              className="startDate"
              name="card_period_begin"
              rules={[{ required: true, message: '开始时间为空！' }]}
              label="身份证有效期"
              child={(value, onChange) => {
                return (
                  <PayDate
                    selectDay={value}
                    value={value && new Date(value)}
                    minDate={new Date('')}
                    maxDate={new Date(card_period_end)}
                    onChange={onChange}
                  />
                );
              }}
              required
            />

            {!period_end_id_card_long && (
              <>
                <div className="middleText">至</div>
                <PayField
                  {...props}
                  className="endDate"
                  name="card_period_end"
                  label=""
                  rules={[{ required: true, message: '结束时间为空！' }]}
                  child={(value, onChange) => {
                    return (
                      <PayDate
                        selectDay={value}
                        value={value && new Date(value)}
                        minDate={new Date(card_period_begin)}
                        onChange={onChange}
                      />
                    );
                  }}
                  required
                />
              </>
            )}
            <PayField
              {...props}
              className="longEndDate"
              name="period_end_id_card_long"
              label=""
              child={(value, onChange) => {
                return (
                  <CheckBox checked={value} onChange={e => onChange(e.target.checked)}>
                    长期有效
                  </CheckBox>
                );
              }}
            />
            {/* <div className='dateRightLabel'>长期有效</div> */}
          </div>
        </>
      )}

      {id_doc_type && id_doc_type !== 'IDENTIFICATION_TYPE_IDCARD' && (
        <>
          {/* 其他类型证件信息 */}
          <PayUploadField
            {...props}
            // labelStyle={{
            //     visibility: 'hidden',
            // }}
            name="id_doc_copy"
            label="证件人像面照片"
            required
          />
          {/* 护照不上传背面照 */}
          {id_doc_type && id_doc_type !== 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT' && (
            <PayUploadField
              {...props}
              // labelStyle={{
              //     visibility: 'hidden',
              // }}
              name="id_doc_copy_back"
              label="证件背面照片"
              required
            />
          )}
          <PayInputField
            {...props}
            name="id_doc_name"
            rules={[{ required: true, message: '证件姓名为空！' }]}
            label="证件姓名"
            required
          />
          <PayInputField
            {...props}
            name="id_doc_number"
            rules={[{ required: true, message: '证件号码为空！' }]}
            label="证件号码"
            required
          />
          {/* 主体类型为企业时，需要填写。 */}
          {/* {subject_type && subject_type === submitTypeList[1]['value'] &&
                    <PayInputField
                        {...props}
                        name="id_doc_address"
                        rules={[{ required: true, message: '证件居住地址为空！' }]}
                        label='证件居住地址'
                        required
                    />} */}
          <PayInputField
            {...props}
            name="id_doc_address"
            rules={[{ required: true, message: '证件居住地址为空！' }]}
            label="证件居住地址"
            required
          />
          <div className="dateFormBox">
            <PayField
              {...props}
              className="startDate"
              name="doc_period_begin"
              rules={[{ required: true, message: '开始时间为空！' }]}
              label="证件有效期"
              child={(value, onChange) => {
                return (
                  <PayDate
                    value={doc_period_begin && new Date(doc_period_begin)}
                    minDate={new Date('')}
                    maxDate={new Date(doc_period_end)}
                    onChange={onChange}
                  />
                );
              }}
              required
            />

            {!period_end_doc_long && (
              <>
                <div className="middleText">至</div>
                <PayField
                  {...props}
                  className="endDate"
                  name="doc_period_end"
                  label=""
                  rules={[{ required: true, message: '结束时间为空！' }]}
                  child={(value, onChange) => {
                    return (
                      <PayDate
                        value={doc_period_end && new Date(doc_period_end)}
                        minDate={new Date(doc_period_begin)}
                        onChange={onChange}
                      />
                    );
                  }}
                  required
                />
              </>
            )}
            <PayField
              {...props}
              className="longEndDate"
              name="period_end_doc_long"
              label=""
              child={(value, onChange) => {
                return <CheckBox onChange={e => onChange(e.target.checked)}>长期有效</CheckBox>;
              }}
            />
            {/* <div className='dateRightLabel'>长期有效</div> */}
          </div>
        </>
      )}
      {/* 身份证 */}
      {/* <PayUploadField
            {...props}
            name="web_info"
            label="授权函"
            required
            desc={
                [
                    `请下载<a download href='/clientassets-cunxin-saas/script/use-default.js'>授权函</a>并盖章拍照上传`,
                ]
            }
        /> */}
    </div>
  );
};

export default memo(SubjectInfo);
