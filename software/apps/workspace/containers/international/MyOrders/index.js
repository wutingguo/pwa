import React, { Component } from 'react';
import { GET_ORDER_LIST, GET_CHILD_ACOUNNTS } from '../../../constants/apiUrl';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { template } from 'lodash';
import { getQueryStringObj, buildUrlParmas } from '../../../utils/url';

import LoadingImg from '@common/components/LoadingImg';
import XPagePagination from '@resource/components/XPagePagination';
import OrderList from '../../../components/en/OrderList';
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
      showAlert: false
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.loadOrderData = this.loadOrderData.bind(this);
    this.getOrderList = this.getOrderList.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.getChildAccounts = this.getChildAccounts.bind(this);
    this.onAccountChange = this.onAccountChange.bind(this);
    this.getWWWorigin = this.getWWWorigin.bind(this);
  }

  getWWWorigin() {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl
  }

  getChildAccounts() {
    const url = template(GET_CHILD_ACOUNNTS)({ baseUrl: this.getWWWorigin() });
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
        accountList.unshift({ value: '', label: 'Show All Orders' });
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

    window.onpopstate = this.handlePopState;

    this.loadOrderData(Number(page));
    this.getChildAccounts();

    if (errorCode && errorCode === '101') {
      this.setState({
        showAlert: true
      });
    }
  }

  componentWillUnmount() {
    window.onpopstate = null;
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
    this.setState({
      paginationInfo: {
        currentPage: 0,
        totalPage: 0
      }
    });

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
          const { currentPage } = paginationInfo;
          const params = {
            page: currentPage,
            subCustomerList: data.value
          };
          this.updateUrl(params);
          this.loadOrderData(currentPage, data.value);
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
      const url = template(GET_ORDER_LIST)(params);
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
    history.replaceState(
      null,
      null,
      location.search.replace(/errorCode\=101&?/gi, '')
    );
  }

  toShoppingCart = () => {
    logEvent.addPageEvent({
      name: 'DesignerOrders_ClickCart'
    });

    window.location.href = '/shopping-cart.html?from=saas';
  }

  render() {
    const {
      orderViewList,
      paginationInfo,
      isDataLoaded,
      showAlert,
      accountList,
      selectedAccount
    } = this.state;
    const { totalPage, currentPage } = paginationInfo;
    const isPannlerPlan = this.props.userInfo.get('isPlannerPlan') || false;
    const totalNmuber = this.props.userInfo.get('totalNmuber');
    const isShowAccount = isPannlerPlan && accountList.length;

    const orderListProps = {
      getWWWorigin: this.getWWWorigin,
      orderViewList,
      isShowAccount,
      ...this.props
    }

    return (
      <div className="my-orders-container">
        <div className="orders-header">
          <div className="title">My Orders</div>
          <div className="btn" onClick={this.toShoppingCart}>
            <img src={shoppingIcon} />Cart
            {totalNmuber && totalNmuber > 0 ? `(${totalNmuber})` : ''}
          </div>
        </div>
        <div className="my-orders">
          {totalPage > 1 ? (
            <div className="pagination-container">
              <XPagePagination
                currentPage={currentPage}
                totalPage={totalPage}
                changeFilter={this.changeFilter}
              />
            </div>
          ) : null}

          {isDataLoaded ? (
            orderViewList && orderViewList.length ? (
              <OrderList {...orderListProps} />
            ) : (
              <div className="empty-div">
                <div className="empty">{t('NO_ORDERS')}</div>
                <div className="empty-detail">{t('YOU_DONT_HAVE_ORDER_YET')}</div>
              </div>
            )
          ) : (
            <LoadingImg />
          )}

          {totalPage > 1 ? (
            <div className="pagination-container">
              <XPagePagination
                currentPage={currentPage}
                totalPage={totalPage}
                changeFilter={this.changeFilter}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
