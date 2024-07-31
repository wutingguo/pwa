import classNames from 'classnames';
import { debounce, isFunction } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import XSelect from '@resource/components/XSelect';

import { throttle } from '@resource/lib/utils/timeout';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

import { XButton, XIcon, XInput, XModal } from '@common/components';

import DatePicker from '@apps/gallery/components/DatePicker';

import mainHandler from './main';

import './index.scss';

class CreateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      closeDatePicker: true,
      autoExpiryDate: '',
      convertAutoExpiryDate: '',
    };
  }

  getAutoExpiryProps = () => mainHandler.getAutoExpiryProps(this);
  getDatePickerProps = () => mainHandler.getDatePickerProps(this);
  willReceiveProps = () => mainHandler.willReceiveProps(this);
  onClickBtn = cb => {
    const { data } = this.props;
    const close = data.get('close');

    if (isFunction(close)) {
      close();
    }

    if (isFunction(cb)) {
      cb();
    }
  };

  onInputChange = e => {
    const { data } = this.props;
    const requiredTip = data.get('requiredTip');
    const inputValue = e.target.value;
    this.setState({
      inputValue,
      isShowTip: !!inputValue ? false : true,
      tipContent: !!inputValue ? '' : requiredTip,
      isShowSuffix: !!inputValue ? true : false,
    });
  };

  onInputClear = () => {
    const { data } = this.props;
    const requiredTip = data.get('requiredTip');
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: requiredTip,
    });
  };

  onCreate = debounce(() => {
    const { data } = this.props;
    const { inputValue, curPresetId, autoExpiryDate } = this.state;

    const handleSave = data.get('handleSave');
    const close = data.get('close');
    const requiredTip = data.get('requiredTip');
    const illegalTip = data.get('illegalTip');

    // const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
    // const isLegal = nameReg.test(inputValue);
    // http://zentao.xiatekeji.com:99/execution-storyView-1279-189.html  【新增】【公共】【Gallery&Slideshow】Gallery + Slideshow 命名放开特殊字符限制与重复命名限制
    const isLegal = true;
    const isEmptyStr = SPACE_REG.test(inputValue);

    let tipContent = '';
    let isShowTip = false;

    if (!inputValue || isEmptyStr) {
      isShowTip = true;
      tipContent = requiredTip;
    } else if (!isLegal) {
      isShowTip = true;
      tipContent = illegalTip;
    }
    this.setState({
      isShowTip,
      tipContent,
    });
    if (inputValue && isLegal && !isEmptyStr) {
      // close();
      const event_time = autoExpiryDate ? moment(autoExpiryDate).valueOf() : null;
      handleSave(inputValue.trim(), curPresetId, event_time);
    }
  }, 100);
  getPresetList = () => {
    const { data } = this.props;
    const { boundProjectActions, urls = {}, userAuth = {}, showSelectPreset } = data.toJS();
    if (!showSelectPreset) return;
    const { customerId } = userAuth;
    const galleryBaseUrl = urls.galleryBaseUrl;
    const defaultList = [{ label: t('SELECT_PRESET'), value: '' }];
    boundProjectActions.getPresetList({ customer_id: customerId, galleryBaseUrl }).then(res => {
      const { data = [] } = res;
      console.log('data: ', data);
      let list = [];
      if (data && data.length > 0) {
        list = data.map(item => {
          return {
            label: item.template_name,
            value: item.template_id,
          };
        });
        list = defaultList.concat(list);
      }
      this.setState({
        presetList: list,
        showSelectPreset,
      });
    });
  };
  componentDidMount() {
    this.willReceiveProps();
    this.getPresetList();
  }
  changePreset = ({ value }) => {
    this.setState({
      curPresetId: value,
    });
  };
  goPreset = () => {
    const { data } = this.props;
    const { history, handleCancel } = data.toJS();
    handleCancel();
    const tab = __isCN__ ? 1 : 2;
    history.push({ pathname: `/software/gallery/settings`, state: { tab } });
  };

  render() {
    const { data } = this.props;
    const { inputValue, isShowTip, isShowSuffix, tipContent, showSelectPreset, closeDatePicker } =
      this.state;

    const close = data.get('close');
    const title = data.get('title');
    const eventDatemessage = data.get('eventDatemessage');
    const eventDatePlaceholder = data.get('eventDatePlaceholder');
    const showEventDate = data.get('showEventDate');
    const placeholder = data.get('placeholder');
    const wrapClass = classNames('x-create-wrap', data.get('className'));

    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');
    const hiddenCancelBtn = !!data.get('hiddenCancelBtn');
    const footerStyle = data.get('footerStyle') ? data.get('footerStyle').toJS() : {};
    const okText = data.get('okText');

    const messageDom = data.get('message');
    const message = messageDom.toJS ? messageDom.toJS() : messageDom;

    const handleCancel = data.get('handleCancel');
    const selectProps = {
      className: 'watermark-select-wrapper',
      placeholder: t('SELECT_PRESET'),
      searchable: false,
      options: this.state.presetList,
      onChanged: this.changePreset,
      value: this.state.curPresetId,
    };

    const inputProps = {
      className: 'create',
      value: inputValue,
      placeholder,
      onChange: this.onInputChange,
      hasSuffix: true,
      isShowSuffix: isShowSuffix,
      isShowTip: isShowTip,
      tipContent: tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };

    return (
      <XModal
        className={wrapClass}
        styles={style}
        opened={true}
        onClosed={close}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        <div className="modal-title">{title}</div>
        <div className="modal-body">
          <div className="add-name-wrap">
            <span className="msg">{message}</span>
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
          </div>
          {showEventDate && (
            <div className="add-name-wrap">
              <span className="msg">{eventDatemessage}</span>
              <div className="input-with-clear">
                <XInput
                  placeholder={eventDatePlaceholder}
                  {...this.getAutoExpiryProps(eventDatePlaceholder)}
                />
                {closeDatePicker ? null : (
                  <div className="date-picker-wrap">
                    <DatePicker {...this.getDatePickerProps()} />
                  </div>
                )}
              </div>
            </div>
          )}
          {showSelectPreset && (
            <div className="add-name-wrap">
              <div className="sub_wrap">
                <span className="msg">{t('PRESET_RESET')}</span>
                <a className="link" onClick={this.goPreset}>
                  {t('CREATE_PRESET')}
                </a>
              </div>
              <div className="input-with-clear">
                <XSelect {...selectProps} />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ ...footerStyle }}>
          {!hiddenCancelBtn && (
            <XButton className="white pwa-btn" onClicked={handleCancel}>
              {t('CANCEL')}
            </XButton>
          )}
          <XButton className="pwa-btn" onClicked={this.onCreate}>
            {okText || t('CREATE')}
          </XButton>
        </div>
      </XModal>
    );
  }
}

CreateModal.propTypes = {
  data: PropTypes.object.isRequired,
};

CreateModal.defaultProps = {};

export default CreateModal;
