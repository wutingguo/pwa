import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import XButton from '@resource/components/XButton';
import { RcRadioGroup } from '@resource/components/XRadio';

import { useLanguage } from '@common/components/InternationalLanguage';

import { useMessage, useRequest } from '@common/hooks';

import InputNumber from '@apps/live/components/InputNumber';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { getPVConfig, savePVConfig } from '@apps/live/services/photoLiveSettings';

import './index.scss';

const clsPrefix = 'manage-pv';
const ManagePV = props => {
  const { urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const { intl } = useLanguage();
  const [placeholder, message] = useMessage();

  //基础浏览量
  const [basePV, setBasePV] = useState(0);
  //曝光量
  const [exposureMultiple, setExposureMultiple] = useState(1);

  const handlePVMultiple = e => {
    const value = e.target.value;
    setExposureMultiple(value);
  };

  const onValueChanged = value => {
    setBasePV(value);
  };

  const requestPVConfig = async () => {
    try {
      const data = await getPVConfig({
        baseUrl,
        enc_album_id: baseInfo.enc_album_id,
      });
      if (!data) {
        throw new Error();
      }
      const { market_basic_coefficient = 0, market_advanced_coefficient = 1 } = data;
      setBasePV(market_basic_coefficient);
      setExposureMultiple(market_advanced_coefficient);
    } catch (e) {
      console.log(e);
    }
  };

  const onSavePVConfig = async () => {
    try {
      const data = await savePVConfig({
        baseUrl,
        enc_album_id: baseInfo.enc_album_id,
        market_basic_coefficient: basePV,
        market_advanced_coefficient: exposureMultiple,
      });
      if (!data) {
        throw new Error();
      }
      message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
    } catch (e) {
      message.success(intl.tf('LP_SAVE_FAILED'));
    }
  };

  useEffect(() => {
    if (!baseInfo?.enc_album_id) return;
    requestPVConfig();
  }, [baseInfo?.enc_album_id]);

  return (
    <WithHeaderComp title={intl.tf('LP_PV')}>
      <div className={clsPrefix}>
        <div className={`${clsPrefix}-base-pv-wrap`}>
          <span className={`${clsPrefix}-label ${clsPrefix}-base-pv-label`}>
            {intl.tf('LP_PV_BASE')}
          </span>
          <div className={`${clsPrefix}-base-pv-input-wrap`}>
            <InputNumber value={basePV} onChange={onValueChanged} />
            <span className={`${clsPrefix}-base-pv-tip`}>{intl.tf('LP_PV_BASE_TIP')}</span>
          </div>
        </div>
        <div className={`${clsPrefix}-exposure-wrap`}>
          <span className={`${clsPrefix}-label ${clsPrefix}-exposure-label`}>
            {intl.tf('LP_PV_ADD_EXPOSURE')}
          </span>
          <RcRadioGroup
            wrapperClass="znoRadio"
            onChange={handlePVMultiple}
            value={exposureMultiple}
            options={[
              {
                value: 1,
                label: intl.tf('LP_PV_NO_EXPOSURE'),
              },
              {
                value: 2,
                label: intl.tf('LP_PV_ADD_1X_EXPOSURE'),
              },
              {
                value: 4,
                label: intl.tf('LP_PV_ADD_3X_EXPOSURE'),
              },
            ]}
          />
        </div>
        <div className={`${clsPrefix}-bottom`}>
          <XButton width={200} height={40} onClicked={onSavePVConfig}>
            {intl.tf('LP_START_PROMOTING')}
          </XButton>
        </div>
      </div>
      {placeholder}
    </WithHeaderComp>
  );
};

export default React.memo(ManagePV);
