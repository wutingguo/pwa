import React, { Fragment, useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import { XFileUpload } from '@common/components';
import { useMessage } from '@common/hooks';

import Switch from '@apps/gallery/components/Switch';
import FInput from '@apps/live/components/FInput';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import liveServices from '@apps/live/services';
import startEn from '@apps/live/static/background/launch-en-small.png';

import LogoSection from './LogoSection';
import InputNumber from './LogoSection/InputNumber';
import start1 from './imgs/start-small.png';

import './index.scss';

const LaunchPage = props => {
  const [checked, setChecked] = useState(false);
  const [imgId, setImgId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [curTab, setCurTab] = useState(0);
  const [logoStore, setLogoStore] = useState({
    loading_time: 1,
    switch_status: false,
    button_text: '',
    loading_pic: '',
    is_default_loading: 1,
  });
  // 启动页倒计时
  const [countdownSetting, setCountdownSetting] = useState({
    count_down_value: 3,
    count_down_switch: true,
  });

  const [placeholder, message] = useMessage();
  const { intl, lang } = useLanguage();

  const { boundGlobalActions, urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  const fileUploadProps = {
    multiple: false,
    inputId: 'single',
    text: intl.tf('LP_UPLOAD'),
    iconType: 'add-upload',
    uploadFilesByS3: true,
    getUploadedImgs: successInfo => {
      const { upload_complete } = successInfo;
      const {
        image_data: { enc_image_id, exif_orientation },
      } = upload_complete[0] || {};
      const exif = exif_orientation ? +exif_orientation : 0;
      const encImgId = enc_image_id || '';
      getImgWithOrientation(encImgId, exif);
      setImgId(encImgId);
      setCurTab(1);
    },
    showModal: boundGlobalActions.showModal,
  };

  useEffect(() => {
    if (baseInfo) {
      queryStartInfo();
    }
  }, [baseInfo]);
  function queryStartInfo() {
    if (!baseInfo) return;
    const { broadcast_id } = baseInfo;
    liveServices.getStartPage({ baseUrl, broadcast_id }).then(res => {
      if (res.ret_code === 200000) {
        const {
          start_page_switch,
          poster_image,
          orientation,
          button_text,
          loading_info,
          poster_method,
          count_down_setting, // 新增启动页倒计时
        } = res.data;
        const newLogoInfo = {
          ...loading_info,
          button_text,
          loading_time: loading_info.loading_time || 1,
        };
        setLogoStore(newLogoInfo);
        setCurTab(poster_method);
        setChecked(start_page_switch);
        const newCountdownSetting = {
          ...count_down_setting,
          count_down_value: count_down_setting?.count_down_value || 3, // 默认为3秒
        };
        setCountdownSetting(newCountdownSetting);
        if (poster_image) {
          getImgWithOrientation(poster_image, orientation);
          setImgId(poster_image);
          // setCurTab(1);
        }
      }
    });
  }

  const getImgWithOrientation = async (encImgId, exif) => {
    const url = `${baseUrl}cloudapi/album_live/image/view?enc_image_uid=${encImgId}&thumbnail_size=5`;
    let correctUrl = url;
    if (exif) {
      correctUrl = await getOrientationAppliedImage(url, exif);
    }
    setImgUrl(correctUrl);
  };

  const changeSwitch = status => {
    setChecked(status);
  };

  const saveSetting = () => {
    const { broadcast_id } = baseInfo;
    const { button_text, is_default_loading, loading_pic, ...logoInfo } = logoStore;
    if (curTab === 1 && !imgId)
      return message.error(intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_TIP_DOWN_TIP'));
    if (is_default_loading === 1 && !loading_pic)
      return message.error(intl.tf('LP_LOGO_TIMER_TIP_IMG_UPLOAD_ERROR'));
    liveServices
      .saveStartPage({
        baseUrl,
        broadcast_id,
        start_page_switch: checked,
        poster_image: imgId && curTab ? imgId : null,
        button_text,
        poster_method: curTab,
        loading_info: {
          loading_pic,
          is_default_loading,
          ...logoInfo,
        },
        count_down_setting: { ...countdownSetting }, // 新增启动页倒计时
      })
      .then(res => {
        if (checked) {
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_StartPage_On',
            });
        } else {
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_StartPage_Off',
            });
        }
        queryStartInfo();
        message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
      });
  };
  function onChange(key, value) {
    const newStore = { ...logoStore };
    if (key === 'loading_time') {
      if (value === '') {
        newStore[key] = value;
      } else {
        newStore[key] = isNaN(Number(value)) ? 1 : Math.floor(Number(value));
      }
    } else {
      newStore[key] = value;
    }
    setLogoStore(newStore);
  }

  /**
   * 启动页倒计时change事件
   */
  function onCountDownChange(key, value) {
    const newStore = { ...countdownSetting };
    if (key === 'count_down_value') {
      if (value === '') {
        newStore[key] = value;
      } else {
        newStore[key] = isNaN(Number(value)) ? 1 : Math.floor(Number(value));
      }
    } else {
      newStore[key] = value;
    }
    setCountdownSetting(newStore);
  }

  const actions = [
    {
      label: intl.tf('LP_SHOW_PAGE'),
      key: 'switch',
      controls: () => <Switch onSwitch={changeSwitch} checked={checked} />,
    },
    {
      label: intl.tf('LP_UPLOAD_IMAGE'),
      key: 'upload',
      controls: () => {
        return (
          <Fragment>
            <XFileUpload {...fileUploadProps} />
            <div className="desc">{intl.tf('LP_UPLOAD_MESSAGE')}</div>
          </Fragment>
        );
      },
    },
    {
      label: intl.tf('LP_LOGO_SWITCH_TIP_BUTTON'),
      key: 'input',
      controls: () => {
        return (
          <Fragment>
            <div className="text_item">
              <div className="text_input">
                <FInput
                  width={'200px'}
                  placeholder={intl.tf('LP_LOGO_CLICK_TIP')}
                  value={logoStore.button_text}
                  onChange={e => onChange('button_text', e.target.value)}
                  max={10}
                />
              </div>
            </div>
          </Fragment>
        );
      },
    },
    {
      label: intl.tf('LP_LOGO_COUNTDOWN_SWITCH_LABLE'),
      key: 'show-countdown-switch',
      controls: () => (
        <div className="switch_setting">
          <Switch
            checked={countdownSetting?.count_down_switch}
            onSwitch={v => onCountDownChange('count_down_switch', v)}
          />
          <div className="swtich_title" style={{ width: 230 }}>
            <p className="switch_tip">{intl.tf('LP_LOGO_SWITCH_TIP')}</p>
            <InputNumber
              min={1}
              max={10}
              value={countdownSetting?.count_down_value}
              onChange={v => onCountDownChange('count_down_value', v)}
              width={78}
            />
            <p className="switch_input_tip">{intl.tf('LP_LOGO_TIMER_NUMBER_TIP')}</p>
          </div>
        </div>
      ),
    },
  ];

  const tabs = [
    {
      label: intl.tf('LP_DEFAULT'),
      key: 'default',
    },
    {
      label: intl.tf('LP_CUSTOM'),
      key: 'custom',
    },
  ];

  const imgRender = () => {
    if (curTab) {
      if (imgId) {
        // const imgStyle = {
        //   width: '100%',
        //   height: '100%',
        //   backgroundSize: '100%',
        //   backgroundPosition: 'top',
        //   backgroundRepeat: 'no-repeat',
        //   backgroundImage: `url(${imgUrl})`,
        // };
        const imgStyle = {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        };
        return <img src={imgUrl} style={imgStyle} />;
      }
      return <XFileUpload {...fileUploadProps} className="effectUpload" />;
    }
    // return <img src={`${baseUrl}clientassets-cunxin-saas/portal/images/pc/live/start.png`} />;
    return <img src={lang === 'cn' ? start1 : startEn} />;
  };
  return (
    <WithHeaderComp title={intl.tf('LP_ALBUM_LANDING_PAGE')} className="launchPageWrapper">
      <div className="content">
        <div className="lunch-section">
          <div className="actionBar">
            {actions.map(item => (
              <div className="actionWrapper" key={item.key}>
                <div
                  className="label"
                  style={lang === 'cn' ? { width: '100px' } : { width: '150px' }}
                >
                  {item.label}
                </div>
                <div className="control">{item.controls()}</div>
              </div>
            ))}
          </div>
          <div className="instantEffect ">
            <div className="title">{intl.tf('LP_CUSTOMIZING_PAGE')}</div>
            <div className="tabWrpper">
              {tabs.map((item, i) => (
                <div
                  className={`tab ${i === curTab ? 'cur' : ''}`}
                  key={item.key}
                  onClick={() => {
                    setCurTab(i);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div className="effectContent">
              <div
                className="imgRender"
                style={!curTab ? { background: 'transparent' } : { width: '80%' }}
              >
                {imgRender()}
              </div>
              {curTab ? (
                <IntlConditionalDisplay revels={['cn']}>
                  <div className="tips">以iphone X进行预览</div>
                </IntlConditionalDisplay>
              ) : null}
            </div>
          </div>
        </div>
        <div className="line_between" />
        <LogoSection
          logoStore={logoStore}
          setLogoStore={setLogoStore}
          boundGlobalActions={boundGlobalActions}
          intl={intl}
          baseUrl={baseUrl}
        />
      </div>
      <div className="saveSetting">
        <XButton onClick={saveSetting}>{intl.tf('LP_SAVE_SETTING')}</XButton>
      </div>
      {placeholder}
    </WithHeaderComp>
  );
};

export default LaunchPage;
