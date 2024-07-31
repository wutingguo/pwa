import React, { Component } from 'react';
import XModal from '@common/components/XModal';
import XButton from 'appsCommon/components/dom/XButton';
import { getProPlanGiveRebateRule, replaceProPlanText } from 'appsCommon/utils/proPlanFee';
import ShipImg from '@common/icons/pc.jpg';
import './index.scss';

class SubscribeToProPlanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proPlanGiveRebateData: {},
      isLoading: true
    };
    this.onClickSubscribe = this.onClickSubscribe.bind(this);
  }

  componentDidMount() {
    getProPlanGiveRebateRule(this.onProPlanDataFetched.bind(this));
  }

  onProPlanDataFetched(data) {
    this.setState({
      proPlanGiveRebateData: data,
      isLoading: false
    });
  }

  onClickSubscribe = () => {
    const { closeModal, onSubscribe } = this.props;

    onSubscribe();
    closeModal();
  };

  render() {
    const { closeModal } = this.props;
    const { proPlanGiveRebateData, isLoading } = this.state;

    const xmodalProps = {
      data: {
        title: t('DROP_SHIP_SERVICE'),
        className: 'drip_ship_subscribe-to-pro-plan-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };
    console.log('proPlanGiveRebateData===>', proPlanGiveRebateData);
    if (isLoading) return null;

    return (
      <XModal {...xmodalProps}>
        <div className="subscribe-to-pro-plan-modal-content">
          <div className="modal-body">
            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text2">
              {replaceProPlanText(proPlanGiveRebateData, t('DROP_SHIP_SERVICE_TEXT1'))}
            </div>
            <div className="ship-image">
              <img src={ShipImg} alt="" />
            </div>
          </div>

          <div className="modal-footer">
            <XButton className="balck" width="307" height="44" onClicked={this.onClickSubscribe}>
              {t('DROP_SHIP_SERVICE_SUBSCRIBE_TO_PRO_PLAN')}
            </XButton>
          </div>
        </div>
      </XModal>
    );
  }
}

export default SubscribeToProPlanModal;
