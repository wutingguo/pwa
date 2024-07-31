import React, { Component } from 'react';
import XModal from '@common/components/XModal';
import XButton from 'appsCommon/components/dom/XButton';

import { absoluteUrl } from '@resource/lib/utils/language';

import { getProPlanGiveRebateRule, replaceProPlanText } from 'appsCommon/utils/proPlanFee';

import './index.scss';

class SubscribeToProPlanModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      proPlanGiveRebateData: {}
    };
    this.onClickSubscribe = this.onClickSubscribe.bind(this);
  }

  componentDidMount() {
    getProPlanGiveRebateRule(this.onProPlanDataFetched.bind(this));
  }

  onProPlanDataFetched(data) {
    this.setState({
      proPlanGiveRebateData: data
    });
  }

  onClickSubscribe = () => {
    const {
      closeModal,
      onSubscribe
    } = this.props;

    onSubscribe();
    closeModal();
  }

  render() {
    const {
      closeModal
    } = this.props;
    const {
      proPlanGiveRebateData
    } = this.state;

    const xmodalProps = {
      data: {
        title: t("SUBSCRIBE_PRO_PLAN"),
        className: 'subscribe-to-pro-plan-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };

    return (
      <XModal {...xmodalProps}>
        <div className="subscribe-to-pro-plan-modal-content">
          <div className="modal-body">
            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text1">
              {t("SUBSCRIBE_TO_PRO_PLAN_TEXT1")}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text2">
              {replaceProPlanText(proPlanGiveRebateData, t('SUBSCRIBE_TO_PRO_PLAN_TEXT2'))}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text3">
              {t("SUBSCRIBE_TO_PRO_PLAN_TEXT3")}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text4">
              {replaceProPlanText(proPlanGiveRebateData, t('SUBSCRIBE_TO_PRO_PLAN_TEXT4'))}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text5">
              {t("SUBSCRIBE_TO_PRO_PLAN_TEXT5")}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text6">
              {t("SUBSCRIBE_TO_PRO_PLAN_TEXT6")}
            </div>

            <div className="subscribe-to-pro-plan-text subscribe-to-pro-plan-text7">
              {t("SUBSCRIBE_TO_PRO_PLAN_TEXT7")}
            </div>

          </div>

          <div className="modal-footer">
            <XButton
              className="balck"
              width="160"
              height="30"
              onClicked={this.onClickSubscribe}
              >{t('SUBSCRIBE')}
            </XButton>

            <a href={absoluteUrl("SUPPORT_FAQ_FOR_PRO_PLAN")} className="link-part"> {t('PRO_SECTION1_LINK')}</a>
            
          </div>
        </div>
      </XModal>
    );
  }
}

export default SubscribeToProPlanModal;
