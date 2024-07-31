import React, { useContext } from 'react';

import { PhotoLiveSettingContext } from '@apps/live/context/index';

export default function useLiveSetting() {
  return useContext(PhotoLiveSettingContext) || {};
}
