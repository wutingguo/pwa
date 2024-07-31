import React, { memo, useEffect, useMemo, useState } from 'react';

import ShareMediaModal from '@apps/gallery-client/containers/components/ShareMediaModal';

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
