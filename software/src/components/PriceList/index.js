import classNames from 'classnames';
import qs from 'qs';
import React from 'react';

import XPackageListBox from '@resource/components/XPackageListBox';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { aiphotoDelicacyInfo } from '@resource/lib/constants/priceInfo';
import { aiphotoInfo, livePhotoInfo, saasProducts } from '@resource/lib/constants/strings';

import './index.scss';

const tabsList = [
  {
    text: '设计软件',
    product_id: saasProducts.designer,
  },
  {
    text: '选片软件',
    product_id: saasProducts.gallery,
  },
  {
    text: '照片直播',
    product_id: saasProducts.live,
  },
  {
    text: '智能修图',
    product_id: saasProducts.aiphoto,
    children: [
      {
        text: '快修',
        value: 0,
      },
      {
        text: '精修',
        value: 1,
      },
    ],
  },
  {
    text: '动感MV',
    product_id: saasProducts.slideshow,
  },

  // {
  //   text: '在线选品',
  //   product_id: saasProducts.selection
  // }
];

class Price extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      isShowModal: false,
      subTab: 0,
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { itemTab, subTab = 0 } = urlParams;
    if (itemTab) {
      this.setState({
        tab: +itemTab,
        subTab: Number(subTab),
      });
    }
    this.parseUrlParams();
  }

  setTab = tab => {
    this.setState({ tab });
  };

  parseUrlParams = () => {
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { combo_code, subTab = 0 } = urlParams;
    const isShowModal =
      urlParams && urlParams.hasOwnProperty('product_id') && urlParams.hasOwnProperty('cycle'); // &&
    // urlParams.hasOwnProperty('level');
    let liveParams;
    if (isShowModal) {
      const tab = tabsList.findIndex(item => item.product_id === urlParams.product_id);

      if (tab !== -1) {
        this.setTab(tab);
        this.setState({ subTab: Number(subTab) });
      }
      let findCurInfo = {};
      let level = urlParams.hasOwnProperty('level') ? Number(urlParams.level) : 0;
      if (urlParams.product_id === saasProducts.aiphoto) {
        findCurInfo =
          (Number(subTab) === 0 ? aiphotoInfo : aiphotoDelicacyInfo).find(
            item => item.comboCode === combo_code
          ) || {};
        // console.log('findCurInfo: ', findCurInfo);
        level = findCurInfo.plan_id;
      } else if (urlParams.product_id === saasProducts.live) {
        findCurInfo = livePhotoInfo.find(item => item.comboCode === combo_code);
        if (findCurInfo) {
          liveParams = {
            ...findCurInfo,
            combos: livePhotoInfo.slice(1),
          };
          level = findCurInfo.plan_id;
        }
      }
      if (findCurInfo?.logEventName) {
        logEvent.addPageEvent({
          name: findCurInfo.logEventName,
        });
      }
      boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
        product_id: urlParams.product_id,
        aiphotoParams: {
          ...findCurInfo,
          // combos: Number(subTab) === 0 ? aiphotoInfo.slice(1) : aiphotoDelicacyInfo.filter(item=>item.id !== 25 && item.id !== 26),
          combos: Number(subTab) === 0 ? aiphotoInfo.slice(1) : aiphotoDelicacyInfo,
          subTab: Number(subTab),
        },
        liveParams,
        level,
        cycle: Number(urlParams.cycle),
        escapeClose: true,
        onClosed: () => {
          boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
          boundGlobalActions.getMySubscription(saasBaseUrl);
        },
      });
    }
  };

  buyNow = () => {
    const imgUrl = '/clientassets-cunxin-saas/portal/images/pc/live/qrCode.png';
    this.setState({
      modal: true,
      modalContent: <img src={imgUrl} />,
    });
  };

  closeModal = () => {
    this.setState({
      modal: false,
      modalContent: null,
    });
  };
  handleSubMenu = subTab => {
    const { logEventName } = tabsList[3];
    this.setTab(3, logEventName);
    this.setState({
      subTab,
    });
  };
  render() {
    const { userInfo, urls, mySubscription, planList, boundGlobalActions } = this.props;
    const { tab, modal, modalContent, subTab } = this.state;
    // console.log('planList: ', planList.toJS());
    const liveInfoArr = planList.get(saasProducts.live)?.toJS();
    const liveInfo = liveInfoArr?.map(item => ({ ...item, isSubscribe: true })) || [];
    const packageListProps = {
      boundGlobalActions,
      product_id: tabsList[tab].product_id,
      userInfo: userInfo.toJS(),
      mySubscription: mySubscription.toJS(),
      planList: {
        ...planList.toJS(),
        [saasProducts.aiphoto]: subTab === 0 ? aiphotoInfo : aiphotoDelicacyInfo,
        [saasProducts.live]: [...livePhotoInfo, ...liveInfo],
      },
      saasBaseUrl: urls.toJS()['saasBaseUrl'],
      urls: urls.toJS(),
      buyNow: this.buyNow,
      subTab,
    };
    return (
      <div className="package-container-pwa">
        <div className="package-tabs">
          {tabsList.map((item, index) => {
            return (
              <div className="tab_menu">
                <div
                  className={classNames('tab-item', { active: index === tab && !item.children })}
                  key={item.product_id}
                  onClick={() => this.setTab(index)}
                >
                  <span>{item.text}</span>
                </div>
                {item.children && tab === index ? (
                  <div className="sub_menu">
                    {item.children.map(child => (
                      <div
                        onClick={() => this.handleSubMenu(child.value)}
                        className={classNames('sub_menu_item', { active: subTab === child.value })}
                      >
                        {child.text}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <XPackageListBox {...packageListProps} />
        {modal && (
          <div className="modalWrapper" onClick={this.closeModal}>
            {modalContent}
          </div>
        )}
      </div>
    );
  }
}

export default Price;
