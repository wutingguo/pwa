import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';
import * as localModalTypes from '@apps/gallery-client/constants/modalTypes';

import BindEmailModal from './BindEmailModal';
import ViewFavoriteListModal from './ViewFavoriteListModal';
import DownloadGalleryModal from './DownloadGalleryModal';
import PaymentFailedModal from './PaymentFailedModal';
import ShopCartEmptyModal from './ShopCartEmptyModal';
import TipsModal from './TipsModal';
import XConfirmModal from '@resource/components/modals/XConfirmModal';
import SignInModal from '@resource/components/modals/XEstoreSignInModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  // modals.forEach((modal, index) => {
  //   const { boundGlobalActions, boundProjectActions, favoriteImageList, favorite } = that.props;
  //
  // });

  return modalsJSX;
};
