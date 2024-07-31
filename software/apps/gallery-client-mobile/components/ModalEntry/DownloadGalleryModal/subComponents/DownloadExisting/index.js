import React, { Component } from 'react';

import { XButton, XIcon } from '@common/components';

import './index.scss';

export default class extends Component {
  constructor(props) {
    super(props);
  }

  handleNewDownload = () => {
    const { goToStep, openChoolesImg, downloadType, onClosed, downloadSetting } = this.props;
    const { download_limited } = downloadSetting || {};

    if (downloadType === 1 && !__isCN__ && download_limited) {
      onClosed();
      openChoolesImg(true);
      return false;
    }
    goToStep(3);
  };

  handleDownloadExisting = () => {
    const { goToStep } = this.props;
    goToStep(5);
  };

  goPreviousStep = () => {
    const { goToStep } = this.props;
    goToStep();
  };

  render() {
    const { initialStep, lastGeneratedTime, cnLastGeneratedTime, isHasExistedZip } = this.props;
    return (
      <div className="download-existing-container">
        {initialStep !== 2 && !isHasExistedZip && (
          <div className="page-back-header">
            <XIcon
              className="back"
              type="back"
              onClick={this.goPreviousStep}
              iconWidth={16}
              iconHeight={16}
              fontSize={16}
              fontColor="#3A3A3A"
              text=""
            />
          </div>
        )}
        <span className="download-existing-title">{t('DOWNLOAD_EXISTING_FILE')}</span>
        <span className="download-existing-desc">
          {t('DOWNLOAD_FILE_DESC', {
            lastGeneratedTime: __isCN__ ? cnLastGeneratedTime : lastGeneratedTime,
          })}
        </span>
        <div className="download-existing-btn-wrapper">
          <XButton className="black download-existing-btn" onClicked={this.handleDownloadExisting}>
            {t('DOWNLOAD_EXISTING')}
          </XButton>
          <XButton className="black download-existing-btn" onClicked={this.handleNewDownload}>
            {t('NEW_DOWNLOAD')}
          </XButton>
        </div>
      </div>
    );
  }
}
