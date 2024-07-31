import { isEqual, template } from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import LazyLoad from 'react-lazy-load';
import { connect } from 'react-redux';

import { getImageUrl } from '@resource/lib/saas/image';
import { getUrl } from '@resource/lib/saas/image';

import { SAAS_DOWNLOAD_CSV_FILE_CN } from '@resource/lib/constants/apiUrl';
import { saasProducts, thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { submitGallery } from '@common/servers';

import { XIcon, XImg } from '@common/components';

import Dialog from '@apps/dashboard-mobile/components/vant/Dialog';
import Empty from '@apps/dashboard-mobile/components/vant/Empty';
// import List from '@apps/dashboard-mobile/components/vant/List';
import PullRefresh from '@apps/dashboard-mobile/components/vant/PullRefresh';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

// import Search from '@apps/dashboard-mobile/components/vant/Search';
// import Sticky from '@apps/dashboard-mobile/components/vant/Sticky';
// import Tabs from '@apps/dashboard-mobile/components/vant/Tabs';
import './index.scss';

// import main from "./handle/main";

const Favorite = props => {
  const { boundProjectActions, urls, match, boundGlobalActions, history, defaultImgs } = props;
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const { params } = match;
  const aDownlad = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.append(link);
    link.click();
  };
  const commonToast = text => {
    Dialog.confirm({
      title: '提示',
      showCancelButton: false,
      message: text,
    });
  };
  const onRefresh = async () => {
    const user = await boundGlobalActions.getUserInfo();
    boundProjectActions
      .getAllFavoriteList({
        collection_uid: params.id,
        customer_uid: user.uidPk,
        search_name: searchText,
      })
      .then(res => {
        setList(res.data.records);
      });
  };
  const onSetting = (item, e) => {
    e.stopPropagation();
    Dialog.confirm({
      title: '重新提交选片',
      message: '是否重置选片记录，允许客户重新提交选片',
      confirmButtonText: '重置',
      onCancel: () => {
        const param = {
          galleryBaseUrl,
          collection_uid: params.id,
          guest_uid: item.guest_uid,
          submit_status: 1,
          content: [],
          is_client: true,
        };
        submitGallery(param).then(() => {
          // this.props.getAllFavoriteData();
          onRefresh();
        });
      },
      onConfirm: () => {
        const param = {
          galleryBaseUrl,
          collection_uid: params.id,
          guest_uid: item.guest_uid,
          submit_status: 0,
          content: [],
          is_client: true,
        };
        submitGallery(param).then(() => {
          onRefresh();
          // this.props.getAllFavoriteData();
        });
      },
    });
  };
  const onExport = async (item, e) => {
    e.stopPropagation();
    const { photos = 0 } = item;
    if (photos < 1) {
      commonToast(t('FAVORITE_NO_PHOTO'));
      return;
    }
    const mySubscription = await boundProjectActions.getMySubscription(galleryBaseUrl);

    const galleryDesc =
      mySubscription.data &&
      mySubscription.data['items'].find(sub => sub['product_id'] === saasProducts.gallery);
    const isOrder = galleryDesc && galleryDesc['plan_level'] > 10;
    if (!isOrder) {
      commonToast('导出记录功能需选片标准版及以上版本方可使用,请升级您的版本以使用此功能。');
      return;
    }
    const { favorite_uid, guest_uid } = item;
    const urlParams = {
      guest_uid,
      collection_uid: params.id,
      favorite_uid,
      languageCode: 'zh',
      countryCode: 'CN',
    };
    const url = getUrl(SAAS_DOWNLOAD_CSV_FILE_CN, urlParams);
    // window.location.href = template(url)({ galleryBaseUrl });
    aDownlad(template(url)({ galleryBaseUrl }));
  };
  const onNavDetail = item => {
    history.push(`/software/gallery/favorite-detail/${params.id}/${item.guest_uid}`);
  };

  useEffect(() => {
    props.setPageHeaders(0);
    onRefresh();
  }, []);
  return (
    <div className="Favorite">
      <PullRefresh successText="刷新成功" onRefresh={onRefresh}>
        <div className="listContainer">
          {list.length ? (
            list.map(item => (
              <div
                className="commonFlex listBox"
                key={item.favorite_uid}
                onClick={() => onNavDetail(item)}
              >
                <div className="imgBox">
                  <LazyLoad
                    className="lazyload-container"
                    once
                    key={`lazyload-item-${item.enc_cover_image_uid}`}
                  >
                    <XImg
                      src={
                        item.submit_status > 0 && item.enc_cover_image_uid
                          ? getImageUrl({
                              galleryBaseUrl,
                              image_uid: item.enc_cover_image_uid,
                              thumbnail_size: thumbnailSizeTypes.SIZE_1500,
                              // timestamp: enc_image_id ? uid : new Date().getTime(),
                            })
                          : defaultImgs.get('defaultCoverSmall')
                      }
                      imgRot={item['orientation']}
                      type="background"
                    />
                  </LazyLoad>
                </div>
                <div className="right">
                  <div className="title">{item.favorite_name}</div>
                  <div className="commonFlex phone">
                    <div>{item.phone || item.email}</div>
                    <div>{moment(item.updated_time).format('YYYY/MM/DD')}</div>
                  </div>
                  <div className="commonFlex bottom">
                    <div className="setting" onClick={e => onSetting(item, e)}>
                      <XIcon type="settings" iconWidth={12} iconHeight={12} text={'设置'} />
                    </div>
                    {/* <div onClick={e => onExport(item, e)}>
                      <XIcon
                        type="sharing"
                        iconWidth={12}
                        iconHeight={12}
                        text={'仅导出选片记录'}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </PullRefresh>
    </div>
  );
};

export default memo(connect(mapState, mapDispatch)(Favorite));
