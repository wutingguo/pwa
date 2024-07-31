import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XCheckBox from '@resource/components/XCheckBox';
import XInput from '@resource/components/XInput/Input/index';
import TextArea from '@resource/components/XInput/TextArea';
import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';
import XRadio from '@resource/components/XRadio';
import XSelect from '@resource/components/XSelect';

// 公共方法
import { getSearchObj } from '@resource/lib/utils/url';

import * as notificationTypes from '@resource/lib/constants/notificationTypes';

// 公共组件
import XButton from '@resource/websiteCommon/components/dom/XButton';

import mapDispatch from '@src/redux/selector/mapDispatch';
// 公共配置
import mapState from '@src/redux/selector/mapState';

import AlertModal from '@src/components/AlertModal';
import XBack from '@src/components/Back';

import ConfirmModal from '../../../../../components/ConfirmModal';
// 自定义组件
import XCreditApplyModal from '../../components/CreditApplyModal';
import XGroup from '../../components/Group';
import XImageArray from '../../components/ImageArray';
import XItemBox from '../../components/ItemBox';
import XLabelItem from '../../components/LabelItem';
import XTitle from '../../components/Title';
// 样式
import '../index.scss';
import { getOptions } from '../utils';

import {
  checkCoverDesign,
  checkInput,
  closeModal,
  didMount,
  getAlerModalProps,
  getConfirmModalProps,
  getCxeditorData,
  getPrice,
  getStoreCreditHandler,
  handleAlertClose,
  handleConfirmClose,
  handleConfirmOk,
  handleCreateOrder,
  handlerBlur,
  handlerChange,
  handlerCoverDesign,
  handlerFormBlur,
  handlerFormChange,
  handlerGroup,
  handlerImageClick,
  handlerInstructionsChange,
  handlerPaymentClick,
  handlerPaypal,
  handlerRadioChange,
  handlerSelectChange,
  handlerSequence,
  handlerUngroup,
  headlerCheckChnage,
  openModal,
  openPageConfirmModal,
} from './handler';

// 标题
const XDsCaption = () => {
  return (
    <Fragment>
      <h1 className="caption text-center mt40"> Design Service Order Form </h1>
      <p className="desc text-center mb40">
        This order form is for Design Service only. It does not include the purchase of the printed
        album.
      </p>
    </Fragment>
  );
};

// 错误提示
const ErrorTip = ({ open, field }) => {
  return open && <span className="error-tips ml24">{field} is required.</span>;
};

// 徽章 星号
const Badge = () => {
  return <i className="icon-star">*</i>;
};

//  Required field
const LabelRequiredItem = () => {
  return (
    <div className="required-field-box">
      <Badge />
      <label className="required-field-text"> Required field</label>
    </div>
  );
};

// 支付金额
const Amount = ({
  hasPoints = false,
  onPaymentClick,
  isButton1Loading,
  isButton2Loading,
  currencyCode,
  currencySymbol,
  appliedCredit = 0,
  totalPaymentMmount = 0,
  realPaymentAmount = 0,
  onOpenModal,
}) => {
  return (
    <div className="amount-box">
      <div className="total-amount-box">
        <span className="title">Items Total:</span>
        <span className="total-amount">
          {currencySymbol}
          {totalPaymentMmount}
        </span>
      </div>
      {hasPoints && (
        <div className="discount-amount-box">
          <span className="apply-store-credit" onClick={onOpenModal}>
            Apply Store Credit
          </span>
          <span className="discount-amount">${appliedCredit}</span>
        </div>
      )}
      <div className="real-amount-box">
        <span className="title">Total: </span>
        <span className="real-amount">
          <em className="real-amount-data">
            {currencySymbol}
            {realPaymentAmount}
          </em>
          <em className="currency">{currencyCode}</em>
        </span>
      </div>
      <div>
        <XButton
          isWithLoading={true}
          isShowLoading={isButton1Loading}
          className="payment-btn mb24"
          onClick={() => onPaymentClick(false)}
        >
          {' '}
          Continue to Order with Credit Card{' '}
        </XButton>
        <XButton
          isWithLoading={true}
          isShowLoading={isButton2Loading}
          className="payment-btn"
          onClick={() => onPaymentClick(true)}
        >
          {' '}
          Continue to Order with PayPal{' '}
        </XButton>
      </div>
    </div>
  );
};

// 页面
@connect(mapState, mapDispatch)
class Designer extends XPureComponent {
  constructor(props) {
    super(props);

    this.closeModal = closeModal.bind(this);
    this.openModal = openModal.bind(this);
    this.didMount = didMount.bind(this);
    this.getPrice = getPrice.bind(this);
    this.handleAlertClose = handleAlertClose.bind(this);
    this.getAlerModalProps = getAlerModalProps.bind(this);
    this.getConfirmModalProps = getConfirmModalProps.bind(this);
    this.handlerSelectChange = handlerSelectChange.bind(this);
    this.handlerSequence = handlerSequence.bind(this);
    this.checkCoverDesign = checkCoverDesign.bind(this);
    this.handlerCoverDesign = handlerCoverDesign.bind(this);
    this.handlerChange = handlerChange.bind(this);
    this.handlerBlur = handlerBlur.bind(this);
    this.handlerImageClick = handlerImageClick.bind(this);
    this.handlerGroup = handlerGroup.bind(this);
    this.handlerUngroup = handlerUngroup.bind(this);
    this.handlerInstructionsChange = handlerInstructionsChange.bind(this);
    this.checkInput = checkInput.bind(this);
    this.handleCreateOrder = handleCreateOrder.bind(this);
    this.handlerPaypal = handlerPaypal.bind(this);
    this.handlerPaymentClick = handlerPaymentClick.bind(this);
    this.getStoreCreditHandler = getStoreCreditHandler.bind(this);

    this.xeditorData = getCxeditorData(this);
    this.handlerFormChange = handlerFormChange.bind(this);
    this.handlerFormBlur = handlerFormBlur.bind(this);
    this.headlerCheckChnage = headlerCheckChnage.bind(this);
    this.handlerRadioChange = handlerRadioChange.bind(this);
    this.handleConfirmClose = handleConfirmClose.bind(this);
    this.handleConfirmOk = handleConfirmOk.bind(this);
    this.openPageConfirmModal = openPageConfirmModal.bind(this);

    this.options = {
      className: 'customer-select',
      searchable: false,
      options: getOptions(this.xeditorData.pages),
      onChange: this.handlerSelectChange,
    };

    // 获取URL中的参数
    this.urlObj = getSearchObj();
  }

  showNotification = msg => {
    this.props.boundGlobalActions.addNotification({
      message: msg || t('SERVICE_ERROR_UNKNOWN'),
      level: 'success',
      uid: notificationTypes.SAVE_FAILED,
      autoDismiss: 3,
    });
  };

  componentDidMount() {
    this.didMount();
  }

  // 渲染 分组图片
  renderGroups = () => {
    const { designService } = this.props;
    const groupArr = designService.get('groupArr');
    return (
      Array.isArray(groupArr) &&
      groupArr.map(group => {
        return (
          <XGroup
            ungroupEnabled={true}
            groupName={group.groupName}
            list={group.imageList}
            onUngroupClick={() => this.handlerUngroup(group.groupName)}
          />
        );
      })
    );
  };

  // 相册属性权限控制
  controlProperties = (label, data) => {
    const target = data?.find(item => item.label === label) || null;
    if (!target) return {};
    let disabledKey = [];
    const options = { checkboxDisabled: true };

    if (label === 'Product') {
      disabledKey = ['PB_SLIM_PHOTO_BOOK', 'PB_LAYFLAT_PHOTO_BOOK'];
      options.checkboxName = 'Edge design is not available for your selected product.';
    } else if (label === 'Cover') {
      disabledKey = [
        'FM_ACRYLIC_COVER',
        'FM_METAL_COVER',
        'FM_WOOD_COVER',
        'FM_PHOTO_COVER',
        'DUOTONE',
        'FM_CRYSTAL_COVER',
        'ACRYLIC_CAMEO_COVER',
      ];
      options.checkboxName = 'Spine text is not available for your selected cover.';
    }
    for (let i = 0; i < disabledKey.length; i++) {
      const key = disabledKey[i];
      if (target.id === key) {
        return options;
      }
    }
  };

  renderMain = () => {
    // 全局 action
    const { boundProjectActions, designService, baseUrl, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    const {
      isButton1Loading,
      isButton2Loading,
      open,
      showAlert,
      productConfirmat,
      currPage,
      coverArr,
      favoriteArr,
      originGroupArr,
      sequence,
      coverDesign,
      liningDesign,
      edgeDesign,
      imageSelection,
      hasSequenceError,
      hasCoverDesignError,
      hasLiningDesignError,
      hasEdgeDesignError,
      priceCount,
      instructions,
      hasPoints,
      showConfirm,
    } = designService.toJS();

    const amountProps = {
      hasPoints,
      isButton1Loading,
      isButton2Loading,
      ...priceCount,
      onOpenModal: this.openModal,
      onPaymentClick: this.handlerPaymentClick,
    };
    const edgeProperty = this.controlProperties(
      'Product',
      Array.isArray(productConfirmat) ? productConfirmat : []
    );
    const spineProperty = this.controlProperties(
      'Cover',
      Array.isArray(productConfirmat) ? productConfirmat : []
    );
    // console.log(this.props, 'props', productConfirmat);
    // Image Groupings 中
    // 有选中的图片
    const hasChecked = originGroupArr.some(img => img.active === true);

    // console.log('liningDesign', liningDesign, 'edgeDesign', edgeDesign);
    return (
      <Fragment>
        {showAlert ? <AlertModal {...this.getAlerModalProps()} /> : null}
        {showConfirm ? <ConfirmModal {...this.getConfirmModalProps()} /> : null}
        {open && (
          <XCreditApplyModal
            baseUrl={baseUrl}
            saasBaseUrl={saasBaseUrl}
            pages={currPage}
            boundProjectActions={boundProjectActions}
            closeModal={this.closeModal}
            onSetStoreCredit={this.getStoreCreditHandler}
          />
        )}
        <XItemBox>
          <XTitle title={'1. Product Confirmation'} className="title mb24" />
          <XTitle
            title="If you want to make any changes to these options, please go back to the previous page and re-select."
            className="sub-title mb24"
          />
          {Array.isArray(productConfirmat) &&
            productConfirmat.map(({ label, value }) => {
              if (value.startsWith('none')) return null;
              return (
                <XLabelItem key={value} vallClassName={'mb24'} label={`${label}:`} value={value} />
              );
            })}
        </XItemBox>

        <XItemBox>
          <XTitle
            title={
              <Fragment>
                2. Total # of Pages (1 sheet = 2 pages) <Badge />{' '}
              </Fragment>
            }
            className="title mb24"
          />
          <XSelect {...this.options} value={currPage} />
          <span className="explain">($1.50 per Page)</span>
        </XItemBox>

        <XItemBox domID="domRadio">
          <XTitle className="title mb24">
            3. Photo Sequence <Badge />
            <ErrorTip open={hasSequenceError.isShow} field={hasSequenceError.text} />
          </XTitle>
          {Array.isArray(sequence) &&
            sequence.map(({ value, checked, label }) => {
              const xRadioProps = { key: value, checked, text: label };
              return (
                <XRadio
                  {...xRadioProps}
                  onClicked={() => this.handlerSequence(value)}
                  name="sequence"
                  className="customer-radio mb20"
                />
              );
            })}
        </XItemBox>

        <XItemBox domID="domCheckBox">
          <XTitle
            title={
              <Fragment>
                4. Cover Design <Badge />{' '}
                <ErrorTip open={hasCoverDesignError.isShow} field={hasCoverDesignError.text} />{' '}
              </Fragment>
            }
            className="title mb24"
          />
          {this.xeditorData.needCameo && (
            <XCheckBox
              {...coverDesign.cameo}
              disabled={false}
              onClicked={({ checked }) => this.handlerCoverDesign('cameo', checked)}
              className="mb15 w200 theme-1"
            />
          )}
          <div className="mb15">
            <XCheckBox
              {...coverDesign.spineText}
              {...spineProperty}
              onClicked={({ checked }) => this.handlerCoverDesign('spineText', checked)}
              className="customer-checkbox theme-1"
            />
            <XInput
              value={coverDesign.spineText.extra}
              maxLength="99"
              disabled={!coverDesign.spineText.checked}
              onChange={value => this.handlerChange('spineText', value)}
              onBlur={e => this.handlerBlur(e)}
            />
          </div>
          <div className="mb15">
            <XCheckBox
              {...coverDesign.coverText}
              onClicked={({ checked }) => this.handlerCoverDesign('coverText', checked)}
              className="customer-checkbox theme-1"
            />
            <XInput
              value={coverDesign.coverText.extra}
              maxLength="99"
              disabled={!coverDesign.coverText.checked}
              onChange={value => this.handlerChange('coverText', value)}
              onBlur={value => this.handlerBlur(value)}
            />
          </div>
          <XCheckBox
            {...coverDesign.noDesign}
            onClicked={({ checked }) => this.handlerCoverDesign('noDesign', checked)}
            className="mb15 w200 theme-1"
          />
          <XCheckBox
            {...coverDesign.specifyCoverPhoto}
            onClicked={({ checked }) => this.handlerCoverDesign('specifyCoverPhoto', checked)}
            className="mb15 w200 theme-1"
          />
          {coverDesign.specifyCoverPhoto.checked && (
            <XImageArray
              list={coverArr}
              handlerClick={this.handlerImageClick}
              type="cover"
              className="mt40"
            />
          )}
        </XItemBox>
        <XItemBox domID="domCheckBox">
          <XTitle
            title={
              <Fragment>
                5. Lining Design
                <ErrorTip
                  open={hasLiningDesignError?.isShow}
                  field={hasLiningDesignError?.text}
                />{' '}
              </Fragment>
            }
            className="title mb24"
          />
          <div className="mb15">
            <XCheckBox
              {...liningDesign.liningText}
              onClicked={({ checked }) =>
                this.headlerCheckChnage('liningDesign', 'liningText', checked)
              }
              className="customer-checkbox theme-1"
            />
            <XInput
              value={liningDesign.liningText?.extra}
              maxLength="99"
              disabled={!liningDesign.liningText.checked}
              onChange={value => this.handlerFormChange('liningDesign', 'liningText', value)}
            />
          </div>
          <XCheckBox
            {...liningDesign.noDesign}
            onClicked={({ checked }) =>
              this.headlerCheckChnage('liningDesign', 'noDesign', checked)
            }
            className="mb15 w200 theme-1"
          />
        </XItemBox>

        <XItemBox domID="domCheckBox">
          <XTitle title={<Fragment>6. Edge Design</Fragment>} className="title mb24" />
          <div className="mb15">
            {Array.isArray(edgeDesign) &&
              edgeDesign.map(({ value, checked, label }) => {
                const xRadioProps = { key: value, checked, text: label };
                return (
                  <XRadio
                    {...xRadioProps}
                    onClicked={() => this.handlerRadioChange('edgeDesign', value, false)}
                    name="edgeDesign"
                    className="customer-radio mb20"
                  />
                );
              })}

            {/* <XCheckBox
              {...edgeDesign.edgeText}
              {...edgeProperty}
              onClicked={({ checked }) =>
                this.headlerCheckChnage('edgeDesign', 'edgeText', checked)
              }
              className="customer-checkbox theme-1"
            />
            <XInput
              value={edgeDesign.edgeText.extra}
              maxLength="99"
              disabled={!edgeDesign.edgeText.checked}
              onChange={value => this.handlerFormChange('edgeDesign', 'edgeText', value)}
            /> */}
          </div>
          {/* <XCheckBox
            {...edgeDesign.noDesign}
            onClicked={({ checked }) => this.headlerCheckChnage('edgeDesign', 'noDesign', checked)}
            className="mb15 w200 theme-1"
          /> */}
        </XItemBox>

        <XItemBox>
          <XTitle title="7. Favorite Images" className="title mb24" />
          <XImageArray list={favoriteArr} handlerClick={this.handlerImageClick} type="favorite" />
        </XItemBox>

        <XItemBox>
          <XTitle title="8. Image Groupings" className="title mb24" />
          <XButton disabled={!hasChecked} className="group-btn mb40" onClick={this.handlerGroup}>
            {' '}
            Group{' '}
          </XButton>
          <XImageArray
            list={originGroupArr}
            handlerClick={this.handlerImageClick}
            type="originGroup"
          />
          {/* 分组 */}
          {this.renderGroups()}
        </XItemBox>

        <XItemBox domID="domCheckBox">
          <XTitle
            title={
              <Fragment>
                9. Image Selection <Badge />
              </Fragment>
            }
            className="title mb24"
          />
          <XTitle
            title="Do you want all the uploaded images to be used?"
            className="sub-title mb24"
          />

          {Array.isArray(imageSelection) &&
            imageSelection.map(({ value, checked, label, disabled }) => {
              const xRadioProps = { key: value, checked, text: label, disabled };
              return (
                <XRadio
                  {...xRadioProps}
                  onClicked={() => this.handlerRadioChange('imageSelection', value, true)}
                  name="imageSelection"
                  className="customer-radio mb20"
                />
              );
            })}
        </XItemBox>

        <XItemBox>
          <XTitle title="10. Additional Instructions" className="title mb24" />
          <TextArea
            defaultValue={instructions}
            resize="none"
            className="text-area"
            onChange={this.handlerInstructionsChange}
          />
        </XItemBox>

        {/* 字段提示 */}
        <LabelRequiredItem />

        {/* 金额 */}
        <Amount {...amountProps} />
      </Fragment>
    );
  };

  render() {
    const { designService } = this.props;
    const isLoading = designService.get('isLoading');

    return (
      <div className="ds-box">
        {isLoading ? (
          <XLoading isShown={isLoading} backgroundColor="rgba(255,255,255,0.6)" />
        ) : null}
        <XBack />
        <XDsCaption />
        {this.renderMain()}
      </div>
    );
  }
}
export default Designer;
