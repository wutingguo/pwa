import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import XLoading from '@resource/components/XLoading';

// import XPureComponent from '@resource/components/XPureComponent';
import renderRoutes from '@resource/lib/utils/routeHelper';

import liveLoading from '@common/icons/live_loading.gif';

import LiveSidebar from '@apps/live/components/liveSidebar';
import { PhotoLiveSettingContext } from '@apps/live/context';
import { getCountryList, queryAlbumBaseInfo } from '@apps/live/services/photoLiveSettings';

import './index.scss';

function PhotoLiveSettings(props) {
  const { id } = useParams();
  const { productSubscriptionStatus, urls, boundGlobalActions, boundProjectActions } = props;
  const [baseInfo, setBaseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [countryInfo, setCountryInfo] = useState(null);
  useEffect(() => {
    const { boundProjectActions } = props;
    boundProjectActions.saveLiveAlbumInfo();
    if (!id || id === 'create') return;
    getBaseInfo();
    // getCountryInfo();
  }, [id]);
  // async function getCountryInfo() {
  //   const baseUrl = urls.get('galleryBaseUrl');
  //   const params = {
  //     baseUrl,
  //   };
  //   const res = await getCountryList(params);
  //   setCountryInfo(res);
  // }
  async function getBaseInfo() {
    const baseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl,
      album_id: id,
    };
    const res = await queryAlbumBaseInfo(params);
    boundProjectActions.saveLiveAlbumInfo({ ...res });
    setBaseInfo(res);
  }

  const values = {
    baseInfo,
    urls,
    boundGlobalActions,
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
  };
  const routeHtml = useMemo(() => {
    return renderRoutes({
      isHash: false,
      props: {
        ...props,
        baseInfo,
        getBaseInfo,
        // countryInfo,
      },
    });
  }, [baseInfo, props]);

  return (
    <div className="live-photoLiveSettings-wrapper">
      <LiveSidebar
        boundGlobalActions={boundGlobalActions}
        productSubscriptionStatus={productSubscriptionStatus}
        liveId={id}
        baseInfo={baseInfo}
        urls={urls}
      />
      <PhotoLiveSettingContext.Provider value={values}>
        <div className="saas-live-container">
          {routeHtml}
          <XLoading
            type={'imageLoading'}
            isShown={loading}
            iconUrl={liveLoading}
            isRotate={false}
            className="live"
            maskStyle={{ opacity: '0.5' }}
          />
        </div>
      </PhotoLiveSettingContext.Provider>
    </div>
  );
}

export default PhotoLiveSettings;
