import React, { Component } from 'react';
import XSelect from '@resource/components/XSelect';
import { XModal, XPureComponent } from '@common/components';
import './index.scss';
class ApplyBulkMarkupModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showHint: false,
      inputValue: '',
      currentRoundPrice: 'ROUNDING_CEILING'
    };
  }

  componentDidMount() {}

  changeEvent(e) {
    let val = e.target.value.toString();
    val = val.replace(/[^\d]/g, '');
    this.setState({
      inputValue: val
    });
  }

  changeRoundPrice = e => {
    this.setState({
      label: e.label,
      currentRoundPrice: e.value
    });
  };

  confirm = e => {
    const { inputValue, currentRoundPrice, label } = this.state;
    const { data } = this.props;
    const confirm = data.get('confirm');
    if (inputValue) {
      confirm({ inputValue, currentRoundPrice, label });
    } else {
      this.setState({
        showHint: true
      });
    }
  };

  render() {
    const { currentRoundPrice, inputValue, showHint } = this.state;
    const { data } = this.props;
    const close = data.get('close');

    const selectProps = {
      searchable: false,
      options: [
        { label: '.00', value: 'ROUNDING_CEILING' },
        { label: '.99', value: 'ROUNDING_CEILING_NINE' },
        { label: t('NO_ROUNDING', 'No Rounding'), value: 'ROUNDING_HALF_UP' }
      ],
      onChanged: this.changeRoundPrice
    };

    return (
      <XModal className="estore-apply-bulk-markup-wrapper" opened={true} onClosed={close}>
        <div className="text title">{t('APPLY_BULK_MARKUP', 'Apply Bulk Markup')}</div>
        <div className="markup-container">
          <div className="text book">{t('MARKUP_PERCENT', 'Markup percent')}</div>
          <div className="markup-input">
            <input
              maxLength={3}
              type="text"
              onChange={e => this.changeEvent(e)}
              value={inputValue}
            ></input>
            <spin className="text percent">%</spin>
          </div>
          {showHint ? (
            <div className="markup-hint">{t('MARKUP_TIPS', 'Markup percent is required.')}</div>
          ) : null}
          <div
            className="text light"
            dangerouslySetInnerHTML={{ __html: t('MARKUP_PERCENT_TIPS') }}
          />
          <div className="text book">{t('ROUND_PRICES', 'Round prices up to')}</div>
          <div className="select-container">
            <XSelect {...selectProps} value={currentRoundPrice} />
          </div>
        </div>
        <div className="btns-container">
          <div className="cancel" onClick={close}>
            {t('CANCEL')}
          </div>
          <div className="confirm" onClick={this.confirm}>
            {t('CONFIRM')}
          </div>
        </div>
      </XModal>
    );
  }
}

export default ApplyBulkMarkupModal;
