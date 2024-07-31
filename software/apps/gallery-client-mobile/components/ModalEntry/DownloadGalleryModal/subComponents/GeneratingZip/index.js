import React, { Component } from 'react';
import loadingIcon from '../../icon/loading.svg';

import './index.scss';

export default class GeneratingZip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timeout);
    const { uuid: newUuid } = nextProps;
    const { uuid: oldUuid } = this.props;
    if (newUuid && newUuid !== oldUuid) {
      this.getDownloadLink(newUuid);
    }
  }
  componentDidMount() {
    const { uuid, downloaduuid } = this.props;
    if (downloaduuid && !uuid) {
      this.getDownloadLink(downloaduuid);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getDownloadLink = async uuid => {
    const { updateState, goToStep, boundProjectActions } = this.props;
    const { getGalleryDownloadLink } = boundProjectActions;

    const { isHasExistedZip, downloadName, downloadUrl } = await getGalleryDownloadLink(uuid);

    if (downloadUrl) {
      updateState({
        isHasExistedZip,
        name: downloadName,
        url: downloadUrl
      });
      goToStep(5);
    } else {
      this.startPoll(uuid);
    }
  };

  // 执行轮询操作
  startPoll = uuid => {
    const that = this;
    this.timeout = setTimeout(function() {
      that.getDownloadLink(uuid);
    }, 1000);
  };

  goPreviousStep = () => {
    const { previousStep, currentStep } = this.props;
    currentStep > 1 && previousStep();
  };

  render() {
    return (
      <div className="generating-zip-container">
        <div className="generating-zip-desc">
          <img src={loadingIcon} className="desc-icon" />
          <span className="desc-title">{t('GENERATING_ZIP_TITLE')}</span>
          {/* <span className="desc-tip">{t('GENERATING_ZIP_DESC')}</span> */}
        </div>
      </div>
    );
  }
}
