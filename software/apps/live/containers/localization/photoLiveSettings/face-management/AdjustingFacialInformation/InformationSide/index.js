import React, { useState } from 'react';

import FButton from '@apps/live/components/FButton';
import IconAddUser from '@apps/live/components/Icons/IconAddUser';
import IconLeft from '@apps/live/components/Icons/IconLeft';
import useLiveSetting from '@apps/live/hooks/useLiveSetting';
import { updateFaceGroup } from '@apps/live/services/photoLiveSettings';

import { UpdateInfoModal } from '../../components';

import ImageItem from './ImageItem';
import { Container, Footer, Header, MenuList, MenuListItem } from './layout';

export default function InformationSide(props) {
  const { onBack, users, values, onChange, queryUser, onClear, onSubmit, record, defaultValues } =
    props;
  const { baseInfo, urls } = useLiveSetting();
  const [visible, setVisible] = useState(false);

  const baseUrl = urls?.get('galleryBaseUrl');
  function handleBack() {
    onBack?.();
  }

  function handleAddUser() {
    setVisible(true);
  }

  function handleOk() {
    setVisible(false);
    queryUser?.();
  }

  // 清除选中
  function handleClear() {
    onClear?.();
  }

  // 保存关系映射
  async function handleSubmit() {
    try {
      const params = {
        baseUrl,
        enc_image_id: record?.enc_image_id,
        source_group_list: defaultValues || [],
        target_group_list: [...values],
      };
      await updateFaceGroup(params);
      onSubmit?.();
    } catch (err) {
      console.error(err);
    }
  }
  const count = values?.length || 0;
  return (
    <Container>
      <Header>
        <IconLeft className="icon" onClick={handleBack} />
        <div className="header_title">Adjusting facial information</div>
        <div className="header_descript">
          Select the correct facial information. If none, choose “Create Face”
        </div>
      </Header>
      <MenuList>
        <MenuListItem className="add_user_btn" onClick={handleAddUser}>
          <IconAddUser width={24} style={{ marginLeft: 6 }} />
        </MenuListItem>
        {users.map((item, index) => {
          return (
            <ImageItem
              index={index}
              item={item}
              onChange={onChange}
              values={values}
              baseUrl={baseUrl}
            />
          );
        })}
      </MenuList>
      <Footer>
        <div className="footer_tip">{count} Selected</div>
        <div className="footer_btns">
          <FButton
            style={{ backgroundColor: '#e8e8e8', color: '#3a3a3a', width: 140, marginRight: 8 }}
            onClick={handleClear}
          >
            Clear Selection
          </FButton>
          <FButton style={{ width: 100 }} onClick={handleSubmit}>
            OK
          </FButton>
        </div>
      </Footer>
      <UpdateInfoModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
        baseUrl={baseUrl}
        enc_broadcast_id={baseInfo?.enc_broadcast_id}
      />
    </Container>
  );
}
