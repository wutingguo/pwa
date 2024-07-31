import React, { useEffect, useState } from 'react';

import { formatDateBeginToEnd } from '@resource/lib/utils/dateFormat';

import discriptionPNG from '@apps/live-photo-client/icons/discription.png';
import locationPNG from '@apps/live-photo-client/icons/location.png';
import timePNG from '@apps/live-photo-client/icons/time.png';
import service from '@apps/workspace/services';

import './index.scss';

export default function Info(props) {
  const { broadcastActivity, urls, qs, userInfo, broadcastAlbum, logClick, activityInfo } = props;
  const [count, setCount] = useState(0);
  const title = broadcastAlbum.get('album_name');
  const subTitle = __isCN__ ? `已有${count}人次浏览了此相册` : `${count} Views`;
  const beginTime = broadcastActivity.get('begin_time');
  const endTime = broadcastActivity.get('end_time');
  const date = formatDateBeginToEnd(beginTime, endTime, '.');
  const country_en = broadcastActivity.get('country');
  const city_en = broadcastActivity.get('city');
  const location = broadcastActivity.get('address');
  let city = broadcastActivity.get('city') ? broadcastActivity.get('city').split('-') : [];
  city.shift();
  city = city.toString().replace(',', '-');
  const discription = broadcastActivity.get('activity_detail');

  // CN-直播隐藏字段
  const fieldConfigVo = activityInfo.get('field_config_vo');

  // console.log('broadcastActivity', broadcastActivity.toJS());

  useEffect(() => {
    getLogInfo();
  }, []);
  const getAddress = () => {
    if (city_en && location) {
      return `${location},${' ' + city_en},${' ' + country_en}`;
    }
    return !city_en
      ? !location
        ? `${country_en}`
        : `${location},${' ' + country_en}`
      : `${city_en},${' ' + country_en}`;
  };
  const getLogInfo = async () => {
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const user_unique_id = userInfo.get('user_id');
    await logClick();
    const params = {
      baseUrl,
      enc_broadcast_id,
      target_type: '1',
      action_type: '1',
      enc_target_id: enc_broadcast_id,
      user_unique_id,
    };
    const res = await service.getTargetOperationCount(params);
    if (res.ret_code !== 200000) return;
    const { count } = res.data;
    setCount(count);
  };

  /**
   * CN-直播隐藏字段
   * 相册名称
   * 活动时间
   * 拍摄城市
   * @param {'hidden_album_name'|'hidden_broadcast_date'|'hidden_broadcast_address'} hiddenName 隐藏的字段名称
   */
  const isHidden = hiddenName => {
    if (!__isCN__) {
      return false;
    }
    return !!fieldConfigVo?.get(hiddenName);
  };

  /**
   * CN-直播地址有什么显示什么
   */
  const showCity = () => {
    if (!__isCN__) {
      return city;
    }
    const cityArray = broadcastActivity?.get('city').split('-');
    const newCitys = cityArray.join(' ');
    if (newCitys && location) {
      return `${newCitys} ${location}`;
    }
    if (newCitys) {
      return newCitys;
    }
    if (location) {
      return location;
    }
  };

  return (
    <div className="info-box">
      {!isHidden('hidden_album_name') && <div className="title">{title}</div>}
      <div className="sub-title">{subTitle}</div>
      <div className="info-items">
        {!isHidden('hidden_broadcast_date') && (
          <div className="items">
            <div className="items-label">{t('LPC_TITLE_TIME')}：</div>
            <div>{date}</div>
          </div>
        )}
        {!__isCN__ && country_en && (
          <div className="items">
            <div className="items-label">{t('LPC_TITLE_LOCATION')}：</div>
            <div>{getAddress()}</div>
          </div>
        )}
        {!isHidden('hidden_broadcast_address') && __isCN__ && showCity() && (
          <div className="items">
            <div className="items-label">活动地点：</div>
            <div>{showCity()}</div>
          </div>
        )}
        {discription ? (
          <div className="items">
            <div className="items-label">{t('LPC_TITLE_DETAIL')}：</div>

            <div className="description">{discription}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
