import React, { useEffect, useState } from 'react';

import ManagementContent from './ManagementContent';
import ManagementSide from './ManagementSide';
import { Container } from './layout';

export default function Management(props) {
  const { goToStep, onChange, urls, users, queryUser } = props;
  const [current, setCurrent] = useState(null);

  const baseUrl = urls?.get('galleryBaseUrl');

  function handleChange(id) {
    const user = users.find(item => item.detail_id === id);
    setCurrent(user);
  }

  function onSwitchUser(record) {
    onChange?.(record);
    goToStep(2);
  }

  function onEdit() {
    // todo
  }
  return (
    <Container>
      <ManagementSide
        value={current?.detail_id}
        onChange={handleChange}
        users={users}
        baseUrl={baseUrl}
      />
      <ManagementContent
        onSwitchUser={onSwitchUser}
        onEdit={onEdit}
        contents={current?.image_list || []}
        baseUrl={baseUrl}
        info={current}
        queryUser={queryUser}
      />
    </Container>
  );
}
