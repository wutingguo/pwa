import React from 'react';

import Waring from '@apps/live/components/Icons/waring2';

export default function MessageTop(props) {
  const { intl } = props;

  return (
    <div className="live-photoLiveSettings-message">
      <Waring style={{ marginRight: 5 }} fill="#FFA929" />
      <span>
        {intl.tf(
          'LP_AFTER_YOU_CLICK_SAVE_THE_ALBUM_IS_CONSIDERED_TO_BE_CREATED_SUCCESSFULLY_PLEASE_UPLOAD_PHOTOS_WITHIN_15_DAYS_NO_MORE_PHOTOS_CAN_BE_UPLOADED'
        )}
      </span>
    </div>
  );
}
