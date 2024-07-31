import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as modalTypes from '@resource/lib/constants/modalTypes';
import { BASE_MODAL } from '@apps/gallery/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';
import CustomProductPage from '../../../components/CustomProductPage';
import CreateNewProject from '../../../components/CreateNewProject';
import { getQs } from '../../../utils/url';
import './index.scss';

export default class Labs extends XPureComponent {
  constructor(props) {
    super(props);
    const tabIndex = getQs('tabs') == 1 ? 1 : 0;
    console.log('tabIndex: ', tabIndex);
    this.state = {
      tabIndex,
      showCustomTip: false
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.toMake = this.toMake.bind(this);
    this.checkLevel = this.checkLevel.bind(this);
    this.getCustomProductRef = React.createRef();
  }

  onTabChange(tabIndex) {
    const logEventName =
      tabIndex === 1 ? 'CreatNewProject_Click_Labs' : 'CreatNewProject_Click_Supplier';
    logEvent.addPageEvent({
      name: logEventName
    });

    // if (tabIndex === 1 && !this.checkLevel()) {
    //   logEvent.addPageEvent({
    //     name: 'DesignerLabs_Click_Upgrade'
    //   });
    //   this.showUpdateModal();
    //   return false;
    // }
    this.setState(
      {
        tabIndex
      },
      () => {
        history.replaceState(null, null, `labs?tabs=${tabIndex}`);
      }
    );
  }

  // componentDidMount() {
  //   if (this.state.tabIndex === 1 && !this.checkLevel()) {
  //     this.onTabChange(0);
  //   }
  // }

  checkLevel() {
    const { mySubscription } = this.props;
    const items = mySubscription.get('items').toJS();
    let isLevel = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].product_id === saasProducts.designer && items[i].plan_level >= 30) {
        isLevel = true;
        break;
      }
    }
    return isLevel;
  }

  toMake(e) {
    const { tabIndex } = this.state;
    if (tabIndex === 0) {
      this.getCreateNewProjectRef.handleMakeClick(e);
    } else if (tabIndex === 1) {
      // if (this.checkLevel()) {
      this.getCustomProductRef.current.handleMakcClick(e);
      // } else {
      //   logEvent.addPageEvent({
      //     name: 'DesignerLabs_Click_Upgrade'
      //   });
      //   this.showUpdateModal();
      // }
    }
  }

  showUpdateModal = () => {
    const {
      boundGlobalActions: { showConfirm, hideConfirm },
      boundGlobalActions,
      urls
    } = this.props;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');

    const data = {
      message: t('UPGRADE_TO_USE_LABS_MSG'),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('UPGRADE'),
          className: 'pwa-btn',
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'DesignerLabs_Click_Upgrade'
            });
            boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
              product_id: saasProducts.designer,
              escapeClose: true,
              level: 30,
              cycle: 1,
              onClosed: () => {
                boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                boundGlobalActions.getMySubscription(saasBaseUrl);
              }
            });
          }
        }
      ]
    };
    showConfirm(data);
  };

  customTip = () => {
    this.setState({
      showCustomTip: !this.state.showCustomTip
    });
  };

  render() {
    const { tabIndex, showCustomTip } = this.state;
    const customProps = {
      ref: this.getCustomProductRef,
      ...this.props
    };
    const creatProps = {
      getInstance: childCp => {
        this.getCreateNewProjectRef = childCp;
      },
      checkLevel: this.checkLevel,
      showUpdateModal: this.showUpdateModal,
      ...this.props
    };
    return (
      <Fragment>
        <h2 className="page-title">设计软件{'>'}新建作品</h2>
        <div className="my-labs-container">
          <Tabs selectedIndex={tabIndex} onSelect={this.onTabChange}>
            <TabList>
              <Tab>厂商产品</Tab>
              <Tab>自定义厂商产品</Tab>
              <div className="labs-container-btn" onClick={this.toMake}>
                开始制作
              </div>
              {tabIndex === 1 ? (
                <div className="custom_standard_tip" onClick={this.customTip}>
                  自定义规格说明
                </div>
              ) : null}
            </TabList>
            <TabPanel>
              <CreateNewProject {...creatProps} />
            </TabPanel>
            <TabPanel>
              <CustomProductPage {...customProps} />
            </TabPanel>
          </Tabs>
          <div onClick={this.customTip} className={`tipImg ${showCustomTip ? 'show' : ''}`}>
            <img src="/clientassets-cunxin-saas/portal/images/pc/workspace/4@2x.jpg" />
          </div>
        </div>
      </Fragment>
    );
  }
}
