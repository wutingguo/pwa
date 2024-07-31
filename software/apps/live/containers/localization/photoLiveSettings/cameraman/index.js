import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import user from '@common/icons/cameraman.png';

import FButton from '@apps/live/components/FButton';
import Add from '@apps/live/components/Icons/Add';
import IconClose from '@apps/live/components/Icons/IconBannerClose';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { CAMERAMAN_MODAL } from '@apps/live/constants/modalTypes';
import { getCameramanList, removeCameraman } from '@apps/live/services/photoLiveSettings';

import { Avatar, Card, Close, Container, Empty, Header, Item, Line, Name, Title } from './layout';

export default function (props) {
  const { boundGlobalActions, urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const [roles, setRoles] = useState([]);
  const { intl } = useLanguage();

  useEffect(() => {
    if (!baseInfo?.album_id) return;
    queryCameramanList();
  }, [baseInfo?.album_id]);

  // 添加摄影师成功回调
  function onOk() {
    queryCameramanList();
    boundGlobalActions.hideModal(CAMERAMAN_MODAL);
  }

  // 删除摄影师
  function delCameraman(customer_id) {
    const { album_id } = baseInfo;
    // 二次确认
    boundGlobalActions.showConfirm({
      title: '',
      message: intl.tf('LP_PHOTOGRAPHER_DEL_MESSAGE'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
          className: 'white',
        },
        {
          onClick: async () => {
            const params = {
              id: album_id,
              customer_id,
              baseUrl,
            };
            await removeCameraman(params);
            queryCameramanList();
            boundGlobalActions.hideConfirm();
          },
          text: intl.tf('CONFIRMED'),
        },
      ],
    });
  }

  // 获取摄影师列表
  async function queryCameramanList() {
    const { album_id } = baseInfo;
    try {
      const params = {
        baseUrl,
        id: album_id,
      };
      const res = await getCameramanList(params);
      setRoles(res);
    } catch (error) {
      console.log(error);
    }
  }
  // 添加按钮计算属性
  const isShowAdd = useMemo(() => {
    if (roles.length >= 100) return false;

    return true;
  }, [roles]);

  // 添加摄影师弹窗
  function AddCameraman() {
    if (!isShowAdd) return;
    const params = {
      close: () => boundGlobalActions.hideModal(CAMERAMAN_MODAL),
      onOk: onOk,
      boundGlobalActions,
      baseInfo,
    };
    boundGlobalActions.showModal(CAMERAMAN_MODAL, params);
  }

  function getPhone(phone = '') {
    let str = '';
    for (let i = 0; i < phone.length; i++) {
      if (i > 2 && i < 7) {
        str += '*';
        continue;
      }
      str += phone[i];
    }
    return str;
  }

  function getName(item) {
    const name = item.name || getPhone(item.phone);
    return name;
  }
  return (
    <WithHeaderComp title={intl.tf('LP_PHOTOGRAPHER')}>
      <Container>
        <Header>
          <FButton className="white" onClick={AddCameraman}>
            {intl.tf('LP_ADD')}
          </FButton>
          <Title>{intl.tf('LP_PHOTOGRAPHER_DESCRIPT')}</Title>
        </Header>

        {roles.length === 0 ? (
          <Empty>{intl.tf('LP_PHOTOGRAPHER_EMPTY_TIP')}</Empty>
        ) : (
          <Card>
            {roles.map(item => {
              return (
                <Item>
                  <Line>
                    <Avatar url={user} />
                  </Line>
                  <Name title={getName(item)} style={{ marginTop: 10 }}>
                    {getName(item)}
                  </Name>
                  <Close onClick={() => delCameraman(item.customer_id)}>
                    <IconClose />
                  </Close>
                </Item>
              );
            })}
          </Card>
        )}
      </Container>
    </WithHeaderComp>
  );
}
