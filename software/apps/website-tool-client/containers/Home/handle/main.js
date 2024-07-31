import React from 'react';
import classNames from 'classnames';
import { fromJS } from 'immutable';
import { merge } from 'lodash';
import * as cache from '@resource/lib/utils/cache';
import { emailReg } from '@resource/lib/constants/reg';
import {
  BIND_EMAIL_MODAL,
  VIEW_FAVORITE_LIST_MODAL,
  DOWNLOAD_GALLERY_MODAL
} from '@apps/gallery-client/constants/modalTypes';
import {
  getEmailCacheKey,
  getPhoneCacheKey,
  getGuestUidCacheKey,
  getPinCacheKey
} from '@apps/gallery-client/utils/helper';
import { XIcon } from '@common/components';

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
          autoDismiss: 2
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
        autoDismiss: 2
      });
    },
    err => {
      console.log(err);
      boundGlobalActions.addNotification({
        message: t('ADD_COMMENT_FAILED'),
        level: 'error',
        autoDismiss: 2
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
        autoDismiss: 2
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
        autoDismiss: 2
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
        fromGallery: true
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
            autoDismiss: 2
          });
        }
      );
    }
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
    name: 'Gallery_Click_Favorite'
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
    favoriteImageList
  } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const uid = `${guest.get('guest_uid')}_${collectionId}`;

  if (__isCN__) {
    const submitStatus = !!favorite.get('submit_status');
    if (submitStatus) {
      addNotification({
        message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
        level: 'error',
        autoDismiss: 2
      });
      return;
    }
  }

  const collection_uid = qs.get('collection_uid');

  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const cachePhoneKey = getPhoneCacheKey(collection_uid);
  const email = cache.get(cacheEmailKey);
  const phone = cache.get(cachePhoneKey);

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
        fromGallery: true
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
            autoDismiss: 2
          });
        }
      );
    }
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
          favorite: m
        })
      );
    })
    .filter(v => !!v);

  return {
    cover,
    set,
    images: setFavoriteImageList
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
    downloadSetting,
    guest,
    favoriteImageList
  } = that.props;
  const tempFavorite = !__isCN__
    ? favorite
    : favorite.setIn(['favorite_image_list', 'records'], favoriteImageList);
  const { cover, set, images } = getFavoriteListData(that);

  boundGlobalActions.showModal(VIEW_FAVORITE_LIST_MODAL, {
    cover,
    set,
    images,
    guest,
    favorite: tempFavorite,
    favoriteSetting,
    downloadSetting,
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
    }
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
      viewImageIndex: index
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
    'actived-item': set['selectedValue'] === set['value']
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
      action: () => that.setState({ currentSetIndex: index + 6 })
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
    customClass: 'collection-sets-dropdown'
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
    favoriteImageList
  } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;

  const collectionUid = qs.get('collection_uid');

  const pinCacheKey = getPinCacheKey(collectionUid);
  const pin = cache.get(pinCacheKey) || '';
  const emailCacheKey = getEmailCacheKey(collectionUid);
  const cachePhoneKey = getPhoneCacheKey(collectionUid);
  const email = cache.get(emailCacheKey) || '';
  const phone = cache.get(cachePhoneKey);

  const {
    checkoutGalleryDownloadPin,
    getSetsAndResolution,
    getLastTimeZipUUID,
    getGalleryDownloadLink
  } = boundProjectActions;

  const { download_type, img_name, set_uid, enc_image_uid, submitStatus } = params;
  console.log('submitStatus: ', submitStatus);

  if (!submitStatus && __isCN__) {
    addNotification({
      message: '提交选片后，您方可下载图库！',
      level: 'error',
      autoDismiss: 2
    });
    return;
  }

  const isDownloadCollection = download_type === 1;
  let initialStep = 1;

  if (isDownloadCollection) {
    window.logEvent.addPageEvent({
      name: 'ClientGallery_Click_GalleryDownload',
      collectionId
    });
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
    onClosed: e => {
      hideModal(DOWNLOAD_GALLERY_MODAL);
      if (e) {
        window.logEvent.addPageEvent({
          name:
            download_type === 1
              ? 'ClientGalleryDownloadPopup_Click_Cross'
              : 'ClientGallerySingleDownloadPopup_Click_Cross',
          collectionId
        });
      }
    }
  };

  // 校验pin码接口
  const {
    isNeedCheckoutPin,
    unSupportDownload,
    common_pin_status
  } = await checkoutGalleryDownloadPin({
    ...params,
    pin
  });

  // 不支持下载
  if (unSupportDownload) {
    addNotification({
      message:
        download_type === 1
          ? t('UNSUPPORT_DOWNLOAD_COLLECTION')
          : t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO'),
      level: 'error',
      autoDismiss: 2
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
        favoriteSelect: !!favoriteSelect
      };
    });
  }

  downloadPorops = merge({}, downloadPorops, {
    setsAndResolution,
    isPinCodeClose: !common_pin_status
  });

  // 下载collection
  if (isDownloadCollection) {
    const { uuid, lastGeneratedTime, cnLastGeneratedTime } = await getLastTimeZipUUID(collectionId);
    const { isHasExistedZip, downloadName, downloadUrl } = uuid
      ? await getGalleryDownloadLink(uuid)
      : { isHasExistedZip: false, downloadName: null, downloadUrl: null };
    let downloaduuid = '';
    if (!isNeedCheckoutPin) {
      initialStep = 3;
      if (isHasExistedZip) {
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
      downloaduuid
    });

    // 下载单张图片
  } else {
    const { enc_image_uid, set_uid: set_id, img_name } = params;
    window.logEvent.addPageEvent({
      name: 'ClientGallery_Click_SinglePhotoDownload',
      collectionId,
      setId: set_id,
      encImageId: enc_image_uid
    });
    if (!isNeedCheckoutPin) {
      initialStep = 3;
      downloadPorops = merge({}, downloadPorops, {
        initialStep
      });
    }
  }
  if (!email && !phone) {
    return showModal(BIND_EMAIL_MODAL, {
      title: t('DOWNLOAD'),
      message: t('DOWNLOAD_PHOTO_BODY'),
      isShowReason: false,
      close: () => {
        hideModal(BIND_EMAIL_MODAL);
      },
      onOk: (params, inputValue) => {
        boundProjectActions.guestSignUp(params).then(
          result => {
            // 尝试登录E-Store 不需要响应数据
            boundProjectActions.storeSignUp({
              email: inputValue,
              fromGallery: true
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
              })
              .catch(err => {
                hideModal(BIND_EMAIL_MODAL);
              });
            showModal(DOWNLOAD_GALLERY_MODAL, downloadPorops);
          },
          err => {
            hideModal(BIND_EMAIL_MODAL);

            addNotification({
              message: t('GUEST_SIGN_UP_FAILED'),
              level: 'error',
              autoDismiss: 2
            });
          }
        );
      }
    });
  }
  showModal(DOWNLOAD_GALLERY_MODAL, downloadPorops);
};

export default {
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

  downloadGallery
};
