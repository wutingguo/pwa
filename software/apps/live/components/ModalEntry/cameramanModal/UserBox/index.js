import React from 'react';

import user from '@common/icons/cameraman.png';

import FButton from '@apps/live/components/FButton';

import { Avatar, Box, Container, Footer, Text } from './layout';

export default function UserBox(props) {
  const { addUser, previousStep, info, intl } = props;

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
  let phone = getPhone(info?.phone);

  return (
    <Container>
      <Box>
        <Avatar url={user} />
        <Text style={{ marginTop: 10 }}>{info?.name || phone}</Text>
      </Box>
      <Footer>
        <FButton
          className="white"
          onClick={previousStep}
          style={{ width: 140, height: 32, marginRight: 40 }}
        >
          {intl.tf('CANCEL')}
        </FButton>
        <FButton onClick={addUser} style={{ width: 140, height: 32 }}>
          {intl.tf('CONFIRMED')}
        </FButton>
      </Footer>
    </Container>
  );
}
