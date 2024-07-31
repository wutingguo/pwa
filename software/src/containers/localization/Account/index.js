import { get } from 'lodash';
import React, { Fragment } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import AccountInfo from '../../../components/AccountInfo';
import PayInfo from '../../../components/PayInfo';
import PriceList from '../../../components/PriceList';
import StudioInfo from '../../../components/StudioInfo';
import { getQs } from '../../../utils/url';
import MySubscription from '../MySubscription';

import './index.scss';

const getTabIndex = () => {
  let tab = getQs('tabs');
  const productId = getQs('product_id');
  //硬编码逻辑，后续优化：外部进来购买套餐的一律重定位到价格表
  if (productId) {
    tab = 4
  }
  return parseInt(tab) || 0;
}

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    const tabIndex = getTabIndex();

    this.state = {
      tabIndex,
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const newTabIndex = getTabIndex();
    const { tabIndex } = state;
    if (newTabIndex !== tabIndex) {
      return {
        ...state,
        tabIndex: newTabIndex,
      };
    }
    return null;
  }

  onTabChange(tabIndex) {
    const eventNames = [
      'MyStuff_Click_MyAccount',
      'MyStuff_Click_MyInfoSetting',
      '',
      'MyStuff_Click_MySubscription',
      'MyStuff_Click_Price',
    ];
    window.logEvent.addPageEvent({
      name: eventNames[tabIndex],
    });
    this.setState(
      {
        tabIndex,
      },
      () => {
        history.replaceState(null, null, `account?tabs=${tabIndex}`);
      }
    );
  }

  render() {
    const { tabIndex } = this.state;
    const { baseUrl, userInfo, urls, boundGlobalActions, studioInfo } =
      this.props;
    const sccountInfoProps = {
      baseUrl,
      userInfo,
      boundGlobalActions,
    };
    const studioInfoProps = {
      studioList: studioInfo.get('studioList'),
      boundGlobalActions,
      userInfo,
      urls,
      navbarDispatch: get(this.props, '$global.stores.navbar.dispatch'),
    };
    const PayInfoProps = {
      baseUrl,
      boundGlobalActions,
      userInfo,
    };
    return (
      <Fragment>
        <div className="account-container">
          <Tabs selectedIndex={tabIndex} onSelect={this.onTabChange}>
            <TabList>
              <Tab>账号管理</Tab>
              <Tab>资料设置</Tab>
              <Tab>支付管理</Tab>
              <Tab>订阅信息</Tab>
              <Tab>版本定价</Tab>
              {/* <Tab>推荐有礼</Tab> */}
            </TabList>
            <TabPanel>
              <AccountInfo {...sccountInfoProps} />
            </TabPanel>
            <TabPanel>
              <StudioInfo {...studioInfoProps} />
            </TabPanel>
            <TabPanel>
              {/* <div>敬请期待……</div> */}
              <PayInfo {...PayInfoProps} />
            </TabPanel>
            <TabPanel>
              <MySubscription {...this.props} />
            </TabPanel>
            <TabPanel>
              <PriceList {...this.props} />
            </TabPanel>
            {/* <TabPanel>
              <Recommend {...this.props} />
            </TabPanel> */}
          </Tabs>
        </div>
      </Fragment>
    );
  }
}
