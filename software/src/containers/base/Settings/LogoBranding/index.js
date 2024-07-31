import classNames from 'classnames';
import React, { Fragment } from 'react';
import LazyLoad from 'react-lazy-load';

import equals from '@resource/lib/utils/compare';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';

import {
  XButton,
  XFileUpload,
  XIcon,
  XImg,
  XInput,
  XLoading,
  XPureComponent,
} from '@common/components';

import { dangerSubDomain } from '@src/constants/strings';

import SettingsHeader from '../components/SettingsHeader';
import SubdomainModal from '../components/SubdomainModal';

import {
  didMount,
  getCollectionNameProps,
  handleDeleteIcon,
  onUploadLogo,
  tipsSubdomain,
  uploadFileClicked,
} from './_handleHelp';

import './index.scss';

/**
 * 该页面 brand loge获取一个接口
 * brandname 和Brand Subdomain 获取一个接口
 * 修改 Brand Subdomain一个接口
 * 修改 Brand Name一个接口
 * 修改 Brand Logo一个接口
 *
 * very stuipd
 *
 */
class Watermark extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyName: '',
      inputValue: '',
      isShowTip: false,
      isShowSuffix: false,
      defaultValue: '',
      tipContent: '',
      isShowLogoUnsaveTip: false,
      isShowLoading: false,
      subdomainValue: '',
      brandId: '',
    };
  }

  componentDidMount() {
    didMount(this);
  }
  editSubdomain = value => {
    this.setState({
      subdomainValue: value,
    });
  };
  onEditSubdomain = () => {
    // 编辑subdomain
    window.logEvent.addPageEvent({
      name: 'MyBrand_BrandSubdomain_Click_Edit',
    });
    const { boundGlobalActions, boundProjectActions } = this.props;
    const { subdomainValue, brandId } = this.state;
    boundGlobalActions.showConfirm({
      close: () => {
        window.logEvent.addPageEvent({
          name: 'MyBrand_BrandSubdomain_Click_Cancel',
        });
        boundGlobalActions.hideConfirm();
      },
      title: 'Brand Subdomain',
      message: (
        <SubdomainModal
          subdomainValue={subdomainValue}
          editSubdomain={this.editSubdomain}
          brandId={brandId}
          boundProjectActions={boundProjectActions}
          boundGlobalActions={boundGlobalActions}
          subdomainDefaultValue={subdomainValue}
        />
      ),
      buttons: [],
    });
  };
  render() {
    const {
      globalSettings: { settingsLogoUrl, image_uid, imgRot, orientation },
    } = this.props;

    const { isShowLoading, isShowLogoUnsaveTip, subdomainValue } = this.state;

    const headerProps = {
      title: t('LOGO_BRANDING'),
      // actionBtn: (
      //   <XButton className="pwa-btn" onClicked={() => onSave(this)}>
      //     {' '}
      //     {t('SETTINGS_LOGOBRNDING_SAVE_TBN')}{' '}
      //   </XButton>
      // ),
    };

    const fileUploadProps = {
      className: 'editor-global-action-bar-upload',
      inputId: 'uploadLogo',
      uploadFileClicked: () => uploadFileClicked(this),
      addImages: files => onUploadLogo(files, this),
      useNewUpload: true,
      iconType: 'upload',
      iconTheme: 'white',
      text: '',
      uploadParams: {
        set_uid: 557,
      },
      // preCheck: preCheckUploadCondition,
      onSelectFile: () => {},
      showModal: () => {},
    };
    const XImgProps = {
      src: settingsLogoUrl,
      type: 'tag',
      className: 'logo-upload-wrapper',
      style: {
        ...getOrientationAppliedStyle(orientation),
      },
    };

    const logoContainer = classNames('logo-container', {
      disabled: isShowLoading,
      'hide-icon': !!image_uid,
    });

    const deleteIconProps = {
      className: 'delete-logo',
      type: 'delete',
      text: t('DELETE'),
      onClick: () => handleDeleteIcon(this),
    };

    return (
      <Fragment>
        <div className="global-settings-logo-branding">
          <div className="content">
            <SettingsHeader {...headerProps} />

            <div className="global-settings-wrap">
              <div className="settings-item">
                <div className="item-name">{t('LOGO_BRANDING_NAME_LABEL')}</div>
                <div className="item-content">
                  <XInput {...getCollectionNameProps(this)} />
                </div>
              </div>
              <div className="settings-item">
                <div className="item-name">{t('LOGO_BRANDING_LOGO_LABEL')}</div>
                <div className="item-content">
                  <div className={logoContainer}>
                    <XFileUpload {...fileUploadProps}>
                      {settingsLogoUrl ? (
                        <LazyLoad className="lazy-container" once key="lazyload-item">
                          <XImg {...XImgProps} />
                        </LazyLoad>
                      ) : null}
                      {<XLoading type="imageLoading" isShown={isShowLoading} zIndex={10} />}
                    </XFileUpload>
                    {settingsLogoUrl && <XIcon {...deleteIconProps} />}
                    {/* {isShowLogoUnsaveTip && (
                      <span className="logo-validate-msg">{isShowLogoUnsaveTip}</span>
                    )} */}
                  </div>
                  <span
                    className="logo-desc"
                    dangerouslySetInnerHTML={{ __html: t('LOGO_BRANDING_LOGO_TIPS') }}
                  />
                </div>
              </div>
              <div className="settings-item">
                <div className="item-name">Brand Subdomain</div>
                <div className="item-content">
                  <div className="subdomain">
                    <div>{subdomainValue}</div>
                    <XIcon
                      type="edit"
                      iconWidth={12}
                      iconHeight={12}
                      onClick={this.onEditSubdomain}
                    />
                  </div>
                  <div className="logo-desc">
                    Your brand subdomain is directly tied to your Zno Cloud URL (e.g.
                    https://subdomain.mypixhome.com). If you change your subdomain, your URLs for
                    existing galleries, website, slideshows and other software projects will be
                    immediately changed as well.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Watermark;
