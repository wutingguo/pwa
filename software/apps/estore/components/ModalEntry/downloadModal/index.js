import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import StepWizard from 'react-step-wizard';
import GeneratingZip from './subComponents/GeneratingZip';
import ReadyPage from './subComponents/ReadyPage';

import { XModal } from '@common/components';

import './index.scss';

class DownloadModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      initialStep: 1,
      uuid: null,
      name: null,
      url: null,
      lastGeneratedTime: null,
      transitions: {
        enterRight: `animated enterRight`,
        enterLeft: `animated enterLeft`,
        exitRight: `animated exitRight}`,
        exitLeft: `animated exitLeft}`,
        intro: `animated intro`
      }
    };
  }
  componentDidMount() {
    const { downloadName, downloadUrl, lastGeneratedTime } = this.props;
    if (downloadUrl) {
      this.setState({
        name: downloadName,
        url: downloadUrl,
        lastGeneratedTime
      });
    }
  }

  updateState = data => {
    this.setState({
      ...this.state,
      ...data
    });
  };
  onStepChange = stats => {
    const { activeStep } = stats;
    this.setState({
      activeStep
    });
  };

  setInstance = SW => {
    this.setState({
      SW
    });
  };

  render() {
    const { isShown, onClosed, escapeClose } = this.props;
    const { transitions, uuid, name, url, lastGeneratedTime } = this.state;

    const modalProps = {
      opened: isShown,
      onClosed,
      escapeClose,
      className: 'x-saas-gallery-download-modal'
    };

    const stepWizardProps = {
      ...this.props,
      transitions,
      onStepChange: this.onStepChange,
      setInstance: this.setInstance
    };

    const generatingZipProps = {
      ...this.props,
      uuid,
      updateState: this.updateState,
      hashKey: 'ThirdStep'
    };

    const readyPageProps = {
      ...this.props,
      name,
      url,
      updateState: this.updateState,
      hashKey: 'FivethStep'
    };

    return (
      <XModal {...modalProps}>
        <div className="step-content">
          <StepWizard {...stepWizardProps}>
            <GeneratingZip {...generatingZipProps} />
            <ReadyPage {...readyPageProps} />
          </StepWizard>
        </div>
      </XModal>
    );
  }
}

export default DownloadModal;
