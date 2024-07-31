import React from 'react';
import { XIcon } from '@common/components';

const renderLable = label => {
  return (
    <span className="dropdown-label" title={label}>
      {label}
    </span>
  );
};

const renderTypographyItem = item => {
  const { type, action, label, className, isActive } = item;
  return (
    <li key={type} className="item-wrap">
      <a className={`${className} ${isActive ? 'active' : ''}`} onClick={() => action(type)}>
        {type === 'sans' ? (
          <div className="item">
            <XIcon type="design-typography-sans" iconWidth={30} iconHeight={30} />
            <span className="label">{label}</span>
          </div>
        ) : (
          <div className="item">
            <XIcon type="design-typography-serif" iconWidth={30} iconHeight={30} />
            <span className="label">{label}</span>
          </div>
        )}
      </a>
    </li>
  );
};

const renderGallerySettingItem = item => {
  const { type, action, label, className, isActive, icon } = item;
  return (
    <li key={type} className="item-wrap">
      <a className={`${className} ${isActive ? 'active' : ''}`} onClick={() => action(type)}>
        <div className="item">
          {icon}
          <span className="label">{label}</span>
        </div>
      </a>
    </li>
  );
};

const getTypographyProps = that => {
  const { onSelectTypography, typography } = that.props;
  return {
    label: t('TYPOGRAPHY'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'sans',
        label: t('SANS'),
        isActive: typography === 'sans' ? true : false,
        action: type => onSelectTypography(type),
        className: 'design-option'
      },
      {
        type: 'serif',
        label: t('SERIF'),
        isActive: typography === 'serif' ? true : false,
        action: type => onSelectTypography(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderTypographyItem,
    customClass: 'typography-handler',
    disabled: false
  };
};

const getGridStyleProps = that => {
  const { onSelectGridStyle, gridStyle, currentTab } = that.props;
  // console.log('gridStyle:', gridStyle);
  return {
    label: t('GRID_STYLE'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'vertical',
        label: t('VERTICAL'),
        icon: <XIcon type="design-grid-style-vertical" iconWidth={30} iconHeight={30} />,
        isActive: gridStyle === 'vertical' ? true : false,
        action: type => onSelectGridStyle(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderGallerySettingItem,
    customClass: 'grid-style-handler',
    disabled: currentTab === 'cover' ? true : false
  };
};

const getColorProps = that => {
  const { onSelectColor, color, currentTab } = that.props;
  return {
    label: t('COLOR'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'light',
        label: t('LIGHT'),
        icon: <XIcon type="design-color-light" iconWidth={30} iconHeight={30} />,
        isActive: color === 'light' ? true : false,
        action: type => onSelectColor(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderGallerySettingItem,
    customClass: 'color-handler',
    disabled: currentTab === 'cover' ? true : false
  };
};

const getThumbnailSizeProps = that => {
  const { onSelectThumbnailSize, thumbnailSize, currentTab } = that.props;
  // console.log('thumbnailSize: ', thumbnailSize);
  return {
    label: t('THUMBNAIL_SIZE'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'regular',
        label: t('REGULAR_SIZE'),
        icon: <XIcon type="design-thumbnail-size-regular" iconWidth={30} iconHeight={30} />,
        isActive: thumbnailSize === 'regular' ? true : false,
        action: type => onSelectThumbnailSize(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderGallerySettingItem,
    customClass: 'thumbnail-size-handler',
    disabled: currentTab === 'cover' ? true : false
  };
};

const getGridSpacingProps = that => {
  const { onSelectGridSpacing, gridSpacing, currentTab } = that.props;
  return {
    label: t('GRID_SPACING'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'regular',
        label: t('REGULAR_SPACING'),
        icon: <XIcon type="design-grid-spacing-regular" iconWidth={30} iconHeight={30} />,
        isActive: gridSpacing === 'regular' ? true : false,
        action: type => onSelectGridSpacing(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderGallerySettingItem,
    customClass: 'grid-spacing-handler',
    disabled: currentTab === 'cover' ? true : false
  };
};

const getNavigationStyleProps = that => {
  const { onSelectNavigationStyle, navigationStyle, currentTab } = that.props;
  return {
    label: t('NAVIGATION_STYLE'),
    arrow: 'center',
    dropdownList: [
      {
        type: 'regular',
        label: t('REGULAR_STYLE'),
        icon: <XIcon type="design-navigation-style-regular" iconWidth={30} iconHeight={30} />,
        isActive: navigationStyle === 'regular' ? true : false,
        action: type => onSelectNavigationStyle(type),
        className: 'design-option'
      }
    ],
    renderLable: label => renderLable(label),
    renderOptionItem: renderGallerySettingItem,
    customClass: 'navigation-style-handler',
    disabled: currentTab === 'cover' ? true : false
  };
};

export default {
  getTypographyProps,
  getGridStyleProps,
  getColorProps,
  getThumbnailSizeProps,
  getGridSpacingProps,
  getNavigationStyleProps
};
