import Table from 'rc-table';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router';

import { payWechatOrderList, payWechatUploadImg } from '@common/servers/payWeChat';

import { XIcon, XPureComponent } from '@common/components';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import { getTableColumns } from './config';

import './index.scss';

class FavoriteOrderDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }
  componentDidMount() {
    const { urls, match } = this.props;
    const {
      params: { favoriteId },
    } = match;
    payWechatOrderList({
      baseUrl: urls.get('galleryBaseUrl'),
      favorite_id: favoriteId,
    }).then(res => {
      console.log('res', res);
      Array.isArray(res) &&
        !!res.length &&
        this.setState({
          list: res,
        });
    });
  }
  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };
  render() {
    const { match, history } = this.props;
    const {
      params: { id: collectionId },
    } = match;
    const { list } = this.state;
    const headerProps = {
      history,
      collectionId,
      title: '客户订单详情',
      hasHandleBtns: false,
    };

    let tableProps = {
      className: 'favorite-detail-table',
      data: list,
      columns: getTableColumns(),
      rowKey: 'order_number',
    };
    return (
      <div className="gllery-editor-content-wrapper favorite-detail-container">
        <div className="content">
          <CollectionDetailHeader {...headerProps} />
          <div className="operations">
            <XIcon className="operation-back-icon" type="back-1" onClick={this.goBack} />
          </div>
          <div className="favorite-detail-table-wrapper">
            {list && !!list.length ? (
              <Table {...tableProps} />
            ) : (
              <div className="favorite-detail-show-empty-content">订单为空</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(FavoriteOrderDetail);
