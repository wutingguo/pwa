import React, { Component } from 'react';

import XModal from '@common/components/XModal';
import XRadio from '@common/components/XRadio';
import XButton from 'appsCommon/components/dom/XButton';

import {
  getStudioSample,
  applyStudioSample
} from '@apps/gallery-client/services/cart';
import { checkTokenError } from 'appsCommon/utils/userToken';

import './index.scss';

class StudioSampleApplyModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      force_use: true,
      isLoading: false,
      studioSamples: []
    };
    this.onApplyStudioSample = this.onApplyStudioSample.bind(this);
  }

  componentDidMount() {
    const { force_use }= this.state;
    getStudioSample(force_use)
      .then(data => {
        this.setState({studioSamples: data})
      })
  }

  toogleItemSelect(item_id) {
    const { studioSamples } = this.state;
    studioSamples.forEach(item => {
      if (item.item_id === item_id) {
        item.checked = !item.checked;
      }
    });
    this.setState({ studioSamples });
  }

  onApplyStudioSample = () => {
    const {
      closeModal,
      refreshPageData
    } = this.props;
    const {
      studioSamples
    } = this.state;
    this.setState({isLoading: true});
    applyStudioSample(studioSamples)
      .then(data => {
        refreshPageData(data);
        closeModal();
        this.setState({isLoading: false});
      })
      .catch(errorCode => {
        checkTokenError(errorCode);
        this.setState({isLoading: false});
      });
  }

  render() {
    const {
      closeModal
    } = this.props;
    const {
      isLoading,
      studioSamples
    } = this.state;

    const xmodalProps = {
      data: {
        title: t("STUDIO_SAMPLE_MODAL_TITLE"),
        className: 'studio-sample-apply-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };

    return (
      <XModal {...xmodalProps}>
        <div className="studio-sample-apply-modal-content">
          <div className="modal-body">
            <div className="notes">
              {t("STUDIO_SAMPLE_MODAL_NOTES")}
            </div>

            <table
            >
              <thead>
                <tr>
                  <td className="first">{t("ACTION")}</td>
                  <td>{t("ITEM")}</td>
                </tr>
              </thead>
              <tbody>
                {studioSamples.map(ssitem => {
                  return (
                    <tr>
                      <td className="first">
                        <XRadio
                          checked={ssitem.checked}
                          skin="blue"
                          onClicked={this.toogleItemSelect.bind(this, ssitem.item_id)}
                        />
                      </td>
                      <td className="second">{ssitem.display_name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
          <div className="modal-footer">
            <XButton
              className="white"
              width="160"
              height="30"
              onClicked={closeModal}
            >{t('CANCEL')}</XButton>
            <XButton
              className="balck"
              width="160"
              height="30"
              isWithLoading={true}
              isShowLoading={isLoading}
              onClicked={this.onApplyStudioSample}
            >{t('CONFIRM')}</XButton>
          </div>
        </div>
      </XModal>
    );
  }
}

export default StudioSampleApplyModal;
