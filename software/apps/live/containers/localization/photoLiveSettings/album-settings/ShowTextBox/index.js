import { template } from 'lodash';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { getLiveSkinList } from '@apps/live/services/photoLiveSettings';

import Content from './content';
import black_bottom_cn from './images/black_bottom_cn.png';
import black_middle_cn from './images/black_middle_cn.png';
import black_top_cn from './images/black_top_cn.png';
import blue_bottom from './images/blue_bottom.png';
import blue_bottom_cn from './images/blue_bottom_cn.png';
import blue_middle from './images/blue_middle.png';
import blue_middle_cn from './images/blue_middle_cn.png';
import blue_top from './images/blue_top.png';
import blue_top_cn from './images/blue_top_cn.png';
import celebration_bottom from './images/celebration_bottom.png';
import celebration_bottom_cn from './images/celebration_bottom_cn.png';
import celebration_middle from './images/celebration_middle.png';
import celebration_middle_cn from './images/celebration_middle_cn.png';
import celebration_top from './images/celebration_top.png';
import celebration_top_cn from './images/celebration_top_cn.png';
import commerce_bottom from './images/commerce_bottom.png';
import commerce_middle from './images/commerce_middle.png';
import commerce_top from './images/commerce_top.png';
import enjoySummer_bottom from './images/enjoySummer_bottom.png';
import enjoySummer_middle from './images/enjoySummer_middle.png';
import enjoySummer_top from './images/enjoySummer_top.png';
import family_bottom from './images/family_bottom.png';
import family_middle from './images/family_middle.png';
import family_top from './images/family_top.png';
import graduation_bottom from './images/graduation_bottom.png';
import graduation_middle from './images/graduation_middle.png';
import graduation_top from './images/graduation_top.png';
import happySummer_bottom from './images/happySummer_bottom.png';
import happySummer_middle from './images/happySummer_middle.png';
import happySummer_top from './images/happySummer_top.png';
import helloSummer_bottom from './images/helloSummer_bottom.png';
import helloSummer_middle from './images/helloSummer_middle.png';

/**
 * CN直播 新增主题
 * 你好夏天、快乐一夏、夏天的风、夏日瞬间、畅享夏日
 */
import helloSummer_top from './images/helloSummer_top.png';
import spring_bottom from './images/spring_bottom.png';
import spring_middle from './images/spring_middle.png';
import spring_top from './images/spring_top.png';
import summerMoment_bottom from './images/summerMoment_bottom.png';
import summerMoment_middle from './images/summerMoment_middle.png';
import summerMoment_top from './images/summerMoment_top.png';
import summerWind_bottom from './images/summerWind_bottom.png';
import summerWind_middle from './images/summerWind_middle.png';
import summerWind_top from './images/summerWind_top.png';
import wedding_bottom from './images/wedding_bottom.png';
import wedding_bottom_cn from './images/wedding_bottom_cn.png';
import wedding_middle from './images/wedding_middle.png';
import wedding_middle_cn from './images/wedding_middle_cn.png';
import wedding_top from './images/wedding_top.png';
import wedding_top_cn from './images/wedding_top_cn.png';
import white_bottom from './images/white_bottom.png';
import white_bottom_cn from './images/white_bottom_cn.png';
import white_middle from './images/white_middle.png';
import white_middle_cn from './images/white_middle_cn.png';
import white_top from './images/white_top.png';
import white_top_cn from './images/white_top_cn.png';
import { Banner, CenterText, Container, GridImageBox } from './layout';

const en_styles = {
  default: {
    topImg: white_top,
    bottomImg: white_bottom,
  },
  White: {
    topImg: white_top,
    middleImg: white_middle,
    bottomImg: white_bottom,
    bottomBg: '#FFFFFF',
  },
  Black: {
    topImg: commerce_top,
    middleImg: commerce_middle,
    bottomImg: commerce_bottom,
    bottomBg: '#070508',
  },
  Wedding: {
    topImg: wedding_top,
    middleImg: wedding_middle,
    bottomImg: wedding_bottom,
    bottomBg: '#FFFFFF',
  },
  'Annual Meeting': {
    topImg: celebration_top,
    middleImg: celebration_middle,
    bottomImg: celebration_bottom,
    bottomBg: '#FCFCFC',
  },
  Blue: {
    topImg: blue_top,
    middleImg: blue_middle,
    bottomImg: blue_bottom,
    bottomBg: '#000636',
  },
};

const cn_styles = {
  default: {
    topImg: white_top_cn,
    bottomImg: white_bottom_cn,
  },

  商务白: {
    topImg: white_top_cn,
    middleImg: white_middle_cn,
    bottomImg: white_bottom_cn,
    bottomBg: '#FFFFFF',
  },
  商务黑: {
    topImg: black_top_cn,
    middleImg: black_middle_cn,
    bottomImg: black_bottom_cn,
    bottomBg: '#050306',
  },
  春游: {
    topImg: spring_top,
    middleImg: spring_middle,
    bottomImg: spring_bottom,
    bottomBg: '#FFFFFF',
  },
  毕业季: {
    topImg: graduation_top,
    middleImg: graduation_middle,
    bottomImg: graduation_bottom,
    bottomBg: '#FFFFFF',
  },
  亲子活动: {
    topImg: family_top,
    middleImg: family_middle,
    bottomImg: family_bottom,
    bottomBg: '#FEFCF7',
  },
  庆典年会: {
    topImg: celebration_top_cn,
    middleImg: celebration_middle_cn,
    bottomImg: celebration_bottom_cn,
    bottomBg: '#FAF9F7',
  },
  科技蓝: {
    topImg: blue_top_cn,
    middleImg: blue_middle_cn,
    bottomImg: blue_bottom_cn,
    bottomBg: '#000636',
  },
  婚庆红色: {
    topImg: wedding_top_cn,
    middleImg: wedding_middle_cn,
    bottomImg: wedding_bottom_cn,
    bottomBg: '#8B202B',
  },
  你好夏天: {
    topImg: helloSummer_top,
    middleImg: helloSummer_middle,
    bottomImg: helloSummer_bottom,
    bottomBg: '#FFFFFF',
  },
  快乐一夏: {
    topImg: happySummer_top,
    middleImg: happySummer_middle,
    bottomImg: happySummer_bottom,
    bottomBg: '#F1FAFF',
  },
  夏天的风: {
    topImg: summerWind_top,
    middleImg: summerWind_middle,
    bottomImg: summerWind_bottom,
    bottomBg: '#FFFFFF',
  },
  夏日瞬间: {
    topImg: summerMoment_top,
    middleImg: summerMoment_middle,
    bottomImg: summerMoment_bottom,
    bottomBg: '#E6F5D0',
  },
  畅享夏日: {
    topImg: enjoySummer_top,
    middleImg: enjoySummer_middle,
    bottomImg: enjoySummer_bottom,
    bottomBg: '#FFFAE7',
  },
};
export default function CustomTextBox(props) {
  const { values, baseUrl } = props;
  const { intl } = useLanguage();
  // console.log('values', values)
  const [themeItem, setThemeItem] = useState({});
  const style = intl.lang == 'cn' ? cn_styles : en_styles;
  const getSkinData = async () => {
    if (isEmptyObject(values.photoStyle)) {
      return;
    }
    const params = {
      baseUrl,
    };
    try {
      const res = await getLiveSkinList(params);
      const item = res.skin_items.find(
        item => item.album_skin_id == values.photoStyle.album_skin_id
      );
      // console.log('item1', item)
      setThemeItem(item);
    } catch (err) {
      console.log(err);
    }
  };
  useImperativeHandle(props.cref, () => ({
    getSkinData,
  }));
  const theme = useMemo(() => {
    const t = {
      ...themeItem,
    };
    if (!!themeItem.bg_image_id) {
      let src = template(ALBUM_LIVE_IMAGE_URL)({
        baseUrl,
        enc_image_id: themeItem.bg_image_id,
        size: '1',
      });
      t.infoBackgroundUrl = src;
    } else if (!!themeItem.bg_color) {
      t.infoBackground = themeItem.bg_color;
    }

    if (!!themeItem.decorate_image_id) {
      let src = template(ALBUM_LIVE_IMAGE_URL)({
        baseUrl,
        enc_image_id: themeItem.decorate_image_id,
        size: '1',
      });
      t.gridBackgroundUrl = src;
    } else if (!!themeItem.decorate_color) {
      t.gridBackground = themeItem.decorate_color;
    }

    return t;
  }, [themeItem]);
  useEffect(() => {
    getSkinData();
    return () => {};
  }, [values.photoStyle.album_skin_id]);
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  return (
    <div className="container" style={{ width: '277px' }}>
      <div className="topImg" isBorder={true}>
        {!isEmptyObject(themeItem) && (
          <img
            src={
              themeItem.album_skin_type == 0
                ? style[themeItem.album_skin_name].topImg
                : style['default'].topImg
            }
            width="100%"
          />
        )}
        <div style={{ color: '#222222' }} className="title">
          {intl.lang == 'cn' ? (values.activityNme ? values.activityNme : '照片直播平台') : ''}
        </div>
      </div>
      <Content
        baseUrl={baseUrl}
        style={theme}
        middleImg={
          !isEmptyObject(themeItem)
            ? themeItem.album_skin_type == 0
              ? style[themeItem.album_skin_name].middleImg
              : ''
            : ''
        }
        contentValues={{ ...values }}
      />
      <div
        className="bottomImg"
        style={{
          backgroundColor: !isEmptyObject(themeItem)
            ? themeItem.album_skin_type == 0
              ? style[themeItem.album_skin_name].bottomBg
              : theme.gridBackground
              ? theme.gridBackground
              : ''
            : '',
          backgroundImage: theme.gridBackgroundUrl ? `url(${theme.gridBackgroundUrl})` : '',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {!isEmptyObject(themeItem) && (
          <img
            src={
              themeItem.album_skin_type == 0
                ? style[themeItem.album_skin_name].bottomImg
                : style['default'].bottomImg
            }
          />
        )}
      </div>
    </div>
  );
}
