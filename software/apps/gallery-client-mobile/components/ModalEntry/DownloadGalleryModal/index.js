import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import StepWizard from 'react-step-wizard';

import CheckoutPin from './subComponents/CheckoutPin';
import SelectSets from './subComponents/SelectSets';
import GeneratingZip from './subComponents/GeneratingZip';
import ReadyPage from './subComponents/ReadyPage';
import DownloadExisting from './subComponents/DownloadExisting';

import { XModal } from '@common/components';

import './index.scss';

class DownloadGalleryModal extends XPureComponent {
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

    const checkoutPinProps = {
      ...this.props,
      hashKey: 'FirstStep',
      updateState: this.updateState
    };
    const selectSetsProps = {
      ...this.props,
      updateState: this.updateState,
      hashKey: 'SecondStep'
    };
    const generatingZipProps = {
      ...this.props,
      uuid,
      updateState: this.updateState,
      hashKey: 'ThirdStep'
    };
    const downloadExistingProps = {
      ...this.props,
      lastGeneratedTime,
      updateState: this.updateState,
      hashKey: 'FourthStep'
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
            <CheckoutPin {...checkoutPinProps} />
            <DownloadExisting {...downloadExistingProps} />
            <SelectSets {...selectSetsProps} />
            <GeneratingZip {...generatingZipProps} />
            <ReadyPage {...readyPageProps} />
          </StepWizard>
        </div>
      </XModal>
    );
  }
}

export default DownloadGalleryModal;
