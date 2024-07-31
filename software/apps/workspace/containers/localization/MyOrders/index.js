import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { template } from '../../../utils/template';
import { GET_CHILD_ACOUNNTS, GET_ORDER_LIST_CN } from '../../../constants/apiUrl';
import { getQueryStringObj, buildUrlParmas } from '../../../utils/url';
import XPagePagination from '@resource/components/XPagePagination';

import LoadingImg from '@common/components/LoadingImg';
import AlertModal from '../../../components/AlertModal';
import OrderList from '../../../components/OrderList';
import DatePicker from '../../../components/DatePicker';
import { format } from '../../../utils/date';
import './index.scss';
import shoppingIcon from '../../../components/ProjectListItem/icons/shopping.png';

export default class MyOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderViewList: null,
      accountList: [],
      selectedAccount: null,
      paginationInfo: {
        currentPage: 0,
        totalPage: 0
      },
      isDataLoaded: false,
      showAlert: false,
      isShowDateRangePicker: false,
      isShowDownloadView: false,
      isShowDownloadDate: false,
      selectedDownloadDate: '',
      downloadStartTime: '',
      downloadEndTime: '',
      isSelectCurrentMonth: true,
      isSelectThreeMonth: false,
      showDownloadView: false,
      startTime: '2019-1-1',
      endTime: '2019-5-30'
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.loadOrderData = this.loadOrderData.bind(this);
    this.getOrderList = this.getOrderList.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.getChildAccounts = this.getChildAccounts.bind(this);
    this.onAccountChange = this.onAccountChange.bind(this);
    this.downloadDateSelect = this.downloadDateSelect.bind(this);
    this.clickShowDownloadView = this.clickShowDownloadView.bind(this);
    this.clickCurrentMonth = this.clickCurrentMonth.bind(this);
    this.clickThreeMonth = this.clickThreeMonth.bind(this);
    this.closeDownloadView = this.closeDownloadView.bind(this);
    this.download = this.download.bind(this);
    this.clickDownload = this.clickDownload.bind(this);
    this.getWWWorigin = this.getWWWorigin.bind(this);
    this.toShoppingCart = this.toShoppingCart.bind(this);
  }

  getWWWorigin() {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl;
  }

  getChildAccounts() {
    const url = template(GET_CHILD_ACOUNNTS, { baseUrl: this.getWWWorigin() });
    xhr.get(url).then(res => {
      if (res && res.data && res.data.length) {
        const childAccountList = res.data;
        const accountList = childAccountList.map(item => {
          const { name, customerId } = item;
          return {
            label: name,
            value: customerId
          };
        });
        accountList.unshift({ value: '', label: '显示所有订单' });
        const selectedAccount = accountList[0];
        this.setState({
          accountList,
          selectedAccount
        });
      }
    });
  }

  onAccountChange(account) {
    const { selectedAccount, isDataLoaded } = this.state;
    // 如果正在加载项目，不响应切换。
    if (!isDataLoaded) return;
    // 如果切换前后的值相等，不响应切换
    if (selectedAccount && selectedAccount.value === account.value) return;
    this.setState(
      {
        selectedAccount: account
      },
      () => {
        this.changeFilter({
          keyName: 'account',
          value: account.value
        });
      }
    );
  }

  componentDidMount() {
    const qs = getQueryStringObj();
    const { page = 1, errorCode, orderUid } = qs;

    this.loadOrderData(Number(page));
    // this.getChildAccounts();

    if (errorCode && errorCode === '101') {
      logEvent.addPageEvent({
        name: 'YX_PC_Order_CancelDebossingFailed',
        orderId: orderUid
      });
      this.setState({
        showAlert: true
      });
    }

    const now = new Date();
    let before = new Date();
    before.setMonth(before.getMonth() - 3);
    this.setState({
      startTime: format(before),
      endTime: format(now),
      downloadEndTime: format(now),
      downloadStartTime: `${now.getFullYear()}-${now.getMonth() + 1}-1`
    });
  }

  handlePopState() {
    const qs = getQueryStringObj();
    const { page } = qs;
    this.setState(
      {
        isDataLoaded: false
      },
      () => {
        this.loadOrderData({ page });
      }
    );
  }

  changeFilter(data) {
    this.setState(
      {
        isDataLoaded: false
      },
      () => {
        if (data.keyName === 'currentPage') {
          const params = {
            page: data.value
          };
          this.updateUrl(params);
          this.loadOrderData(data.value);
        } else {
          const { paginationInfo } = this.state;
          // 切换账号时, page 从第一页开始获取
          // const { currentPage } = paginationInfo;
          const params = {
            page: 1,
            subCustomerList: data.value
          };
          this.updateUrl(params);
          this.loadOrderData(1, data.value);
        }
      }
    );
  }

  updateUrl(ops) {
    const params = buildUrlParmas(ops);
    history.pushState(null, null, params);
  }

  loadOrderData(page = 1, subCustomerList = '') {
    const params = {
      baseUrl: this.getWWWorigin(),
      page,
      subCustomerList
    };
    this.getOrderList(params)
      .then(orderData => {
        const { totalPage, currentPage, orderViewList } = orderData;
        this.setState({
          orderViewList,
          paginationInfo: {
            currentPage,
            totalPage
          },
          isDataLoaded: true
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isDataLoaded: false
        });
      });
  }

  getOrderList(params) {
    return new Promise((resolve, reject) => {
      const url = template(GET_ORDER_LIST_CN, params);
      xhr.get(url).then(result => {
        const { success, data } = result;
        if (success) {
          return resolve(data);
        }
        return reject();
      });
    });
  }

  handleAlertClose() {
    this.setState({
      showAlert: false
    });
    history.replaceState(null, null, location.search.replace(/errorCode\=101&?/gi, ''));
  }

  clickDownload() {
    this.setState({
      isShowDownloadView: true
    });
  }

  closeDownloadView() {
    this.setState({
      isShowDownloadView: false
    });
  }

  hideDatePicker() {
    if (this.state.isShowDateRangePicker) {
      this.setState({
        isShowDateRangePicker: false
      });
    }
  }

  handleSelectStartTime(item) {
    this.setState({
      startTime: format(item.dateTime)
    });
  }

  handleSelectEndTime(item) {
    this.setState({
      endTime: format(item.dateTime)
    });
  }

  clickThreeMonth() {
    const before = new Date();
    const now = new Date();
    before.setMonth(before.getMonth() - 3);
    this.setState({
      isSelectThreeMonth: true,
      isSelectCurrentMonth: false,
      downloadEndTime: format(now),
      downloadStartTime: `${before.getFullYear()}-${before.getMonth() + 1}-${before.getDate()}`
    });
  }

  clickCurrentMonth() {
    const now = new Date();
    this.setState({
      isSelectThreeMonth: false,
      isSelectCurrentMonth: true,
      downloadEndTime: format(now),
      downloadStartTime: `${now.getFullYear()}-${now.getMonth() + 1}-1`
    });
  }

  download() {
    const startTime = this.state.downloadStartTime + ' 00:00:00';
    const endTime = this.state.downloadEndTime + ' 23:59:59';
    window.location.href =
      this.props.baseUrl +
      '/web-api/credit/downloadStatements?startTime=' +
      startTime +
      '&endTime=' +
      endTime;
  }

  clickShowDownloadView(date, type) {
    this.setState({
      isShowDownloadDate: true,
      selectedDownloadDate: date,
      currentDownloadDateType: type
    });
  }
  downloadDateSelect(item) {
    if (this.state.currentDownloadDateType === 'start') {
      this.setState({
        downloadStartTime: format(item.dateTime),
        isShowDownloadDate: false,
        isSelectCurrentMonth: false,
        isSelectThreeMonth: false
      });
    }

    if (this.state.currentDownloadDateType === 'end') {
      this.setState({
        downloadEndTime: format(item.dateTime),
        isShowDownloadDate: false,
        isSelectCurrentMonth: false,
        isSelectThreeMonth: false
      });
    }
  }

  toShoppingCart() {
    logEvent.addPageEvent({
      name: 'Designer_Click_YXCart'
    });
    this.props.history.push('/software/shopping-cart');
  }

  render() {
    const {
      orderViewList,
      paginationInfo,
      isDataLoaded,
      showAlert,
      accountList,
      selectedAccount,
      isShowDownloadView,
      downloadEndTime,
      downloadStartTime,
      isSelectCurrentMonth,
      isSelectThreeMonth,
      isShowDownloadDate,
      selectedDownloadDate
    } = this.state;
    const { totalPage, currentPage } = paginationInfo;
    const isPannlerPlan = this.props.userInfo.get('isPlannerPlan') || false;
    const isShowAccount = isPannlerPlan && accountList.length;

    const alerModalProps = {
      html: '该订单包含特殊商品不支持自主取消，<br />请联系客服协助您',
      btnText: '我知道了',
      actions: {
        handleClose: this.handleAlertClose,
        handleOk: this.handleAlertClose
      }
    };

    const downloadStartTimeObj = new Date(downloadStartTime);
    const downloadEndTimeObj = new Date(downloadEndTime);

    const currentMonthClass = classNames('type-button', { selected: isSelectCurrentMonth });
    const threeMonthClass = classNames('type-button', { selected: isSelectThreeMonth });
    const closeIconSrc =
      this.props.baseUrl + '/clientassets/portal/v2/images/pc/maker-plan/close.svg';
    const totalNmuber = this.props.userInfo.get('totalNmuber');
    return (
      <div className="my-orders-container">
        <div className="orders-header">
          <div className="title">设计软件{'>'}影像订单</div>
          <div className="btn" onClick={this.toShoppingCart}>
            <img src={shoppingIcon} />
            购物车
            {totalNmuber && totalNmuber > 0 ? `(${totalNmuber})` : ''}
          </div>
        </div>
        <div className="download-button">
          <div className="btn" onClick={this.clickDownload}>
            下载对账单
          </div>
        </div>
        <div className="orders-content">
          <div className="my-orders">
            {isShowAccount ? (
              <div className="filter-container">
                <div className="group-item">
                  <div className="select-label">筛选</div>
                  <div className="select-container">
                    <XSelect
                      searchable={false}
                      options={accountList}
                      value={selectedAccount}
                      onChanged={this.onAccountChange}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {isDataLoaded ? (
              orderViewList && orderViewList.length ? (
                <OrderList
                  getWWWorigin={this.getWWWorigin}
                  orderViewList={orderViewList}
                  isShowAccount={isShowAccount}
                  {...this.props}
                />
              ) : (
                <div className="empty">暂时没有订单</div>
              )
            ) : (
              <LoadingImg />
            )}

            {totalPage > 1 ? (
              <div className="pagination-container">
                <XPagePagination
                  changeFilter={this.changeFilter}
                  currentPage={currentPage}
                  totalPage={totalPage}
                />
              </div>
            ) : null}

            {showAlert ? <AlertModal {...alerModalProps} /> : null}
          </div>
        </div>
        {isShowDownloadView ? (
          <div className="download-model">
            <div className="close-container" onClick={this.closeDownloadView}></div>
            <div className="download-container">
              <img className="close-icon dib" src={closeIconSrc} onClick={this.closeDownloadView} />
              <div className="title">下载对账单</div>
              <div className="date-type-select">
                <span>时间跨度: </span>
                <span className={currentMonthClass} onClick={this.clickCurrentMonth}>
                  本月账单
                </span>
                <span className={threeMonthClass} onClick={this.clickThreeMonth}>
                  3个月的账单
                </span>
              </div>
              <div className="start-time">
                <span>起始日期: </span>
                <span
                  className="start-time-button"
                  onClick={this.clickShowDownloadView.bind(this, downloadStartTime, 'start')}
                >
                  {`${downloadStartTimeObj.getFullYear()}年${downloadStartTimeObj.getMonth() +
                    1}月${downloadStartTimeObj.getDate()}号 >`}
                </span>
              </div>

              <div className="end-time">
                <span>结束日期: </span>
                <span
                  className="end-time-button"
                  onClick={this.clickShowDownloadView.bind(this, downloadEndTime, 'end')}
                >
                  {`${downloadEndTimeObj.getFullYear()}年${downloadEndTimeObj.getMonth() +
                    1}月${downloadEndTimeObj.getDate()}号 >`}
                </span>
              </div>

              {isShowDownloadDate ? (
                <div className="data-picker">
                  <DatePicker selected={selectedDownloadDate} onSelect={this.downloadDateSelect} />
                </div>
              ) : null}

              <div className="download-button2" onClick={this.download}>
                确定下载
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
