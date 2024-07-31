import classNames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { useEffect } from 'react';

import { RcRadioGroup } from '@resource/components/XRadio';
import XSlider from '@resource/components/XSlider';

import { IntlConditionalDisplay } from '@common/components/InternationalLanguage';

import Switch from '@apps/gallery/components/Switch';
import FButton from '@apps/live/components/FButton';
import FImageUpload from '@apps/live/components/FImageUpload';
import InputNumber from '@apps/live/components/InputNumber';
import { AGAIN_PRINT_WATERMARK_MODAL, LIVE_CONFIRM_MODAL } from '@apps/live/constants/modalTypes';
import { PhotoLiveSettingContext } from '@apps/live/context';
import {
  queryRewatermarkTaskStatus,
  removeWatermark,
  updateWatermarkEnable,
} from '@apps/live/services/photoLiveSettings';

import { initPosition, positionKey } from '../opts';

import {
  BannerMarginBox,
  Container,
  DefaultItem,
  DefaultLabel,
  DefaultLine,
  InputMarginBox,
  Lable,
  Line,
  NewLine,
  SliderContatiner,
  SliderItem,
  SliderLabel,
  Space,
  Text,
  Title,
} from './layout';

const initalOption = intl => [
  {
    key: 1,
    children: [
      {
        key: 'left_right_margins',
        label: intl.tf('LP_LEFT_AND_RIGHT_POSTION'),
        directions: ['Left', 'Right'],
      },
      {
        key: 'space',
      },
      {
        key: 'top_bottom_margins',
        label: intl.tf('LP_UP_AND_DOWN_POSITION'),
        directions: ['Up', 'Down'],
      },
    ],
  },
  {
    key: 2,
    children: [
      {
        key: 'transparency',
        label: intl.tf('LP_TRANSPARENCY'),
      },
      {
        key: 'space',
      },
      {
        key: 'scaling_ratio',
        label: intl.tf('LP_SCALING'),
      },
    ],
  },
];
const initalDefaultOption = intl => [
  {
    key: 0,
    children: [
      {
        key: positionKey[0],
        label: intl.tf('LP_WATERMARK_POSITION_LEFTTOP'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[1],
        label: intl.tf('LP_WATERMARK_POSITION_MIDDLETOP'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[2],
        label: intl.tf('LP_WATERMARK_POSITION_RIGHTTOP'),
      },
    ],
  },
  {
    key: 1,
    children: [
      {
        key: positionKey[3],
        label: intl.tf('LP_WATERMARK_POSITION_CENTER'),
      },
    ],
  },
  {
    key: 2,
    children: [
      {
        key: positionKey[4],
        label: intl.tf('LP_WATERMARK_POSITION_LEFTBOTTOM'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[5],
        label: intl.tf('LP_WATERMARK_POSITION_MIDDLEBOTTOM'),
      },
      {
        key: 'space',
      },
      {
        key: positionKey[6],
        label: intl.tf('LP_WATERMARK_POSITION_RIGHTBOTTOM'),
      },
    ],
  },
  {
    key: 4,
    children: [
      {
        key: 'default_top_bottom_margins',
        type: 'input',
        showIds: [positionKey[0], positionKey[2], positionKey[1]],
        label: intl.tf('LP_WATERMARK_POSITION_UP'),
      },
      {
        key: 'default_top_bottom_margins',
        type: 'input',
        showIds: [positionKey[4], positionKey[6], positionKey[5]],
        label: intl.tf('LP_WATERMARK_POSTION_DOWN'),
      },
      {
        key: 'default_left_right_margins',
        type: 'input',
        showIds: [positionKey[0], positionKey[4]],
        label: intl.tf('LP_WATERMARK_POSTION_LEFT'),
      },
      {
        key: 'default_left_right_margins',
        type: 'input',
        showIds: [positionKey[2], positionKey[6]],
        label: intl.tf('LP_WATERMARK_POSTION_RIGHT'),
      },
    ],
  },
  {
    key: 3,
    children: [
      {
        key: 'default_transparency',
        label: intl.tf('LP_TRANSPARENCY'),
      },
      {
        key: 'space',
      },
      {
        key: 'default_scaling_ratio',
        label: intl.tf('LP_SCALING'),
      },
    ],
  },
];

/**
 * 默认的通栏水印设置
 */
const initalBannerOptions = intl => [
  {
    key: 1,
    children: [
      {
        key: positionKey[0],
        label: intl.tf('LP_WATERMARK_UP'),
        margin: 'top', // 位置
      },
      {
        key: positionKey[1],
        label: intl.tf('LP_WATERMARK_DOWN'),
        margin: 'bottom',
      },
      {
        key: positionKey[2],
        label: intl.tf('LP_WATERMARK_LEFT'),
        margin: 'left',
      },
      {
        key: positionKey[3],
        label: intl.tf('LP_WATERMARK_RIGHT'),
        margin: 'right',
      },
    ],
  },
  {
    key: 2,
    children: [
      {
        key: 'banner_top_bottom_margins',
        type: 'input',
        showIds: [positionKey[0]],
        label: intl.tf('LP_WATERMARK_POSITION_UP'),
      },
      {
        key: 'banner_top_bottom_margins',
        type: 'input',
        showIds: [positionKey[1]],
        label: intl.tf('LP_WATERMARK_POSTION_DOWN'),
      },
      {
        key: 'banner_left_right_margins',
        type: 'input',
        showIds: [positionKey[2]],
        label: intl.tf('LP_WATERMARK_POSTION_LEFT'),
      },
      {
        key: 'banner_left_right_margins',
        type: 'input',
        showIds: [positionKey[3]],
        label: intl.tf('LP_WATERMARK_POSTION_RIGHT'),
      },
    ],
  },
  {
    key: 3,
    children: [
      {
        key: 'banner_transparency',
        label: intl.tf('LP_TRANSPARENCY'),
      },
    ],
  },
];

export default function SettingBox(props) {
  const {
    currentImg,
    setCurrentImg,
    baseInfo,
    waterMarks,
    updateWatermark,
    queryList,
    setWaterMarks,
    checked,
    setChecked,
    submitForm,
    intl,
    updated,
    sourceNum,
  } = props;
  // console.log('currentImg[0]?.setting_type', currentImg?.setting_type);
  // const [radioValue, setRadioValue] = useState(currentImg?.setting_type || 1);
  // const [defaultSelect, setDefaultSelect] = useState(currentImg?.position_value || 1);
  const { urls, boundGlobalActions } = useContext(PhotoLiveSettingContext);
  const albumId = baseInfo && baseInfo.enc_album_id ? baseInfo.enc_album_id : null;
  const baseUrl = urls.get('galleryBaseUrl');

  useEffect(() => {
    initData();
  }, [baseInfo?.album_id]);

  useEffect(() => {
    if (typeof baseInfo?.watermark_enable !== 'boolean') return;
    onSwitch(baseInfo?.watermark_enable);
  }, [baseInfo?.watermark_enable]);

  function initData() {
    const { watermark_enable } = baseInfo || {};
    setChecked(watermark_enable);
  }

  // 按钮开关点击回调
  async function onSwitch(value) {
    // const params = {
    //   baseUrl,
    //   enc_album_id: albumId,
    //   watermark_enable: Number(value)
    // };
    // await updateWatermarkEnable(params);
    setChecked(value);
  }

  // 图片上传成回调
  function imageChange(files) {
    const file = files[files.length - 1];
    updateWatermark({ image_id: file.imageId });
    // console.log('files', files);
  }

  // 水印选择回调
  function onSelect(record) {
    setCurrentImg(record);
    // console.log('record', record);
  }

  // 判断是否选中，比较函数
  function isShowSuccessIcon(record) {
    return currentImg?.id === record.id;
  }

  async function onRemove(id) {
    const params = {
      baseUrl,
      enc_album_id: albumId,
    };
    const res = await queryRewatermarkTaskStatus(params);
    if (res === 1 || res === 0) {
      boundGlobalActions.showModal(LIVE_CONFIRM_MODAL, {
        title: <div style={{ marginTop: 20 }}>{intl.tf('LP_WATERMARK_PRINTING')}</div>,
        content: intl.tf('LP_WATERMARK_PRINTING_SET_TIPS'),
        onClose: () => {
          boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL);
        },
        footer: null,
      });
      return;
    }
    const data = waterMarks.find(item => item.id === id);
    if (!data) return;
    boundGlobalActions.showConfirm({
      title: intl.lang === 'cn' ? intl.tf('LP_ARE_YOU_DELETE_WATERMARK') : '',
      message: intl.tf('LP_REMOVED_CONFIRM'),
      close: boundGlobalActions.hideConfirm,
      className: 'photo-live-delete-watermark',
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
          className: 'white',
        },
        {
          onClick: async () => {
            await removeWatermark({ id: data.id, baseUrl });
            setCurrentImg(initPosition);
            if (waterMarks.length <= 1) {
              const settings = waterMarks.filter(item => item.id !== id);
              submitForm({ watermark_enable: 0, settings });
            } else {
              queryList(albumId);
            }
          },
          text: intl.tf('CONFIRMED'),
        },
      ],
    });
  }

  // 滑块切换回调
  function handleSliderChange(key, value) {
    if (!currentImg.imageId) return;
    const index = waterMarks.findIndex(item => item.id === currentImg.id);
    if (index < 0) return;
    waterMarks[index][key] = value;
    // console.log('///', waterMarks[index]);
    setWaterMarks([...waterMarks]);
    setCurrentImg({ ...waterMarks[index] });
    // setSliders(state => {
    //   return {
    //     ...state,
    //     [key]: value
    //   };
    // });
  }
  const commonSettingFn = (key, value) => {
    if (!currentImg.imageId) return;
    const index = waterMarks.findIndex(item => item.id === currentImg.id);
    if (index < 0) return;
    if (key === 'position_value') {
      waterMarks[index]['default_left_right_margins'] = 0;
      waterMarks[index]['default_top_bottom_margins'] = 0;
    }
    // 重置通栏水印的边距值
    if (key === 'banner_position') {
      waterMarks[index]['banner_left_right_margins'] = 0;
      waterMarks[index]['banner_top_bottom_margins'] = 0;
    }
    waterMarks[index][key] = value;
    setWaterMarks([...waterMarks]);
    setCurrentImg({ ...waterMarks[index] });
  };
  // 水印类型选择
  const onRadioClicked = e => {
    const { value } = e.target;
    // setRadioValue(value)
    commonSettingFn('setting_type', value);
  };
  const cols = initalOption(intl);
  const initalDefaultCols = useMemo(() => {
    return initalDefaultOption(intl);
  });

  /**
   * 通栏水印cols
   */
  const initalBannerCols = initalBannerOptions(intl);

  const handleDefaultLabel = key => {
    // setDefaultSelect(key);
    commonSettingFn('position_value', key);
  };

  async function resetPrintWatermark() {
    if (sourceNum === 0) return;
    const params = {
      baseUrl,
      enc_album_id: albumId,
    };
    const res = await queryRewatermarkTaskStatus(params);
    if (res === 1 || res === 0) {
      boundGlobalActions.showModal(LIVE_CONFIRM_MODAL, {
        title: <div style={{ marginTop: 20 }}>{intl.tf('LP_WATERMARK_TIPS')}</div>,
        content: intl.tf('LP_WATERMARK_PRINTING_REPRINT_TIPS'),
        onClose: () => {
          boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL);
        },
        footer: null,
      });
      return;
    }
    boundGlobalActions.showModal(AGAIN_PRINT_WATERMARK_MODAL, {
      baseInfo,
      onClose: () => {
        boundGlobalActions.hideModal(AGAIN_PRINT_WATERMARK_MODAL);
      },
      defaultActivity: updated ? 1 : 2,
      savePrintWatermark: updateWatermark,
    });
  }
  // console.log("🚀 ~ SettingBox ~ waterMarks:", waterMarks)
  return (
    <Container>
      <Line>
        <Lable>{intl.tf('LP_WATERMARK')}</Lable>
        <Switch onSwitch={onSwitch} checked={checked} labelStyle={{ marginBottom: 0 }} />
      </Line>
      <Line style={{ flexDirection: 'column', alignItems: 'start' }}>
        <>
          <FImageUpload
            baseUrl={baseUrl}
            boundGlobalActions={boundGlobalActions}
            onChange={imageChange}
            value={waterMarks}
            labelText={intl.tf('LP_WATERMARK_UPLOAD')}
            isShowTip={false}
            onSelect={onSelect}
            style={{ border: '1px solid #d8d8d8' }}
            curStyle={{ border: '1px solid #000' }}
            isShowSuccessIcon={isShowSuccessIcon}
            onRemove={onRemove}
            isShowAdd={waterMarks.length < 5}
            accept="image/png"
            uploadParams={{ acceptFileTip: intl.tf('LP_PLEASE_UPLOAD_PHOTOS_IN_PNG_FORMAT') }}
          />
          <IntlConditionalDisplay reveals={['en']}>
            <>
              <Text className="top-10">{intl.tf('LP_WARTERMARK_MESSAGE')}</Text>
              <Text style={{ whiteSpace: 'break-spaces' }}>
                {intl.tf('LP_WARTERMARK_Message_TWO')}
              </Text>
            </>
          </IntlConditionalDisplay>
        </>
      </Line>
      <Line>
        <Title>{intl.tf('LP_WATERMARK_POSITION')}</Title>
      </Line>
      <NewLine>
        <RcRadioGroup
          wrapperClass="znoRadio"
          disabled={!currentImg?.enc_image_id}
          onChange={onRadioClicked}
          value={currentImg?.setting_type}
          options={[
            {
              value: 1,
              label: intl.tf('LP_WATERMARK_POSITION_DEFAULT'),
            },
            {
              value: 2,
              label: intl.tf('LP_WATERMARK_POSITION_custom'),
            },
            {
              value: 3,
              label: intl.tf('LP_WATERMARK_POSITION_BANNER'),
            },
          ]}
        />
      </NewLine>
      <div style={{ marginTop: '32px' }}>
        {currentImg?.setting_type === 1 &&
          initalDefaultCols.map(item => {
            if (item.key === 4)
              return (
                <InputMargin
                  disabled={!currentImg?.enc_image_id}
                  options={item.children}
                  data={currentImg}
                  parentKey={currentImg?.position_value}
                  onChange={commonSettingFn}
                />
              );
            return item.key !== 3 ? (
              <DefaultLine key={item.key}>
                {item.children.map((child, index) => {
                  if (child.key === 'space') {
                    return <Space key={index} width={10} />;
                  }
                  if (child.type === 'input') {
                    return <InputNumber />;
                  }
                  return (
                    <DefaultItem key={index} type={child.key}>
                      <DefaultLabel
                        active={currentImg?.position_value === child.key}
                        onClick={() => handleDefaultLabel(child.key)}
                      >
                        {child.label}
                      </DefaultLabel>
                    </DefaultItem>
                  );
                })}
              </DefaultLine>
            ) : (
              <DefaultLine style={{ marginTop: '22px' }} key={item.key}>
                {item.children.map(child => {
                  if (child.key === 'space') {
                    return <Space key={child.key} width={50} />;
                  }
                  return (
                    <SliderItem key={child.key}>
                      <SliderLabel>{child.label}</SliderLabel>
                      <SliderContatiner>
                        <XSlider
                          value={currentImg[child.key]}
                          handleSliderChange={v => handleSliderChange(child.key, v)}
                        />
                        <span>{currentImg[child.key]}%</span>
                      </SliderContatiner>
                    </SliderItem>
                  );
                })}
              </DefaultLine>
            );
          })}
      </div>

      {currentImg?.setting_type === 2 &&
        cols.map(item => {
          return (
            <Line key={item.key}>
              {item.children.map(child => {
                if (child.key === 'space') {
                  return <Space key={child.key} width={50} />;
                }
                return (
                  <SliderItem key={child.key}>
                    <SliderLabel>{child.label}</SliderLabel>
                    <SliderContatiner>
                      {intl.lang === 'en' && child?.directions ? (
                        <span style={{ marginLeft: 0, marginRight: 10 }}>
                          {child?.directions[0]}
                        </span>
                      ) : null}
                      <XSlider
                        value={currentImg[child.key]}
                        handleSliderChange={v => handleSliderChange(child.key, v)}
                      />
                      {intl.lang === 'en' && child?.directions ? (
                        <span>{child?.directions[1]}</span>
                      ) : (
                        <span>{currentImg[child.key]}%</span>
                      )}
                    </SliderContatiner>
                  </SliderItem>
                );
              })}
            </Line>
          );
        })}
      {/* 新增通栏水印 */}
      {currentImg?.setting_type === 3 &&
        initalBannerCols.map(item => {
          if (item.key === 1) {
            return (
              <BannerMarginBox key={item.key}>
                {item.children.map(child => (
                  <div
                    key={child.key}
                    className={classNames(`item ${child.margin}`, {
                      active: currentImg?.banner_position === child.key,
                    })}
                    onClick={() => commonSettingFn('banner_position', child.key)}
                  >
                    {child.label}
                  </div>
                ))}
              </BannerMarginBox>
            );
          }
          if (item.key === 2) {
            return (
              <InputMargin
                disabled={!currentImg?.enc_image_id}
                options={item.children}
                data={currentImg}
                parentKey={currentImg?.banner_position}
                onChange={commonSettingFn}
              />
            );
          }
          if (item.key === 3) {
            return (
              <DefaultLine style={{ marginTop: '22px', width: '50%' }} key={item.key}>
                {item.children.map(child => {
                  // if (child.key === 'space') {
                  //   return <Space key={child.key} width={50} />;
                  // }
                  return (
                    <SliderItem key={child.key}>
                      <SliderLabel>{child.label}</SliderLabel>
                      <SliderContatiner>
                        <XSlider
                          value={currentImg[child.key]}
                          handleSliderChange={v => handleSliderChange(child.key, v)}
                        />
                        <span>{currentImg[child.key]}%</span>
                      </SliderContatiner>
                    </SliderItem>
                  );
                })}
              </DefaultLine>
            );
          }
        })}
      <FButton
        disabled={sourceNum === 0}
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #222',
          padding: '10px 44px',
          marginTop: 22,
        }}
        onClick={resetPrintWatermark}
      >
        {intl.tf('LP_REPRINT_WATERMARK')}
      </FButton>
    </Container>
  );
}

function InputMargin(props) {
  const { data, parentKey, options, onChange, disabled } = props;

  function handleChange(key, v) {
    if (disabled) {
      return;
    }
    onChange?.(key, Number(v));
  }
  return (
    <InputMarginBox>
      {options.map(item => {
        if (!item.showIds.includes(parentKey)) return null;

        return (
          <div className="margin_item">
            <div className="margin_label">{item.label}</div>
            <div className="margin_input">
              <InputNumber
                min={0}
                value={data[item.key]}
                onChange={v => handleChange(item.key, v)}
              />
              <span className="input_unit">px</span>
            </div>
          </div>
        );
      })}
    </InputMarginBox>
  );
}
