import classNames from 'classnames';
import { fromJS } from 'immutable';
import { merge, unionBy } from 'lodash';
import React from 'react';

import * as cache from '@resource/lib/utils/cache';

import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';
import { emailReg } from '@resource/lib/constants/reg';
import {
  galleryOrderType,
  orderStatus,
  payScenario,
  paySource,
} from '@resource/lib/constants/strings';

import {
  favoriteCreatOrder,
  favoriteOrderCancel,
  favoriteOrderDetails,
  favoriteOrderPay,
  favoriteOrders,
  listPaymentSettings,
} from '@resource/lib/service/weixinPay';

import { submitGallery } from '@common/servers';

import { XIcon } from '@common/components';

import {
  BIND_EMAIL_MODAL,
  DOWNLOAD_GALLERY_MODAL,
  TIPS_MODAL,
  VIEW_FAVORITE_LIST_MODAL,
} from '@apps/gallery-client/constants/modalTypes';
import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
  getPinCacheKey,
} from '@apps/gallery-client/utils/helper';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';

import offline from '../img/offline.png';
import weixin from '../img/weixin.png';

const loadData = that => {
  // const { mockData, currentSetIndex } = that.state;
  // const newList = generateList();
  // that.setState({
  //   mockData: Object.assign({}, mockData, {
  //     list: mockData.list.concat(newList)
  //   })
  // });
};

const verifySubmit = (that, isNotifiy) => {
  const { boundGlobalActions, favorite } = that.props;
  if (__isCN__) {
    const submitStatus = !!favorite.get('submit_status');
    if (submitStatus) {
      isNotifiy &&
        boundGlobalActions.addNotification({
          message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
          level: 'error',
          autoDismiss: 2,
        });
      return false;
    }
  }
  return true;
};

/**
 * 添加评论.
 * @param {*} that
 * @param {*} text
 * @param {*} favorite_uid
 */
const addComment = (that, item, text) => {
  const { boundGlobalActions, boundProjectActions, guest, collectionId } = that.props;
  const image_uid = item.get('enc_image_uid');
  boundProjectActions.addComment(image_uid, text).then(
    () => {
      boundGlobalActions.addNotification({
        message: t('ADD_COMMENT_SUCCESS'),
        level: 'success',
        autoDismiss: 2,
      });
    },
    err => {
      console.log(err);
      boundGlobalActions.addNotification({
        message: t('ADD_COMMENT_FAILED'),
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};

const markOrUnmarkFavorite = (that, item) => {
  const { boundProjectActions, boundGlobalActions, sets, guest, collectionId } = that.props;
  const { currentSetIndex, images } = that.state;
  const { setCurrentSetFavoriteImageCount } = boundProjectActions;
  return boundProjectActions.markOrUnmark(item.get('enc_image_uid')).then(
    res => {
      const { isMark } = res;
      const { favoriteImageList } = that.props;

      boundGlobalActions.addNotification({
        message: isMark ? t('MARK_SUCCESS') : t('UNMARK_SUCCESS'),
        level: 'success',
        autoDismiss: 2,
      });
      const set = sets.get(currentSetIndex);
      setCurrentSetFavoriteImageCount(
        currentSetIndex,
        images.get(set.get('set_uid')),
        favoriteImageList
      );
      return Promise.resolve(res);
    },
    err => {
      const { isMark } = err;
      boundGlobalActions.addNotification({
        message: isMark ? t('MARK_FAILED') : t('UNMARK_FAILED'),
        level: 'error',
        autoDismiss: 2,
      });
      return Promise.reject(err);
    }
  );
};

let isMarkOrUnmarking = false;

const bindUserInfo = (that, cb) => {
  const { boundGlobalActions, boundProjectActions, qs } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const collection_uid = qs.get('collection_uid');

  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const cachePhoneKey = getPhoneCacheKey(collection_uid);
  // 弹出绑定email的弹框.
  showModal(BIND_EMAIL_MODAL, {
    close: () => {
      isMarkOrUnmarking = false;
      hideModal(BIND_EMAIL_MODAL);
    },
    onOk: (params, inputValue) => {
      // 尝试登录E-Store 不需要响应数据
      boundProjectActions.storeSignUp({
        email: inputValue,
        fromGallery: true,
      });
      boundProjectActions.guestSignUp(params).then(
        result => {
          const { guest_uid } = result.data;

          // 获取一下favorite.
          boundProjectActions
            .getFavoriteImageList(guest_uid)
            .then(() => {
              const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
              cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);
              cache.set(cacheGuestUidKey, guest_uid);
              if (cb && typeof cb === 'function') {
                cb(guest_uid);
              }
              hideModal(BIND_EMAIL_MODAL);
              // markOrUnmarkFavorite(that, item, guest_uid).then(() => (isMarkOrUnmarking = false));
            })
            .catch(err => {
              hideModal(BIND_EMAIL_MODAL);
              isMarkOrUnmarking = false;
            });
        },
        err => {
          isMarkOrUnmarking = false;
          hideModal(BIND_EMAIL_MODAL);

          addNotification({
            message: t('GUEST_SIGN_UP_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
  });
};

/**
 * 添加到favorite或从favorite中移除.
 * @param {*} that
 * @param {*} item
 */
const toggleFavorite = (that, item, isFavorite) => {
  if (isMarkOrUnmarking && !__isCN__) {
    return;
  }
  isMarkOrUnmarking = true;

  window.logEvent.addPageEvent({
    name: 'Gallery_Click_Favorite',
  });
  const {
    currentSet,
    boundGlobalActions,
    boundProjectActions,
    qs,
    favorite,
    sets,
    guest,
    collectionId,
    favoriteImageList,
    selectionSetting,
  } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const uid = `${guest.get('guest_uid')}_${collectionId}`;

  if (__isCN__) {
    const { gallery_rule_type, gallery_image_num } = selectionSetting.toJSON();
    const selectedNum = that.selectedNum;
    const sortComboList = that.sortComboList;
    if (gallery_rule_type === 1) {
      const maxLength = sortComboList[sortComboList.length - 1]['gallery_image_num'];
      if (!isFavorite && selectedNum >= gallery_image_num + maxLength) {
        addNotification({
          message: '已达到最大选片上限',
          level: 'error',
          autoDismiss: 2,
        });
        return;
      }
    }
    const submitStatus = !!favorite.get('submit_status');
    if (submitStatus) {
      addNotification({
        message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
  }

  const collection_uid = qs.get('collection_uid');
  const submit_status = favorite.get('submit_status');
  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const cachePhoneKey = getPhoneCacheKey(collection_uid);
  const email = cache.get(cacheEmailKey);
  const phone = cache.get(cachePhoneKey);
  if (!__isCN__ && email && submit_status) {
    showModal(CONFIRM_MODAL, {
      message: (
        <div style={{ fontSize: '15px' }}>
          You‘ve submitted favorites. Navigate to{' '}
          <span
            style={{ color: '#0077cc', cursor: 'pointer' }}
            onClick={() => {
              that.setState({
                viewImageIndex: -1,
              });
              hideModal(CONFIRM_MODAL);
              showFavoriteList(that);
            }}
          >
            My Favorites
          </span>{' '}
          to regain access to modifying your choice.
        </div>
      ),
      close: () => hideModal(CONFIRM_MODAL),
      buttons: [
        {
          text: 'OK',
          onClick: () => {
            hideModal(CONFIRM_MODAL);
          },
        },
      ],
    });
    isMarkOrUnmarking = false;
    return;
  }

  const canMark = __isCN__ ? email || phone : email;

  if (canMark) {
    return markOrUnmarkFavorite(that, item)
      .then(() => (isMarkOrUnmarking = false))
      .catch(err => (isMarkOrUnmarking = false));
  }

  // 弹出绑定email的弹框.
  showModal(BIND_EMAIL_MODAL, {
    close: () => {
      isMarkOrUnmarking = false;
      hideModal(BIND_EMAIL_MODAL);
    },
    onOk: (params, inputValue) => {
      // 尝试登录E-Store 不需要响应数据
      boundProjectActions.storeSignUp({
        email: inputValue,
        fromGallery: true,
      });
      boundProjectActions.guestSignUp(params).then(
        result => {
          const { guest_uid } = result.data;

          // 获取一下favorite.
          boundProjectActions
            .getFavoriteImageList(guest_uid)
            .then(() => {
              const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);

              cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);
              cache.set(cacheGuestUidKey, guest_uid);

              hideModal(BIND_EMAIL_MODAL);
              markOrUnmarkFavorite(that, item, guest_uid).then(() => (isMarkOrUnmarking = false));
            })
            .catch(err => {
              hideModal(BIND_EMAIL_MODAL);
              isMarkOrUnmarking = false;
            });
        },
        err => {
          isMarkOrUnmarking = false;
          hideModal(BIND_EMAIL_MODAL);

          addNotification({
            message: t('GUEST_SIGN_UP_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
  });
};

/**
 * 获取favorite list弹框的渲染数据.
 * @param {*} that
 */
const getFavoriteListData = that => {
  const { currentSetIndex, viewImageIndex, images: imgs } = that.state;
  const { coverInfo, sets, favoriteImageList } = that.props;
  const cover = coverInfo;
  const set = sets.get(currentSetIndex);

  // 真实的需要从后台接口中获取到所有添加到收藏夹的图片
  const images = imgs.get(set.get('set_uid')) || fromJS([]);
  const setFavoriteImageList = favoriteImageList
    .map(m => {
      const item = images.find(k => k.get('enc_image_uid') === m.get('enc_image_uid'));

      if (!item) {
        return item;
      }

      return item.merge(
        fromJS({
          favorite: m,
        })
      );
    })
    .filter(v => !!v);

  return {
    cover,
    set,
    images: setFavoriteImageList,
  };
};

/**
 * 显示favorite列表的弹框.
 * @param {*} that
 */
const showFavoriteList = (that, submitStatus) => {
  const {
    boundGlobalActions,
    favorite,
    favoriteSetting,
    collectionSetting,
    downloadSetting,
    guest,
    favoriteImageList,
    designSetting,
    sets,
    match,
  } = that.props;
  const tempFavorite = !__isCN__
    ? favorite
    : favorite.setIn(['favorite_image_list', 'records'], favoriteImageList);
  const { cover, set, images } = getFavoriteListData(that);
  const favoriteSubmitStatus = favorite.get('submit_status');
  boundGlobalActions.showModal(VIEW_FAVORITE_LIST_MODAL, {
    cover,
    set,
    sets,
    images,
    guest,
    favorite: tempFavorite,
    favoriteSetting,
    collectionSetting,
    designSetting,
    downloadSetting,
    submitStatus: favoriteSubmitStatus,
    verifySubmit: isNotify => verifySubmit(that, isNotify),
    close: () => boundGlobalActions.hideModal(VIEW_FAVORITE_LIST_MODAL),
    addComment: (item, text) => addComment(that, item, text),
    unmark: item => {
      if (!that.verifySubmit(true)) {
        return;
      }
      return markOrUnmarkFavorite(that, item);
    },
    downloadGallery: params => {
      that.downloadGallery({ ...params, submitStatus });
    },
  });
};

/**
 * 显示单张图片的预览图.
 * @param {*} that
 * @param {*} item
 */
const showImageViewer = (that, item, index) => {
  if (item) {
    that.setState({
      viewImageIndex: index,
    });
  }
};

const hideImageViewer = that => {
  that.setState({ viewImageIndex: -1 });
};

/**
 * 格式化成XImageViewer中可以使用的数据.
 * @param {*} item
 */
const formatViewerImages = images => {
  if (!images || !images.size) {
    return images;
  }

  // 使用previewSrc作为预览图.
  return images.map(m => m.merge({ src: m.get('previewSrc') }));
};

const renderOptionItem = set => {
  const cName = classNames('dropdown-set-item', {
    'actived-item': set['selectedValue'] === set['value'],
  });
  // const dropdownItemStyle = classNames({
  //   active:
  //     typeof dropdownItem.value !== 'undefined' &&
  //     isEqual(selectedValue, dropdownItem.value)
  // });
  return (
    <li key={set['set_uid']} className={cName} onClick={set['action']}>
      <span>{set['set_name']}</span>
    </li>
  );
};

const renderLable = () => {
  return (
    <div className="set-dropdown-lable">
      <span className="label-content">MORE</span>
      <XIcon type="dropdown" iconWidth={12} iconHeight={12} />
    </div>
  );
};

const getDropdownProps = that => {
  const { sets } = that.props;
  const dropdownSets = sets.slice(6);
  const { currentSetIndex } = that.state;
  const convertSets = dropdownSets.map((set, index) => {
    const expendProps = {
      value: index + 6,
      selectedValue: currentSetIndex,
      action: () => that.setState({ currentSetIndex: index + 6 }),
    };
    return set.merge(expendProps);
  });
  const label = 'MORE';
  return {
    label: 'MORE',
    arrow: 'center',
    dropdownList: convertSets.toJS(),
    renderLable,
    renderOptionItem,
    customClass: 'collection-sets-dropdown',
  };
};

// 下载gallery图片
const downloadGallery = async (that, params) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    qs,
    urls,
    collectionId,
    favoriteImageList,
    sets,
    detail,
    downloadSetting,
    favorite,
  } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;

  const collectionUid = qs.get('collection_uid');

  const pinCacheKey = getPinCacheKey(collectionUid);
  const pin = cache.get(pinCacheKey) || '';
  const emailCacheKey = getEmailCacheKey(collectionUid);
  const cachePhoneKey = getPhoneCacheKey(collectionUid);
  const email = cache.get(emailCacheKey) || favorite.get('email') || '';
  const phone = cache.get(cachePhoneKey);
  const download_limited = downloadSetting.get('download_limited');
  const downloadImgInfo = detail.get('downloadImgInfo') || {};
  const limited_download_White_list = downloadImgInfo?.limited_download_permissions || [];
  const client_restricted = downloadSetting.get('client_restricted');
  const canDownloadClient = limited_download_White_list.find(i => i.client_email === email);
  const {
    checkoutGalleryDownloadPin,
    getSetsAndResolution,
    getLastTimeZipUUID,
    getGalleryDownloadLink,
  } = boundProjectActions;

  const {
    download_type,
    img_name,
    set_uid,
    enc_image_uid,
    submitStatus,
    isSelectPhotoed,
    downloadImgListImg,
    isDownload,
    formHistory,
  } = params;
  const { remaining } = downloadImgInfo;
  console.log('submitStatus: ', submitStatus);

  if (!submitStatus && __isCN__) {
    addNotification({
      message: '提交选片后，您方可下载图库！',
      level: 'error',
      autoDismiss: 2,
    });
    return;
  }

  const isDownloadCollection = download_type === 1;
  let initialStep = 1;

  if (isDownloadCollection) {
    window.logEvent.addPageEvent({
      name: 'ClientGallery_Click_GalleryDownload',
      collectionId,
    });
  }
  if (!email && !phone) {
    return showModal(BIND_EMAIL_MODAL, {
      title: t('DOWNLOAD'),
      message: t('DOWNLOAD_PHOTO_BODY'),
      isShowReason: false,
      close: () => {
        hideModal(BIND_EMAIL_MODAL);
      },
      onOk: (paramsValue, inputValue) => {
        boundProjectActions.guestSignUp(paramsValue).then(
          result => {
            // 尝试登录E-Store 不需要响应数据
            boundProjectActions.storeSignUp({
              email: inputValue,
              fromGallery: true,
            });
            const { guest_uid } = result.data;

            // 获取一下favorite.
            boundProjectActions
              .getFavoriteImageList(guest_uid)
              .then(() => {
                const cacheGuestUidKey = getGuestUidCacheKey(collectionUid);

                cache.set([emailReg.test(inputValue) ? emailCacheKey : cachePhoneKey], inputValue);
                cache.set(cacheGuestUidKey, guest_uid);

                hideModal(BIND_EMAIL_MODAL);
                downloadGallery(that, params);
              })
              .catch(err => {
                hideModal(BIND_EMAIL_MODAL);
              });
          },
          err => {
            hideModal(BIND_EMAIL_MODAL);

            addNotification({
              message: t('GUEST_SIGN_UP_FAILED'),
              level: 'error',
              autoDismiss: 2,
            });
          }
        );
      },
    });
  }
  if (client_restricted && !canDownloadClient) {
    showModal(TIPS_MODAL, {
      title: t('Download Restrictions'),
      tips: t('Photos are restricted to specific clients to download.'),
      className: 'download-restrictions-modal',
      okButtonText: 'OK',
      close: () => {
        hideModal(TIPS_MODAL);
      },
      onOk: () => {
        hideModal(TIPS_MODAL);
      },
    });
    return;
  }
  let downloadPorops = {
    escapeClose: true,
    isShown: true,
    initialStep,
    email,
    img_name,
    enc_image_uid,
    collectionId,
    collection_uid: collectionUid,
    set_id: set_uid,
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    downloadType: download_type,
    isDownloadSinglePhoto: download_type === 2,
    downloadName: null,
    downloadUrl: null,
    lastGeneratedTime: null,
    cnLastGeneratedTime: null,
    setsAndResolution: null,
    sets,
    urls: urls.toJS(),
    detail,
    downloadImgListImg,
    downloadSetting,
    downloadImgInfo,
    onClosed: e => {
      hideModal(DOWNLOAD_GALLERY_MODAL);
      if (e) {
        window.logEvent.addPageEvent({
          name:
            download_type === 1
              ? 'ClientGalleryDownloadPopup_Click_Cross'
              : 'ClientGallerySingleDownloadPopup_Click_Cross',
          collectionId,
        });
      }
    },
    openChoolesImg: formHistory => {
      boundGlobalActions.showModal('DOWNLOAD_CHOOSE_IMG_MODAL', {
        ...that.props,
        urls: urls.toJS(),
        downloadSelectPhoto: true,
        downloadImgInfo,
        onOk: downloadImgListImg => {
          that.downloadGallery({
            download_type: 1,
            set_uid: '',
            submitStatus: true,
            isSelectPhotoed: true,
            downloadImgListImg,
            formHistory,
          });
        },
        close: () => {
          boundGlobalActions.hideModal('DOWNLOAD_CHOOSE_IMG_MODAL');
        },
      });
    },
  };
  if (remaining < 1 && !__isCN__ && !isDownload && download_type === 2 && download_limited) {
    addNotification({
      message: 'No photos remaining for download.',
      level: 'error',
      autoDismiss: 2,
    });
    return;
  }
  // 校验pin码接口
  const { isNeedCheckoutPin, unSupportDownload, common_pin_status } =
    await checkoutGalleryDownloadPin({
      ...params,
      pin,
    });

  // 不支持下载
  if (unSupportDownload) {
    addNotification({
      message:
        download_type === 1
          ? t('UNSUPPORT_DOWNLOAD_COLLECTION')
          : t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO'),
      level: 'error',
      autoDismiss: 2,
    });
    return false;
  }

  // 下载选择 sets 及 图片清晰度
  const { setsAndResolution } = await getSetsAndResolution();
  if (__isCN__) {
    setsAndResolution.sets_setting = setsAndResolution.sets_setting.map(sub => {
      const favoriteSelect = favoriteImageList.find(fav => fav.get('set_uid') === sub.set_uid);
      return {
        ...sub,
        favoriteSelect: !!favoriteSelect,
      };
    });
  }

  downloadPorops = merge({}, downloadPorops, {
    setsAndResolution,
    isPinCodeClose: !common_pin_status,
  });

  // 下载collection
  if (isDownloadCollection) {
    const { uuid, lastGeneratedTime, cnLastGeneratedTime } = await getLastTimeZipUUID(collectionId);
    const { isHasExistedZip, downloadName, downloadUrl } = uuid
      ? await getGalleryDownloadLink(uuid)
      : { isHasExistedZip: false, downloadName: null, downloadUrl: null };
    let downloaduuid = '';
    if (!isNeedCheckoutPin) {
      if (
        !__isCN__ &&
        !isSelectPhotoed &&
        download_limited &&
        !isHasExistedZip &&
        (client_restricted ? canDownloadClient : email)
      ) {
        boundGlobalActions.showModal('DOWNLOAD_CHOOSE_IMG_MODAL', {
          ...that.props,
          urls: urls.toJS(),
          downloadSelectPhoto: true,
          downloadImgInfo,
          onOk: downloadImgListImg => {
            that.downloadGallery({
              download_type: 1,
              set_uid: '',
              submitStatus: true,
              isSelectPhotoed: true,
              downloadImgListImg,
            });
          },
          close: () => {
            boundGlobalActions.hideModal('DOWNLOAD_CHOOSE_IMG_MODAL');
          },
        });
        return;
      }
      initialStep = 3;

      if (isHasExistedZip && !formHistory) {
        initialStep = 2;
      }
      if (uuid && !isHasExistedZip) {
        initialStep = 4;
        downloaduuid = uuid;
      }
    }

    downloadPorops = merge({}, downloadPorops, {
      initialStep,
      downloadName,
      downloadUrl,
      cnLastGeneratedTime,
      lastGeneratedTime,
      setsAndResolution,
      downloaduuid,
      isHasExistedZip,
    });

    // 下载单张图片
  } else {
    const { enc_image_uid, set_uid: set_id, img_name } = params;
    window.logEvent.addPageEvent({
      name: 'ClientGallery_Click_SinglePhotoDownload',
      collectionId,
      setId: set_id,
      encImageId: enc_image_uid,
    });

    if (!isNeedCheckoutPin) {
      initialStep = 3;
      downloadPorops = merge({}, downloadPorops, {
        initialStep,
      });
    }
  }

  showModal(DOWNLOAD_GALLERY_MODAL, downloadPorops);
};

// 面部识别逻辑
const onOpenFace = that => {
  that.setState({
    facePopup: !that.state.facePopup,
  });
};
const onFaceUI = that => {
  that.setState({
    facePopup: !that.state.facePopup,
  });
};
const onFaceSelect = (that, list) => {
  if (list && list.length > 0) {
    onGetFaceInfo(that, list);
    that.setState({
      isFace: true,
      facePopup: false,
    });
  } else {
    that.setState({
      isFace: false,
      facePopup: false,
      faceImg: [],
    });
  }
};
// 处理人像搜索的逻辑
const onGetFaceInfo = (that, list) => {
  const { urls, favoriteImageList, boundProjectActions, detail } = that.props;
  const { downloadImgInfo } = detail && detail.toJS();
  const { sets: downloadSets } = downloadImgInfo || {};
  const imgsArr = downloadSets ? downloadSets.map(item => item.enc_image_ids) : [];
  const image_ids = [...imgsArr];
  //根据选择的人像 获取图片数组
  list.forEach(item => {
    item.simple_image_info.image_infos.forEach(itm => {
      itm.enc_image_uid = itm.enc_image_id;
      itm.image_uid = itm.enc_image_id;
    });
  });
  const res = unionBy(
    [].concat(...list.map(item => item.simple_image_info.image_infos)),
    'image_uid'
  );

  let setImages = transformSetImages(fromJS({ images: res }), null, urls);
  if (favoriteImageList && favoriteImageList.size && setImages && setImages.size) {
    setImages = setImages.map(item => {
      const favoriate = favoriteImageList.find(
        favoriateItem => favoriateItem.get('enc_image_uid') === item.get('enc_image_uid')
      );
      if (favoriate)
        return item.merge({
          comment: favoriate.get('comment'),
        });
      return item;
    });
  }
  setImages = setImages.map(item => {
    const imgId = item.get('enc_image_uid');
    const findFav = favoriteImageList.find(subItem => subItem.get('enc_image_uid') === imgId);
    const isDownload = image_ids && image_ids.includes(item.get('enc_image_uid'));
    if (findFav && findFav.get('enc_image_uid') === imgId) {
      return item.merge(item, {
        comment: findFav.get('comment'),
        width: item.get('width'),
        height: item.get('height'),
        isDownload,
      });
    }
    return item.merge(item, {
      width: item.get('width'),
      height: item.get('height'),
      isDownload,
    });
  });
  boundProjectActions.setCurrentSetFavoriteImageCount(
    0, //此值无用 置为0
    setImages,
    favoriteImageList
  );
  console.log('setImages', setImages);
  that.setState({
    faceImg: setImages,
  });
};
const onInitFace = that => {
  //获取face图片数组
  const { boundProjectActions, guest } = that.props;
  boundProjectActions.getFaceImgs().then(res => {
    const guest_uid = guest.get('guest_uid');
    const faceImgs = (res.data && res.data.group_infos) || [];
    const selectCache =
      localStorage.getItem(guest_uid) && JSON.parse(localStorage.getItem(guest_uid));
    (selectCache || []).forEach(item => {
      faceImgs.some(itm => {
        if (itm.simple_image_info.group_id === item) {
          itm.tag = true;
          return true;
        }
      });
    });
    const filter = faceImgs.filter(item => item.tag);
    onFaceSelect(that, filter);
  });
};
const setMeta = imgSrc => {
  const set = (k, v) => {
    let meta = document.createElement('meta');
    meta.name = k;
    meta.content = v;
    document.getElementsByTagName('head')[0].appendChild(meta);
  };
  const brand = window.location.pathname.replace(/\//g, '');
  const faceBookMeta = {
    'og:site_name': window.origin,
    'og:title': brand,
    'og:description': `Photo collection by ${brand}`,
    'og:url': `${window.origin}${window.location.pathname}`,
    'og:image': imgSrc,
  };
  const twitterMeta = {
    'twitter:site': window.origin,
    'twitter:title': brand,
    'twitter:description': `Photo collection by ${brand}`,
    'twitter:url': `${window.origin}${window.location.pathname}`,
    'twitter:image': imgSrc,
  };
  Object.keys(twitterMeta).forEach(item => {
    set(item, twitterMeta[item]);
  });
  Object.keys(faceBookMeta).forEach(item => {
    set(item, faceBookMeta[item]);
  });
};

const handleOrderPay = (that, config) => {
  const { boundGlobalActions, urls, favoriteImageList, boundProjectActions, favorite } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  const favorite_id = favorite.get('favorite_uid');
  const params = {
    galleryBaseUrl: config.galleryBaseUrl,
    order_number: config.order_number,
  };
  that.setState({
    submitGalleryStatus: true,
  });
  if (config.order_type === galleryOrderType.weixin) {
    params.pay_scenario = payScenario.pc;
    params.pay_source = paySource.pc;
  }
  favoriteOrderPay(params).then(res => {
    if (res.ret_code === 200000) {
      const enc_image_ids = [];
      favoriteImageList.map(item => {
        if (item.get('enc_image_uid')) {
          enc_image_ids.push(item.get('enc_image_uid'));
        }
      });
      that.setState(
        {
          orderConfig: {
            ...that.state.orderConfig,
            ...config,
            enc_image_ids,
            payInfoShow: config.order_type === galleryOrderType.weixin,
            qrCodeData: res.data || '',
          },
        },
        () => {
          //
          if (config.order_type === galleryOrderType.offline) {
            boundProjectActions.getCollectionDetail();
            boundProjectActions.getFavoriteImageList();
            boundGlobalActions.addNotification({
              message: t('SUBMIT_GALLERY_SUCCESS', '选片提交成功'),
              level: 'success',
              autoDismiss: 2,
            });
          }
          hideModal(CONFIRM_MODAL);
        }
      );
    }
  });
};

const getOrderDetails = async (that, params) => {
  const details = await favoriteOrderDetails(params);
  handleOrderPay(that, { ...params, ...details });
};

const getOrderStatus = async (that, params) => {
  // console.log('that////', that)
  const { customerId } = that.props;
  const list = await favoriteOrders(params);
  let orderConfig = null;
  let orderTypeConfig = null;
  // list订单列表第一个是最新的有效订单， 并且order_status === 1 待支付才调起继续支付弹窗
  // 同时查看开关是否打开状态pay_switch === 1， 才能打开
  const payConfigs = await listPaymentSettings({ ...params, customer_id: customerId });
  that.setState({
    payTypeConfigs: payConfigs,
  });
  if (
    list &&
    !!list.length &&
    [orderStatus.waitPaid, orderStatus.inPayment].includes(list[0].order_status) &&
    list[0].order_type === galleryOrderType.weixin
  ) {
    orderConfig = list[0];
    // const payConfigs = await listPaymentSettings({ ...params, customer_id: orderConfig?.customer_id })
    orderTypeConfig =
      payConfigs && payConfigs.find(item => item.pay_type === orderConfig.order_type);
    if (orderTypeConfig && orderTypeConfig.pay_switch === 1) {
      that.setState({
        orderConfig: {
          ...that.state.orderConfig,
          ...orderConfig,
        },
      });
      that.continuePaymentModal();
    }
  }
};

const cancelOrder = async (that, params) => {
  const { galleryBaseUrl, order_number, hideModal } = params;
  const res = await favoriteOrderCancel({ galleryBaseUrl, order_number });
  if (res) {
    hideModal(CONFIRM_MODAL);
  }
};

// 选择支付方式
const confrimPayTypeModal = (that, textObj, configs) => {
  const { payTypeConfigs } = that.state;
  const { boundGlobalActions, urls } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const { title, message, btnText1, btnText2 } = textObj;
  const offlineBtnShow = payTypeConfigs.find(
    item => item.pay_type === galleryOrderType.offline
  ).pay_switch;

  const offlineBtn = {
    text: '线下支付',
    icon: offline,
    className: 'payBtn',
    onClick: () => {
      // 支付流程
      favoriteCreatOrder({ ...configs, order_type: galleryOrderType.offline }).then(res => {
        // that.handleSubmit()
        handleOrderPay(that, {
          ...configs,
          order_number: res,
          order_type: galleryOrderType.offline,
        });
      });
    },
  };
  const weixinBtn = {
    text: '微信支付',
    icon: weixin,
    className: 'payBtn',
    onClick: () => {
      // 支付流程
      favoriteCreatOrder({ ...configs, order_type: galleryOrderType.weixin }).then(res => {
        // 获取订单号
        handleOrderPay(that, {
          ...configs,
          order_number: res,
          order_type: galleryOrderType.weixin,
        });
      });
    },
  };
  const btns = !!offlineBtnShow ? [offlineBtn, weixinBtn] : [weixinBtn];

  showModal(CONFIRM_MODAL, {
    title,
    message,
    style: { width: '430px' },
    footerStyle: { display: 'flex', justifyContent: 'start' },
    close: () => hideModal(CONFIRM_MODAL),
    buttons: btns,
  });
};

const continuePaymentModal = that => {
  const { boundGlobalActions, urls } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  showModal(CONFIRM_MODAL, {
    title: '',
    message: '当前存在待支付订单，是否继续支付？',
    btnOpenClose: true,
    style: { width: '440px' },
    footerStyle: { marginTop: '100px' },
    isHideIcon: true,
    close: () =>
      that.cancelOrder({
        galleryBaseUrl,
        order_number: that.state.orderConfig?.order_number,
        hideModal,
      }),
    buttons: [
      {
        text: '重新选片',
        className: 'white',
        onClick: () =>
          that.cancelOrder({
            galleryBaseUrl,
            order_number: that.state.orderConfig?.order_number,
            hideModal,
          }),
      },
      {
        text: '继续支付',
        onClick: () => {
          // 只有初始化的时候才会调起，并且会有order_number
          handleOrderPay(that, {
            ...that.state.orderConfig,
            galleryBaseUrl,
          });
        },
      },
    ],
  });
};

const handlePay = (that, params) => {
  const { favorite, favoriteImageList, guest, urls, collectionUid } = that.props;
  const { orderConfig } = that.state;
  const favorite_id = favorite.get('favorite_uid');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const enc_image_ids = [];
  favoriteImageList.map(item => {
    if (item.get('enc_image_uid')) {
      enc_image_ids.push(item.get('enc_image_uid'));
    }
  });
  const configs = {
    galleryBaseUrl,
    enc_collection_id: collectionUid,
    guest_id: guest.get('guest_uid'),
    pay_source: paySource.pc,
    order_type: galleryOrderType.weixin,
    price: params.price || orderConfig.price,
    add_image_pack_id: params.add_image_pack_id,
    favorite_id,
    enc_image_ids,
  };
  if (!params?.weixinShow) {
    favoriteCreatOrder({ ...configs, order_type: galleryOrderType.offline }).then(res => {
      handleOrderPay(that, {
        ...configs,
        order_number: res,
        order_type: galleryOrderType.offline,
      });
    });
  } else {
    confrimPayTypeModal(
      that,
      {
        title: '提交选片',
        message:
          '请仔细确认您提交的选片是否正确，一旦提交后，将不再允许更改！ \n \n请选择您的支付方式',
        // btnText1: '线下支付',
        // btnText2: '微信支付',
      },
      configs
    );
  }
};

const handleSubmit = that => {
  const {
    urls,
    collectionUid,
    guest,
    boundGlobalActions,
    boundProjectActions,
    qs,
    favoriteImageList,
    selectionSetting,
  } = that.props;
  const { gallery_image_extra, gallery_image_num, gallery_rule_switch, gallery_rule_type } =
    selectionSetting.toJSON();
  const comboList = selectionSetting.get('add_image_packages')?.toJS() || [];
  const tempComboList = [...comboList].sort(
    (a, b) => a['gallery_image_num'] - b['gallery_image_num']
  );

  const { showModal, hideModal } = boundGlobalActions;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const activeCombo = that.activeCombo;

  const props = {
    galleryBaseUrl,
    collection_uid: collectionUid,
    guest_uid: guest.get('guest_uid'),
    submit_status: 1,
    add_image_pack_id:
      gallery_rule_type === 0 || activeCombo === -1 ? null : tempComboList[activeCombo]['uidpk'],
    content: favoriteImageList.reduce((res, item) => {
      res.push({
        enc_image_uid: item.get('enc_image_uid'),
        comment: item.get('comment'),
      });
      return res;
    }, []),
  };
  submitGallery(props).then(() => {
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    boundGlobalActions.addNotification({
      message: t('SUBMIT_GALLERY_SUCCESS', '选片提交成功'),
      level: 'success',
      autoDismiss: 2,
    });
  });
  hideModal(CONFIRM_MODAL);
};

const hidePayInfo = async that => {
  const { boundProjectActions, boundGlobalActions } = that.props;
  // 返回判断是否扫码了
  const details = await favoriteOrderDetails({
    ...that.state.orderConfig,
  });
  if (details.order_status === orderStatus.success) {
    // that.handleSubmit()
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    boundGlobalActions.addNotification({
      message: t('SUBMIT_GALLERY_SUCCESS', '选片提交成功'),
      level: 'success',
      autoDismiss: 2,
    });
  } else if ([orderStatus.waitPaid, orderStatus.inPayment].includes(details.order_status)) {
    that.continuePaymentModal();
  }
  that.setState({
    orderConfig: {
      ...that.state.orderConfig,
      payInfoShow: false,
    },
  });
};

export default {
  setMeta,
  loadData,
  toggleFavorite,
  showFavoriteList,

  // 图片预览.
  showImageViewer,
  hideImageViewer,
  formatViewerImages,
  bindUserInfo,
  addComment,
  verifySubmit,
  getDropdownProps,

  downloadGallery,
  onFaceUI,
  onFaceSelect,
  onOpenFace,
  onInitFace,

  // 支付
  getOrderDetails,
  handleOrderPay,
  getOrderStatus,
  cancelOrder,
  continuePaymentModal,
  handlePay,
  handleSubmit,
  hidePayInfo,
};
