import QRCode from 'qrcode.react';
import React, { Fragment, createContext } from 'react';

import { XIcon } from '@common/components';

import CanvasToImg from '@apps/dashboard-mobile/components/CanvasToImg';
import Dialog from '@apps/dashboard-mobile/components/vant/Dialog';

const copyToClipboard = text => {
  var dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
};
export const getCollectionList = (that, searchText = '', current_page = 1) => {
  const { boundProjectActions, boundGlobalActions } = that.props;
  // const qs = getQueryStringObj();
  if (!current_page) return;
  that.setState({
    isLoadingProject: true
  });
  // const urlParams = buildUrlParmas({ ...qs, searchText });
  // history.pushState(null, null, urlParams);
  return boundProjectActions
    .getCollectionList(searchText, current_page)
    .then(res => {
      that.setState({
        isLoadingProject: false,
        paginationInfo: res.data
      });
      if (searchText === '' && current_page === 1) {
        that.setState({
          maxOrdering: res.data.records[0] && res.data.records[0]['ordering']
        });
      }
    })
    .catch(err => that.setState({ isLoadingProject: false }));
};
export const init = async that => {
  that.setState({
    isLoadingProject: true
  });
  getCollectionList(that);
};
export const onRefresh = that => {
  return getCollectionList(that);
};
const handleDelete = async (that, item) => {
  const { boundProjectActions, boundGlobalActions } = that.props;
  await boundProjectActions.deleteCollection(item.get('enc_collection_uid'));
  getCollectionList(that);
};
const handleShare = (that, item) => {
  const { boundProjectActions, boundGlobalActions } = that.props;

  boundProjectActions.getEmailShareDirectLink(item.get('enc_collection_uid')).then(res => {
    const { share_link_url } = res.data;
    Dialog.confirm({
      title: '分享选片链接',
      showCancelButton: false,
      message: (
        <>
          {/* <QRCode id="qrid" value={share_link_url} size={115} fgColor="#000000" /> */}
          <CanvasToImg share_link_url={share_link_url} />
          <div style={{ fontSize: '13px', color: '#222222', margin: '7px 0 20px' }}>
            长按保存二维码
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #DCDCDC',
              height: '33px'
            }}
          >
            <span
              style={{
                background: '#D5D5D5',
                height: '100%',
                width: '33px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <XIcon type="link" iconWidth={12} iconHeight={12} />
            </span>
            <div
              style={{
                width: '221px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginLeft: '12px',
                color: '#222222',
                flexGrow: '1'
              }}
            >
              {share_link_url}
            </div>
          </div>
        </>
      ),
      confirmButtonText: '复制链接',
      confirmButtonColor: '#222',
      onCancel: () => console.log('cancel'),
      onConfirm: () => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(share_link_url);
        } else {
          copyToClipboard(share_link_url);
        }
      }
    });
  });
};

const handleClick = async (that, item) => {
  const { boundProjectActions, boundGlobalActions, urls } = that.props;

  const galleryBaseUrl = urls.get('galleryBaseUrl');
  boundProjectActions.getMySubscription(galleryBaseUrl);
  const res = await boundProjectActions.getCollectionsSettings(item.get('enc_collection_uid'));
  if (res.ret_code === 200000) {
    that.props.history.push('/software/gallery/gallery-detail');
  }
};

const onLoadMore = async that => {
  const { paginationInfo, searchText } = that.state;

  return getCollectionList(that, searchText, paginationInfo.current_page + 1);
};
export default {
  onRefresh,
  // onLoadRefresh,
  getCollectionList,
  init,
  handleDelete,
  handleShare,
  handleClick,
  onLoadMore
};
