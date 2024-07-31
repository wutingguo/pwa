import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import qs from "qs";
import { getSubscribeOrderDetail } from '@resource/pwa/services/subscription';
import XButton from "@resource/components/XButton";
import {
  navigateToWwwOrSoftware,
  navigateToWwwOrExternalBrowser
} from '@resource/lib/utils/history';
import OrderDetails from './_OrderDetails';
import PaymentDetail from './_PaymentDetail';
import { relativeUrl } from '@resource/lib/utils/language';
import {
  getAliOrderPayment
} from '@resource/pwa/services/subscription';
import './index.scss';
import {template} from "lodash";
import {ALIPAY} from "@resource/lib/constants/apiUrl";
import ConfirmModal from './_ConfirmModal';

class BillingReview extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      creditListloading: true,
      detailLoading: true,
      submitLoading: false,
      creditCardList: [],
      hasHistoryCredit: false,
      useNewCredit: false, // true 表示使用新增信用卡，false 表示使用已有信用卡
      detailData: {}, // 详情页面数据
      checkedCreditCode: '',
      userInfo: {},
      radioValue: 'wxpay',
      showAlert: false,
      orderNumber: '',
      isShowConfirmPage: false
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { oID } = urlParams;
    this.setState({
      orderNumber: oID
    }, () => {
      this.getBillingDetail(oID)
    });
  }

  getBillingDetail = (orderNumber) => {
    const { urls, history} = this.props;
    const { isShowConfirmPage } = this.state;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    if(orderNumber) {
      getSubscribeOrderDetail(orderNumber, galleryBaseUrl).then(res => {
        const { order_status } = res;
        if(order_status === 0) {
          history.push('/software/success')
        } else {
          if(isShowConfirmPage) {
            this.onSubmit();
          }
        }
        this.setState({
          detailData: res
        })
      })
    }else {
      history.goBack();
    }
  }
  onBack = () => {
    const { history} = this.props;
    history.goBack();
  }

  handleChangePayment = (e) => {
    console.log('val', e.target);
    if (e.target.title === '') return;

    this.setState({
      radioValue: e.target.title
    });
  }

  onSubmit = () => {
    window.logEvent.addPageEvent({
      name: 'SubCheckout_Click_PayNow',
    });
    const { urls, history, userInfo } = this.props;
    const customer_uid = userInfo.get('id');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const wwwBaseUrl = urls.get('wwwBaseUrl');
    const isWWW = window.location.origin.indexOf('www') !== -1;
    this.setState({isShowConfirmPage: true}, () => {
      const { radioValue, orderNumber } = this.state;
      console.log('radioValue====>', radioValue)
      if (radioValue === 'alipay') {
        const alipay_url = template(ALIPAY)({
          galleryBaseUrl,
          order_number: orderNumber,
          customer_uid
        });
        navigateToWwwOrExternalBrowser(relativeUrl(alipay_url), false);
      } else {
        const wx_url = isWWW ? `${wwwBaseUrl}software/wxpayment?order_number=${orderNumber}` : `${galleryBaseUrl}software/wxpayment?order_number=${orderNumber}`;
        navigateToWwwOrExternalBrowser(relativeUrl(wx_url), false);
        this.setState({
          showAlert: true
        });
      }
    })
  }

  buttonClick = () => {
    const { orderNumber } = this.state;
    const { boundGlobalActions } = this.props;
    this.getBillingDetail(orderNumber)
    boundGlobalActions.hideConfirm();
    this.setState({ isShowConfirmPage: false});
  }

  hideConfirmModal = () => {
    const { boundGlobalActions } = this.props;
    boundGlobalActions.hideConfirm();
    this.setState({ isShowConfirmPage: false});
  }

  render() {
    const { boundGlobalActions } = this.props;
    const  { orderNumber, radioValue, submitLoading, detailData, isShowConfirmPage} = this.state;
    const orderProps = {
      detailData
    };
    const paymentProps = {
      radioValue,
      handleChangePayment: this.handleChangePayment
    };

    const confirmModalProps = {
      boundGlobalActions,
      data: {
        message: t('CONTINUE_ORDER_WARN_TEXT'),
        close: this.hideConfirmModal,
        buttons: [
          {
            onClick: this.buttonClick,
            text: t('PAY_SUCCESS'),
            style: {
              backgroundColor: '#fff',
              color: '#222',
              border: '1px solid #222'
            }
          },
          {
            onClick: this.buttonClick,
            text: t('CONTINUE_PAY')
          }
        ]
      }
    };
    return (
      <div class="order-review">
        <div className="confirm-header">
          <label className="back-btn" onClick={this.onBack}>
            {`< ${t('BACK')}`}
          </label>
        </div>
        <OrderDetails {...orderProps} />
        <PaymentDetail {...paymentProps} />
        <div className="order-btn-wrapper">
          <div className="price-wrapper">
            <span className="label">总金额: </span>
            <span className="amount">¥{detailData.amount}</span>
          </div>
          <XButton
            className="order-btn"
            // isWithLoading={true}
            // isShowLoading={submitLoading}
            onClicked={this.onSubmit}
          >
            {'支付'}
          </XButton>
        </div>

        {
          isShowConfirmPage ? <ConfirmModal {...confirmModalProps} /> : null
        }
      </div>
    );
  }
}

export default BillingReview;
