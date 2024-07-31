import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { XCheckBox } from '@common/components';

import { Container } from './layout';

export default function ModalContent(props) {
  const { checkbox, onClicked, intl } = props;

  // console.log('checkbox', checkbox);
  return (
    <Container>
      <Tabs>
        <TabList>
          <Tab>{intl.tf('LP_ALBUM_DOWNLOAD_MODAL_TAB')}</Tab>
        </TabList>
        <TabPanel>
          <XCheckBox
            checked={checkbox === 2}
            onClicked={({ checked }) => onClicked(2, checked)}
            style={{ marginTop: 20 }}
            // checkboxDisabled={true}
            text={intl.tf('LP_ALBUM_DOWNLOAD_MODAL_WITH_WATERMARKS')}
          />
          <XCheckBox
            checked={checkbox === 1}
            onClicked={({ checked }) => onClicked(1, checked)}
            style={{ marginTop: 20 }}
            text={intl.tf('LP_ALBUM_DOWNLOAD_MODAL_WITHOU_WATERMARKS')}
          />
        </TabPanel>
      </Tabs>
    </Container>
  );
}
