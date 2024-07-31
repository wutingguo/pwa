import React, { useEffect, useMemo, useState } from 'react';

import useMessage from '@common/hooks/useMessage';

import CustomBox from '@apps/live/components/CustomBox';
import Add from '@apps/live/components/Icons/Add';
import IconDelete from '@apps/live/components/Icons/IconDelete';
import IconEdit from '@apps/live/components/Icons/IconEdit';
import RadioImage from '@apps/live/components/RadioImage';
import { FORMULATE_MODAL } from '@apps/live/constants/modalTypes';
import { deleteLiveSkin, getLiveSkinList } from '@apps/live/services/photoLiveSettings';

import { AddBox, Btns, Container, ThemeBox } from './layout';

const space = 40;
export default function CustomContent(props) {
  const { boundGlobalActions, baseUrl, value, onChange, baseInfo, intl, callMethod } = props;
  const [data, setData] = useState([]);
  const [placeholder, message] = useMessage();

  useEffect(() => {
    querySkinList();
  }, []);

  // 弹窗关闭回调
  function close() {
    boundGlobalActions.hideModal(FORMULATE_MODAL);
  }

  // 弹窗成功回调
  function onOk() {
    querySkinList();
    callMethod();

    boundGlobalActions.hideModal(FORMULATE_MODAL);
  }
  // 主题切换事件回调
  function onCheckChange(key) {
    const obj = data.find(item => item.album_skin_id === key);
    onChange && onChange(obj);
  }

  // 获取自定义主题列表
  async function querySkinList() {
    const params = {
      baseUrl,
      type: 1,
    };
    try {
      const res = await getLiveSkinList(params);
      // setData(res.concat(res, res, res, res));
      setData(res?.skin_items);
    } catch (err) {
      console.log(err);
    }
  }
  // 打开自定义弹窗
  function add() {
    if (data.length >= 4) {
      return message.error(intl.tf('LP_AT_MOST_UPLOAD_PIC'));
    }
    const params = {
      close,
      onOk,
      boundGlobalActions,
      baseUrl,
      value,
    };
    boundGlobalActions.showModal(FORMULATE_MODAL, params);
  }

  // 编辑stylebox
  function edit(record) {
    const params = {
      close,
      onOk,
      boundGlobalActions,
      baseUrl,
      value: record,
      type: 'edit',
    };

    boundGlobalActions.showModal(FORMULATE_MODAL, params);
  }

  // 删除stylebox
  async function deleteStyle(record) {
    const params = {
      baseUrl,
      id: record.album_skin_id,
    };
    boundGlobalActions.showConfirm({
      title: intl.lang == 'cn' ? intl.tf('LP_WARM_REMINDER') : '',
      message: intl.tf('LP_DELETED_ALBUMS_DO_NOT_AFFECT_USED_ALBUMS'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          className: 'white',
          text: intl.tf('CANCEL'),
        },
        {
          onClick: async () => {
            // 判断删除是否是当前style
            if (baseInfo?.album_skin_id === record.album_skin_id) {
              message.error(intl.tf('LP_THE_CURRENT_STYLE_IS_IN_USE_AND_CANNOT_BE_DELETED'));
              return;
            }
            await deleteLiveSkin(params);
            querySkinList();
            boundGlobalActions.hideConfirm();
          },
          text: intl.tf('CONFIRMED'),
        },
      ],
    });
  }

  // 自定义风格内容
  function renderContent(record) {
    return <CustomBox style={{ width: 150, padding: '5px' }} values={record} baseUrl={baseUrl} />;
  }

  // console.log('data', data);

  return (
    <Container>
      {data?.length < 4 && (
        <AddBox onClick={add} style={{ margin: `5px ${space}px 5px 5px` }}>
          <Add width={28} />
          <div>{intl.tf('LP_CUSTOM_STYLE')}</div>
        </AddBox>
      )}
      {data.map((item, index) => {
        return (
          <ThemeBox style={{ marginRight: space }}>
            <RadioImage
              onChange={onCheckChange}
              key={item.key}
              renderContent={() => renderContent(item, index)}
              checked={value.album_skin_id === item.album_skin_id}
              text={item.album_skin_name}
              value={item.album_skin_id}
              overlay={
                <CustomBox
                  style={{
                    width: 200,
                    padding: '5px',
                    boxShadow: '0px 6px 16px 0px rgba(0,0,0,0.3)',
                  }}
                  values={item}
                  isInfo
                  baseUrl={baseUrl}
                />
              }
            />
            <Btns>
              <span onClick={() => edit(item)}>
                <IconEdit fill="#fff" width={16} />
                {intl.tf('EDIT')}
              </span>
              <span>|</span>
              <span onClick={() => deleteStyle(item)}>
                <IconDelete fill="#fff" width={16} />
                {intl.tf('DELETE')}
              </span>
            </Btns>
          </ThemeBox>
        );
      })}
      {placeholder}
    </Container>
  );
}
