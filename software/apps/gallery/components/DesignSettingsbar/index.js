import Proptypes from 'prop-types';
import React from 'react';

import { XDropdown, XIcon, XPureComponent } from '@common/components';

import main from './handle/main';

import './index.scss';

class DesignSettingsbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTypographyProps = () => main.getTypographyProps(this);
  getGridStyleProps = () => main.getGridStyleProps(this);
  getColorProps = () => main.getColorProps(this);
  getThumbnailSizeProps = () => main.getThumbnailSizeProps(this);
  getGridSpacingProps = () => main.getGridSpacingProps(this);
  getNavigationStyleProps = () => main.getNavigationStyleProps(this);

  render() {
    const { onChangeCover, onSetCoverFocal, currentTab } = this.props;

    return (
      <div className="cover-gallery-handler-wrap">
        <div
          className={`change-cover design-handle ${currentTab === 'cover' ? '' : 'not-allowed'}`}
        >
          <XIcon
            type={currentTab === 'cover' ? 'design-change-cover' : 'design-change-cover-disabled'}
            text={t('CHANGE_COVER')}
            className={` ${currentTab === 'cover' ? '' : 'disable'}`}
            onClick={onChangeCover}
          />
        </div>
        <div
          className={`set-cover-focal design-handle ${currentTab === 'cover' ? '' : 'not-allowed'}`}
        >
          <XIcon
            type={
              currentTab === 'cover' ? 'design-set-cover-focal' : 'design-set-cover-focal-disabled'
            }
            text={t('SET_COVER_FOCAL')}
            className={` ${currentTab === 'cover' ? '' : 'disable'}`}
            onClick={onSetCoverFocal}
          />
        </div>
        {/* <div className="typography design-handle">
          <XDropdown {...this.getTypographyProps()}/>
        </div>
        <div className={`grid-style design-handle ${currentTab === 'cover' ?  'not-allowed' : ''}`}>
          <XDropdown {...this.getGridStyleProps()}/>
        </div>
        <div className={`color design-handle ${currentTab === 'cover' ?  'not-allowed' : ''}`}>
          <XDropdown {...this.getColorProps()}/>
        </div>
        <div className={`thumbnail-size design-handle ${currentTab === 'cover' ?  'not-allowed' : ''}`}>
          <XDropdown {...this.getThumbnailSizeProps()}/>
        </div>
        <div className={`grid-spacing design-handle ${currentTab === 'cover' ?  'not-allowed' : ''}`}>
          <XDropdown {...this.getGridSpacingProps()}/>
        </div>
        <div className={`navigation-style design-handle ${currentTab === 'cover' ?  'not-allowed' : ''}`}>
          <XDropdown {...this.getNavigationStyleProps()}/>
        </div> */}
      </div>
    );
  }
}

export default DesignSettingsbar;

DesignSettingsbar.propTypes = {
  // onChangeCover: Proptypes.func.isRequired,
  onSetCoverFocal: Proptypes.func.isRequired,
  typography: Proptypes.string.isRequired,
  onSelectTypography: Proptypes.func.isRequired,
};

DesignSettingsbar.defaultProps = {
  onSetCoverFocal: () => {},
  typography: '',
  onSelectTypography: () => {},
};
