import { template } from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import useMessage from '@common/hooks/useMessage';

import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { LIVE_CONFIRM_MODAL } from '@apps/live/constants/modalTypes';
import { PhotoLiveSettingContext } from '@apps/live/context';
import {
  getWatermarkList,
  queryRewatermarkTaskStatus,
  saveWatermark,
} from '@apps/live/services/photoLiveSettings';

import SettingBox from './SettingBox';
import ViewBox from './ViewBox';
import { Container, Footer } from './layout';
import { bannerToPosition, initPosition, positionKey, transformBannerPosition } from './opts';

const textToPosition = [
  {
    type: positionKey[0],
    top: 0,
    left: 0,
    right: '.',
    bottom: '.',
  },
  {
    type: positionKey[1],
    top: 0,
    left: 0,
    right: 0,
    bottom: '.',
  },
  {
    type: positionKey[2],
    top: 0,
    left: '.',
    right: 0,
    bottom: '.',
  },
  {
    type: positionKey[3],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  {
    type: positionKey[4],
    top: '.',
    left: 0,
    right: '.',
    bottom: 0,
  },
  {
    type: positionKey[5],
    top: '.',
    left: 0,
    right: 0,
    bottom: 0,
  },
  {
    type: positionKey[6],
    top: '.',
    left: '.',
    right: 0,
    bottom: 0,
  },
];
export default function Watermark(props) {
  const { urls, baseInfo, getBaseInfo } = props;
  const [currentImg, setCurrentImg] = useState({
    ...initPosition,
  });
  const [waterMarks, setWaterMarks] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [sourceNum, setSourceNum] = useState(0);

  const [placeholder, message] = useMessage();

  const [checked, setChecked] = useState(false);
  const { intl, lang } = useLanguage();
  // const [sliders, setSliders] = useState({
  //   top_bottom_margins: 0,
  //   left_right_margins: 0,
  //   transparency: 100,
  //   scaling_ratio: 10
  // });
  const { boundGlobalActions } = useContext(PhotoLiveSettingContext);
  const baseUrl = urls.get('galleryBaseUrl');
  const albumId = baseInfo && baseInfo.enc_album_id ? baseInfo.enc_album_id : null;

  useEffect(() => {
    if (!albumId) return;
    queryList(albumId);
  }, [albumId]);

  // 默认选中
  useEffect(() => {
    if (waterMarks.length !== 0 && !currentImg.enc_image_id) {
      console.log('currentImg', currentImg);
      setCurrentImg(waterMarks[0]);
    }
  }, [waterMarks]);

  function setLogEvent() {
    if (checked) {
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_Watermark_On',
        });
      return;
    }
    intl.lang === 'cn' &&
      window.logEvent.addPageEvent({
        name: 'LIVE_Watermark_Off',
      });
  }

  async function submitForm(obj = {}) {
    const settings =
      waterMarks.map(item => {
        const { id, key, ...rest } = item;
        return {
          ...rest,
          watermark_id: item.id,
        };
      }) || [];
    if (checked && settings.length === 0) {
      return message.error(intl.tf('LP_SAVE_FAILED_PLEASE_ADD_WATERMARK_FIRST'));
    }

    const params = {
      baseUrl,
      enc_album_id: albumId,
      watermark_enable: checked ? 1 : 0,
      settings,
      ...obj,
    };
    const endSubmit = async (params, isVerify = true) => {
      try {
        await updateWatermarkEstimate(params, isVerify);
        setLogEvent();
        queryList(albumId);
        getBaseInfo();
        boundGlobalActions.hideConfirm();
        message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
      } catch (err) {
        console.log(err);
      }
    };
    if (!(params.settings.length > 0 && params.watermark_enable === 0)) {
      // 当存在水印并且水印关闭时出现弹窗
      endSubmit(params);
      return;
    }

    const statusParams = {
      baseUrl,
      enc_album_id: albumId,
    };
    const res = await queryRewatermarkTaskStatus(statusParams);
    // 存在水印并且水印关闭时且存在任务时出现弹窗
    if (res === 1 || res === 0) {
      boundGlobalActions.showModal(LIVE_CONFIRM_MODAL, {
        title: <div style={{ marginTop: 20 }}>{intl.tf('LP_WATERMARK_PRINTING')}</div>,
        content: intl.tf('LP_WATERMARK_PRINTING_SAVE_TIPS'),
        onClose: () => {
          boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL);
        },
        footer: null,
      });
      return;
    }
    // 存在水印并且水印关闭时时出现弹窗
    boundGlobalActions.showConfirm({
      title: '',
      message: intl.tf('LP_SAVE_CONFIRMNOTICE'),
      // close: boundGlobalActions.hideConfirm,
      isHideIcon: true,
      className: 'photo-live-delete-watermark',
      buttons: [
        {
          onClick: async () => {
            await endSubmit(params, false);
          },
          text: intl.tf('LP_BTNENNABLE'),
          className: 'white',
        },
        {
          onClick: async () => {
            params.watermark_enable = 1;
            try {
              endSubmit(params, false);
            } catch (err) {
              console.log(err);
            }
          },
          text: intl.tf('LP_BTNUNENNABLE'),
        },
      ],
    });
  }

  function transformPosition(water) {
    const {
      position_value,
      default_left_right_margins: left_right = 0,
      default_top_bottom_margins: top_bottom = 0,
    } = water;
    const rectPos = {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
    };
    const default_left_right_margins = left_right / 10;
    const default_top_bottom_margins = top_bottom / 10;
    switch (position_value) {
      case positionKey[0]:
        rectPos.marginLeft += default_left_right_margins;
        rectPos.marginTop += default_top_bottom_margins;
        break;
      case positionKey[1]:
        rectPos.marginTop += default_top_bottom_margins;
        break;
      case positionKey[2]:
        rectPos.marginRight += default_left_right_margins;
        rectPos.marginTop += default_top_bottom_margins;
        break;
      case positionKey[3]:
        break;
      case positionKey[4]:
        rectPos.marginLeft += default_left_right_margins;
        rectPos.marginBottom += default_top_bottom_margins;
        break;
      case positionKey[5]:
        rectPos.marginBottom += default_top_bottom_margins;
        break;
      case positionKey[6]:
        rectPos.marginRight += default_left_right_margins;
        rectPos.marginBottom += default_top_bottom_margins;
        break;
    }
    return rectPos;
  }

  const options = useMemo(() => {
    const opts = waterMarks.map(water => {
      let opt = {
        top: 0,
        left: 0,
        opacity: 100,
        scale: 10,
      };
      let url = template(ALBUM_LIVE_IMAGE_URL)({
        baseUrl,
        enc_image_id: water.imageId,
        size: 5,
      });
      if (!water.imageId) return opt;
      if (water.setting_type === 1) {
        const res = textToPosition.find(item => item.type === water.position_value);
        const pos = transformPosition(water);
        opt = { ...opt, ...res, ...pos };
        opt.opacity = water.default_transparency / 100;
        opt.scale = water.default_scaling_ratio / 100;
      } else if (water.setting_type === 2) {
        opt.top = water.top_bottom_margins / 100;
        opt.left = water.left_right_margins / 100;
        opt.opacity = water.transparency / 100;
        opt.scale = water.scaling_ratio / 100;
      } else if (water.setting_type === 3) {
        // 新增通栏水印
        const res = bannerToPosition.find(item => item.type === water.banner_position);
        const pos = transformBannerPosition(water);
        opt = { ...opt, ...pos, ...res };
        opt.opacity = water.banner_transparency / 100;
        opt.scale = NaN; // 使得width自适应容器
      }

      opt.url = url;
      return opt;
    });

    return opts;
  }, [waterMarks]);
  // console.log('option', option);
  // 查询水印列表
  async function queryList(id) {
    const params = {
      id: id,
      baseUrl,
    };
    try {
      const res = await getWatermarkList(params);
      const newData = res.map(item => {
        return {
          ...item,
          imageId: item.enc_image_id,
          key: item.id,
        };
      });
      setSourceNum(newData.length);
      setWaterMarks(newData);
      setUpdated(false);
    } catch (e) {
      console.error(e);
    }
  }
  // console.log('waterMarks', waterMarks);
  // 更新水印方法
  async function updateWatermark(obj) {
    const { id, image_id } = obj || {};
    if (id && !currentImg.imageId) return;
    const settings = waterMarks.map(item => {
      const { id, key, ...rest } = item;
      return {
        ...rest,
        watermark_id: item.id,
      };
    });
    let message = intl.tf('LP_WATERMARK_PRINTING_SAVE_TIPS');
    if (image_id) {
      message = intl.tf('LP_WATERMARK_PRINTING_SET_TIPS');
      settings.push({
        enc_image_id: image_id,
        ...initPosition,
      });
    }
    const params = {
      baseUrl,
      watermark_enable: checked ? 1 : 0,
      enc_album_id: albumId,
      settings,
    };
    await updateWatermarkEstimate(params, !!obj, { message });
    queryList(albumId);
  }

  /**
   *
   * @param {*} params 保存水印接口参数
   * @param {boolean} isVerify 是否需要校验打印状态
   * @returns
   */
  async function updateWatermarkEstimate(params, isVerify, options = {}) {
    const statusParams = {
      baseUrl,
      enc_album_id: albumId,
    };
    if (isVerify) {
      const res = await queryRewatermarkTaskStatus(statusParams);
      if (res === 1 || res === 0) {
        boundGlobalActions.showModal(LIVE_CONFIRM_MODAL, {
          title: <div style={{ marginTop: 20 }}>{intl.tf('LP_WATERMARK_PRINTING')}</div>,
          content: options.message || intl.tf('LP_WATERMARK_PRINTING_SAVE_TIPS'),
          onClose: () => {
            boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL);
          },
          footer: null,
        });
        return Promise.reject(false);
      }
    }
    await saveWatermark(params);
    return true;
  }
  function watermarkChange(watermarks) {
    setWaterMarks(watermarks);
    setUpdated(true);
  }

  // console.log('currentImg', currentImg);
  return (
    <WithHeaderComp title={intl.tf('LP_WATERMARK_SETTINGS')}>
      <Container>
        <SettingBox
          currentImg={currentImg}
          setCurrentImg={setCurrentImg}
          baseInfo={baseInfo}
          waterMarks={waterMarks}
          setWaterMarks={watermarkChange}
          updateWatermark={updateWatermark}
          queryList={queryList}
          checked={checked}
          setChecked={setChecked}
          submitForm={submitForm}
          getBaseInfo={getBaseInfo}
          intl={intl}
          updated={updated}
          sourceNum={sourceNum}
        />
        <ViewBox options={options} intl={intl} lang={lang} />
      </Container>
      <Footer>
        <XButton width={200} height={40} onClick={() => submitForm()}>
          {intl.tf('LP_SAVE_SETTING')}
        </XButton>
      </Footer>
      {placeholder}
    </WithHeaderComp>
  );
}
