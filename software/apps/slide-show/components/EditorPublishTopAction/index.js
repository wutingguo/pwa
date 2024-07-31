import React, { Component } from 'react';
import { XDropdown } from '@common/components';
import main from './handle/main';
import ToolTip from 'react-portal-tooltip';

import './index.scss';

class EditorPublishTopAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipShow: false
    }
  }

  onThemeChange = (option) => main.onThemeChange(this, option)
  getThemeDropdownProps = () => main.getThemeDropdownProps(this)
  getThemeDropdownData = () => main.getThemeDropdownData(this)
  onFeaturedImageClick = (option, closeDropDown) => main.onFeaturedImageClick(this, option, closeDropDown)
  renderFeaturedImageItem = (item, closeDropDown) => main.renderFeaturedImageItem(this, item, closeDropDown)
  getFeaturedImageDropdownData = () => main.getFeaturedImageDropdownData(this)
  getFeaturedImageDropdownProps = () => main.getFeaturedImageDropdownProps(this)

  renderLogoButton = () => {
    if (__isCN__) return null;

    const { collectionDetail } = this.props;
    const { tipShow } = this.state;
    const logoShow = !!collectionDetail.get('logo_show');
    const hasLogo = collectionDetail.get('logo') && collectionDetail.getIn(['logo', 'image_uid']);
    const btnLabel = hasLogo && logoShow ? t('MAKE_LOGO_INVISIBLE') : t('MAKE_LOGO_VISIBLE');
    const toolTipStyle = {
      style: {
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.13)',
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#3a3a3a',
        padding: '4px 10px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        zIndex: 99999999999,
        lineHeight: '20px',
        transition: 'initial',
        transform: 'translate(40px, 0)'
      },
      arrowStyle: {
        color: '#3a3a3a',
        borderColor: false,
        transition: 'initial'
      }
    }

    return (
      <div className="logo-show-toggle">
        <button className="btn-white" onClick={() => main.onChangeLogoShowClick(this, hasLogo, logoShow)}>
          {btnLabel}
        </button>
        <span className="show-icon" id="logo_tip" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip}>?</span>
        <ToolTip
          active={tipShow}
          position="right"
          align="left"
          arrow="left"
          parent="#logo_tip"
          style={toolTipStyle}
          tooltipTimeout={0}
        >
          <div>{t('LOGO_VISIBILITY_TIP_1')}</div>
          <div>{t('LOGO_VISIBILITY_TIP_2')}</div>
        </ToolTip>
      </div>
    )
  };

  showToolTip = () => {
    this.setState({ tipShow: true })
  };
  hideToolTip = () => {
    this.setState({ tipShow: false })
  }

  render() {
    const themeDropdownProps = this.getThemeDropdownProps();
    const featuredImageDropdownProps = this.getFeaturedImageDropdownProps();
    return (
      <div className="editor-publish-top-container">
        <XDropdown {...themeDropdownProps} />
        <XDropdown {...featuredImageDropdownProps} />
        {this.renderLogoButton()}
      </div>
    );
  }
}

export default EditorPublishTopAction;