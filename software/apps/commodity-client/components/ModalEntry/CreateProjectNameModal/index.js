import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { Component } from 'react';

import { isBrowserEnv } from '@resource/lib/utils/env';

import closeIcon from '../../../icons/close.png';
import { getStoreCustomerToken } from '../../../services/user';
import { buildUrlParmas } from '../../../utils/url';

import './index.scss';

export default class EditNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  componentDidMount() {
    if (isBrowserEnv()) {
      window.addEventListener('keyup', this.handleEnterKey);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', () => {});
  }

  handleTitleChange(e) {
    let value = e.currentTarget.value;
    if (/[!@#$%^&*()/\|,.<>?"();:+=\[\]{}]/.test(value)) {
      value = value.replace(/[!@#$%^&*()/\|,.<>?"();:+=\[\]{}]/g, '');
    }
    if (value.length > 50) {
      value = value.substr(0, 50);
    }

    this.setState({ title: value });
  }

  handleEnterKey(e) {
    const { title } = this.state;
    const disabled = !title || /^\s+$/.test(title);
    if (e.keyCode === 13) {
      if (!disabled) {
        this.startButton && this.startButton.click();
      }
    }
  }

  handleCreate = debounce(async () => {
    const { boundProjectActions, project_uid, urls, goods_id, qs, store } = this.props;
    const { title } = this.state;
    const { baseUrl, pstoreBaseUrl } = urls;
    const { enc_sw_id } = qs;
    const { userInfo } = store;
    boundProjectActions.getCommodityUserInfo().catch(err => {
      console.log(err);
    });
    const auth = await getStoreCustomerToken({ baseUrl, enc_sw_id });

    boundProjectActions.cloneRequest(title, project_uid, auth).then(res => {
      const {
        projectInfo: { guid },
      } = res;
      if (guid) {
        boundProjectActions.projectCreate(goods_id, guid).then(response => {
          const { data } = response;
          // eslint-disable-next-line no-debugger
          debugger;
          const urlQueryObj = {
            initGuid: guid,
            virtualProjectGuid: guid,
            packageType: 'single',
            languageCode: 'cn',
            enc_sw_id: enc_sw_id,
            title: title,
            backHref: encodeURIComponent(location.href),
            commodityLibrarySource: 1,
            listId: data,
            client_project_id: data,
          };

          const urlQueryString = buildUrlParmas(urlQueryObj, false);
          let productLinkUrl = `
         ${pstoreBaseUrl}prod-assets/app/cxeditor/index.html?${urlQueryString}`;
          if (data) {
            window.location.href = productLinkUrl;
          }
        });
      }
    });
  }, 2000);

  render() {
    const { title } = this.state;

    const { closeModal, productTitle } = this.props;
    const buttonClass = classNames('create-button', {
      disable: !title || /^\s+$/.test(title),
    });
    return (
      <div className="edit-name-modal-cn">
        <div className="edit-name-modal-wrap">
          <img className="close-icon dib" src={closeIcon} onClick={closeModal} />
          <div className="title">{productTitle}</div>
          <div className="input-container">
            <span className="input-text">输入新的作品名</span>
            <input
              type="text"
              value={title}
              placeholder="在此输入您的作品名称"
              autoComplete="off"
              onChange={this.handleTitleChange}
            />
          </div>
          <div
            className={buttonClass}
            ref={node => (this.startButton = node)}
            onClick={this.handleCreate}
          >
            开始定制
          </div>
        </div>
      </div>
    );
  }
}
