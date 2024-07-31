import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { combinLanguage } from '@common/components/InternationalLanguage';

import XSiderbar from '@src/components/XSiderbar';

import './index.scss';

class LiveSidebar extends Component {
  constructor(props) {
    super(props);
    const { intl, lang, baseInfo, urls } = props;
    this.preferentialConfig = [
      {
        displayName: intl.tf('LP_ALBUM_SETTING'),
        icon: 'live_setting',
        subMenu: [
          {
            displayName: intl.tf('LP_BASIC_INFO'),
            path: '/software/live/photo/:id/album-settings',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_LANDING_PAGE'),
            path: '/software/live/photo/:id/launch-page',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_BANNER'),
            path: '/software/live/photo/:id/banner',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_PHOTO_CATEGORIES'),
            path: '/software/live/photo/:id/album-menu',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_WATERMARK_SETTINGS'),
            path: '/software/live/photo/:id/watermark',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_PICTRUE_CATEGORIES'),
            path: '/software/live/photo/:id/category',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_ACCESS_SETTINGS'),
            path: '/software/live/photo/:id/access',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_AI_FIND_PICTURE'),
            path: '/software/live/photo/:id/AI-mapping',
            logEventName: '',
          },
        ],
      },
      {
        displayName: intl.tf('LP_WORKFLOW'),
        icon: 'live_retoucher',
        subMenu: [
          {
            displayName: intl.tf('LP_AI_RETOUCH_TITLE'),
            path: '/software/live/photo/:id/AI-retoucher',
            logEventName: '',
          },
          lang === 'cn' && {
            displayName: 'AI挑图师',
            path: '/software/live/photo/:id/AI-picker',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_ADD_PHOTOGRAPHER'),
            path: '/software/live/photo/:id/cameraman',
            logEventName: '',
          },
        ].filter(Boolean),
      },
      lang === 'cn' && {
        displayName: intl.tf('LP_PACKAGE_DOWNLOAD_LINE'),
        icon: 'live_download',
        subMenu: [
          {
            displayName: intl.tf('LP_PACKAGE_DOWNLOAD'),
            path: '/software/live/photo/:id/package-download',
            logEventName: '',
          },
        ],
      },
      lang === 'en' && {
        displayName: intl.tf('LP_PACKAGE_DOWNLOAD_LINE'),
        icon: 'live_download',
        subMenu: [
          {
            displayName: 'Preview',
            path: 'preview',
            type: 'link',
            click: () => {
              const { baseInfo, urls } = this.props;
              const { enc_broadcast_id } = baseInfo;
              const { broadcastBaseUrl } = urls.toJS();
              const src =
                broadcastBaseUrl +
                `live-photo-client/index.html?enc_broadcast_id=${enc_broadcast_id}#/home`;
              const link = document.createElement('a');
              link.href = src;
              link.target = '_blank';
              link.click();
            },
            logEventName: '',
          },
          {
            displayName: 'QR Code',
            path: '/software/live/photo/:id/share',
            logEventName: '',
          },
          {
            displayName: intl.tf('LP_PACKAGE_DOWNLOAD'),
            path: '/software/live/photo/:id/package-download',
            logEventName: '',
          },
        ],
      },
      {
        displayName: intl.tf('LP_PHOTO_MANGEMENT'),
        icon: 'live_picture',
        subMenu: [
          {
            displayName: intl.tf('LP_PHOTO_MANGEMENT_AND'),
            path: '/software/live/photo/:id/photo-management',
            logEventName: '',
          },
          intl.lang === 'en' && {
            displayName: 'Face Management',
            path: '/software/live/photo/:id/face-management',
            logEventName: '',
          },
        ].filter(Boolean),
      },
      lang === 'cn' && {
        displayName: '分享',
        icon: 'live_share',
        subMenu: [
          {
            displayName: '微信分享',
            path: '/software/live/photo/:id/WeChat-share',
            logEventName: '',
          },
        ],
      },
      lang === 'cn' && {
        displayName: intl.tf('LP_MARKETING'),
        icon: 'live_marketing',
        subMenu: [
          {
            displayName: intl.tf('LP_PV'),
            path: '/software/live/photo/:id/manage-pv',
            logEventName: '',
          },
          {
            displayName: intl.tf('END_ADVERTISEMENT'),
            path: '/software/live/photo/:id/end-advertisement',
            logEventName: '',
          },
          {
            displayName: '侧边广告',
            path: '/software/live/photo/:id/side-advertsing',
            logEventName: '',
          },
          {
            displayName: '登记表单',
            path: '/software/live/photo/:id/registration-form',
            logEventName: '',
          },
        ],
      },
    ].filter(Boolean);
  }
  // 返回上一页
  navBack = () => {
    this.props.history.push('/software/live/photo');
    // this.props.history.goBack();
  };

  menuCallback = () => {
    const { boundGlobalActions, intl } = this.props;

    boundGlobalActions.showConfirm({
      title: intl.tf('LP_ALBUM_TIPS'),
      message: intl.tf('LP_ALBUM_TIPS_CONTENT'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('LP_ALBUM_TIPS_KNOWN'),
        },
      ],
    });
    return true;
  };

  render() {
    const { productSubscriptionStatus, liveId, isOpenTip, boundGlobalActions } = this.props;

    return (
      <XSiderbar
        productSubscriptionStatus={productSubscriptionStatus}
        replacePath={path => path.replace(':id', liveId)}
        preferentialConfig={this.preferentialConfig}
        menuCallback={this.menuCallback}
        boundGlobalActions={boundGlobalActions}
        liveId={liveId}
      />
    );
  }
}

export default withRouter(combinLanguage(LiveSidebar));
