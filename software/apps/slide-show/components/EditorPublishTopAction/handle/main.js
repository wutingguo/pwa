import React from 'react';
import { merge } from 'lodash';
import classNames from 'classnames';
import { getSlideShowImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import ThemeList from '@apps/slide-show/constants/theme';

const onThemeChange = (that, option) => {
  const { collectionDetail, boundProjectActions } = that.props;
  const collectionId = collectionDetail.get('id');
  boundProjectActions
    .setTheme({
      project_id: collectionId,
      theme: option
    })
    .then(() => {
      // TODO: 保存数据以更新状态，并重新获取详情
      boundProjectActions.saveSlideshow();
    });
  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_Theme',
    ThemeId: option.id
  });
};

const getThemeDropdownData = that => {
  return ThemeList.map(item => {
    return merge({}, item, {
      label: item.name,
      value: item.id,
      action: that.onThemeChange
    });
  });
};

const getFeaturedImageDropdownData = that => {
  const { collectionDetail } = that.props;
  const frameList = collectionDetail.get('frameList');
  const selectedValue = collectionDetail.getIn(['cover_img', 'id']);
  const DropdownData = [];
  frameList.forEach(item => {
    if (!DropdownData.find(di => di.value === item.getIn(['image', 'id']))) {
      const itemValue = item.getIn(['image', 'id']);
      DropdownData.push({
        label: '',
        value: item.getIn(['image', 'id']),
        itemData: item,
        isActive: itemValue === selectedValue,
        action: that.onFeaturedImageChange
      });
    }
  });
  return DropdownData;
};

export const getThemeDropdownProps = that => {
  const { collectionDetail } = that.props;
  const theme = collectionDetail.get('theme');
  const themeDropdownList = that.getThemeDropdownData();
  const selectedValue = theme.get('id');
  const themeDropdownProps = {
    dropdownList: themeDropdownList,
    selectedValue,
    label: t('THEME'),
    customClass: 'theme-dropdown-selection'
  };
  return themeDropdownProps;
};

const onFeaturedImageClick = (that, itemData, closeDropDown) => {
  const { collectionDetail, boundProjectActions } = that.props;
  const collectionId = collectionDetail.get('id');

  boundProjectActions
    .setCoverImage({
      project_id: collectionId,
      coverImg: itemData.get('image')
    })
    .then(() => {
      // TODO: 保存数据以更新状态，并重新获取详情
      boundProjectActions.saveSlideshow();
    });

  closeDropDown && closeDropDown();
  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_FeaturedImage'
  });
};

const renderFeaturedImageItem = (that, item, closeDropDown) => {
  const { urls } = that.props;
  const { isActive, itemData } = item;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const enc_image_uid = itemData.getIn(['image', 'enc_image_uid']);
  const timestamp = itemData.getIn(['image', 'imgTimestamp']);
  const orientation = itemData.getIn(['image', 'orientation']);
  const imageUrl = getSlideShowImageUrl({
    galleryBaseUrl,
    enc_image_uid: enc_image_uid,
    thumbnail_size: thumbnailSizeTypes.SIZE_350,
    isWaterMark: true,
    timestamp
  });
  const itemClassName = classNames('item-wrap', {
    active: isActive
  });
  return (
    <li
      key={itemData.get('guid')}
      className={itemClassName}
      onClick={() => that.onFeaturedImageClick(itemData, closeDropDown)}
    >
      <img src={imageUrl} style={getOrientationAppliedStyle(orientation)} />
    </li>
  );
};

const getFeaturedImageDropdownProps = that => {
  const { collectionDetail } = that.props;
  const themeDropdownList = that.getFeaturedImageDropdownData();
  const selectedValue = collectionDetail.getIn(['cover_img', 'id']);
  const themeDropdownProps = {
    dropdownList: themeDropdownList,
    selectedValue,
    label: t('FEATURED_IMAGE'),
    customClass: 'featured-image-dropdown-selection',
    renderOptionItem: that.renderFeaturedImageItem
  };
  return themeDropdownProps;
};

const linkToLogoSetting = that => {
  const {
    boundGlobalActions: { showConfirm, hideConfirm }
  } = that.props;

  const closeConfirm = () => {
    hideConfirm();
    window.logEvent.addPageEvent({
      name: 'SlideshowsLogoUploadNotificationPopup_Click_Cancel'
    });
  };

  showConfirm({
    message: t('LINK_TO_LOGO_SETTING_TIPS'),
    close: () => closeConfirm(),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => closeConfirm()
      },
      {
        text: t('CONTINUE'),
        className: 'pwa-btn',
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsLogoUploadNotificationPopup_Click_Countinue'
          });
          that.props.history.push('/software/settings/logo-branding');
        }
      }
    ]
  });
};

const onChangeLogoShowClick = (that, hasLogo, logoShow) => {
  window.logEvent.addPageEvent({
    name:
      logoShow && hasLogo
        ? 'SlideshowsConfig&Publish_Click_MakeLogoInvisible'
        : 'SlideshowsConfig&Publish_Click_MakeLogoVisible'
  });

  if (!hasLogo) {
    linkToLogoSetting(that);
    return;
  }

  const { collectionDetail, boundProjectActions } = that.props;
  const projectId = collectionDetail.get('id');

  boundProjectActions
    .changeProjectSetting({
      project_id: projectId,
      setting_key: 'LOGO_SHOW',
      setting_value: !logoShow,
      setting_value_type: 6
    })
    .then(() => {
      boundProjectActions.getCollectionDetail(projectId);
    });
};

export default {
  onThemeChange,
  getThemeDropdownData,
  getThemeDropdownProps,
  onFeaturedImageClick,
  renderFeaturedImageItem,
  getFeaturedImageDropdownData,
  getFeaturedImageDropdownProps,
  onChangeLogoShowClick
};
