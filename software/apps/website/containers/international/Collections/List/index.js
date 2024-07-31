import { List, Map, is } from 'immutable';
import React from 'react';

import UpgradeInfo from '@resource/components/UpgradeInfo';

import equals from '@resource/lib/utils/compare';

import { productBundles, saasProducts } from '@resource/lib/constants/strings';

import { EmptyContent, XCardList, XIcon, XPureComponent } from '@common/components';

import { CREATE_MODAL, WEBSITE_TEMPLATE_MODAL } from '@apps/website/constants/modalTypes';

import CardList from '../../../../components/CardList';

import mainHandler from './handle/main';

import './index.scss';

class CollectionList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRequestCompleted: false,
      websiteList: null,
    };
  }

  handleCreate = () => mainHandler.handleCreate(this);
  handleEdit = item => mainHandler.handleEdit(this, item);
  handlePublish = item => mainHandler.handlePublish(this, item);

  componentDidMount() {
    //  window.logEvent.addPageEvent({
    //   name: 'GalleryCollection'
    // });
    const { boundProjectActions } = this.props;
    const { getWebsiteList } = boundProjectActions;

    window.addEventListener('message', this.onMessage);
    getWebsiteList()
      .then(res => {
        const list = res.data.reverse();
        this.setState({
          websiteList: list,
          isRequestCompleted: true,
        });
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  }

  componentWillReceiveProps(nextProps) {
    const { boundGlobalActions } = this.props;
    const { addNotification } = boundGlobalActions;
    const isEqual = equals(nextProps.storageStatus, this.props.storageStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage = event => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    if (event.data.type === 'CLOSE_WEBSITE_THEME_MODAL') {
      boundGlobalActions.hideModal(WEBSITE_TEMPLATE_MODAL);
    }
  };
  //打开  弹窗表格
  openTablePriceModal = () => {
    const { boundProjectActions, boundGlobalActions } = this.props;
    let data = {
      tableTitle: 'Website Plan Comparison',
      product_id: saasProducts.website,
    };
    boundGlobalActions
      .getTablePriceList({ product_id: saasProducts.website })
      .then(res => {
        if (res.ret_code === 200000) {
          data.priceData = res.data;
          mainHandler.openTablePriceModal(this, data);
        }
        this.setState({ isRequestCompleted: true });
      })
      .catch(err => this.setState({ isRequestCompleted: true }));
  };

  renderUpgradeInfo = () => {
    const { mySubscription } = this.props;
    const { activityInformation, statusAndHistory } = mySubscription.toJS();
    if (!activityInformation || !statusAndHistory) return;
    const information = activityInformation.find(i => i.product_id === saasProducts.website);
    let showUpgrade = false;
    const { activity_desc, code, code_status, expired_time_display } = information || {};
    const { fee_current, fee_history } = statusAndHistory || {};
    if (fee_current) {
      showUpgrade = !fee_current.SAAS_WEBSITE;
      productBundles.forEach(item => {
        if (fee_current[item.productId]) {
          const productsInBundle = item.included;
          const isSubscribed = productsInBundle.find(
            prod => prod.productId === saasProducts.website
          );
          showUpgrade = !isSubscribed;
        }
      });
    }
    let showCode = false;
    if (code && fee_current) {
      showCode = code_status === 0 && !fee_history.SAAS_WEBSITE;
    }
    const param = {
      id: saasProducts.website,
      showUpgrade,
      text: 'Upgrade to Website Paid Plans for advanced features such as Use Custom Domain, Modify Font Pack or Color Palette and',
      url: '/saascheckout.html?level=30&cycle=1&product_id=SAAS_WEBSITE',
      eventName: 'websiteUpgradeBanner_Click_Upgrade',
      showCode,
      code,
      expired_time: expired_time_display,
      codeDesc: `${activity_desc}, Ends`,
      onClick: id => {
        this.openTablePriceModal();
      },
    };

    return <UpgradeInfo {...param} />;
  };

  render() {
    const { websiteList, isRequestCompleted } = this.state;
    const { collectionList = List([]), urls = Map({}), history } = this.props;
    const cardListProps = {
      items: websiteList,
      galleryBaseUrl: urls.get('galleryBaseUrl'),
      handleEdit: this.handleEdit,
      handlePublish: this.handlePublish,
    };

    return (
      <div className="collections-list">
        {this.renderUpgradeInfo()}
        <div className="collection-header">
          <span className="collection-label">{t('WEBSITE')}</span>
          {!websiteList ||
            (websiteList.length < 1 && (
              <div className="collection-btns">
                <XIcon
                  type="add"
                  iconWidth={12}
                  iconHeight={12}
                  theme="black"
                  title={t('NEW_WEBSITE')}
                  text={t('NEW_WEBSITE')}
                  onClick={this.handleCreate}
                />
              </div>
            ))}
        </div>
        <div className="collection-container">
          {websiteList && websiteList.length ? (
            <CardList {...cardListProps} />
          ) : (
            isRequestCompleted && (
              <div className="collection-btns empty-btn">
                <XIcon
                  type="add"
                  iconWidth={12}
                  iconHeight={12}
                  theme="black"
                  title={t('NEW_WEBSITE')}
                  text={t('NEW_WEBSITE')}
                  onClick={this.handleCreate}
                />
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default CollectionList;
