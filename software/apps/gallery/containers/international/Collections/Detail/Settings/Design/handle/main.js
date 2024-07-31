import { fromJS, is } from 'immutable';
import moment from 'moment';

import { CHANGE_COVER_MODAL, IMAGE_FOCAL_MODAL } from '@apps/gallery/constants/modalTypes';

const instantUpdate = (that, design_setting, setting) => {
  const { collectionPresetSettings, boundProjectActions, envUrls, boundGlobalActions } = that.props;
  const { addNotification } = boundGlobalActions;
  const galleryBaseUrl = envUrls.get('galleryBaseUrl');
  const template_id = collectionPresetSettings.get('template_id');
  const template_name = collectionPresetSettings.get('template_name');
  const init_design_setting = collectionPresetSettings.get('design_setting').toJS();
  const settingType = collectionPresetSettings.getIn(['design_setting', 'setting_type']);
  const key = Object.keys(design_setting)[0];
  const bodyParams = {
    template_id,
    template_name,
    design_setting: {
      [key]: { ...init_design_setting[key], ...design_setting[key] },
    },
  };
  boundProjectActions.presetSettingUpdate({ bodyParams, type: settingType, galleryBaseUrl }).then(
    res => {
      console.log('res: ', res);
      addNotification({
        message: `${setting} ${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')} `,
        level: 'success',
        autoDismiss: 2,
      });
    },
    error => {
      console.log(error);
      addNotification({
        message: `${setting} ${t('COLLECTIOIN_SETTINGS_FAILED_TOAST')}`,
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};
/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, design_setting, setting) => {
  const { collectionsSettings, boundGlobalActions, boundProjectActions, presetState } = that.props;
  const { addNotification } = boundGlobalActions;
  const { updateCollectionsSettings } = boundProjectActions;

  const collectionUid = collectionsSettings.get('enc_collection_uid');
  const settingType = collectionsSettings.getIn(['design_setting', 'setting_type']);
  const params = {
    collection_uid: collectionUid,
    setting_type: settingType,
    design_setting,
  };
  if (presetState) {
    instantUpdate(that, design_setting, setting);
  } else {
    updateCollectionsSettings(params).then(
      res => {
        console.log('res: ', res);
        addNotification({
          message: `${setting} ${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')} `,
          level: 'success',
          autoDismiss: 2,
        });
      },
      error => {
        console.log(error);
        addNotification({
          message: `${setting} ${t('COLLECTIOIN_SETTINGS_FAILED_TOAST')}`,
          level: 'error',
          autoDismiss: 2,
        });
      }
    );
  }
};

// cover gallery 切换
const onTabChange = (that, e) => {
  const { coverTypography, designTypography } = that.state;
  that.setState({
    currentTab: e.target.id,
    typography: e.target.id === 'cover' ? coverTypography : designTypography,
  });
};

// 更改封面
const onChangeCover = that => {
  window.logEvent.addPageEvent({
    name: 'GallerySetting_Design_Click_ChangeCover',
  });

  const { boundGlobalActions, boundProjectActions, collectionsSettings, urls } = that.props;
  const { currentTab } = that.state;
  const collection_uid = collectionsSettings.get('enc_collection_uid');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  if (currentTab === 'cover') {
    boundGlobalActions.showModal(CHANGE_COVER_MODAL, {
      collection_uid,
      galleryBaseUrl,
      close: coverInfo => {
        if (coverInfo) {
          boundProjectActions.updateCover(coverInfo);
        }

        boundGlobalActions.hideModal(CHANGE_COVER_MODAL);
      },
    });
  }
};

// 设置封面焦点
const onSetCoverFocal = that => {
  window.logEvent.addPageEvent({
    name: 'GalleryDesign_Click_SetFocal',
  });

  const { boundGlobalActions } = that.props;
  const { focalPosition, currentTab, coverUrl, imgRot } = that.state;
  if (currentTab === 'cover') {
    boundGlobalActions.showModal(IMAGE_FOCAL_MODAL, {
      imgRot,
      src: coverUrl,
      focalPosition,
      close: () => boundGlobalActions.hideModal(IMAGE_FOCAL_MODAL),
      onFocalChanged: data => {
        // console.log('focal changed', data);
        const { x, y } = data;
        that.setState({
          focalPosition: data,
        });
        updateSettings(that, { [currentTab]: { focal: `${x} ${y}` } }, t('COVER_FOCAL'));
      },
    });
  }
};

// 设置字体粗细
const onSelectTypography = (that, type, currentTab) => {
  window.logEvent.addPageEvent({
    name: 'GalleryDesign_Click_Typography',
    Typography: type,
  });

  that.setState({
    typography: type,
    [`${currentTab === 'cover' ? 'coverTypography' : 'designTypography'}`]: type,
  });
  updateSettings(that, { [currentTab]: { typography: type } }, t('TYPOGRAPHY'));
};

// 设置网格样式
const onSelectGridStyle = (that, type) => {
  window.logEvent.addPageEvent({
    name: 'GalleryDesign_Click_GridStyle',
    GridStyle: type,
  });

  that.setState({
    gridStyle: type,
  });
  updateSettings(that, { gallery: { grid_style: type } }, t('GRID_STYLE'));
};

// 设置字体颜色
const onSelectColor = (that, type) => {
  window.logEvent.addPageEvent({
    name: 'GalleryDesign_Click_Color',
    Color: type,
  });

  that.setState({
    color: type,
  });
  updateSettings(that, { gallery: { color: type } }, t('COLOR'));
};

// 设置缩略图尺寸
const onSelectThumbnailSize = (that, type) => {
  that.setState({
    thumbnailSize: type,
  });
  updateSettings(that, { gallery: { thumbnail_size: type } }, t('THUMBNAIL_SIZE'));
};

// 设置网格元素间距
const onSelectGridSpacing = (that, type, key) => {
  const tempKey = key === 'grid_spacing' ? 'gridSpacing' : key;
  that.setState({
    [tempKey]: type,
  });
  updateSettings(that, { gallery: { [key]: type } }, t(key.toUpperCase()));
};
const commonOnSelect = (that, type, key) => {
  const tempKey = key === 'grid_spacing' ? 'gridSpacing' : key;
  that.setState({
    [tempKey]: type,
  });
  updateSettings(that, { gallery: { [key]: type } }, t(key.toUpperCase()));
};
// 设置导航样式
const onSelectNavigationStyle = (that, type) => {
  that.setState({
    navigationStyle: type,
  });
  updateSettings(that, { gallery: { navigation_style: type } }, t('NAVIGATION_STYLE'));
};

// carsouel left/right
const onSetActiveItemIndex = (that, tplIndex) => {
  that.setState({
    activeItemIndex: tplIndex,
  });
};

// 切换模板
const onClickTplItem = (that, id) => {
  updateSettings(that, { cover: { template: id } }, t('COVER_TEMPLATE'));
};

// 底部模板 props
const getDesignTplCarouselProps = (that, templates) => {
  const { activeItemIndex, collectionsSettings, urls } = that.props;
  const { cover_spec } = that.state;
  if (collectionsSettings && collectionsSettings.size) {
    const designSettings = collectionsSettings.get('design_setting');
    const coverTemplateUrl = designSettings.getIn(['cover', 'coverTemplateUrl']);
    const template = designSettings.getIn(['cover', 'template']);
    const designTplCarouselProps = {
      templates,
      template,
      coverTemplateUrl,
      setActiveItemIndex: tplIndex => onSetActiveItemIndex(that, tplIndex),
      onClickItem: id => onClickTplItem(that, id),
      cover_spec,
    };
    return designTplCarouselProps;
  }
};

// 操作栏 props
const getDesignSettingsbarProps = that => {
  const { currentTab, typography } = that.state;
  const { boundGlobalActions, collectionsSettings = fromJS({}) } = that.props;

  if (collectionsSettings && collectionsSettings.size) {
    const designSettings = collectionsSettings.get('design_setting');
    const designTypography = designSettings.getIn(['gallery', 'typography']);
    const gridStyle = designSettings.getIn(['gallery', 'grid_style']);
    const color = designSettings.getIn(['gallery', 'color']);
    const thumbnailSize = designSettings.getIn(['gallery', 'thumbnail_size']);
    const gridSpacing = designSettings.getIn(['gallery', 'grid_spacing']);
    const navigationStyle = designSettings.getIn(['gallery', 'navigation_style']);

    const designSettingsbarProps = {
      currentTab,
      typography,
      designTypography,
      gridStyle,
      color,
      thumbnailSize,
      gridSpacing,
      navigationStyle,
      boundGlobalActions,
      onChangeCover: () => onChangeCover(that),
      onSetCoverFocal: () => onSetCoverFocal(that),
      onSelectTypography: type => onSelectTypography(that, type, currentTab),
      onSelectGridStyle: type => onSelectGridStyle(that, type),
      onSelectColor: type => onSelectColor(that, type),
      onSelectThumbnailSize: type => onSelectThumbnailSize(that, type),
      onSelectGridSpacing: type => onSelectGridSpacing(that, type),
      onSelectNavigationStyle: type => onSelectNavigationStyle(that, type),
    };
    return designSettingsbarProps;
  }
};

const computedState = (that, props) => {
  const { currentTab } = that.state;
  const { collectionsSettings, coverInfo } = props;
  if (collectionsSettings && collectionsSettings.size) {
    const designSettings = collectionsSettings.get('design_setting');
    const coverTypography = designSettings.getIn(['cover', 'typography']);
    const focal = designSettings.getIn(['cover', 'focal']);
    const designTypography = designSettings.getIn(['gallery', 'typography']);
    const gridSpacing = designSettings.getIn(['gallery', 'grid_spacing']);
    const grid_style = designSettings.getIn(['gallery', 'grid_style']);
    const thumbnail_size = designSettings.getIn(['gallery', 'thumbnail_size']);

    that.setState({
      focal,
      focalPosition: {
        x: focal.split(' ')[0],
        y: focal.split(' ')[1],
      },
      coverInfo,
      coverUrl: coverInfo.getIn(['computed', 'photo', 'src']),
      imgRot:
        coverInfo.getIn(['computed', 'photo', 'orientation']) ||
        coverInfo.getIn(['computed', 'photo', 'imgRot']),
      coverTypography,
      designTypography,
      typography: currentTab === 'cover' ? coverTypography : designTypography,
      gridSpacing,
      grid_style,
      thumbnail_size,
    });
  }
};

const willReceiveProps = (that, nextProps) => {
  // 第一次
  if (!nextProps) {
    computedState(that, that.props);
    return;
  }

  // props更新逻辑
  if (!is(that.props, nextProps)) {
    computedState(that, nextProps);
  }
};

const getDesignTemplateProps = that => {
  const { currentTab, typography } = that.state;
  const { collectionsSettings, coverInfo, urls, presetState, presetCoverInfo } = that.props;
  if (collectionsSettings && collectionsSettings.size) {
    const designSettings = collectionsSettings.get('design_setting');
    const collection_setting = collectionsSettings.get('collection_setting');
    // const gridStyle = designSettings.getIn(['gallery', 'grid_style']);
    // const color = designSettings.getIn(['gallery', 'color']);
    // const thumbnailSize = designSettings.getIn(['gallery', 'thumbnail_size']);
    // const gridSpacing = designSettings.getIn(['gallery', 'grid_spacing']);
    // const navigationStyle = designSettings.getIn(['gallery', 'navigation_style']);
    const template = designSettings.getIn(['cover', 'template']);
    const galleryStyleUrlPC = designSettings.getIn(['gallery', 'galleryStyleUrlPC']);
    const galleryStyleUrlM = designSettings.getIn(['gallery', 'galleryStyleUrlM']);
    // designTemplateProps
    const event_time = collection_setting.get('event_time');
    const time = event_time === 946742399000 ? '' : moment(event_time).format('MMMM Do, YYYY');
    const designTemplateProps = {
      event_time: time,
      coverInfo: presetState ? presetCoverInfo : coverInfo,
      currentTab,
      urls,
      template,
      galleryStyleUrlPC,
      galleryStyleUrlM,
    };
    return designTemplateProps;
  }
};

export default {
  onTabChange,
  onSetCoverFocal,
  onSelectTypography,
  onSetActiveItemIndex,
  onClickTplItem,
  getDesignTplCarouselProps,
  getDesignSettingsbarProps,
  getDesignTemplateProps,
  willReceiveProps,
  commonOnSelect,
};
