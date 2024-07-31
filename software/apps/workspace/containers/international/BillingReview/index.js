import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';

// 公共方法
import { getCountryCode } from '@resource/lib/utils/currency';
import { getSearchObj } from '@resource/lib/utils/url';
import { fetchCurData } from '@resource/websiteCommon/utils/stringVariables';
import mapState from '@src/redux/selector/mapState';
import mapDispatch from '@src/redux/selector/mapDispatch';

// 公共组件
import XLoading from '@resource/components/XLoading';
import XButton from '@resource/websiteCommon/components/dom/XButton';

// 自定义组件
import Table from './components/Table';
import XBack from '@src/components/Back';
import PaymentDetail from './components/PaymentDetail';

// 自定义方法
import * as service from './Service';
import { creditColumns, costInfoColumns, getCostData } from './components/Config';

// 样式
import './index.scss';
import { fromJS } from 'immutable';

let isSubmiting = false;
@connect(mapState, mapDispatch)
export default class BillingReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creditListloading: true,
      // detailLoading: true,
      submitLoading: false,
      creditCardList: [],
      hasHistoryCredit: false,
      useNewCredit: false, // true 表示使用新增信用卡，false 表示使用已有信用卡
      checkedCreditCode: '',
      userInfo: {}
    };
    this.getCreditCardList = this.getCreditCardList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // 获取URL中的参数
    this.urlObj = getSearchObj();
  }

  componentDidMount() {
    // 获取信用卡列表
    this.getCreditCardList();
    // 获取ds订单信息
    this.getDesignServiceOrderDetails();

    fetchCurData(() => {
      this.forceUpdate.bind(this);
    });
  }

  getDesignServiceOrderDetails = async () => {
    const { designService, boundProjectActions, urls } = this.props;
    let serviceOrderId = designService.get('serviceOrderId');
    if (serviceOrderId <= 0) {
      serviceOrderId = this.urlObj.service_order_id;
      const saasBaseUrl = urls.get('saasBaseUrl');
      const { isRequestSuccess, data = {} } = await boundProjectActions.getConfirmInfo({
        saasBaseUrl,
        serviceOrderId
      });
      const { originData = {} } = data || {};
      const initData = isRequestSuccess ? originData : {};
      boundProjectActions.initDsState(initData);
    }
  };

  showNotification = msg => {
    this.props.boundGlobalActions.addNotification({
      message: msg || t('SERVICE_ERROR_UNKNOWN'),
      level: 'success',
      // uid: notificationTypes.SAVE_FAILED,
      autoDismiss: 2
    });
  };

  // 获取信用卡列表
  async getCreditCardList() {
    const { ret_code, data } = await service.getCreditCardList();
    let state = { creditListloading: false };
    if (ret_code == 200000 && Array.isArray(data) && data.length) {
      state = {
        ...state,
        creditCardList: data,
        hasHistoryCredit: !!data.length,
        checkedCreditCode: data[0].check_code
      };
    }
    this.setState(state);
  }

  handleUseNewCredit = () => {
    this.setState(({ useNewCredit }) => ({
      useNewCredit: !useNewCredit
    }));
  };

  changeCredit = item => {
    this.setState({
      checkedCreditCode: item.check_code
    });
  };

  async onSubmit() {
    // 添加埋点
    window.logEvent.addPageEvent({
      name: 'DSBillingReview_Click_PlaceOrder'
    });

    const { history, boundProjectActions, urls } = this.props;

    const { submitLoading, hasHistoryCredit, useNewCredit, checkedCreditCode } = this.state;
    let params = {
      service_order_id: this.urlObj.service_order_id,
      payment_gateway: 'BRAINTREE',
      payment_channel: 'credit card',
      save_card: true,
      dsBaseUrl: urls.get('saasBaseUrl')
    };
    if (isSubmiting || submitLoading) {
      return;
    }

    if (hasHistoryCredit && !useNewCredit) {
      params.check_code = checkedCreditCode;
      params.save_card = false;
    } else {
      try {
        const { nonce, checked } = await this.newCreditRef.onSubmit();
        params.card_nonce = nonce;
        params.save_card = checked;
      } catch (error) {
        this.showNotification();
      }
    }
    // 发起提交请求
    this.setState({ submitLoading: true });
    isSubmiting = true;
    try {
      let { isRequestSuccess, data } = (await boundProjectActions.submitOrder(params)) || {};
      data = data || {};
      if (isRequestSuccess) {
        history.replace(
          `/software/designer/ds-order-confirm?service_order_id=${this.urlObj.service_order_id}`
        );
      } else {
        isSubmiting = false;
        this.setState({ submitLoading: false });
      }
    } catch (error) {
      this.showNotification();
    }
  }

  handleBack = () => {
    const { history } = this.props;
    history.push(`/software/designer/ds-order-form`);
    return true;
  };

  render() {
    const {
      creditListloading,
      // detailLoading,
      submitLoading,
      creditCardList,
      hasHistoryCredit,
      useNewCredit,
      checkedCreditCode
    } = this.state;

    const loading = creditListloading;
    let paymentRightText;

    if (hasHistoryCredit) {
      // 判断有没有绑定过信用卡，条件待补充
      paymentRightText = useNewCredit ? t('USE_REMEMBERED_CARD') : t('USE_NEW_CC');
    }

    const countryCode = getCountryCode();

    const paymentProps = {
      useNewCredit: !hasHistoryCredit || useNewCredit,
      titleProps: {
        title: t('PAYMENT_DETAIL'),
        rightText: paymentRightText,
        rightClick: this.handleUseNewCredit
      },
      newCreditRef: node => (this.newCreditRef = node),
      // detailLoading,
      creditListProps: {
        className: 'credit-table',
        dataSource: creditCardList,
        columns: creditColumns({
          checked: checkedCreditCode,
          onChange: this.changeCredit
        }),
        showHeader: false,
        rowKey: 'card_number'
      }
    };

    const { designService } = this.props;
    const priceCount = designService.get('priceCount');
    const { currencyCode, currencySymbol } = priceCount || {};
    const hasPoints = designService.get('hasPoints');
    const orderAmount = {
      item_total: priceCount.totalPaymentMmount,
      applied_credits: priceCount.appliedCredit,
      payable_amount: priceCount.realPaymentAmount
    };
    const currency = { code: currencyCode, symbol: currencySymbol };
    const costData = getCostData(orderAmount, currency, countryCode, hasPoints);

    return (
      <Fragment>
        {loading ? <XLoading isShown={loading} backgroundColor="rgba(255,255,255,0.6)" /> : null}
        <div className="billing-review">
          <XBack className="mb50" callback={this.handleBack} />
          <PaymentDetail {...paymentProps} />
          <div className="cost-info-table-wrapper">
            <Table
              className="cost-info-table"
              columns={costInfoColumns}
              dataSource={costData}
              showHeader={false}
            />
          </div>
          <div className="order-btn-wrapper">
            <XButton
              className="order-btn"
              isWithLoading={true}
              isShowLoading={submitLoading}
              onClicked={this.onSubmit}
            >
              {t('PLACE_ORDER')}
            </XButton>
          </div>
        </div>
      </Fragment>
    );
  }
}
