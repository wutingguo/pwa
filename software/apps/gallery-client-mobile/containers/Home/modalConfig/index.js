import React, { memo, useEffect, useMemo, useState } from 'react';

import MiniCode from '@apps/gallery-client-mobile/components/MiniCode';
import ShareMediaModal from '@apps/gallery-client-mobile/components/ShareMediaModal';

export const shareMediaModalConfig = (boundGlobalActions, imgSrc) => {
  return {
    close: boundGlobalActions.hideConfirm,
    title: 'Share',
    backdropClassName: 'blackBg',
    style: {
      width: '580px',
    },
    message: <ShareMediaModal boundGlobalActions={boundGlobalActions} imgSrc={imgSrc} />,
    buttons: [],
  };
};

export const miniCodeModalConfig = (
  boundGlobalActions,
  urls,
  favorite_id,
  guest_uid,
  collection_uid,
  callbackFn
) => {
  return {
    close: () => {
      boundGlobalActions.hideConfirm();
      callbackFn();
    },
    title: '',
    backdropClassName: 'blackBg',
    // isHideIcon: true,
    style: {
      width: '580px',
    },
    message: (
      <MiniCode
        urls={urls}
        guest_uid={guest_uid}
        favorite_id={favorite_id}
        collection_uid={collection_uid}
      />
    ),
    buttons: [],
  };
};
