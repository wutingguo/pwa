import React, { useState } from 'react';

import Empty from '@apps/live/components/Empty';
import IconEdit3 from '@apps/live/components/Icons/IconEdit3';
import useLiveSetting from '@apps/live/hooks/useLiveSetting';

import { UpdateInfoModal } from '../../components';

import ImageItem from './ImageItem';
import { Container, Content, Header, List } from './layout';

export default function ManagementContent(props) {
  const { contents, info, onSwitchUser, onEdit, baseUrl, queryUser } = props;
  const { baseInfo } = useLiveSetting();

  const [visible, setVisible] = useState(false);

  function handleEdit() {
    console.log('onHandleEdit');
    setVisible(true);
    onEdit?.();
  }

  function handleOk() {
    queryUser();
    setVisible(false);
  }
  console.log('contents', contents);
  return (
    <Container>
      {info ? (
        <Header>
          <span className="header_count">{`（${contents.length}）`}</span>
          <span className="header_name">{`Full Name: ${info?.full_name}`}</span>
          <span className="header_phone">{`Phone Number: ${info?.phone_number}`}</span>
          <span className="header_email">{`Email: ${info?.email}`}</span>
          <span className="header_edit" onClick={handleEdit}>
            <IconEdit3 fill="#222" />
          </span>
        </Header>
      ) : null}
      {contents.length > 0 ? (
        <Content>
          <List>
            {contents.map(item => {
              return (
                <ImageItem
                  key={item.id}
                  item={item}
                  onSwitchUser={onSwitchUser}
                  baseUrl={baseUrl}
                />
              );
            })}
          </List>
        </Content>
      ) : (
        <Empty style={{ heigth: '100%' }} />
      )}
      <UpdateInfoModal
        enc_album_id={baseInfo?.enc_album_id}
        baseUrl={baseUrl}
        info={info}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      />
    </Container>
  );
}
