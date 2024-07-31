import React, { Component } from 'react';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { XButton } from '@common/components';
import XModal from '../XModal/index';
import getQRCodeUrl from '@resource/lib/service/getQrcode';
import Table from 'rc-table';
import { getTableColumns } from './config';
import {
  LIST_REC_RECORD_BY_ACTIVITY,
  GET_ACTIVITY_INFO,
  CHECK_EXCHANGE_AWARD
} from '../../constants/apiUrl';
import './index.scss';
import XIcon from '@resource/components/icons/XIcon';
import XInput from '@resource/components/pwa/XInput';
import { template } from 'lodash';

class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowQRModal: false,
      fuliQrcode: '',
      hasCopied: false,
      inputValue: '',
      recommendList: [],
      isExchange: false
    };
  }

  componentDidMount() {
    const { userInfo, baseUrl } = this.props;
    const host = location.host;
    if (userInfo.toJS()) {
      const { uidPk } = userInfo.toJS();
      this.setState({
        inputValue: `https://${host}/passport.html?rec_customer_id=${uidPk}`
      });
      xhr
        .get(
          template(GET_ACTIVITY_INFO)({
            baseUrl
          })
        )
        .then(activity_info => {
          const {
            data: { uidpk }
          } = activity_info;
          if (activity_info.ret_code === 200000) {
            xhr
              .get(
                template(LIST_REC_RECORD_BY_ACTIVITY)({
                  baseUrl,
                  activity_id: uidpk
                })
              )
              .then(res => {
                const { data, ret_code } = res;
                if (ret_code === 200000) {
                  this.setState({
                    recommendList: data
                  });
                }
              });
            xhr
              .get(
                template(CHECK_EXCHANGE_AWARD)({
                  baseUrl,
                  activity_id: uidpk
                })
              )
              .then(res => {
                const { data, ret_code } = res;
                if (ret_code === 200000) {
                  this.setState({
                    isExchange: data
                  });
                }
              });
          }
        });
    }
  }
  onCopyDirectLink = () => {
    const { boundGlobalActions } = this.props;

    window.logEvent.addPageEvent({
      name: 'RecommendationForBenefits_Click_CopyURL'
    });

    const obj = document.querySelector('#getDirectLinkInput');
    obj.select();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `我订阅了寸心云服-设计软件，大大提升了影像后期效率，你也快来注册吧，注册成功后赶紧订阅哦！点击注册：${obj.value}`
      );
    } else {
      document.execCommand('Copy');
    }
    this.setState(
      {
        hasCopied: true
      },
      () => {
        boundGlobalActions.addNotification({
          message: t('链接已复制'),
          level: 'success',
          autoDismiss: 3
        });
      }
    );
  };

  showQRCodeModal = () => {
    window.logEvent.addPageEvent({
      name: 'RecommendationForBenefits_Click_RedeemNow'
    });
    const scene = 'customerService';
    getQRCodeUrl('', scene).then(fuliQrcode => {
      this.setState(
        {
          fuliQrcode
        },
        () => {
          this.setState({
            isShowQRModal: true
          });
        }
      );
    });
  };
  closeModal = () => {
    this.setState({
      isShowQRModal: false
    });
  };
  render() {
    const {
      hasCopied,
      fuliQrcode,
      isShowQRModal,
      inputValue,
      recommendList,
      isExchange
    } = this.state;

    const { baseUrl, userInfo, boundGlobalActions } = this.props;
    const inputProps = {
      className: 'get-direct-link-input',
      value: inputValue,
      hasSuffix: false,
      isShowSuffix: false,
      readOnly: 'readonly',
      id: 'getDirectLinkInput',
      onClick: this.onCopyDirectLink,
      disabled: !inputValue
    };
    const xmodalProps = {
      data: {
        title: '',
        className: 'qr-modal',
        backdropColor: 'rgba(0, 0, 0, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose: this.closeModal
      }
    };
    const tableProps = {
      className: '',
      columns: getTableColumns(),
      rowKey: 'favorite_uid',
      data: recommendList
    };

    return (
      <>
        <div className="section activity-introduction">
          <div className="section-title">一、活动介绍</div>
          <div className="activity-introduction-content">
            <div className="img-banner-content">
              <img
                className="activity-img"
                src="/clientassets-cunxin-saas/portal/images/pc/recommendation-for-benefits/1.png"
              />
              <div className="activity-text">
                <div className="activity-time">活动时间 8月17日-8月31日</div>
                <ul>
                  <li>8月31日 23:59:59 之后的新客订阅不再参与统计；</li>
                  <li>在活动时间结束后，我们会统一为满足兑换条件的用户发放权益；</li>
                  <li>
                    在活动时间结束前，如满足兑换条件，您可以提前发起兑换，兑换后您仍然可以在活动结束前继续参与，新客订阅会重新累计。
                  </li>
                </ul>
              </div>
            </div>
            <div className="center-text-content">
              <div className="center-text left">
                <div className="content-title">
                  1. 通过您的专属推荐链接注册的新用户，在注册后 <span>7</span> 天内，选择设计软件
                  <span> 月 </span>订阅
                </div>
                <ul>
                  <li>
                    1) 满 <span>2</span> 人，您获得设计软件标准版
                    <span> 1</span> 个月权益;
                  </li>
                  <li>
                    2) 满 <span>3</span> 人，您获得设计软件标准版
                    <span> 2</span> 个月权益;
                  </li>
                  <li>
                    3) 满 <span>4</span> 人，您获得设计软件标准版
                    <span> 3</span> 个月权益;
                  </li>
                  <li>
                    4) 满 <span>7</span> 人或以上，您获得设计软件标准版
                    <span> 12</span> 个月权益。
                  </li>
                </ul>
              </div>
              <div className="center-text right">
                <div className="content-title">
                  2. 通过您的专属推荐链接注册的新用户，在注册后 <span>7</span> 天内，选择设计软件
                  <span> 年 </span>订阅
                </div>
                <ul>
                  <li>
                    1) 满 <span>1</span> 人，您获得设计软件标准版
                    <span> 1</span> 个月权益;
                  </li>
                  <li>
                    2) 满 <span>2</span> 人或以上，您获得设计软件标准版
                    <span> 12</span> 个月权益;
                  </li>
                </ul>
              </div>
            </div>
            <div className="tips-content">
              <p>
                注：1和2中的权益可叠加，如您既满足1-4)，又满足2-2），您可以获得24个月的软件权益；
              </p>
              <p>
                获赠的软件权益使用时间不接受指定，如您已经订阅，获赠的使用时间会加在当前订阅之后，如您未订阅，我们会在活动结束后为您发放使用权益。
              </p>
            </div>
          </div>
        </div>
        <div className="section interlinkage">
          <div className="section-title">二、您的专属推荐链接</div>
          <div className="input-with-copy">
            <span className="forward-icon">
              <XIcon type="link" iconWidth={16} iconHeight={16} />
            </span>
            <XInput {...inputProps} />
            <span
              className={`copy-btn ${!inputValue ? 'disable-btn' : ''}`}
              onClick={this.onCopyDirectLink}
            >
              {hasCopied ? '已复制' : '复制'}
            </span>
          </div>
          <div className="interlinkage-text">
            新客只有通过您的专属链接注册，系统才会将Ta后续的订阅记在您的推荐中哟！
          </div>
        </div>
        <div className="section recommend-info">
          <div className="section-title">三、您的推荐详情</div>
          <div className="recommend-info-container">
            {isExchange && (
              <div className="satisfy-info">
                <div className="satisfy-img">
                  <img src="/clientassets-cunxin-saas/portal/images/pc/recommendation-for-benefits/2.png" />
                </div>
                <div className="satisfy-content">
                  <span className="gx">恭喜</span>
                  <span className="gx-text">
                    您目前已满足权益兑换条件，您可以继续冲刺更大的权益或者立即兑换权益！
                  </span>
                  <XButton
                    className="black"
                    width={126}
                    height={30}
                    onClicked={this.showQRCodeModal}
                  >
                    立即兑换
                  </XButton>
                </div>
              </div>
            )}
            {recommendList.length ? (
              <div className="recommend-info-table">
                <Table {...tableProps}></Table>
              </div>
            ) : (
              <div>尚无新客推荐，继续加油哦！</div>
            )}
          </div>
        </div>
        {isShowQRModal && (
          <XModal {...xmodalProps}>
            <img className="qr-code-img" src={fuliQrcode} />
            <p>微信扫码联系您的专属顾问领取权益！</p>
          </XModal>
        )}
      </>
    );
  }
}

export default Recommend;
