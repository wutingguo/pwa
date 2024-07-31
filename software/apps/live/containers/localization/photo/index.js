import Tooltip from 'rc-tooltip';
import React from 'react';

import XButton from '@resource/components/XButton';
import XLoading from '@resource/components/XLoading';
import XPagePagination from '@resource/components/XPagePagination';
import XPureComponent from '@resource/components/XPureComponent';

import { getCustomerDeliveryList } from '@resource/pwa/services/subscription';

import addPNG from '@resource/static/icons/btnIcon/add-1.png';
import helpPNG from '@resource/static/icons/btnIcon/help.png';
import emptyPNG from '@resource/static/icons/empty.png';

import { IntlText, combinLanguage } from '@common/components/InternationalLanguage';

import { createMessage } from '@common/hooks/useMessage';

import FInput from '@apps/live/components/FInput';
import FreeNotify from '@apps/live/components/FreeNotify';
import Phone from '@apps/live/components/Icons/IconPhone';
import IconSearch from '@apps/live/components/Icons/IconSearch';
import LiveItemCard from '@apps/live/components/liveItemCard';
import { openPayCard } from '@apps/live/utils/index';

import liveServices from '../../../services';

import instant_down from './images/instant-download.png';
import down from './images/live-photo-download.png';

import './index.scss';

class Photo extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liveList: [],
      loading: true,
      pageSize: 6,
      total: 0,
      currentPage: 1,
      album_name: '',
    };
  }

  componentDidMount() {
    const { intl } = this.props;
    this.getAlbums();
    intl.lang === 'cn' && this.getcoupon();
    intl.lang === 'cn' && this.getcoupon('MEITU_EDIT_IMAGE');
    intl.lang === 'cn' && this.giftFree(); // 精修免费版
  }
  // 获取优惠劵
  getcoupon = (moduleCode = 'ALBUM_LIVE') => {
    const { urls } = this.props;
    const baseUrl = urls.get('saasBaseUrl');
    const params = {
      moduleCode,
      // businessLine: 'YX_SAAS',
      baseUrl,
    };
    liveServices.init_account(params);
  };

  // 精修免费版
  giftFree = () => {
    const { urls } = this.props;
    const baseUrl = urls.get('saasBaseUrl');
    const params = {
      baseUrl,
      moduleCode: 'MEITU_EDIT_IMAGE',
      policyCode: 'MEITU_EDIT_IMAGE_TIYAN',
    };
    liveServices.gift_free(params);
  };

  getAlbums = ({ current } = {}) => {
    const { urls } = this.props;
    const { currentPage, album_name } = this.state;
    const baseUrl = urls.get('saasBaseUrl');
    this.setState({
      loading: true,
    });
    const params = {
      page_num: current || currentPage,
      baseUrl,
      album_name,
    };
    liveServices
      .getAlbumList(params)
      .then(res => {
        const { album_list = [], total } = res.data;
        this.setState({
          liveList: album_list || [],
          total,
          loading: false,
          currentPage: current || currentPage,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };
  createAlbum = async () => {
    const { boundGlobalActions, urls, userInfo, intl } = this.props;
    const baseUrl = urls.get('saasBaseUrl');
    const { uidPk } = userInfo.toJS();
    const params = { baseUrl, scene: 2, id: uidPk };

    const isAuth = await liveServices.verifyAuth(params);
    if (!isAuth) {
      if (intl.lang === 'en') {
        window.location.href =
          '/saascheckout.html?plan_id=null&product_id=SAAS_INSTANT&coupon_code=STFT2024';
      }

      intl.lang === 'cn' &&
        boundGlobalActions.showConfirm({
          title: '',
          message: intl.tf('LP_PHOTO_BUY_NOW_TITLE'),
          close: boundGlobalActions.hideConfirm,
          buttons: [
            {
              onClick: async () => {
                //获取用户是否有199优惠券 有优惠券展示199的套餐 没有则展示399套餐
                // const res = await this.getCouponFn();
                openPayCard({ boundGlobalActions, baseUrl, sliceNumber: 1 });
                boundGlobalActions.hideConfirm();
              },
              text: intl.tf('LP_PHOTO_BUY_NOW'),
            },
          ],
        });
      return;
    }
    intl.lang === 'cn' &&
      window.logEvent.addPageEvent({
        name: 'LIVE_PC_CreateAlbum_Click_CreateAlbum',
      });
    this.props.history.push('/software/live/photo/create/album-settings');
  };
  getCouponFn = async () => {
    const { urls, userInfo } = this.props;
    const baseUrl = urls.get('baseUrl');
    const { uidPk } = userInfo.toJS();
    const params = { baseUrl, isUse: false, customerId: uidPk };

    try {
      const data = await getCustomerDeliveryList(params);
      return (data || []).some(item => item.activityId === 11);
    } catch (error) {
      console.log('getCustomerDeliveryList', error);
    }
  };

  renderLiveCards = () => {
    const { liveList, loading, album_name } = this.state;
    const { urls, boundProjectActions, boundGlobalActions, message, intl } = this.props;

    const cardProps = {
      urls,
      boundProjectActions,
      boundGlobalActions,
      cardWrapperRef: this.cardWrapperRef,
      getAlbums: this.getAlbums,
      message,
      liveList,
    };

    if (loading) {
      return <XLoading isShown={loading} />;
    }

    if (liveList.length) {
      return liveList.map((item, i) => <LiveItemCard key={i} {...item} {...cardProps} />);
    }
    const isSearch = album_name !== '';
    return (
      <div className="emptyWrapper">
        <div className="empty">
          <img className="emptyImg" src={emptyPNG} />
          {isSearch ? (
            <div className="text">{intl.tf('LP_NO_RESULTS_FOUND')}</div>
          ) : (
            <div className="text">{intl.tf('LP_ALBUM_EMPTY_MESSAGE')}</div>
          )}
          {this.createButton()}
        </div>
      </div>
    );
  };

  /**
   * 点击帮助中心按钮事件
   */
  clickHelpCenter = () => {
    const url = 'https://help.zno.com/hc/en-us/categories/23885511888535-Zno-Instant';
    window.open(url);
  };

  /**
   * US-直播 帮助中心
   * 点击跳转
   * https://support.zno.com/hc/en-us/sections/21196193873047-Zno-Instant
   */
  helpCenterButton = () => {
    const { intl } = this.props;
    if (intl.lang === 'en') {
      return (
        <XButton className="help-center" width={160} onClicked={this.clickHelpCenter}>
          <img src={helpPNG} />
          How To Use
        </XButton>
      );
    }
    return null;
  };

  createButton = () => {
    const { intl } = this.props;
    return (
      <XButton className="createAlbum" onClick={this.createAlbum}>
        <img src={addPNG} />
        {intl.tf('LP_NEW_ALBUM')}
      </XButton>
    );
  };

  onChange = data => {
    const { value } = data;
    this.setState(
      {
        currentPage: value,
      },
      () => {
        this.getAlbums();
      }
    );
    console.log('data', data);
  };

  onSearch = e => {
    const value = e.target.value;
    this.setState({
      album_name: value,
    });
    // console.log('value', value);
  };

  render() {
    const { liveList } = this.state;
    const { total, currentPage, pageSize, album_name } = this.state;
    const { intl, planList } = this.props;
    const appDownloadImg = intl.lang === 'en' ? instant_down : down;
    const downloadOverlay = (
      <div className="download-box">
        <img className="download-img" src={appDownloadImg} />
      </div>
    );
    // console.log('props', this.props);
    return (
      <div className="live-photo-wrapper">
        {intl.lang === 'en' ? <FreeNotify planList={planList.toJS()} /> : null}
        <div className="titleWrapper">
          <span className="title">{intl.tf('LP_ALBUMS')}</span>
          <div className="title-btns">
            {/* US-直播新增帮助中心入口 */}
            {this.helpCenterButton()}

            <IntlText>
              <Tooltip
                overlayClassName="download-overlay"
                placement="bottom"
                overlay={downloadOverlay}
              >
                <XButton className="btn-download">
                  <Phone fill="#fff" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  <span>{intl.tf('LP_APP_DOWNLOAD')}</span>
                </XButton>
              </Tooltip>
            </IntlText>

            {this.createButton()}
          </div>
        </div>
        <div className="live-photo-content">
          <div className="search-line">
            <FInput
              placeholder={intl.tf('LP_ALBUM_NAME')}
              value={album_name}
              width={255}
              onChange={this.onSearch}
            />
            <XButton width={60} onClick={() => this.getAlbums({ current: 1 })}>
              <IntlText>
                {lang => {
                  return lang === 'cn' ? (
                    '搜索'
                  ) : (
                    <IconSearch
                      fill="#fff"
                      width={20}
                      style={{ position: 'relative', top: '6px' }}
                    />
                  );
                }}
              </IntlText>
            </XButton>
          </div>
          <div
            className="cardWrapper"
            ref={ref => {
              this.cardWrapperRef = ref;
            }}
          >
            {this.renderLiveCards()}
            {total > 6 ? (
              <div className="pagination-box">
                <XPagePagination
                  currentPage={currentPage}
                  totalPage={Math.ceil(total / pageSize)}
                  changeFilter={this.onChange}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
export default createMessage()(combinLanguage(Photo));

// export default Photo;
