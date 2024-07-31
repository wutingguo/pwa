import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import {
  PERMISSION_NAME_ENUM,
  saasProducts,
  LABS_TRIAL_MODAL
} from '@resource/lib/constants/strings';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CustomProductPage from '../../../components/CustomProductPage';
import CreateNewProject from '../../../components/en/CreateNewProject';
import { getQs } from '../../../utils/url';
import { showTrialModal } from '@resource/lib/utils/modal';
import './index.scss';

export default class Labs extends XPureComponent {
  constructor(props) {
    super(props);
    const tabIndex = getQs('tabs') == 1 ? 1 : 0;
    this.state = {
      tabIndex
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
    function changeTabState(that) {
      that.setState(
        {
          tabIndex
        },
        () => {
          history.replaceState(null, null, `labs?tabs=${tabIndex}`);
        }
      );
    }
    if (tabIndex === 1) {
      const { hasCapcility, isTrial } = this.checkLevel();
      // todo 临时方案: 新老用户无论处于什么状态（未订阅/Free Plan/Pro Plan/Premium Plan/Power Plan），都可以正常无限制的使用Export相关功能
      //  所以提醒升级订阅和提示弹窗不需要通过订阅状态出现
      const isShowTrialModal = false; //临时变量控制
      if (isShowTrialModal && !hasCapcility && isTrial) {
        const modalProps = {
          close: () => {
            changeTabState(this);
          },
          buttons: [
            {
              text: t('I_KNOW'),
              onClick: () => {
                changeTabState(this);
              }
            }
          ]
        };
        const canShowTrial = showTrialModal(
          modalProps,
          this.props.boundGlobalActions,
          LABS_TRIAL_MODAL,
          true
        );
        if (canShowTrial) return;
      }
      if (isShowTrialModal && !hasCapcility && !isTrial) {
        logEvent.addPageEvent({
          name: 'DesignerLabs_Click_Upgrade'
        });
        this.showUpdateModal();
        return;
      }
    }
    changeTabState(this);
  }

  componentDidMount() {
    // if (this.state.tabIndex === 1) {
    //   const { hasCapcility, isTrial } = this.checkLevel();
    //   if (!hasCapcility && !isTrial) {
    //     this.onTabChange(0);
    //   }
    // }
  }

  checkLevel() {
    const { mySubscription } = this.props;
    const items = mySubscription.get('items').toJS();
    let designerSubscription;
    designerSubscription = items.find(item => item.product_id === saasProducts.designer);
    let hasCapcility = false;
    let isTrial = false;
    if (designerSubscription) {
      if (designerSubscription) {
        const { plan_level, trial_plan_level } = designerSubscription;
        if (plan_level === 40) {
          hasCapcility = true;
        } else if (trial_plan_level > plan_level) {
          isTrial = true;
        }
      }
    }
    return {
      hasCapcility,
      isTrial
    };
  }

  toMake(e) {
    const { tabIndex } = this.state;
    function handleMakeClick(that) {
      if (tabIndex === 0) {
        that.getCreateNewProjectRef.handleMakeClick(e);
      } else {
        that.getCustomProductRef.current.handleMakcClick(e);
      }
    }
    if (tabIndex === 0) {
      handleMakeClick(this);
    } else if (tabIndex === 1) {
      // todo 临时方案: 新老用户无论处于什么状态（未订阅/Free Plan/Pro Plan/Premium Plan/Power Plan），都可以正常无限制的使用Export相关功能
      //  所以弹窗不需要出现
      const { hasCapcility, isTrial } = this.checkLevel();
      let isShowTrialModal = true;
      if (!isShowTrialModal && !isTrial) {
        logEvent.addPageEvent({
          name: 'DesignerLabs_Click_Upgrade'
        });
        this.showUpdateModal();
        return;
      }
      handleMakeClick(this);
    }
  }

  showUpdateModal = () => {
    const {
      boundGlobalActions: { showConfirm, hideConfirm }
    } = this.props;
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

            location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.designer}&right_name=${PERMISSION_NAME_ENUM.labs}`;
          }
        }
      ]
    };
    showConfirm(data);
  };

  render() {
    const { tabIndex } = this.state;
    const customProps = {
      ref: this.getCustomProductRef,
      ...this.props
    };
    const creatProps = {
      getInstance: childCp => {
        this.getCreateNewProjectRef = childCp;
      },
      ...this.props
    };
    return (
      <Fragment>
        <div className="my-labs-title">{t('CREATE_NEW_PROJECT')}</div>
        <div className="my-labs-container">
          <Tabs selectedIndex={tabIndex} onSelect={this.onTabChange}>
            <TabList>
              <Tab>{t('ZNO_LABS')}</Tab>
              <Tab>{t('CUSTOM_LABS')}</Tab>
              <div className="labs-container-btn" onClick={this.toMake}>
                {t('STARTS')}
              </div>
            </TabList>
            <TabPanel>
              <CreateNewProject {...creatProps} />
            </TabPanel>
            <TabPanel>
              <CustomProductPage {...customProps} />
            </TabPanel>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}
