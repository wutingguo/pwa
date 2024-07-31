import React from 'react';
import { XPureComponent } from '@common/components';
import {
  PREVIEW_POST_CARD_MODAL,
} from '@apps/slide-show/constants/modalTypes';
import {CONFIRM_MODAL} from '@resource/lib/constants/modalTypes';
import './index.scss';

class TableList extends XPureComponent {
  constructor(props) {
    super(props);
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.handleEdite = this.handleEdite.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handelDelete = this.handelDelete.bind(this);
  }

  componentDidMount() {
  }

  handleEdite(item) {
    const { history } = this.props;
    history.push(`/software/slide-show/post-card/detail/${item.id}`)
  }
  handlePreview(item) {
    const { boundGlobalActions, boundProjectActions, history, urls } = this.props;
    const { addNotification, hideModal, showModal } = boundGlobalActions;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const data = {
      postCardDetail: item,
      galleryBaseUrl,
      history,
      title: t('SLIDESHOW_SHARE_TITLE'),
      handleCancel: () => hideModal(PREVIEW_POST_CARD_MODAL),
      close: () => hideModal(PREVIEW_POST_CARD_MODAL),
    };
    showModal(PREVIEW_POST_CARD_MODAL, data);
  }

  handelDelete(item) {
    const { boundProjectActions, boundGlobalActions} = this.props;
    const {showModal, hideModal, addNotification } = boundGlobalActions;
    const data = {
      title: '确认删除',
      message: '请确认是否删除您的名片？',
      close: () => hideModal(CONFIRM_MODAL),
      buttons: [
        {
          text: t('CANCEL'),
          className: 'confirm-btn-delete-cancel',
        },
        {
          text: t('DELETE'),
          className: 'confirm-btn-delete-confirm',
          onClick: async () => {
            const res = await boundProjectActions.deletePostCard(item.id);
            if(res.ret_code === 200000) {
              boundProjectActions.getPostCardList();
              addNotification({
                message: '名片删除成功',
                level: 'success',
                autoDismiss: 2
              });
            }
          }
        }
      ]
    };

    showModal(
      CONFIRM_MODAL,
      data
    );

  }

  getRenderHtml() {
    const html = [];
    const { list = []} = this.props;
    list.forEach(item => {
      html.push(
        <div className="row" key={item.id}>
          <div className="column">{item.card_name}</div>
          <div className="column">{item.is_default ? '是' : '否'}</div>
          <div className="column">{item.studio_name}</div>
          <div className="column">{item.studio_introduction}</div>
          <div className="column">{item.studio_address}</div>
          <div className="column">{item.weibo_account}</div>
          <div className="column">{item.weichat_account}</div>
          <div className="column">{item.official_website}</div>
          <div className="column">
            <span onClick={this.handleEdite.bind(this, item)}>编辑</span>/
            <span onClick={this.handlePreview.bind(this, item)}>预览</span>/
            <span onClick={this.handelDelete.bind(this, item)}>删除</span>
          </div>
        </div>
      )
    });
    return html;
  }

  render() {
    return (
      <div className="post-card-table">
        <div className="row header">
          <div className="column">名片名称</div>
          <div className="column">默认名片</div>
          <div className="column">工作室名称</div>
          <div className="column">工作室介绍</div>
          <div className="column">工作室所在地</div>
          <div className="column">微博账号</div>
          <div className="column">微信账号</div>
          <div className="column">官方网站</div>
          <div className="column">操作</div>
        </div>
        {this.getRenderHtml()}
      </div>
    )
  }
}

export default TableList;
