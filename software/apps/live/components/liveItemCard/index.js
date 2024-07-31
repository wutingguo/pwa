import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withRouter } from 'react-router';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import aiphotoPNG from '@resource/static/icons/aiphoto_HD.png';
import deletePNG from '@resource/static/icons/btnIcon/delete.png';
import downloadPNG from '@resource/static/icons/btnIcon/download.png';
import photoPNG from '@resource/static/icons/btnIcon/photo.png';
import reloadPNG from '@resource/static/icons/btnIcon/reload.png';
import settingPNG from '@resource/static/icons/btnIcon/setting.png';
import sharePNG from '@resource/static/icons/btnIcon/share-1.png';
import loadingPNG from '@resource/static/icons/loading2.gif';

import { useLanguage } from '@common/components/InternationalLanguage';

import * as localModalTypes from '@apps/live/constants/modalTypes';

import liveService from '../../services';

import placeholderEn from './imgs/placeholder-en.png';
import placeholderCn from './imgs/placeholder.png';

import './index.scss';

const LiveItemCard = props => {
  const [instantHeight, setInstantHeight] = useState(165);
  const [exifImg, setExifImg] = useState('');
  const [loading, setLoading] = useState(false);
  const { intl } = useLanguage();

  const placeholder = intl.lang === 'cn' ? placeholderCn : placeholderEn;
  const {
    album_name,
    image_count,
    enc_album_id,
    cover_image_id,
    urls,
    boundProjectActions,
    boundGlobalActions,
    getAlbums,
    isRecycle = false,
    reload,
    deleteAlbum,
    retrieve_remained_days,
    orientation,
    enc_broadcast_id,
    message,
    expired,
    liveList,
    share_flag,
  } = props;
  const baseUrl = urls.get('saasBaseUrl');
  const ratio = 520 / 340;
  const liveItemRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    reszieLiveItem();
    window.addEventListener('resize', () => {
      reszieLiveItem();
    });
    return () => {
      window.removeEventListener('resize', reszieLiveItem);
    };
  }, [liveItemRef.current]);

  useEffect(() => {
    setLoading(true);
    if (imgRef.current) {
      const backgroundImage = new Image();
      backgroundImage.src = exifImg;
      backgroundImage.onload = () => {
        setLoading(false);
      };
      backgroundImage.onerror = () => {
        setLoading(false);
      };
    }
  }, [imgRef.current, exifImg]);

  useEffect(() => {
    handleOrientation();
  }, [cover_image_id]);

  const handleOrientation = async () => {
    if (cover_image_id && cover_image_id !== '0') {
      let imgUrl = `${baseUrl}cloudapi/album_live/image/view?enc_image_uid=${cover_image_id}&thumbnail_size=5`;
      if (orientation) {
        imgUrl = await getOrientationAppliedImage(imgUrl, orientation);
      }
      setExifImg(imgUrl);
    } else {
      setExifImg(placeholder);
    }
  };

  const reszieLiveItem = () => {
    if (liveItemRef.current) {
      const cardWrapper = liveItemRef.current.parentNode;
      const width = (cardWrapper.clientWidth - 46) / 3;
      const height = width / ratio;
      setInstantHeight(height);
    }
  };

  const recycleAlbum = () => {
    const current = liveList.length > 1 ? undefined : 1;
    liveService.retrieveAlbum({ baseUrl, enc_album_ids: enc_album_id }).then(() => {
      message && message.success(intl.tf('LP_DELETE_SUCCESSFULLY'));
      getAlbums({ current });
    });
  };

  const actionBar = useMemo(() => {
    if (!isRecycle) {
      return [
        {
          icon: settingPNG,
          label: intl.tf('LP_ALBUM_SETTING_SPACE'),
          key: 'liveSetting',
          onClick: () => {
            boundProjectActions.saveLiveAlbumInfo({ currentAlbumId: enc_album_id });
            window.open(`/software/live/photo/${enc_album_id}/album-settings`, '_blank');
          },
        },
        {
          icon: aiphotoPNG,
          label: intl.tf('LP_AI_RETOUCH'),
          key: 'AIPhoto',
          onClick: () => {
            window.open(`/software/live/photo/${enc_album_id}/AI-retoucher`, '_blank');
          },
        },
        {
          icon: sharePNG,
          label: intl.tf('LP_SHARE'),
          key: 'share',
          onClick: () => {
            boundGlobalActions.showModal(localModalTypes.LIVE_SHARE_MODAL, {
              close: () => boundGlobalActions.hideModal(localModalTypes.LIVE_SHARE_MODAL),
              enc_broadcast_id,
              album_name,
              message,
              share_flag,
            });
          },
        },
        {
          icon: photoPNG,
          label: intl.tf('LP_PHOTO_MANGEMENT_LINE'),
          key: 'photoManagement',
          onClick: () => {
            window.open(
              `/software/live/photo/${enc_album_id}/photo-management?album_name=${encodeURIComponent(
                album_name
              )}`,
              '_blank'
            );
          },
        },
        {
          icon: downloadPNG,
          label: intl.tf('LP_PACKAGE_DOWNLOAD_LINE'),
          key: 'packageDownload',
          onClick: () => {
            window.open(`/software/live/photo/${enc_album_id}/package-download`, '_blank');
          },
        },
        {
          icon: deletePNG,
          label: intl.tf('LP_DELETE'),
          key: 'delete',
          onClick: recycleAlbum,
        },
      ];
    }
    return [
      {
        icon: reloadPNG,
        label: intl.tf('LP_RECOVER'),
        key: 'reload',
        onClick: () => reload && reload(enc_album_id),
      },
      {
        icon: deletePNG,
        label: intl.tf('LP_DELETE'),
        key: 'delete',
        onClick: () => deleteAlbum && deleteAlbum(enc_album_id),
      },
    ];
  }, []);

  const imgStyle = {
    height: instantHeight,
    backgroundImage: `url(${exifImg})`,
  };

  return (
    <div className="liveItemCardWrapper" ref={liveItemRef}>
      <div className="imgWrapper" style={imgStyle} ref={imgRef}>
        {loading ? <img className="loading" src={loadingPNG} /> : null}
        <div className="liveItemInfo">
          <span className="liveName" title={album_name}>
            {album_name}
          </span>
          <span className="photoNum">{`${image_count} ${intl.tf('LP_PHOTOS')}`}</span>
        </div>
        {isRecycle ? (
          <div className="tip">
            {intl.tf('LP_RECYCLE_BIN_DELAY_MESSAGE')}：{retrieve_remained_days} {intl.tf('LP_DAYS')}
          </div>
        ) : null}
        {expired === 1 ? <div className="tip-timeout">{intl.tf('LP_EXPIRED')}</div> : null}
      </div>
      <div className="liveActionBarWrapper">
        {actionBar.map(item => (
          <div key={item.key} className="actionItem" onClick={() => item.onClick && item.onClick()}>
            <img src={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRouter(LiveItemCard);
