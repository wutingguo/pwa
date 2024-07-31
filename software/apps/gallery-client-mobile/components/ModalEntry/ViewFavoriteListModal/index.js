import classNames from 'classnames';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import XPureComponent from '@resource/components/XPureComponent';
import XWaterFall from '@resource/components/XWaterFall';
import XNewImageViewer from '@resource/components/mobile/XNewImageViewer';

import XCoverRender from '@resource/components/pwa/XCoverRender';

import equals from '@resource/lib/utils/compare';
import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';

import scrollLoadHOC from '@common/utils/scrollLoadHOC';

import { submitGallery } from '@common/servers';

import { XButton, XIcon, XImageViewer, XInput, XModal } from '@common/components';

import { getFavoriteImages, querySetImages } from '@apps/gallery-client/services/project';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';

import HorizontalWaterFall from '../../HorizontalWaterFall';

import main from './main';

import './index.scss';

class ViewFavoriteListModal extends XPureComponent {
  constructor(props) {
    super(props);
    const { data } = this.props;

    this.photoContainer = React.createRef();
    this.wrapRef = React.createRef();
    const images = data.get('images');
    this.state = {
      boxWidth: 0,
      boxHeight: 0,
      images,
      viewImageIndex: -1,
      cur: 0,
      tabs: [],
      imageSize: images.size,
      sets: null,
      favoriteList: null,
      favoriteSubmit: data.get('submitStatus'),
    };
  }

  renderCard = (item, index) => main.renderCard(this, item, index);
  // 预览图片.
  showImageViewer = (item, index) => main.showImageViewer(this, item, index);
  hideImageViewer = () => main.hideImageViewer(this);
  formatViewerImages = image => main.hideImageViewer(this, image);

  componentDidMount() {
    this.getCoverBoxSize();
    this.formatData();
    this.getImageList();
    if (this.photoContainer) {
      this.photoContainer.current.scrollIntoView();
    }
    // resizing时, 重新计算node的style.
    window.addEventListener('resize', this.getCoverBoxSize);
  }

  getImageList = async (id, name) => {
    const { images } = this.state;

    const { urls, favoriteImageList, collectionUid, guest } = this.props;
    const baseUrl = urls.get('baseUrl');
    const params = {
      baseUrl,
      collection_uid: collectionUid || '',
      guest_uid: guest.get('guest_uid') || '',
    };

    const res = await getFavoriteImages(params);
    const mergedImages = res.map(item => item.images).reduce((acc, curr) => acc.concat(curr), []);
    const data = transformSetImages(fromJS({ images: mergedImages }), null, fromJS(urls)).toJS();
    const imageList = data.map(item => {
      const img = images.find(img => img.get('enc_image_uid') === item.enc_image_uid);
      return Object.assign(item, {
        width: item.width,
        height: item.height,
        selected: false,
        isDownload: img?.get('isDownload'),
      });
    });
    const promiseArr = [];
    imageList.forEach(item => {
      const { orientation, src } = item;
      // promiseArr.push(getOrientationAppliedImage(src, orientation));
      promiseArr.push(src);
    });
    await Promise.all(promiseArr).then(res => {
      imageList.forEach((item, index) => {
        // imageList[index].src = res[index];
        imageList[index] = fromJS({ ...imageList[index], src: res[index] });
      });
    });

    res.forEach(set => {
      set.images = imageList.filter(item => item.get('set_uid') === set.set_uid);
    });

    this.setState({
      sets: res,
      favoriteList: imageList,
    });
  };

  getCoverBoxSize = () => {
    const { data, isFullScreen } = this.props;
    const cover = data.get('cover');
    const computed = cover.get('computed');
    if (!computed) {
      return;
    }

    const ratio = computed.get('ratio');
    const page = document.documentElement || document.body;
    const boxWidth = page.clientWidth;
    const boxHeight = isFullScreen ? page.clientHeight : boxWidth / ratio;

    this.setState({ boxWidth, boxHeight });
  };

  componentDidUpdate(prevProps, prevState) {
    const { boxHeight: oldHeight, images: preImages } = prevState;
    const { boxHeight: newHeight, images } = this.state;
    // const oldHeight = prevState.boxHeight;
    // const newHeight = this.state.boxHeight;
    const {
      label_img_list: pre_label_img_list,
      label_list: pre_label_list,
      favoriteImageList: prefavoriteImageList,
    } = prevProps;
    const { favoriteImageList, label_list, label_img_list, data, images: imgs } = this.props;
    const set = data.get('set');
    if (
      !isEqual(preImages, images) ||
      !isEqual(pre_label_img_list, label_img_list) ||
      !isEqual(pre_label_list, label_list)
    ) {
      this.formatData();
    }
    // const isEqual = equals(prefavoriteImageList, favoriteImageList);
    if (!isEqual(prefavoriteImageList, favoriteImageList)) {
      // 真实的需要从后台接口中获取到所有添加到收藏夹的图片
      const images = imgs.get(set.get('set_uid'));
      const setFavoriteImageList = favoriteImageList
        .map(m => {
          const item = images.find(k => k.get('enc_image_uid') === m.get('enc_image_uid'));

          if (!item) {
            return item;
          }

          return item.merge(
            fromJS({
              favorite: m,
              comment: m.get('comment'),
            })
          );
        })
        .filter(v => !!v);
      this.getImageList();
      this.setState({
        images: setFavoriteImageList,
      });
    }
    if (oldHeight !== newHeight) {
      this.photoContainer.current.scrollIntoView();
    }
  }

  postImgs = () => {
    const { cur, tabs } = this.state;
    const { postData = () => {} } = this.props;
    const { list } = tabs[cur].waterFallProps;
    console.log('list: **********', list);
    postData(list);
  };

  modalHandle = (item, text) => {
    let { images } = this.state;
    images = images.map(subItem => {
      if (subItem.get('enc_image_uid') === item.get('enc_image_uid')) {
        return subItem.merge(subItem, {
          comment: text,
          favorite: subItem.merge(subItem.get('favorite'), {
            comment: text,
          }),
        });
      }
      return subItem;
    });
    this.setState({
      images,
    });
  };

  formatData = () => {
    const { label_img_list = [], label_list = [], favoriteImageList } = this.props;
    const { images, cur, tabs: tabsList } = this.state;
    let tabs = [
      {
        waterFallProps: {
          list: fromJS(images),
        },
        text: `全部(${favoriteImageList.size})`,
      },
    ];
    if (label_list && label_list.length && __isCN__) {
      const list = label_list.reduce((acc, item) => {
        const arr = label_img_list[item.id]
          .map(m => {
            const item = images.find(k => k.get('enc_image_uid') === m.enc_image_uid);
            return item;
          })
          .filter(v => !!v);
        const newArr = fromJS(arr);
        acc.push({
          waterFallProps: {
            list: newArr,
          },
          text: `${this.truncateText(item.label_name, 4)}(${item.label_count})`,
        });
        return acc;
      }, []);
      this.setState(
        {
          tabs: tabs.concat(list),
          imageSize: tabs.concat(list)[cur]?.waterFallProps?.list?.size,
        },
        () => {
          this.postImgs();
        }
      );
    } else {
      this.setState(
        {
          tabs,
          imageSize: tabs[cur]?.waterFallProps?.list?.size,
        },
        () => {
          this.postImgs();
        }
      );
    }
  };

  // 超过4个字打点省略
  truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  switchTab = (cur, item) => {
    const imageSize = item.waterFallProps?.list.size;
    this.setState(
      {
        cur,
        imageSize,
      },
      () => {
        this.postImgs();
      }
    );
  };

  switchTabComp = () => {
    const { cur, tabs } = this.state;
    return (
      <div className="switch-tabs-wrappr">
        {tabs.map((item, i) => (
          <div
            className={`tab-item ${cur === i ? 'cur' : ''} ${item.className || ''}`}
            key={item.key}
            onClick={() => this.switchTab(i, item)}
          >
            {item.text}
          </div>
        ))}
      </div>
    );
  };

  /**
   * 渲染图片预览时的自定义header.
   * @param {*} that
   * @param {*} opt
   */
  renderFavoriteViewHeader = () => {
    return (
      <div className="favorite-view-header">
        <XIcon type="back" onClick={this.hideImageViewer} text={t('BACK')} />
        <div className="pull-right"></div>
      </div>
    );
  };

  handleBackToTop = () => {
    this.wrapRef.current.scrollIntoView();
  };

  renderFavoriteCont = waterFallProp => {
    const { label_img_list, label_list, data, favoriteImageList, favorite } = this.props;
    const { sets, cur } = this.state;
    const designSetting = data.get('designSetting');
    const { records } = favorite.get('favorite_image_list').toJS();

    return (
      <div className="favorite-content" ref={this.wrapRef}>
        {sets &&
          sets.length &&
          sets.map((item, index) => {
            const { set_name, images, set_uid } = item;
            let newImageList = images;
            if (cur > 0) {
              const key = cur > 0 && label_list[cur - 1].id;
              const selectList = cur > 0 ? label_img_list[key] : [];
              newImageList = images.filter(itemA =>
                selectList.some(itemB => itemA.get('enc_image_uid') === itemB.enc_image_uid)
              );
            }
            const waterFallProps = {
              ...waterFallProp,
              list: newImageList,
              cols: (waterFallProp?.thumbnail_size || '').toLowerCase() === 'large' ? 1 : 2,
              renderCard: this.renderCard,
              onScrollToBottom: this.loadData,
              designSetting,
              records,
              showBackButton: false,
            };
            const horizontalWaterFallProps = {
              // ...curPool.waterFallProps,
              renderCard: this.renderCard,
              designSetting,
              list: fromJS(newImageList),
              onScrollToBottom: this.loadData,
              records,
              showBackButton: false,
            };
            if (!newImageList || newImageList.length === 0) {
              return null;
            }
            return (
              <div className="favorite-item" key={set_uid}>
                <div className="favorite-item-title">{set_name}</div>
                {(waterFallProp?.grid_style || '').toLowerCase() !== 'horizontal' ? (
                  <XWaterFall {...waterFallProps} />
                ) : (
                  <HorizontalWaterFall {...horizontalWaterFallProps} />
                )}
              </div>
            );
          })}
        {favoriteImageList.size > 10 && (
          <XButton
            className="back-button dark"
            style={{ overflow: 'hidden' }}
            onClicked={this.handleBackToTop}
          >
            {t('BACK_TO_TOP')}
          </XButton>
        )}
      </div>
    );
  };
  submitFavoritesStatus = () => {
    const { boundGlobalActions, boundProjectActions, urls, guest, collectionUid } = this.props;
    const { favoriteSubmit } = this.state;
    const { showModal, hideModal, addNotification } = boundGlobalActions;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const submitFavorites = submit_status => {
      const submitParams = {
        galleryBaseUrl,
        collection_uid: collectionUid,
        guest_uid: guest.get('guest_uid'),
        submit_status,
        is_client: submit_status ? false : true,
      };
      return submitGallery(submitParams).then(() => {
        boundProjectActions.getFavoriteImageList();
      });
    };
    if (!favoriteSubmit) {
      showModal(CONFIRM_MODAL, {
        title: 'Submit Favorites?',
        titleStyle: {
          fontSize: 32,
          marginTop: 20,
        },
        message: 'Are you sure you want to submit favorites?',
        close: () => hideModal(CONFIRM_MODAL),
        buttons: [
          {
            text: 'Cancel',
            className: 'white',
            style: {
              width: '230px',
              height: '80px',
              marginRight: 16,
            },
            onClick: () => hideModal(CONFIRM_MODAL),
          },
          {
            text: 'Submit',
            style: {
              width: '230px',
              height: '80px',
            },
            onClick: () => {
              submitFavorites(1).then(() => {
                this.setState({
                  favoriteSubmit: true,
                });
                addNotification({
                  message: 'Favorites Submitted.',
                  level: 'success',
                  autoDismiss: 2,
                });
              });
            },
          },
        ],
      });
    } else {
      showModal(CONFIRM_MODAL, {
        title: 'Edit Favorites?',
        titleStyle: {
          fontSize: 32,
          marginTop: 20,
        },
        message: 'Are you sure you want to re-edit favorites?',
        close: () => hideModal(CONFIRM_MODAL),
        buttons: [
          {
            text: 'Cancel',
            className: 'white',
            style: {
              width: '230px',
              height: '80px',
              marginRight: 16,
            },
            onClick: () => hideModal(CONFIRM_MODAL),
          },
          {
            text: 'Edit',
            style: {
              width: '230px',
              height: '80px',
            },
            onClick: () => {
              // 提交 favorite 状态
              submitFavorites(0).then(() => {
                this.setState({
                  favoriteSubmit: false,
                });
                addNotification({
                  message: 'Favorites can be modified now.',
                  level: 'success',
                  autoDismiss: 2,
                });
              });
            },
          },
        ],
      });
    }
  };

  render() {
    const { data, scrollData, favoriteImageList, boundGlobalActions } = this.props;
    const { images, viewImageIndex, tabs, cur, imageSize, sets, favoriteList, favoriteSubmit } =
      this.state;
    const designSetting = data.get('designSetting');
    const gallerySetting = designSetting.get('gallery').toJSON();
    const { grid_spacing, grid_style, thumbnail_size } = gallerySetting;
    const close = data.get('close');
    const wrapClass = classNames('view-favorite-list-modal', data.get('className'), {
      auto: viewImageIndex === -1,
    });

    const curPool = tabs[cur] || {};

    const favorite = data.get('favorite');
    const set = data.get('set');
    const cover = data.get('cover');
    // const images = data.get('images');
    const favoriteName = favorite ? favorite.get('favorite_name') : '';
    const setName = set ? set.get('set_name') : '';
    const favoriteEmail = favorite ? favorite.get('email') : '';
    const favoritePhone = favorite ? favorite.get('phone') : '';

    // 封面渲染
    const coverRenderProps = {
      cover,
    };

    const updateImgs = images.map(item => {
      const exifOrientation = item.get('orientation');
      return item.merge(item, {
        width: item.get('width'),
        height: item.get('height'),
      });
    });

    // set图片列表.
    const waterFallProps = {
      cols: (thumbnail_size || '').toLowerCase() === 'large' ? 1 : 2,
      // list: updateImgs,
      ...curPool.waterFallProps,
      renderCard: this.renderCard,
      onScrollToBottom: this.loadData,
      designSetting,
    };
    const horizontalWaterFallProps = {
      ...curPool.waterFallProps,
      renderCard: this.renderCard,
      designSetting,
      onScrollToBottom: this.loadData,
    };
    const collectionSetting = data.get('collectionSetting');
    const favoriteSetting = data.get('favoriteSetting');
    const image_name_enabled = __isCN__
      ? favoriteSetting?.get('image_name_enabled')
      : collectionSetting?.get('image_name_enabled');

    const save_preview_enabled = __isCN__ ? !!favoriteSetting?.get('save_preview_enabled') : true;

    // 图片预览.
    const imageViewers = main.formatViewerImages(fromJS(favoriteList), viewImageIndex);
    const imageViewProps = {
      boundGlobalActions,
      favoriteImageList: favoriteImageList,
      hideViewer: this.hideImageViewer,
      images: imageViewers,
      imgNameVisible: !!image_name_enabled,
      saveEnabled: !!save_preview_enabled,
      currentIndex: viewImageIndex,
      isShowBackdrop: false,
      isShowHeader: false,
      className: 'favorite-image-viewer',
      renderHeader: this.renderFavoriteViewHeader,
      renderType: 'canvas',
    };

    if (scrollData) {
      waterFallProps.list = scrollData;
      horizontalWaterFallProps.list = scrollData;
    }

    return (
      <XModal
        id="favoriteModal"
        className={wrapClass}
        opened
        onClosed={close}
        escapeClose={false}
        isHideIcon
      >
        <div className="modal-body" id="favoriteContent">
          <XCoverRender {...coverRenderProps} />

          <div className="wrap" ref={this.photoContainer}>
            <div className="favorite-view-header">
              <XIcon type="back" iconWidth={32} iconHeight={32} onClick={close} />
              {!__isCN__ && (
                <div className="pull-right">
                  {favoriteSubmit ? <div className="submitted">Favorites Submitted!</div> : null}
                  <XButton
                    className={classNames('submit-favorites', { editor: favoriteSubmit })}
                    onClicked={this.submitFavoritesStatus}
                  >
                    {favoriteSubmit ? 'Edit' : 'Submit'} Favorites
                  </XButton>
                </div>
              )}
            </div>

            {/* 图片列表 */}
            <div className="image-wrap">
              <div className="title">{t('SELECTED_PHOTOS')}</div>
              <div className={classNames('set-info', { margin: __isCN__ })}>
                <div className="text1">
                  {t('CREATED_BY', { favoriteEmail: favoriteEmail || favoritePhone })}
                </div>

                <div className="text1">
                  {favoriteImageList.size} {t('FAVORITE_PHOTOS_COUNT_SUFFIX')}
                </div>
              </div>
              {__isCN__ && this.switchTabComp()}
              {sets && sets.length ? (
                this.renderFavoriteCont({ ...horizontalWaterFallProps, thumbnail_size })
              ) : (
                // (
                // (grid_style || '').toLowerCase() !== 'horizontal' ? (
                //   <XWaterFall {...waterFallProps} />
                // ) : (
                //   <HorizontalWaterFall {...horizontalWaterFallProps} />
                // )
                // )
                <Fragment>
                  <div className="text2">{t('NO_FAVORITE_PHOTOS')}</div>
                  <XButton className="backBtn" onClicked={close}>
                    {t('RETURN_TO_GALLERY')}
                  </XButton>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        {/* 照片放大查看. */}
        {viewImageIndex !== -1 ? <XNewImageViewer {...imageViewProps} /> : null}
      </XModal>
    );
  }
}

ViewFavoriteListModal.propTypes = {
  data: PropTypes.object.isRequired,
};

ViewFavoriteListModal.defaultProps = {};

export default scrollLoadHOC(ViewFavoriteListModal, {
  scrollContainerId: 'favoriteModal',
  scrollContentIds: ['favoriteContent'],
});
