import React, { memo, useEffect, useState } from 'react';

import FormSelect from '@common/components/FormSelect';

import { getPreferenceConfig, savePreferenceConfig } from '@apps/gallery/utils/services';

import './index.scss';

const Preference = props => {
  const { urls, userInfo, boundGlobalActions } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const dropdownList = [
    {
      id: 0,
      value: 'none',
      label: 'None',
    },
    {
      id: 1,
      value: 'low',
      label: 'Low',
    },
    {
      id: 3,
      value: 'optimal',
      label: 'Optimal',
    },
    {
      id: 4,
      value: 'heigh',
      label: 'High',
    },
  ];
  const [vl, setVl] = useState(dropdownList[0]['value']);
  useEffect(() => {
    getPreferenceConfig({ baseUrl }).then(res => {
      setVl(res.config_value);
    });
  }, []);
  const onFormChange = value => {
    setVl(value);
    window.logEvent.addPageEvent({
      name: 'Gallery_Settings_Click_SharpeningLevel',
      level: value,
    });
    savePreferenceConfig({
      baseUrl,
      param: {
        customer_id: userInfo?.get('uidPk'),
        config_key: 'sharpening_level', // 配置KEY
        config_value: value, // 配置value (none，low，optimal，heigh)
      },
    }).then(res => {
      boundGlobalActions.addNotification({
        message: 'Sharpening Level updated.',
        level: 'success',
        autoDismiss: 3,
      });
    });
  };

  return (
    <div className="Preference">
      <div className="title">{t('SETTINGS_SHARPENING_LEVEL', 'Sharpening Level')}</div>
      <div className="mydropdown">
        <FormSelect onChange={onFormChange} selectValue={vl} dropdownList={dropdownList} />
      </div>
      <div className="desc">
        This only applies to display copies of your photos. Original photos are not altered.
      </div>
    </div>
  );
};

export default memo(Preference);
