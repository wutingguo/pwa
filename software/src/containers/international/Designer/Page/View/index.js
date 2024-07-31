import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// 公共配置
import mapState from '@src/redux/selector/mapState';
import mapDispatch from '@src/redux/selector/mapDispatch';

// 公共方法
import { getSearchObj } from '@resource/lib/utils/url';

// 公共组件
import XLoading from '@resource/components/XLoading';
import Main from "./main";

import '../index.scss';

const onJump = (e, history) => {
    // 添加埋点
    window.logEvent.addPageEvent({
        name: 'DSOrderConfirm_Click_MyOrders'
    });
    history.push(`./my-orders`);
    e.preventdefault();
}

const XDsCaption = ({ history }) => {
    return <Fragment>
        <h1 className="caption text-center mt40">Design Service Order Successfully Placed!</h1>
        <p className="desc text-center">
            You will receive an order confirmation email
        </p>
        <p className="desc text-center mb24">Go to &nbsp;
            <a className="blue" href="javascript:void(0)" onClick={(e) => onJump(e, history)}>My Orders to view order details.</a>
        </p>
        <p className="desc text-center">
            Your design will be completed within 2-4 working days. You will be
        </p>
        <p className="desc text-center mb40">
            notified by email when it is completed with a link to view the album.
        </p>
    </Fragment>
}

@connect(mapState, mapDispatch)
export default class Designer extends Component {

    constructor(props) {
        super(props);
        // 获取URL中的参数
        this.urlObj = getSearchObj();

        this.state = {
            isLoading: true,
            productConfirmat: [],
            currPage: 0,
            sequence: "",
            coverDesign: [],
            favoriteArr: [],
            groupArr: [],
            coverArr: [],
            instructions: ""
        }
    }

    showNotification = (msg) => {
        this.props.boundGlobalActions.addNotification({
            message: msg || t('SERVICE_ERROR_UNKNOWN'),
            level: 'success',
            uid: notificationTypes.SAVE_FAILED,
            autoDismiss: 2
        });
    }

    componentDidMount() {
        const { boundProjectActions } = this.props;
        boundProjectActions.getConfirmInfo({ serviceOrderId: this.urlObj.service_order_id })
            .then(({ ret_code, data }) => {
                if (ret_code == 200000) {
                    this.setState(data);
                }
            }).catch(res => {
                this.showNotification();
            }).finally(() => {
                this.setState({ isLoading: false });
            })
    }

    render() {
        const { history } = this.props;
        const { isLoading } = this.state;
        return (
            <div className="ds-box">
                {isLoading ? <XLoading isShown={isLoading} backgroundColor="rgba(255,255,255,0.6)" /> : null}
                <XDsCaption history={history} />
                <Main {...this.state} />
            </div>
        )
    }
}