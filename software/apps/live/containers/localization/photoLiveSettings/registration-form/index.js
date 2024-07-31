import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useMessage } from '@common/hooks';

import FGroupRadio, { FRadio } from '@apps/live/components/FGroupRadio';
import FInput from '@apps/live/components/FInput';
import FSwitch from '@apps/live/components/FSwitch';
import { Field, Form, useForm } from '@apps/live/components/Form';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import {
  export_register_form_list,
  get_register_config,
  get_register_form_list,
  save_register_config,
} from '@apps/live/services/photoLiveSettings';

import CollectItems from './CollectItems';
import EditForm from './EditForm';
import ViewModal from './ViewModal';
import { ItemsLabel } from './ViewModal/layout';
import rightPng from './imgs/right.png';
import { Container, Footer, SettingBox, TextAlignRight, View } from './layout';
import {
  PAGE_SIZE,
  findMaxSettingId,
  getFieldData,
  modifyRegisterFormInfo,
  validitorFieldConfig,
  wrapCol,
} from './opts';

/**
 * CN-登记表单
 */
const RegistrationForm = props => {
  const { urls, albumInfo: baseInfo } = props;
  // 消息提示
  const [placeholder, message] = useMessage();
  // 相册加密id
  const enc_album_id = baseInfo?.enc_album_id;
  // baseUrl
  const baseUrl = urls.get('galleryBaseUrl');
  // uidpk
  const [uidpk, setUidpk] = useState('');
  // 客资收集项表单
  const [form] = useForm();
  // 查看客资名单弹窗
  const [viewVisible, setViewVisible] = useState(false);
  // 添加、编辑收集项弹窗
  const [editVisible, setEditVisible] = useState(false);
  // 查看客资名单信息
  const [registerFormInfo, setRegisterFormInfo] = useState(null);
  // 选中收集项
  const [selected, setSelected] = useState();
  // 当前编辑的收集项信息
  const [record, setRecord] = useState(null);
  // 客资收集项
  const fieldConfig = form.getFieldValue('field_config') || [];

  /**
   * 获取登记表单配置信息
   */
  const getRegisterConfig = async () => {
    const params = { baseUrl, enc_album_id };
    try {
      const res = await get_register_config(params);
      setUidpk(res?.uidpk);
      const fieldData = getFieldData(res);
      form.setFieldsValue(fieldData);
      setSelected(fieldData?.field_config?.[0]?.id);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 查看客资名单（分页）
   * @param {number} page_num 分页默认1
   */
  const getRegisterFormList = async (page_num = 1) => {
    try {
      const params = {
        baseUrl,
        enc_album_id,
        page_num,
        page_size: PAGE_SIZE,
      };
      const res = await get_register_form_list(params);
      const newInfo = modifyRegisterFormInfo(res);
      setRegisterFormInfo(newInfo);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 初始化
   */
  useEffect(() => {
    if (enc_album_id) {
      getRegisterConfig(); // 获取配置信息
      getRegisterFormList(); // 查看客资名单列表
    }
  }, [enc_album_id]);

  /**
   * 保存设置事件
   */
  const handleSubmit = () => {
    form.submit();
  };

  /**
   * 表单提交事件
   */
  const onFinish = async values => {
    try {
      const params = {
        baseUrl,
        uidpk,
        enc_album_id,
        ...values,
      };
      await save_register_config(params);
      message.success('保存成功！');
      getRegisterConfig(); // 刷新数据
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 查看客资名单点击事件
   */
  const handleView = e => {
    e.preventDefault();
    setViewVisible(true);
  };

  /**
   * 查看客资名单弹窗关闭事件
   */
  const handleClose = () => {
    setViewVisible(false);
    changePageNum(1);
  };

  /**
   * 查看客资名单列表分页点击事件
   * @param {number} page_num 分页
   */
  const changePageNum = page_num => {
    getRegisterFormList(page_num);
  };

  /**
   * 添加收集项事件
   */
  const handleAddFieldConfig = e => {
    e.preventDefault();
    setEditVisible(true);
  };

  /**
   * 选中收集项事件
   * @param {number} current
   */
  const handleSelect = current => {
    setSelected(current);
  };

  /**
   * 收集项编辑事件
   * @param {Object} task
   */
  const handleEditFieldConfig = task => {
    setRecord(task);
    setEditVisible(true);
  };

  /**
   * 关闭收集项弹窗事件
   */
  const handleCloseFieldConfig = () => {
    setRecord(null);
    setEditVisible(false);
  };

  /**
   * 添加、编辑收集项确定事件
   * @param {Object} values 收集项的值
   * @param {boolean} isAdd 是否是添加确定
   */
  const handleOkFieldConfig = async (values, isAdd) => {
    const newConfig = cloneDeep(fieldConfig);
    if (isAdd) {
      // 是添加确定
      newConfig.push({ ...values, id: findMaxSettingId(newConfig) });
      form.setFieldValue(
        'field_config',
        newConfig.map((item, index) => ({ ...item, field_order: index + 1 })) // 新增顺序变化
      );
    } else {
      // 是编辑确定
      const { id } = values;
      const findIndex = newConfig.findIndex(item => item.id === id);
      newConfig[findIndex] = values;
      form.setFieldValue('field_config', newConfig);
    }
    setRecord(null);
    setEditVisible(false);
  };

  /**
   * 导出Excel
   */
  const exportExcel = () => {
    try {
      const params = { baseUrl, enc_album_id };
      const res = export_register_form_list(params);
      const a = document.createElement('a');
      a.href = res;
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 设置客资信息收集项label
   */
  const collectItemsLabel = (
    /* 添加e.preventDefault()是修复点击收集项label时，阻止默认事件，避免触发点击事件的bug */
    <ItemsLabel onClick={e => e.preventDefault()}>
      <span className="label">设置客资信息收集项</span>
      <XButton
        width={90}
        height={32}
        disabled={fieldConfig?.length >= 5}
        onClicked={handleAddFieldConfig}
      >
        添加收集项
      </XButton>
    </ItemsLabel>
  );

  return (
    <WithHeaderComp title="客资收集">
      <Container>
        {/* 左边表单信息 */}
        <SettingBox>
          <Form form={form} layout="h" wrapCol={wrapCol} onFinish={onFinish}>
            <Field name="enabled" label="客资收集开关" className="registration-form-field">
              <FSwitch />
            </Field>
            <Field name="popup_type" label="客资收集时机" layout="v">
              <FGroupRadio>
                <FRadio value={1}>访问相册时</FRadio>
                <FRadio value={2}>点击查看大图时</FRadio>
              </FGroupRadio>
            </Field>
            <Field label="客资收集表设置" className="registration-form-field">
              <TextAlignRight>
                <XButton width={140} height={32} onClicked={handleView}>
                  查看客资名单（{registerFormInfo?.total || 0}）
                </XButton>
              </TextAlignRight>
            </Field>
            <Field
              name="banner_enabled"
              label="顶部宣传图（默认使用相册Banner）"
              className="registration-form-field banner_enabled"
            >
              <FSwitch />
            </Field>
            <Field
              required
              name="title"
              label="标题"
              rules={[{ required: true, message: '标题不能为空' }]}
            >
              <FInput placeholder="请输入标题" max={20} />
            </Field>
            <Field
              name="field_config"
              label={collectItemsLabel}
              layout="v"
              rules={[{ validitor: validitorFieldConfig, message: '收集项不能为空' }]}
            >
              <CollectItems
                selected={selected}
                onSelect={handleSelect}
                onEdit={handleEditFieldConfig}
                baseUrl={baseUrl}
                encAlbumId={enc_album_id}
                onDeleteSuccess={() => changePageNum(1)}
              />
            </Field>
            <Field
              required
              name="button_text"
              label="按钮文案"
              rules={[{ required: true, message: '按钮文案不能为空' }]}
            >
              <FInput placeholder="请输入按钮文案" max={12} />
            </Field>
          </Form>
        </SettingBox>
        {/* 右边图片展示 */}
        <View>
          <img src={rightPng} alt="registration" />
        </View>
        {/* 底部操作按钮 */}
        <Footer>
          <XButton width={200} height={40} onClicked={handleSubmit}>
            保存设置
          </XButton>
        </Footer>
        {/* 客资名单弹窗 */}
        {viewVisible && (
          <ViewModal
            registerFormInfo={registerFormInfo}
            onClose={handleClose}
            changePageNum={changePageNum}
            exportExcel={exportExcel}
          />
        )}
        {/* 添加、编辑收集项弹窗 */}
        {editVisible && (
          <EditForm
            record={record}
            onClose={handleCloseFieldConfig}
            onOk={handleOkFieldConfig}
            fieldConfig={fieldConfig}
          />
        )}
        {/* 消息提示弹窗 */}
        {placeholder}
      </Container>
    </WithHeaderComp>
  );
};

export default RegistrationForm;
