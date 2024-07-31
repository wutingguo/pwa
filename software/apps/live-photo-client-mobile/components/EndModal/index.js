import Immutable from 'immutable';
import React, { useMemo, useState } from 'react';

import './index.scss';
import { getImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

function EndModal(props) {
    const { activityInfo, envUrls } = props
    const baseUrl = envUrls.get('saasBaseUrl');

    return (
        <div className="modal">
            <span>{activityInfo.ending_advertise.title}</span>
            <p>{activityInfo.ending_advertise.brand_desc}</p>
            {
                <img src={getImageUrl(baseUrl, activityInfo.ending_advertise.logo_image_id, 3)} />
            }
        </div>
    )
}
export default React.memo(EndModal);
