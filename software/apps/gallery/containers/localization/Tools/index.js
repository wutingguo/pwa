import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { XLink, XButton, XPureComponent } from '@common/components';
import LightroomPlugin from './lightroom-plugin.png';
import './index.scss';

class Tools extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDownload = href => {
    window.logEvent.addPageEvent({
      name: 'GalleryTools_Click_Download'
    });

    location.href = href.target;
  };

  render() {
    const downloadHtml = __isCN__
      ? `
        ${t('TOOLS_PLUGIN_DOWNLOAD_DESC')}
        ${t('TOOLS_PLUGIN_DOWNLOAD_DESC_1')}
        <a target='_blank' href=${location.origin.replace(
          'saas.',
          'www.'
        )}/gallery.html>寸心选片软件</a>
        ${t('TOOLS_PLUGIN_DOWNLOAD_DESC_2')}
      `
      : `
        ${t('TOOLS_PLUGIN_DOWNLOAD_DESC')}
        <a target='_blank' href=${location.origin.replace(
          'saas.',
          'www.'
        )}/gallery.html>Zno Gallery.</a>
      `;

    let downloadUrl = __isCN__
      ? 'https://www.cunxin.com/templates/cunxin.lrplugin.zip'
      : 'https://assets.znocdn.net/templates/zno.lrplugin.zip';
    if (location && location.host === 'saas.cnzno.com.tt') {
      downloadUrl = 'https://www.cnzno.com.tt/templates/cunxin.lrplugin_tt.zip';
    }

    return (
      <div className="gallery-tools">
        {/* <div className="tools-header">
          <span className="tools-label">
            {t('TOOLS')}
          </span>
        </div> */}
        <div className="tools-desc">
          <span className="topic">{t('TOOLS_TOPIC')}</span>
          <p className="desc" dangerouslySetInnerHTML={{ __html: t('TOOLS_DESC') }} />
        </div>
        <div className="tools-plugin">
          <div className="plugin">
            <div className="title">{t('TOOLS_LIGHTROOM_PLUGIN')}</div>
            <p className="desc">{t('TOOLS_LIGHTROOM_DESC')}</p>
            <XLink className="plugin-download-a" onClick={this.onDownload} href={downloadUrl}>
              <XButton className="plugin-download" onClicked={() => {}}>
                {t('TOOLS_PLUGIN_DOWNLOAD')}
              </XButton>
            </XLink>

            <p
              className="download-desc"
              dangerouslySetInnerHTML={{
                __html: downloadHtml
              }}
            />
          </div>
          <div className="img">
            <img src={LightroomPlugin} />
          </div>
        </div>
      </div>
    );
  }
}

export default Tools;
