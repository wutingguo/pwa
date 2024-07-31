import classNames from 'classnames';
import { addDays, isBefore, subDays } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import { cloneDeep, template } from 'lodash';
// 日历组件
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import XButton from '@resource/components/XButton';
import XInput from '@resource/components/XInput';
import XSelect from '@resource/components/XSelect';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import { XFileUpload } from '@common/components';
import { XLoading } from '@common/components';
import { EmptyContent } from '@common/components';
import { useMessage } from '@common/hooks';

import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import { ALBUM_LIVE_IMAGE_URL } from '@apps/live/constants/api';
import { IAMGE_MODAL, MOVE_MODAL } from '@apps/live/constants/modalTypes';
import { DAYLIMIT15_MODAL, DIFFERENT_MODAL } from '@apps/live/constants/modalTypes';
import { getAlbumCategory } from '@apps/live/services/category';
// 导入中文语言包
// 接口
import {
  changeContentGroup,
  change_ai_select,
  deleteImage,
  get_pho_role_list,
  list_contents,
  pinnedImage,
  queryAlbumBaseInfo,
  update_client_show,
} from '@apps/live/services/photoLiveSettings';
import refresh from '@apps/live/static/background/refresh.png';

import Checkbox from './Checkbox';
import ListItem from './ListItem';
import XPagePagination from './PagePagination';
import Selector from './Selector';
// 照片管理平台删除按钮svg
import DeleteIcon from './icons/DeleteIcon';
// 移动图标
import MoveIcon from './icons/MoveIcon';
import PickerIcon from './icons/PickerIcon';
import {
  categoryStatusOptions,
  columnsOptions,
  defaultCategoryStatus,
  defaultSort,
  filterSecondCategoryOptions,
  getIds,
  isSameFile,
  retouchStatusOptions,
  selectStatusOptions,
  showStatusOptions,
  uploadTimeOptions,
} from './util';

import './index.scss';

__isCN__ && registerLocale('zh-CN', zhCN);
__isCN__ && setDefaultLocale('zh-CN');

// const menuData1 = [
//   {
//     icon: 'xxx',
//     active: true,
//     name: '您的相册',
//     submenu: [
//       {
//         icon: '',
//         select: true,
//         name: '全部照片',
//         number: '',
//       },
//       {
//         icon: '',
//         select: false,
//         name: '照片直播',
//         number: '',
//       },
//     ],
//   },
// ];

const currentDate = new Date(); // 当前日期
currentDate.setHours(23, 59, 59, 0); // 将时间设置为 00:00:00

const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
threeMonthsAgo.setHours(0, 0, 0, 0); // 将时间设置为 00:00:00

export default function PhotoManagement(props) {
  const { boundGlobalActions, urls, boundProjectActions } = props;
  const [placeholder, message] = useMessage();
  const { id } = useParams();

  const [photographers, setPhotographers] = useState(null);
  const data = useSelector(state => state.live.albumList);

  const [customerIds, setCustomerIds] = useState('');
  // const [menuData, setMenuData] = useState([]);
  const [showStatus, setShowStatus] = useState('all');
  const [retouchStatus, setRetouchStatus] = useState('all');
  const [imageName, setImageName] = useState('');
  const [columnsValue, setColumnsValue] = useState(6);
  const [uploadTimeValue, setUploadTimeValue] = useState(4);
  const [selectedData, setSelectedData] = useState([]);
  const [startDate, setStartDate] = useState(threeMonthsAgo);
  const [endDate, setEndDate] = useState(currentDate);
  const [all, setAll] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(24); // 一页数量
  const [totalPages, setTotalPages] = useState(0);
  const [baseInfo, setBaseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const baseUrl = urls.get('galleryBaseUrl');
  const cloudBaseUrl = urls.get('cloudBaseUrl'); // 兼容US环境url-置顶接口
  // const pageSize = 24;
  const { intl, lang } = useLanguage();
  // 分类筛选项
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState();

  // CN-挑图筛选状态
  const [selectStatus, setSelectStatus] = useState('all');

  useEffect(() => {
    if (!id || id === 'create') return;
    getBaseInfo();
  }, []);

  // input回车监听
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      queryTableData({ current_page: 1 });
    }
  };

  const getBaseInfo = async () => {
    const params = {
      baseUrl,
      album_id: id,
    };
    const res = await queryAlbumBaseInfo(params);
    // console.log('***********8***', res);
    setBaseInfo(res);
    const sort = defaultSort(res);
    setUploadTimeValue(sort);
    const list = await getPhoRoleList(res);
    const ids = getIds(list);
    setCustomerIds(ids);
    const category_id = await getCategoryList(res); // 获取所有分类筛选项
    queryTableData({ customer_ids: ids, category_id, current_page: 1, sort }, res, true);
  };

  /**
   * 获取所有分类筛选项
   */
  const getCategoryList = async info => {
    const baseInfoParams = baseInfo || info;
    const { enc_album_id } = baseInfoParams;
    const params = { enc_album_id, baseUrl };
    const res = await getAlbumCategory(params);
    setCategoryOptions(res);
    const newCategoryStatus = defaultCategoryStatus(res);
    setCategoryStatus(newCategoryStatus); // 默认选中全部，没有就显示无
    return newCategoryStatus;
  };

  // 获取table数据
  const getPhoRoleList = async info => {
    const baseInfoParams = baseInfo || info;
    const { album_id } = baseInfoParams;
    const params = {
      album_id,
      baseUrl,
    };
    const res = await get_pho_role_list(params);
    if (!res) return;
    res.forEach((item, index) => {
      if (item.customer_id) {
        res[index].checked = true;
      }
    });
    setPhotographers(res);
    return res;
  };
  // 获取table数据
  const queryTableData = async (obj = {}, baseConfig, init = false) => {
    const baseInfoParams = baseInfo || baseConfig;
    if (!baseInfoParams) return;
    const { album_id } = baseInfoParams;
    setLoading(true);

    const params = {
      baseUrl,
      album_id,
      current_page: pageNum || 1,
      page_size: pageSize,
      customer_ids: customerIds || '',
      is_client_show: showStatus,
      replace: retouchStatus,
      category_id: categoryStatus,
      select_status: selectStatus, // 新增挑图状态
      startTime: startDate ? moment(startDate).valueOf() : null,
      endTime: endDate ? moment(endDate).valueOf() : null,
      imageName: imageName,
      sort: uploadTimeValue,
      ...obj,
    };

    getNewParams(params, 'is_client_show');
    getNewParams(params, 'replace');
    getNewParams(params, 'select_status', false);
    const res = await list_contents(params);
    if (!res) {
      setLoading(false);
      boundProjectActions.saveLiveAlbumList([]);
      setTotalPages(0);
      setPageNum(1);
      return;
    }
    // if (init) {
    // menuData1[0].name = decodeURIComponent(album_name);
    // menuData1[0].submenu[0].number = res?.total;
    // setMenuData(menuData1);
    setPageNum(res?.current);
    // }
    const list = res?.records;
    Promise.all(
      list.map(promise => {
        if (promise.enc_content_id) {
          const url = getUrl(promise);
          if (typeof url === 'string') {
            return url;
          }
          return url.then(value => {
            // 处理每个 Promise 对象的值
            return {
              ...promise,
              src: value,
            };
          });
        }
      })
    )
      .then(results => {
        // 处理结果数组
        if (!results) return;
        setLoading(false);
        boundProjectActions.saveLiveAlbumList(results);
        const newTotalPages = Math.ceil(res?.total / params?.page_size);
        setTotalPages(newTotalPages);
        setAll(false);
        setSelectedData([]);
        return results;
      })
      .catch(error => {
        // 处理错误
        setLoading(false);
        message.error(intl.tf('LP_PICTURE_PROCESSING_ERROR'));
        console.error(error);
      });
  };

  async function getUrl(item) {
    // correct_enc_content_id
    let src = template(ALBUM_LIVE_IMAGE_URL)({
      baseUrl,
      enc_image_id: item.show_enc_content_id,
      size: 4,
    });
    if (typeof item.orientation === 'number') {
      const url = await getOrientationAppliedImage(src, item.orientation);
      if (typeof url === 'string') {
        src = url;
      }
    }
    return src;
  }

  // 下载图片
  const handleDowload = (type, params) => {
    const id = type === 'noWatermark' ? params.correct_enc_content_id : params.enc_content_id;
    const src = getDownloadUrl({ baseUrl, enc_image_uid: id, size: 1 });
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        // 将链接地址字符内容转变成blob地址
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = params.content_name;
        a.click();
      });
  };

  // 摄影师选择
  const handleCheckboxChange = list => {
    const ids = getIds(list);
    setCustomerIds(ids);
    setPhotographers(list);
    queryTableData({ customer_ids: ids, current_page: 1 });
  };

  // 图片名字
  const inputProps = {
    value: imageName,
    placeholder: intl.tf('LP_PHOTO_MANGEMENT_SEARCH_PLACEHOLDER'),
    onKeyDown: handleKeyDown,
    style: { width: intl.lang === 'cn' ? '' : '262px' },
    onChange: e => {
      setImageName(e.target.value);
    },
  };

  // 因为select有all的缘故
  const getNewParams = (params, type, isToBoolean = true) => {
    // 是否将1、0等数字转为boolean
    if (params[type] === 'all') {
      delete params[type];
    } else {
      params[type] = isToBoolean ? !!params[type] : params[type];
    }
    return params;
  };

  // 显示状态
  const showStatusProps = {
    options: showStatusOptions(intl),
    value: showStatus,
    onChanged: ({ value }) => {
      setShowStatus(value);
      queryTableData({ is_client_show: value, current_page: 1 });
    },
  };

  // 修图状态
  const retouchStatusProps = {
    options: retouchStatusOptions(intl),
    value: retouchStatus,
    onChanged: ({ value }) => {
      setRetouchStatus(value);
      queryTableData({ replace: value, current_page: 1 });
    },
  };

  /**
   * 分类筛选，兼容老数据
   * 当没有数据时显示无
   */
  const categoryStatusProps = {
    options: categoryStatusOptions(intl, categoryOptions),
    value: categoryStatus,
    onChanged: ({ value }) => {
      setCategoryStatus(value);
      queryTableData({ category_id: value, current_page: 1 });
    },
  };

  /**
   * 挑图筛选数据
   */
  const selectStatusProps = {
    options: selectStatusOptions,
    value: selectStatus,
    onChanged: ({ value }) => {
      setSelectStatus(value);
      queryTableData({ select_status: value, current_page: 1 });
    },
  };

  const batchDownload = type => {
    const arr = getSelectData();
    arr.forEach(item => {
      handleDowload(type, item);
    });
  };

  // 列数
  const columnsChange = ({ value }) => {
    setColumnsValue(value);
  };

  // 顺序
  const uploadTimeChange = ({ value }) => {
    setUploadTimeValue(value);
    queryTableData({ sort: value, current_page: 1 });
  };

  const handleDateChange = (o, type) => {
    if (type === 'start' && !!o) setStartDate(o);
    if (type === 'end' && !!o) setEndDate(o);
    // clear 事件不触发onCalendarClose
    if (type === 'end' && !o) {
      setEndDate(null);
      queryTableData({ endTime: null, current_page: 1 });
    }
    if (type === 'start' && !o) {
      setStartDate(null);
      queryTableData({ startTime: null, current_page: 1 });
    }
  };

  const onCalendarClose = () => {
    queryTableData({ current_page: 1 });
  };

  const onAllCheck = () => {
    const list = cloneDeep(data);
    for (let i = 0; i < list.length; i++) {
      list[i].checked = !all;
    }
    setAll(!all);
    getSelectData(list);
    boundProjectActions.saveLiveAlbumList(list);
  };

  const updateCheckedStatus = (list, item) => {
    const data = cloneDeep(list);
    for (let i = 0; i < data.length; i++) {
      if (data[i].enc_content_id === item.enc_content_id) {
        data[i].checked = !item.checked;
        break; // 如果找到匹配项，可以选择终止循环
      }
    }

    if (item.checked) {
      setAll(false);
    } else {
      let allChecked = true;
      for (let i = 0; i < data.length; i++) {
        if (!data[i].checked) {
          allChecked = false;
          break;
        }
      }
      setAll(allChecked);
    }
    getSelectData(data);
    boundProjectActions.saveLiveAlbumList(data);
  };

  // 用的时候再查找选中哪些
  const getSelectData = list => {
    const newData = list || data;
    const arr = [];
    newData.forEach(item => {
      if (item.checked) {
        arr.push(item);
      }
    });
    setSelectedData(arr);
    return arr;
  };

  // 是否显示
  const handleShow = async (obj = {}) => {
    // {"enc_album_id":"相册加密ID","enc_content_id":"content加密ID","client_show":true}
    const params = {
      baseUrl,
      enc_album_id: obj.enc_album_id,
      enc_content_id: obj.enc_content_id,
      client_show: !obj.client_show,
    };

    // return new Promise(async(resovle, reject) => {
    const res = await update_client_show(params);
    if (res.ret_code === 200000) {
      const list = cloneDeep(data);
      list.forEach(item => {
        if (item.enc_content_id === obj.enc_content_id) {
          item.client_show = !obj.client_show;
        }
      });
      // setData(list);
      boundProjectActions.saveLiveAlbumList(list);
      return !obj.client_show;
    }
  };

  /**
   * 查看大图所属分类变更点击事件
   */
  const handleChangeMove = detail => {
    const { category_info, enc_album_content_rel_id: id } = detail;
    boundGlobalActions.showModal(MOVE_MODAL, {
      intl,
      close: () => boundGlobalActions.hideModal(MOVE_MODAL),
      onOk: value => handleSaveMove(value, [id]),
      radioOptions: filterSecondCategoryOptions(categoryOptions),
      selectedValue: category_info?.id,
    });
  };

  const handleListChange = (type, params, e) => {
    if (e) {
      // 当存在e时为替换 判断相册创建是否超过15天
      handleDateLimit(e);
    }
    if (type === 'select') {
      updateCheckedStatus(data, params);
    } else if (type === 'show') {
      handleShow(params);
    } else if (type === 'origin' || type === 'noWatermark') {
      handleDowload(type, params);
    } else if (type === 'modal') {
      const initialSlide = data.findIndex(item => item.enc_content_id === params.enc_content_id);
      boundGlobalActions.showModal(IAMGE_MODAL, {
        download: handleDowload,
        onReplaceClick: () => handleDowload(type, params),
        onHide: handleShow,
        beforeUpload: beforeUpload,
        getUploadedImgs: getUploadedImgs,
        onDateLimit: handleDateLimit,
        close: () => boundGlobalActions.hideModal(IAMGE_MODAL),
        initialSlide,
        list: data,
        onChangeMove: handleChangeMove, // 所属分类变更事件
        onDelete: ids => patchDeleteImage(ids), // 查看大图删除事件
      });
    }
  };
  //上传日期限制
  const handleDateLimit = (e, type) => {
    const { create_time } = baseInfo;
    const afterDay = addDays(new Date(create_time), 30);
    if (isBefore(afterDay, new Date())) {
      e.stopPropagation();
      boundGlobalActions.showModal(DAYLIMIT15_MODAL);
      return;
    }

    if (type === 'category') {
      boundGlobalActions.showModal(MOVE_MODAL, {
        intl,
        close: () => boundGlobalActions.hideModal(MOVE_MODAL),
        onOk: value => handleSaveMove(value),
        radioOptions: filterSecondCategoryOptions(categoryOptions, false),
        baseInfo,
        beforeUpload,
        getUploadedImgs,
        type,
      });
    }
  };
  // 文件上传前回调
  const beforeUpload = (files, type, originData) => {
    // const len = files.length;
    // if (len > 3) {
    //   message.error(intl.tf('LP_UPLOAD_FAILED_UP_TO_24_IMAGES_ARE_SUPPORTED'));
    //   return false;
    // }
    if (type === 'replace') {
      let differentFile = [];
      const multipleList = selectedData.length > 0 ? selectedData : getSelectData();
      const isSingle = !!originData; // 是否是单个替换
      const selectList = !!originData ? originData : multipleList;
      if (!originData && !selectList.length) {
        message.error(intl.tf('LP_PLEASE_FIRST_SELECT_THE_IMAGE_YOU_WANT_TO_REPLACE'));
        return false;
      }
      files.forEach((el, index) => {
        const currentOne = selectList.find(item => {
          // item.content_name === el.name
          // 单个替换不检测文件名重复
          if (isSingle) {
            return item;
          }
          if (item.content_name == el.name || isSameFile(el.name, item?.content_name)) {
            return item;
          }
        });
        if (!currentOne) {
          differentFile.push(el.name);
        } else {
          files[index].enc_content_id = currentOne.enc_content_id;
        }
      });
      if (differentFile.length > 0) {
        openDifferentModal(differentFile);
        // message.error(`请勿修改下载下来的文件名，再替换，错误文件名：${differentFile.name}`);
        return false;
      }
    }
    return true;
  };

  // 文件上传回调
  const getUploadedImgs = (successInfo, type) => {
    const { upload_complete } = successInfo;

    if (upload_complete[0]?.status?.code === 200000) {
      getPhoRoleList();
      // 替换图片不返回第一页
      const newPageNum = type === 'replace' ? pageNum : 1;
      queryTableData({ current_page: newPageNum });
    }
  };

  const onFresh = () => {
    getPhoRoleList();
    queryTableData({ current_page: 1, imageName: '' });
    setImageName('');
  };

  /**
   * 删除接口方法
   */
  const patchDeleteImage = async deleteIds => {
    const selectIds = selectedData.map(item => item.enc_album_content_rel_id);
    const ids = deleteIds !== undefined ? deleteIds : selectIds;
    const params = {
      baseUrl,
      ids,
    };
    await deleteImage(params);
    /**
     * 删除成功提示
     * 单个删除如果data.length小于1
     * 批量删除如果selectedData的数量等于data.length
     * 进入前一页，否则在当前页
     */
    const isPrevPage = data.length <= 1 || selectedData.length === data.length;
    const prevPageNum = pageNum - 1 <= 1 ? 1 : pageNum - 1;
    const newPageNum = isPrevPage ? prevPageNum : pageNum;
    queryTableData({ current_page: newPageNum });
    getPhoRoleList();
    message.success(intl.tf('LP_DELETE_SUCCESSFULLY'));
  };

  /**
   * 批量删除回调
   */
  const handleBatchDelete = () => {
    boundGlobalActions.showConfirm({
      title: intl.tf('LP_DELETE_CONFIRM'),
      message: intl.tf('LP_DELETE_CONFIRM_MESSAGE'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: () => patchDeleteImage(),
          className: 'white',
          text: intl.tf('CONTINUE'),
        },
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
        },
      ],
    });
  };

  /**
   * 批量图片移动
   */
  const handleBatchMove = () => {
    boundGlobalActions.showModal(MOVE_MODAL, {
      intl,
      close: () => boundGlobalActions.hideModal(MOVE_MODAL),
      onOk: value => handleSaveMove(value),
      radioOptions: filterSecondCategoryOptions(categoryOptions),
    });
  };

  /**
   * 保存移动
   * @param {number} value 移动到的分组id
   */
  const handleSaveMove = async (value, ids) => {
    boundGlobalActions.hideModal(MOVE_MODAL);
    boundGlobalActions.hideModal(IAMGE_MODAL);
    const selectIds = selectedData.map(item => item.enc_album_content_rel_id);
    const newIds = ids != undefined ? ids : selectIds;
    const params = {
      baseUrl,
      category_id: value,
      enc_album_id: baseInfo?.enc_album_id,
      content_list: newIds,
    };
    try {
      await changeContentGroup(params);
      // 移动成功后，重置选中状态
      queryTableData();
      message.success(intl.tf('LP_MOVE_SUCCESSFULLY'));
    } catch (error) {
      if (error.ret_code === 400333) {
        // 移动失败
        message.error(intl.tf('LP_MOVE_FAILED'));
      }
    }
  };

  /**
   * 图片置顶函数回调
   * @param {string} id enc_album_content_rel_id
   * @param {boolean} is_pinned 是否置顶
   */
  const handlePinned = async (id, is_pinned) => {
    const params = {
      baseUrl: lang === 'cn' ? baseUrl : cloudBaseUrl,
      enc_album_content_id: id,
      is_pinned,
    };
    await pinnedImage(params);
    queryTableData();
  };

  /**
   * 批量挑图
   * @param {2|3} type 2: 挑图通过 3: 挑图未通过
   * @param {Array} pickerIds 单个挑图
   */
  const handleBatchPicker = async (type, pickerIds) => {
    const selectIds = selectedData.map(item => item.enc_content_id);
    const ids = pickerIds !== undefined ? pickerIds : selectIds;
    if (ids.length === 0) {
      message.error('请先选择需要挑图的图片');
    }
    try {
      const params = {
        baseUrl,
        enc_album_id: baseInfo?.enc_album_id,
        enc_album_content_ids: ids,
        select_status: type,
      };
      await change_ai_select(params);
      queryTableData({ current_page: 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadProps = {
    multiple: true,
    inputId: 'add',
    isIconShow: false,
    uploadFilesByS3: true,
    isDropFile: false,
    enc_album_id: baseInfo?.enc_album_id,
    album_category_id: null, // 分类id-全部照片
    // getUploadedImgs,
    showModal: boundGlobalActions.showModal,
    maxUploadFileNums: 4,
    // beforeUpload,
    values: [],
  };

  const onChangeFilter = data => {
    const { pageNum: newPageNum, pageSize: newPageSize } = data;
    // pageNum是将要的页码 pageSize是设置的一页数量
    setPageNum(newPageNum);
    setPageSize(newPageSize);
    queryTableData({ current_page: newPageNum, page_size: newPageSize });
  };

  function openDifferentModal(messages) {
    const params = {
      messages,
      onOk: () => boundGlobalActions.hideModal(DIFFERENT_MODAL),
      close: () => boundGlobalActions.hideModal(DIFFERENT_MODAL),
    };
    boundGlobalActions.showModal(DIFFERENT_MODAL, params);
  }

  const emptyContentProps = {
    desc: intl.tf('LP_NO_PICTURE'),
    iconText: t('NEW_SLIDESHOW'),
    handleButton: ' ',
    style: { color: '#cccccc' },
  };
  const selectClassName = classNames('pm-form-item-select', {
    en: intl.lang === 'en',
  });
  return (
    <div className="pm">
      {/* <SideMenu data={menuData} /> */}
      <div className="pm-rightcontent">
        <Selector list={photographers} onChange={handleCheckboxChange} customerIds={customerIds} />
        <div className="pm-filter">
          <span className="pm-label">{intl.tf('LP_FILTERS')}：</span>
          <div className="pm-wrapper">
            <div className="pm-left">
              <div className="pm-form-item">
                <span className="pm-form-item-label">{intl.tf('LP_DISPLAY_STATUS')}</span>
                <XSelect className={selectClassName} {...showStatusProps}></XSelect>
              </div>
              <div className="pm-form-item">
                <span className="pm-form-item-label">{intl.tf('LP_TETOUCH_STATE')}</span>
                <XSelect className={selectClassName} {...retouchStatusProps}></XSelect>
              </div>
              {/* 分类筛选Select */}
              <div className="pm-form-item">
                <span className="pm-form-item-label">{intl.tf('LP_CATEGORY')}</span>
                <XSelect className={selectClassName} {...categoryStatusProps} />
              </div>
              {/* CN-挑图筛选 */}
              <IntlConditionalDisplay reveals={['cn']}>
                <div className="pm-form-item">
                  <span className="pm-form-item-label">挑图筛选</span>
                  <XSelect className={selectClassName} {...selectStatusProps} />
                </div>
              </IntlConditionalDisplay>
              <div className="pm-form-item" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="pm-form-item-wrapper">
                  <span className="pm-form-item-label">{intl.tf('LP_UPLOAD_PHOTO_STARTTIME')}</span>
                  <div className="pm-form-item-select">
                    <DatePicker
                      className={
                        intl.lang === 'cn' ? 'pm-date-picker' : 'pm-date-picker pm-date-picker-w150'
                      }
                      selected={startDate}
                      onChange={o => handleDateChange(o, 'start')}
                      onCalendarClose={() => onCalendarClose('start')}
                      excludeDateIntervals={[
                        {
                          start: subDays(new Date(endDate), 0),
                          end: addDays(new Date(endDate), 10000),
                        },
                      ]}
                      // selectsRange
                      showIcon
                      isClearable={!!startDate}
                      placeholderText={intl.tf('LP_PLEASE_SELECT_A_START_TIME')}
                      // monthsShown={2}
                      startDate={startDate}
                      endDate={endDate}
                      showTimeSelect
                      fixedHeight
                      // shouldCloseOnSelect={false}
                      // showTimeInput
                      timeFormat="HH:mm"
                      dateFormat={intl.lang === 'cn' ? 'yyyy/MM/dd HH:mm' : 'MM/dd/yyyy HH:mm'}
                    ></DatePicker>
                  </div>
                </div>
                <div className="pm-form-item-wrapper" style={{ marginLeft: '20px' }}>
                  <span className="pm-form-item-label">{intl.tf('LP_UPLOAD_PHOTO_ENDTIME')}</span>
                  <div className="pm-form-item-select">
                    <DatePicker
                      className={
                        intl.lang === 'cn'
                          ? 'pm-date-picker endTime'
                          : 'pm-date-picker pm-date-picker-w150 endTime'
                      }
                      selected={endDate}
                      onChange={o => handleDateChange(o, 'end')}
                      onCalendarClose={() => onCalendarClose('end')}
                      excludeDateIntervals={[
                        {
                          start: subDays(new Date(startDate), 10000),
                          end: addDays(new Date(startDate), 0),
                        },
                      ]}
                      // selectsRange
                      showIcon
                      isClearable={!!endDate}
                      placeholderText={intl.tf('LP_PLEASE_SELECT_AN_END_TIME')}
                      // monthsShown={2}
                      startDate={startDate}
                      endDate={endDate}
                      showTimeSelect
                      fixedHeight
                      // shouldCloseOnSelect={false}
                      // showTimeInput
                      timeFormat="HH:mm"
                      dateFormat={intl.lang === 'cn' ? 'yyyy/MM/dd HH:mm' : 'MM/dd/yyyy HH:mm'}
                    ></DatePicker>
                  </div>
                </div>
              </div>
            </div>
            <div className="pm-right pm-filter-right">
              <XInput className="pm-serach-input" {...inputProps}></XInput>
              <XButton
                className="pm-serach-btn"
                onClicked={() => queryTableData({ current_page: 1 })}
              >
                {intl.tf('LP_SEARCH')}
              </XButton>
            </div>
          </div>
        </div>
        <div className="pm-batch">
          <span className="pm-label">{intl.tf('LP_BULK_ACTIONS')}：</span>
          <div className="pm-wrapper">
            <div className="pm-left">
              <div className="pm-batch-checkbox-box">
                <Checkbox
                  label={`${intl.tf('LP_PHOTO_MANGEMENT_ALL')} (${
                    all ? data.length : selectedData.length
                  }/${data.length})`}
                  checked={all}
                  onChange={onAllCheck}
                ></Checkbox>
              </div>
              <XButton
                className="pm-btn pm-download-btn"
                style={{ width: lang !== 'cn' ? 120 : '' }}
              >
                <svg
                  t="1696744309022"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2296"
                  width="18"
                  height="18"
                >
                  <path
                    d="M960 629.888v316.736H64V629.888h76.8v239.936h742.4V629.888H960zM552 515.392l142.784-142.72 54.336 54.272-236.416 236.352-0.32-0.32-0.32 0.256L275.712 426.88l54.272-54.336L475.2 517.76V63.872h76.8v451.52z"
                    fill="#ffffff"
                    fill-opacity=".85"
                    p-id="2297"
                  ></path>
                </svg>
                {intl.tf('LP_PHOTO_MANGEMENT_DOWNLOAD')}
                <div className="pm-btn-menu">
                  <XButton
                    className="pm-menu-btn"
                    onClicked={() => batchDownload('origin')}
                    style={{ width: lang !== 'cn' ? 180 : '' }}
                  >
                    {intl.tf('LP_PHOTO_MANGEMENT_MASTER_PIC')}
                  </XButton>
                  <XButton
                    className="pm-menu-btn"
                    onClicked={() => batchDownload('noWatermark')}
                    style={{ width: lang !== 'cn' ? 180 : '' }}
                  >
                    {intl.tf('LP_PHOTO_MANGEMENT_UNWATERMARKED_GRAPH')}
                  </XButton>
                </div>
              </XButton>
              <XFileUpload
                {...uploadProps}
                className="pm-upload-img"
                interfaceType="replace_album_content"
                beforeUpload={files => beforeUpload(files, 'replace')}
                getUploadedImgs={files => getUploadedImgs(files, 'replace')}
              >
                <XButton
                  className="pm-btn pm-replace-btn"
                  style={{ width: lang !== 'cn' ? 130 : '' }}
                  onClicked={handleDateLimit}
                >
                  <svg
                    t="1696744740393"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2810"
                    id="mx_n_1696744740394"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M859.04 352H95.936a32 32 0 1 0 0 64h832a32 32 0 0 0 24.448-52.64l-189.088-224a32 32 0 0 0-48.896 41.28L859.04 352zM164.896 640H928a32 32 0 1 0 0-64H96a32 32 0 0 0-24.448 52.64l189.088 224a32 32 0 0 0 48.896-41.28L164.896 640z"
                      fill="#ffffff"
                      p-id="2811"
                    ></path>
                  </svg>
                  {intl.tf('LP_BULK_REPLACE')}
                </XButton>
              </XFileUpload>

              {categoryOptions?.length > 1 ? (
                <XButton
                  onClicked={e => handleDateLimit(e, 'category')}
                  className="pm-btn"
                  style={{ width: lang !== 'cn' ? 120 : '', marginRight: 10 }}
                >
                  <svg
                    t="1696745007958"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3620"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"
                      fill="#ffffff"
                      p-id="3621"
                    ></path>
                  </svg>
                  {intl.tf('LP_NEW_PHOTOS')}
                </XButton>
              ) : (
                <XFileUpload
                  {...uploadProps}
                  uploadParams={{
                    isCheckRepeatByInterface: true, // 是否通过接口检查重复
                  }}
                  className="pm-upload-img"
                  interfaceType="add_album_content"
                  beforeUpload={files => beforeUpload(files, 'add')}
                  getUploadedImgs={files => getUploadedImgs(files, 'add')}
                >
                  <XButton
                    onClicked={e => handleDateLimit(e)}
                    className="pm-btn pm-add-btn"
                    style={{ width: lang !== 'cn' ? 120 : '' }}
                  >
                    <svg
                      t="1696745007958"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3620"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"
                        fill="#ffffff"
                        p-id="3621"
                      ></path>
                    </svg>
                    {intl.tf('LP_NEW_PHOTOS')}
                  </XButton>
                </XFileUpload>
              )}
              {/* CN-批量挑图按钮 */}
              <IntlConditionalDisplay reveals={['cn']}>
                <XButton className="pm-btn pm-download-btn picker-btn">
                  <PickerIcon className="icon" style={{ top: 2, marginRight: 3 }} />
                  <span>批量挑图</span>
                  <div className="pm-btn-menu picker-btn-menu">
                    <XButton className="pm-menu-btn" onClicked={() => handleBatchPicker(2)}>
                      通过挑图
                    </XButton>
                    <XButton className="pm-menu-btn" onClicked={() => handleBatchPicker(3)}>
                      不通过挑图
                    </XButton>
                  </div>
                </XButton>
              </IntlConditionalDisplay>
              {/* 删除按钮 */}
              <XButton
                className="pm-btn"
                disabled={selectedData.length === 0}
                style={{ width: lang !== 'cn' ? 120 : '' }}
                onClicked={handleBatchDelete}
              >
                <DeleteIcon className="icon" style={{ top: 2, marginRight: 3 }} />
                {intl.tf('LP_DELETE')}
              </XButton>
              {/* 移动照片按钮 */}
              <XButton
                className="pm-btn"
                disabled={selectedData.length === 0}
                style={{ width: lang !== 'cn' ? 120 : 100, marginLeft: 14 }}
                onClicked={handleBatchMove}
              >
                <MoveIcon className="icon" style={{ top: 2, marginRight: 3 }} />
                {intl.tf('LP_ALBUM_MOVE')}
              </XButton>
            </div>
            <div className="pm-right">
              <XSelect
                className="pm-form-item-select"
                options={uploadTimeOptions(intl)}
                onChanged={uploadTimeChange}
                value={uploadTimeValue}
                style={{ width: '170px' }}
              />
              <XSelect
                className="pm-form-item-select col"
                options={columnsOptions(intl)}
                onChanged={columnsChange}
                value={columnsValue}
                style={{ width: intl.lang === 'cn' ? '60px' : '90px', marginLeft: '10px' }}
              />
            </div>
          </div>
        </div>
        <div className="pm-list" id="list" ref={listRef}>
          {data && data.length > 0 ? (
            data.map(item => {
              return (
                <ListItem
                  key={item.id}
                  columnsValue={columnsValue}
                  data={{ ...item, columnsValue, uploadData: [], boundGlobalActions }}
                  onChange={handleListChange}
                  beforeUpload={beforeUpload}
                  getUploadedImgs={getUploadedImgs}
                  intl={intl}
                  lang={lang}
                  onPinned={handlePinned}
                  onPicker={(type, ids) => handleBatchPicker(type, ids)}
                ></ListItem>
              );
            })
          ) : (
            <div className="pm-empty">
              <EmptyContent {...emptyContentProps} />
            </div>
          )}
          <XLoading
            className="loading"
            backgroundColor="rgba(0,0,0,0)"
            type="imageLoading"
            size="lg"
            zIndex={99}
            isShown={loading}
          />
        </div>
        <div className="pm-refresh" onClick={onFresh}>
          <img className="pm-refresh-img" src={refresh} alt="" />
          <span className="pm-refresh-btn">{intl.tf('LP_REFRESH')}</span>
        </div>
        {totalPages > 1 && (
          <div className="pm-page-pagination">
            <XPagePagination
              currentPage={pageNum}
              totalPage={totalPages}
              changeFilter={onChangeFilter}
              isShowPageSize
            />
          </div>
        )}
        {placeholder}
      </div>
    </div>
  );
}
