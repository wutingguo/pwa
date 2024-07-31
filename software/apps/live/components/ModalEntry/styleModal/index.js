import React, { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import FModal from '@apps/live/components/FDilog';
import { getCustomerSkinCount } from '@apps/live/services/photoLiveSettings';

import CustomContent from './CustomContent';
import DefaultContent from './DefaultContent';
import { Container } from './layout';

export default function ModalStyle(props) {
  const { data } = props;
  const {
    close,
    onOk,
    boundGlobalActions,
    baseUrl,
    value: initValue,
    baseInfo,
    callMethod,
  } = data.toJS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [value, setValue] = useState(initValue || {});
  const [customCount, setCustomCount] = useState(0);
  const { intl } = useLanguage();

  // 系统默认风格的数量
  const [defaultCount, setDefaultCount] = useState(0);

  useEffect(() => {
    queryCustomCount();
  }, []);

  function onTabChange(tabIndex) {
    setCurrentIndex(tabIndex);
  }

  function onCancel() {
    close && close();
  }
  function onSuccess() {
    onOk && onOk(value);
  }

  async function queryCustomCount() {
    const params = {
      baseUrl,
    };
    try {
      const res = await getCustomerSkinCount(params);
      setCustomCount(res);
    } catch (error) {
      console.error(error);
    }
  }
  const footer = (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <XButton
        onClick={onCancel}
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #d8d8d8',
          width: 160,
          height: 40,
        }}
        type="button"
      >
        {intl.tf('CANCEL')}
      </XButton>
      <XButton onClick={onSuccess} type="button" width={160} height={40}>
        {intl.tf('CONFIRMED')}
      </XButton>
    </div>
  );
  return (
    <Container>
      <FModal
        title={intl.tf('LP_CURRENT_ALBUM_STYLE')}
        titleStyle={{ textAlign: 'center' }}
        open={true}
        footer={footer}
        onCancel={onCancel}
        style={{ top: '10%' }}
        width="885px"
      >
        <Tabs selectedIndex={currentIndex} onSelect={onTabChange}>
          <TabList>
            <Tab>
              {intl.tf('LP_SYSTEM_DEFAULT')}({defaultCount})
            </Tab>
            <Tab>
              {intl.tf('LP_CUSTOM_STYLE')}({customCount})
            </Tab>
          </TabList>
          <TabPanel>
            <DefaultContent
              baseUrl={baseUrl}
              value={value}
              onChange={setValue}
              changeDefaultCount={setDefaultCount}
            />
          </TabPanel>
          <TabPanel>
            <CustomContent
              boundGlobalActions={boundGlobalActions}
              value={value}
              onChange={setValue}
              baseUrl={baseUrl}
              baseInfo={baseInfo}
              intl={intl}
              callMethod={callMethod}
            />
          </TabPanel>
        </Tabs>
      </FModal>
    </Container>
  );
}
