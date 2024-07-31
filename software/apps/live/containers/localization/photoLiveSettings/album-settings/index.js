import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import XButton from '@resource/components/XButton';
import XSelect from '@resource/components/XSelect';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import { useMessage } from '@common/hooks';

import FCascader from '@apps/live/components/FCascader';
import FCheckBox from '@apps/live/components/FCheckBox';
import FImageUpload from '@apps/live/components/FImageUpload';
import FInput from '@apps/live/components/FInput';
import FTimeCalendar from '@apps/live/components/FTimeCalendar';
import Form, { Field, useForm } from '@apps/live/components/Form';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { IAMGE_MODAL } from '@apps/live/constants/modalTypes';
import {
  BUSINESS_BLACK,
  BUSINESS_WHITE,
  CELEBRATION,
  HONEY_RED,
  TECHNOLOGY_BLUE,
} from '@apps/live/constants/strings';
import liveServices from '@apps/live/services';
import { getCountryList, updataAlbumBaseInfo } from '@apps/live/services/photoLiveSettings';
import img02 from '@apps/live/static/background/album-settings-en.png';
import img01 from '@apps/live/static/background/album-settings.png';
import { openPayCard } from '@apps/live/utils/index';

import { Container, Content, Footer, Left, Right } from './Layout';
import MessageTop from './MessageTop';
import PhotoStyle from './PhotoStyle';
import ShowTextBox from './ShowTextBox';
import { defaultFormCity, sortTypeOptions, transferFormCity } from './opts';

import './index.scss';

// https://www.asovx.com.tt
export default function BasicSetting(props) {
  const { urls, baseInfo, history, getBaseInfo, boundGlobalActions, userInfo } = props;
  const { intl, lang } = useLanguage();
  const [countryList, setCountryList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [countryValue, setCountryValue] = useState('');
  const [provinceValue, setProvinceValue] = useState('');
  const [hideProvince, setHideProvince] = useState(true);

  const [albumName, setAlbumName] = useState('');
  const [activityNme, setActivityName] = useState('');
  const [activityStartTime, setActivityStartTime] = useState('');
  const [activityEndTime, setActivityEndTime] = useState('');
  const [address, setAddress] = useState('');
  const [activeDetail, setActiveDetail] = useState('');
  const [photoStyle, setPhotoStyle] = useState({
    album_skin_name: intl.tf('LP_WHITE'),
    album_skin_id: 1,
  });
  const [city, setCity] = useState({});
  const lockRef = useRef(false);
  const showTextRef = useRef();
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const baseUrl = urls.get('galleryBaseUrl');
  const { id } = useParams();
  const [form] = useForm();
  const formRef = useRef(null);
  const album_id = id && id !== 'create' ? id : null;
  const [placeholder, message] = useMessage();

  const [store, setStore] = useState({});

  /**
   * 相册名称、活动时间、拍摄城市是否隐藏组合对象
   */
  const [hiddenObj, setHiddenObj] = useState({});

  async function onFinish(values) {
    if (!album_id) {
      const flag = await beforeSubmit();
      if (!flag) return;
    }
    lockRef.current = true;
    const {
      activity_startTime,
      activity_endTime,
      form_city,
      cover_image_id,
      photo_style,
      address,
      ...rest
    } = values;
    const begin_time = dayjs(activity_startTime[0]).valueOf();
    let end_time = dayjs(activity_endTime[1]).valueOf();

    // // 需要对结束时间特殊处理一下，判断结束时间是否发生变化
    // if ((baseInfo && !end_time.isSame(baseInfo.end_time)) || album_id === null) {
    //   end_time = end_time.add(86399000, 'millisecond').valueOf();
    // } else {
    //   end_time = end_time.valueOf();
    // }
    let city;
    if (form_city) {
      // city = form_city.area
      //   ? `${form_city.province}-${form_city.city}-${form_city.area}`
      //   : `${form_city.province}-${form_city.city}`;
      city = transferFormCity(form_city);
    } else if (lang === 'cn' && !form_city) {
      city = ''; // CN-直播拍摄城市可以为空
    }
    const imageId =
      cover_image_id && typeof cover_image_id[0].imageId === 'string'
        ? cover_image_id[0].imageId
        : null;

    // 皮肤id
    const album_skin_id = photo_style ? photo_style.album_skin_id : undefined;

    const params = {
      ...rest,
      baseUrl,
      begin_time,
      end_time,
      city,
      album_id,
      cover_image_id: imageId,
      album_skin_id,
      address,
      ...hiddenObj, // 保存隐藏字段信息
    };
    if (intl.lang === 'en') {
      params['country'] = countryValue;
      params['city'] = provinceValue;
      params['address'] = address;
    }
    try {
      const res = await updataAlbumBaseInfo(params);
      switch (album_skin_id) {
        case BUSINESS_WHITE:
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_AlbumStyle_BusinessWhite',
            });
          break;
        case BUSINESS_BLACK:
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_AlbumStyle_BusinessBlack',
            });
          break;
        case HONEY_RED:
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_AlbumStyle_WeddingRed',
            });
          break;
        case CELEBRATION:
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_AlbumStyle_Celebration',
            });
          break;
        case TECHNOLOGY_BLUE:
          intl.lang === 'cn' &&
            window.logEvent.addPageEvent({
              name: 'LIVE_AlbumStyle_TechBlue',
            });
          break;
        default:
          break;
      }
      message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_PC_CreateAlbum_Click_SaveBasicSettings',
        });
      // 创建需要埋点，编辑不需要埋点
      if (!album_id) {
        intl.lang === 'cn' &&
          window.logEvent.addPageEvent({
            name: 'SAASCN_PWA_Instant_CreateEvent_PC',
            albumId: res,
          });
        intl.lang === 'en' &&
          window.logEvent.addPageEvent({
            name: 'SAASUS_PWA_Instant_CreateEvent_PC',
            albumId: res,
          });
      }
      if (!album_id) {
        history.replace(`/software/live/photo/${res}/album-settings`);
      } else {
        getBaseInfo();
      }
      lockRef.current = false;
    } catch (err) {
      if (err.ret_code === 400341) {
        message.error(intl.tf('LP_ALBUM_DELTED'));
      }
      lockRef.current = false;
    }
  }
  useEffect(() => {
    if (baseInfo) {
      initData();
    } else {
      initCountryData();
    }
  }, [baseInfo]);

  async function initCountryData(baseInfo) {
    if (intl.lang === 'en') {
      const params = {
        baseUrl,
      };
      const countryInfo = await getCountryList(params);
      const list = countryInfo.districts.map(item => {
        return {
          ...item,
          label: item.local_name,
          value: item.local_name,
        };
      });
      setCountryList(list);
      if (baseInfo && baseInfo.country) {
        setCountryValue(baseInfo.country);
        const countryItem = list.find(item => item.local_name == baseInfo.country);
        if (countryItem.sub_districts.length > 0) {
          const subList = countryItem.sub_districts.map(item => {
            return {
              ...item,
              label: item.local_name,
              value: item.local_name,
            };
          });
          setProvinceList(subList);
          setHideProvince(false);
        } else {
          setHideProvince(true);
        }
      } else {
        setHideProvince(true);
      }
      if (baseInfo && baseInfo.city) {
        setProvinceValue(baseInfo.city);
      }
    }
  }
  useEffect(() => {
    if (album_id) return;

    form.setFieldsValue({
      photo_style: { album_skin_name: intl.tf('LP_WHITE'), album_skin_id: 1 },
      sort_type: 2, // 创建时候默认按拍摄时间排序
    });
    setPhotoStyle({ album_skin_name: intl.tf('LP_WHITE'), album_skin_id: 1 });

    // CN-直播-拍摄城市默认值为[上海/上海市/松江区]
    if (lang === 'cn') {
      form.setFieldValue('form_city', defaultFormCity);
    }
  }, [album_id]);

  // 获取详细
  async function initData() {
    // const res = await queryAlbumBaseInfo({ baseUrl, album_id });
    // if (!res) return null;
    const {
      activity_name,
      address,
      activity_detail,
      cover_image_id,
      album_name,
      city,
      begin_time,
      end_time,
      album_skin_name,
      album_skin_id,
      hidden_album_name, // 是否隐藏相册名称
      hidden_broadcast_date, // 是否隐藏直播日期
      hidden_broadcast_address, // 是否隐藏直播地址
      sort_type, // 新增直播间排序方式
      skin_category, // 皮肤分类信息
    } = baseInfo;
    // 存储隐藏字段信息
    setHiddenObj({
      ...hiddenObj,
      hidden_album_name,
      hidden_broadcast_date,
      hidden_broadcast_address,
    });

    initCountryData(baseInfo);
    const citys = city ? city.split('-') : undefined;
    const form_city = citys
      ? {
          province: citys[0],
          city: citys[1],
          area: citys[2],
        }
      : undefined;
    // const activity_time = [dayjs(begin_time), dayjs(end_time)];
    const photo_style = {
      album_skin_name,
      album_skin_id,
      skin_category,
    };
    const initailValue = {
      activity_name,
      address,
      activity_detail,
      cover_image_id: cover_image_id ? [{ imageId: cover_image_id, key: 1 }] : null,
      album_name,
      form_city,
      activity_startTime: [dayjs(begin_time), null],
      activity_endTime: [null, dayjs(end_time)],
      photo_style,
      sort_type: sort_type || 2, // 默认按拍摄时间排序
    };
    form.setFieldsValue(initailValue);
    console.log('initailValue', initailValue);
    Object.keys(initailValue).forEach(key => {
      getValues(key, initailValue[key]);
    });
  }
  // 提交事件
  function submitForm() {
    if (lockRef.current) return;
    formRef.current.submit();
  }

  /**
   * 隐藏change事件
   * @param {'hidden_album_name'|'hidden_broadcast_date'|'hidden_broadcast_address'} type 隐藏字段type
   * @param {boolean} value 值
   */
  function hiddenOnChange(type, value) {
    setHiddenObj({
      ...hiddenObj,
      [type]: value,
    });
  }

  function validitorDate(time) {
    const d1 = form.getFieldValue('activity_startTime')[0],
      d2 = time[1];
    if (dayjs(d2).isBefore(dayjs(d1)) || dayjs(d2).isSame(dayjs(d1))) {
      return false;
    }
    return true;
  }
  function validitorCountry() {
    if (countryValue.length == 0) {
      return false;
    }
    return true;
  }
  function validitorDate1(time) {
    const d = time[0];
    return !!d;
  }
  function validitorDate2(time) {
    const d = time[1];
    return !!d;
  }
  function validitorStyle(skin) {
    if (!skin.album_skin_id) {
      return false;
    }
    return true;
  }
  function getValues(name, value) {
    console.log('name value', name, value);
    switch (name) {
      case 'activity_name':
        setActivityName(value);
        break;
      case 'album_name':
        setAlbumName(value);
        break;
      case 'activity_startTime':
        setActivityStartTime(value[0]);
        break;
      case 'activity_endTime':
        setActivityEndTime(value[1]);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'photo_style':
        setPhotoStyle(value);
        break;
      case 'activity_detail':
        setActiveDetail(value);
        break;
      case 'form_city':
        setCity(value);
        break;
      default:
        break;
    }
    // setStore((data)=>{
    //    return  {
    //       ...data,
    //       'data':value
    //    }
    // })
  }
  async function beforeSubmit() {
    const baseUrl = urls.get('saasBaseUrl');
    const { uidPk } = userInfo.toJS();
    const params = { baseUrl, scene: 2, id: uidPk };
    lockRef.current = true;
    const isAuth = await liveServices.verifyAuth(params).catch(() => {
      lockRef.current = false;
    });
    if (!isAuth) {
      boundGlobalActions.showConfirm({
        title: '',
        message: intl.tf('LP_NO_ALBUMS_AVAILABLE_BUY_NOW'),
        close: boundGlobalActions.hideConfirm,
        buttons: [
          {
            onClick: () => {
              openPayCard({ boundGlobalActions, baseUrl });
              boundGlobalActions.hideConfirm();
            },
            text: intl.tf('LP_BUY_NOW'),
          },
        ],
      });
      return false;
    }
    return true;
  }
  useEffect(() => {
    console.log('stor', store);
  }, [store]);
  function beforeUpload(files) {
    const size = files[0].size / 1024 / 1024;
    if (size >= 5) {
      message.error(intl.tf('LP_PLEASE_UPLOAD_PICTURES_SMALLER_THAN_5M'));
      return false;
    }
    return true;
  }
  const defaultwrapCol =
    lang === 'cn'
      ? undefined
      : {
          labelCol: 6,
          textCol: 18,
        };
  return (
    <div>
      {!album_id ? <MessageTop intl={intl} /> : null}
      <WithHeaderComp title={intl.tf('LP_BASIC_INFO')}>
        <Container>
          <Content>
            <Left style={{ width: lang !== 'cn' ? '550px' : '' }}>
              <Form
                ref={formRef}
                form={form}
                onFinish={onFinish}
                wrapCol={defaultwrapCol}
                layout="h"
                formStateChange={getValues}
              >
                <IntlConditionalDisplay reveals={['cn']}>
                  <Field name="activity_name" label="顶部名称">
                    <FInput max={10} placeholder="照片直播平台" />
                  </Field>
                </IntlConditionalDisplay>
                <Field
                  name="album_name"
                  label={intl.tf('LP_ALBUM_NAME')}
                  required
                  rules={[
                    { required: true, message: intl.tf('LP_ALBUM_NAME_MESSAGE') },
                    { message: intl.tf('LP_ALBUM_NAME_CANTMESSAGE'), pattern: /^[^/]*$/ },
                  ]}
                >
                  {(value, onChange) => {
                    const { hidden_album_name } = hiddenObj;
                    return (
                      <div className="hidden-field">
                        <FInput.Textarea
                          rows={2}
                          max={120}
                          placeholder={intl.tf('LP_PLEASE_ENTER_THE_ACTIVITY_NAME')}
                          value={value}
                          onChange={onChange}
                        />
                        {/* CN-直播增加隐藏功能 */}
                        <IntlConditionalDisplay reveals={['cn']}>
                          <FCheckBox
                            checked={hidden_album_name}
                            onChange={checked => hiddenOnChange('hidden_album_name', checked)}
                            style={{ marginTop: 0 }}
                          />
                        </IntlConditionalDisplay>
                      </div>
                    );
                  }}
                </Field>
                <IntlConditionalDisplay reveals={['cn']}>
                  <Field label="活动时间" required className="activity-time-field">
                    <div className="activity-time">
                      <Field
                        name="activity_startTime"
                        rules={[
                          {
                            required: true,
                            message: intl.tf(
                              'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_START_TIME_CANNOT_BE_EMPTY'
                            ),
                          },

                          {
                            validitor: validitorDate1,
                            message: intl.tf(
                              'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_START_TIME_CANNOT_BE_EMPTY'
                            ),
                          },
                        ]}
                      >
                        {(value, onChange) => {
                          const { hidden_broadcast_date } = hiddenObj;
                          return (
                            <div className="hidden-field">
                              <FTimeCalendar
                                placeholderTexts={[
                                  intl.tf('LP_PLEASE_SELECT_A_START_TIME'),
                                  intl.tf('LP_PLEASE_SELECT_AN_END_TIME'),
                                ]}
                                timeType={'start'}
                                value={value}
                                onChange={onChange}
                              />
                              {/* CN-直播增加隐藏功能 */}
                              <FCheckBox
                                checked={hidden_broadcast_date}
                                onChange={checked =>
                                  hiddenOnChange('hidden_broadcast_date', checked)
                                }
                              />
                            </div>
                          );
                        }}
                      </Field>
                      <span className="separator">—</span>
                      <Field
                        name="activity_endTime"
                        rules={[
                          {
                            required: true,
                            message: intl.tf(
                              'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_END_TIME_CANNOT_BE_EMPTY'
                            ),
                          },
                          {
                            validitor: validitorDate2,
                            message: intl.tf(
                              'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_END_TIME_CANNOT_BE_EMPTY'
                            ),
                          },
                          {
                            validitor: validitorDate,
                            message: intl.tf(
                              'LP_THE_END_TIME_OF_ALBUM_BASIC_SETTINGS_CANNOT_BE_LESS_THAN_THE_START_TIME'
                            ),
                          },
                        ]}
                      >
                        <FTimeCalendar
                          placeholderTexts={[
                            intl.tf('LP_PLEASE_SELECT_A_START_TIME'),
                            intl.tf('LP_PLEASE_SELECT_AN_END_TIME'),
                          ]}
                          timeType={'end'}
                        />
                      </Field>
                    </div>
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['en']}>
                  <Field
                    name="activity_startTime"
                    label={intl.tf('LP_UPLOAD_PHOTO_STARTTIME')}
                    required
                    rules={[
                      {
                        required: true,
                        message: intl.tf(
                          'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_START_TIME_CANNOT_BE_EMPTY'
                        ),
                      },

                      {
                        validitor: validitorDate1,
                        message: intl.tf(
                          'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_START_TIME_CANNOT_BE_EMPTY'
                        ),
                      },
                    ]}
                  >
                    {/* <FCalendar placeholder="请输入开始时间/结束时间" /> */}
                    <FTimeCalendar
                      placeholderTexts={[
                        intl.tf('LP_PLEASE_SELECT_A_START_TIME'),
                        intl.tf('LP_PLEASE_SELECT_AN_END_TIME'),
                      ]}
                      timeType={'start'}
                    />
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['en']}>
                  <Field
                    name="activity_endTime"
                    label={intl.tf('LP_UPLOAD_PHOTO_ENDTIME')}
                    required
                    rules={[
                      {
                        required: true,
                        message: intl.tf(
                          'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_END_TIME_CANNOT_BE_EMPTY'
                        ),
                      },
                      {
                        validitor: validitorDate2,
                        message: intl.tf(
                          'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_END_TIME_CANNOT_BE_EMPTY'
                        ),
                      },
                      {
                        validitor: validitorDate,
                        message: intl.tf(
                          'LP_THE_END_TIME_OF_ALBUM_BASIC_SETTINGS_CANNOT_BE_LESS_THAN_THE_START_TIME'
                        ),
                      },
                      // {
                      //   validitor: validitorDate1,
                      //   message: intl.tf(
                      //     'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_START_TIME_CANNOT_BE_EMPTY'
                      //   ),
                      // },
                    ]}
                  >
                    {/* <FCalendar placeholder="请输入开始时间/结束时间" /> */}
                    <FTimeCalendar
                      placeholderTexts={[
                        intl.tf('LP_PLEASE_SELECT_A_START_TIME'),
                        intl.tf('LP_PLEASE_SELECT_AN_END_TIME'),
                      ]}
                      timeType={'end'}
                    />
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['en']}>
                  <Field
                    name="location"
                    label={intl.tf('LP_UPLOAD_PHOTO_LOCATION')}
                    required
                    rules={[
                      {
                        validitor: validitorCountry,
                        message: intl.tf(
                          'LP_THE_ALBUM_BASIC_SETTINGS_ACTIVITY_LOCATION_CANNOT_BE_EMPTY'
                        ),
                      },
                    ]}
                  >
                    <div className="country-city-address-select">
                      <XSelect
                        className={'location-item-select'}
                        placeholder={'County/Region'}
                        value={countryValue}
                        options={countryList}
                        onChange={o => {
                          const country = countryList.find(item => o.local_name == item.local_name);
                          setCountryValue(country.local_name);
                          if (country.sub_districts.length > 0) {
                            const list = country.sub_districts.map(item => {
                              return {
                                ...item,
                                label: item.local_name,
                                value: item.local_name,
                              };
                            });
                            setHideProvince(false);
                            setProvinceList(list);
                            setProvinceValue('');
                          } else {
                            setHideProvince(true);
                          }
                        }}
                      />
                      {!hideProvince && (
                        <XSelect
                          className={'location-item-select'}
                          placeholder={'State/Province'}
                          value={provinceValue}
                          options={provinceList}
                          onChange={o => {
                            const province = provinceList.find(
                              item => o.local_name == item.local_name
                            );
                            setProvinceValue(province.local_name);
                          }}
                        />
                      )}
                    </div>
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['en']}>
                  <Field name="address" label={intl.tf('LP_ALBUM_ADDRESS')}>
                    <FInput.Textarea
                      rows={2}
                      max={30}
                      placeholder={intl.tf('LP_ACTIVITY_ADDRESS')}
                    />
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['cn']}>
                  <Field
                    name="form_city"
                    label="拍摄城市"
                    // required
                    // rules={[{ required: true, message: '拍摄城市不能为空！' }]}
                  >
                    {(value, onChange) => {
                      const { hidden_broadcast_address } = hiddenObj;
                      return (
                        <div className="hidden-field">
                          <FCascader
                            estoreBaseUrl={estoreBaseUrl}
                            placeholder="请选择城市"
                            needMapStateToProps // 可以不限省、市、区
                            value={value}
                            onChange={onChange}
                          />
                          {/* 清空按钮 */}
                          {!!value && (
                            <div
                              className="clearBtn"
                              onClick={() => {
                                form.setFieldValue('form_city', '');
                                getValues('form_city', {});
                              }}
                            >
                              ×
                            </div>
                          )}
                          {/* CN-直播增加隐藏功能 */}
                          <FCheckBox
                            checked={hidden_broadcast_address}
                            onChange={checked =>
                              hiddenOnChange('hidden_broadcast_address', checked)
                            }
                          />
                        </div>
                      );
                    }}
                  </Field>
                </IntlConditionalDisplay>
                <IntlConditionalDisplay reveals={['cn']}>
                  <Field name="address" label="详细地址">
                    <FInput.Textarea rows={2} max={30} placeholder="请输入活动的详细地址" />
                  </Field>
                </IntlConditionalDisplay>
                {/* {lang === 'cn' && ( */}
                <Field
                  name="photo_style"
                  label={intl.tf('LP_ALBUM_DESCRIPTION')}
                  required
                  rules={[
                    {
                      validitor: validitorStyle,
                      message: intl.tf('LP_THE_ALBUM_STYLE_CANNOT_BE_EMPTY'),
                    },
                  ]}
                >
                  <PhotoStyle
                    onChange={e => {}}
                    callMethod={() => {
                      showTextRef.current.getSkinData();
                    }}
                    boundGlobalActions={boundGlobalActions}
                    baseUrl={baseUrl}
                    baseInfo={baseInfo}
                    // disabled={lang !== 'cn'}
                  />
                </Field>
                {/* )} */}
                <Field name="activity_detail" label={intl.tf('LP_ALBUM_DETAIL')}>
                  <FInput.Textarea rows={2} max={300} placeholder={intl.tf('LP_ACTIVITY_DETAIL')} />
                </Field>
                <Field name="cover_image_id" label={intl.tf('LP_ALBUM_COVER')}>
                  <FImageUpload
                    baseUrl={baseUrl}
                    orientation={baseInfo?.orientation}
                    boundGlobalActions={boundGlobalActions}
                    beforeUpload={beforeUpload}
                  />
                </Field>
                {/* 新增直播间排序方式 */}
                <Field name="sort_type" label={intl.tf('LP_ALBUM_SORT_TYPE')}>
                  {(value, onChange) => (
                    <XSelect
                      value={value}
                      className="sort-type-select"
                      onChange={item => onChange(item.value)}
                      options={sortTypeOptions(lang === 'cn')}
                    />
                  )}
                </Field>
              </Form>
            </Left>
            <Right>
              <ShowTextBox
                cref={showTextRef}
                values={{
                  activityNme,
                  albumName,
                  activityStartTime,
                  activityEndTime,
                  address,
                  photoStyle,
                  activeDetail,
                  countryValue,
                  provinceValue,
                  city,
                  ...hiddenObj, // CN-直播增加隐藏字段
                }}
                baseUrl={baseUrl}
              />
              {/* <img style={{ width: '557px' }} src={lang === 'cn' ? img01 : img02} /> */}
            </Right>
          </Content>
          <Footer>
            <XButton width={200} height={40} onClick={debounce(submitForm, 500)}>
              {intl.tf('LP_SAVE_SETTING')}
            </XButton>
          </Footer>
        </Container>
        {placeholder}
      </WithHeaderComp>
    </div>
  );
}
