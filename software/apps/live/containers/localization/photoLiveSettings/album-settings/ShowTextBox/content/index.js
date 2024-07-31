import moment from 'moment';
import React from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import IconQrCode from '@apps/live/components/Icons/IconQrCode';
import Sort from '@apps/live/components/Icons/Sort';

import address from '../images/address.png';
import detail from '../images/detail.png';
import time from '../images/time.png';

import { Left, Right, Tabs, TabsItem } from './layout';

import './index.scss';

/**
 * CN-直播 处理城市数据
 * @param {Object} form_city
 */
const transferFormCity = form_city => {
  const { province, city, area } = form_city || {};
  if (area) {
    return `${province}-${city}-${area}`;
  }
  if (city) {
    return `${province}-${city}`;
  }
  if (province) {
    return `${province}`;
  }
  return '';
};

export default function ContentView(props) {
  const { intl } = useLanguage();
  const { contentValues, style, baseUrl } = props;
  const getAddress = () => {
    const { countryValue, provinceValue, address } = contentValues;
    if (!countryValue) {
      return intl.tf('LP_DEFAULT_LOCATION');
    }
    if (countryValue && provinceValue && address) {
      return `${countryValue},${' ' + provinceValue},${' ' + address}`;
    } else if (!provinceValue) {
      return `${countryValue},${' ' + address}`;
    } else if (!provinceValue && !address) {
      return `${countryValue}`;
    }
    return `${countryValue},${' ' + provinceValue}`;
  };
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  const getAddress_cn = () => {
    const { city, address } = contentValues;
    // if (isEmptyObject(city || {})) {
    //   return intl.tf('LP_DEFAULT_LOCATION');
    // }
    if (address) {
      return `${transferFormCity(city) ? transferFormCity(city) + ',' : ''}${address} `;
    }
    return transferFormCity(city);
  };
  const getActiveTime = time => {
    if (typeof time == 'string') {
      return moment(time).format('YYYY/MM/DD');
    }
    const data = new Date(time);
    return moment(data.getTime()).format('YYYY/MM/DD');
  };
  const getUrl = enc_image_id => {
    return `${baseUrl}cloudapi/album_live/image/download?enc_image_uid=${enc_image_id}&thumbnail_size=1`;
  };

  /**
   * CN-直播隐藏字段
   * @param {'hidden_album_name'|'hidden_broadcast_date'|'hidden_broadcast_address'} hiddenName 隐藏的字段名称
   */
  const isHidden = hiddenName => {
    if (intl.lang === 'en') {
      return false;
    }
    // 判断拍摄城市、详细地址都存在
    if (hiddenName === 'hidden_broadcast_address') {
      return !getAddress_cn() || !!contentValues[hiddenName];
    }
    return !!contentValues[hiddenName];
  };

  return (
    <div
      className="containerBgImg"
      style={{
        height: 'auto',
        backgroundImage: `url(${
          props.middleImg ? props.middleImg : style.infoBackgroundUrl ? style.infoBackgroundUrl : ''
        })`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: style.infoBackground ? style.infoBackground : '',
        marginTop: '-10px',
        paddingTop: '5px',
        paddingBottom: '10px',
        backgroundSize: 'cover',
      }}
    >
      <div className="content">
        {contentValues && (
          <>
            <div className="list">
              {
                <div className="album_item">
                  {!isHidden('hidden_album_name') && (
                    <div style={{ color: style.other_font_color }}>
                      {' '}
                      {contentValues.albumName
                        ? contentValues.albumName
                        : intl.tf('LP_DEFAULT_NAME')}
                    </div>
                  )}
                  <p style={{ color: style.other_font_color }}>
                    {intl.lang == 'cn' ? (
                      <span>
                        已有<span style={{ color: style.primary_font_color }}>427</span>
                        人次浏览了此相册
                      </span>
                    ) : (
                      <span>
                        <span style={{ color: style.primary_font_color }}>0 </span> Views
                      </span>
                    )}{' '}
                  </p>
                </div>
              }
              {!isHidden('hidden_broadcast_date') &&
                (contentValues.activityStartTime || contentValues.activityEndTime) && (
                  <div className="item">
                    <img className="image" src={time}></img>
                    <div style={{ color: style.other_font_color }}>
                      {' '}
                      {getActiveTime(contentValues.activityStartTime)} -{' '}
                      {getActiveTime(contentValues.activityEndTime)}{' '}
                    </div>
                  </div>
                )}
              {!isHidden('hidden_broadcast_address') && getAddress() && (
                <div className="item">
                  <img className="image" src={address}></img>
                  <div style={{ color: style.other_font_color }}>
                    {intl.lang == 'cn' ? getAddress_cn() : getAddress()}{' '}
                  </div>
                </div>
              )}
              {
                <div className="item">
                  <img className="image" src={detail}></img>
                  <div style={{ color: style.other_font_color }}>
                    {contentValues.activeDetail
                      ? contentValues.activeDetail
                      : intl.tf('LP_DEFAULT_DETAIL')}
                  </div>
                </div>
              }
              <Tabs>
                <Left>
                  <TabsItem
                    isCurrent
                    color={style.primary_font_color ? style.primary_font_color : '#042A9D'}
                  >
                    {intl.lang == 'cn' ? '照片直播' : 'Live photos'}
                  </TabsItem>
                  <TabsItem style={{ color: style.other_font_color ? style.other_font_color : '' }}>
                    {' '}
                    {intl.lang == 'cn' ? '热门' : 'Popular'}{' '}
                  </TabsItem>
                  {intl.lang == 'cn' && (
                    <TabsItem
                      style={{ color: style.other_font_color ? style.other_font_color : '' }}
                    >
                      活动介绍
                    </TabsItem>
                  )}
                </Left>

                <Right>
                  <IconQrCode className="icon" fill={style.other_font_color}></IconQrCode>
                  <Sort className="icon" fill={style.other_font_color}></Sort>
                </Right>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
