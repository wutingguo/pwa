import React from 'react';
import { withRouter } from 'react-router';
import { template } from 'lodash';
import equals from '@resource/lib/utils/compare';
import { XInput, XTextarea, XCheckBox, XIcon, XPureComponent } from '@common/components';
import classNames from 'classnames';
import main from './handler/main';

import './index.scss';

class Share extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shareEmail: '',
      emailSubject: '',
      emailContent: '',
      sendCopy: true,

      isShowEmailTip: false,
      emailTipContent: '',
      isShowSubjectTip: false,
      subjectTipContent: '',
      showDownloadPin: false,
      showDownloadPassword: true,
      templateList: [], // 邮件模板列表
      showTemplateList: false,
      isShowTemplateNmaeTip: false,
      templateNameTipContent: '',
      isSameTemplateName: false,
      renderEmail: null
    };
  }

  didMount = () => main.didMount(this);
  onEmailChange = e => main.onEmailChange(this, e);
  onSubjectChange = e => main.onSubjectChange(this, e);
  onTextChange = e => main.onTextChange(this, e);
  onSendCopy = e => main.onSendCopy(this, e);
  changePinStatus = e => main.changePinStatus(this, e);
  changePasswordStatus = e => main.changePasswordStatus(this, e);
  onSendInvite = () => main.onSendInvite(this);
  onBack = () => main.onBack(this);
  onGetDirectLink = () => main.onGetDirectLink(this);
  renderEmailTemplate = () => main.renderEmailTemplate(this);

  didMount = () => main.didMount(this);
  willReceiveProps = nextProps => main.willReceiveProps(this, nextProps);
  getEmailTemplateList = () => main.getEmailTemplateList(this);
  showTemplateModal = () => main.showTemplateModal(this);
  applyTemplate = id => main.applyTemplate(this, id);

  showEmailTemplateList = () => main.showEmailTemplateList(this);
  hideTemplateList = () => main.hideTemplateList(this);

  componentDidMount() {
    this.didMount();
    this.getEmailTemplateList();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
      this.renderEmailTemplate();
    }
  }

  render() {
    const { emailTheme, pinSetting } = this.props;
    const {
      shareEmail,
      emailSubject,
      emailContent,
      sendCopy,
      isShowEmailTip,
      emailTipContent,
      isShowSubjectTip,
      subjectTipContent,
      showDownloadPin,
      showDownloadPassword,
      templateList = [],
      showTemplateList,
      renderEmail
    } = this.state;

    const pinSettingJs = pinSetting ? pinSetting.toJS() : {};
    const { common_download_status, common_pin_status, gallery_password_switch } = pinSettingJs;

    const emailProps = {
      className: 'share-input',
      value: shareEmail,
      placeholder: t('SHARE_EMAIL_PLACEHOLDER'),
      onFocus: this.onInputFocus,
      onChange: this.onEmailChange,
      isShowTip: isShowEmailTip,
      tipContent: emailTipContent,
      maxLength: 1000
    };

    const subjectProps = {
      className: 'share-input',
      value: emailSubject,
      placeholder: t('SHARE_SUBJECT_PLACEHOLDER'),
      onChange: this.onSubjectChange,
      isShowTip: isShowSubjectTip,
      tipContent: subjectTipContent
    };

    const textareaProps = {
      className: 'share-textarea',
      value: emailContent,
      placeholder: t('SHARE_TEXTAREA_PLACEHOLDER'),
      onChanged: this.onTextChange,
      maxlength: 2500
    };

    const checkboxProps = {
      className: 'sm theme-1 share-checkbox',
      onClicked: this.onSendCopy,
      checked: sendCopy,
      text: t('SHARE_SEND_ME')
    };

    const pinCheckboxProps = {
      className: 'sm theme-1 share-checkbox pin',
      onClicked: this.changePinStatus,
      checked: showDownloadPin,
      text: t('SHARE_DOWNLOAD_PIN')
    };

    const passwordCheckboxProps = {
      className: 'sm theme-1 share-checkbox pin',
      onClicked: this.changePasswordStatus,
      checked: showDownloadPassword,
      text: t('GALLERY_CLIENT_PASSWORD')
    };
    const saveClass = classNames('btn-item', { gray: templateList.length >= 10 });
    const haveTemplates = !!templateList.length;
    const templateListItem = classNames('template-list-item', { 'text-center': !haveTemplates });
    const templateListClass = classNames('template-list', { 'item-center': !haveTemplates });

    const templateWrapClass = classNames('template-wrap', { hide: !showTemplateList });

    return (
      <div className="collection-share-wrap">
        <div className="share-header">
          <div className="back" onClick={this.onBack}>
            <XIcon type="back" />
            {t('SHARE_BACK_TO_COLLECTION', {
              collectionName: emailTheme && emailTheme.size ? emailTheme.get('collection_name') : ''
            })}
          </div>
          <div className="handles">
            <div className="get-link" onClick={this.onGetDirectLink}>
              <XIcon type="link" />
              {t('SHARE_GET_DIRECT_LINK')}
            </div>
          </div>
        </div>
        <div className="share-content-wrap">
          <div className="share-form">
            <div className="form-item">
              <span className="label ellipsis" title={t('SHARE_EMAIL_LABEL')}>
                {t('SHARE_EMAIL_LABEL')}
              </span>
              <XInput {...emailProps} />
            </div>
            <div className="form-item">
              <span className="label ellipsis" title={t('SHARE_SUBJECT_LABEL')}>
                {t('SHARE_SUBJECT_LABEL')}
              </span>
              <XInput {...subjectProps} />
            </div>
            <div className="form-item textarea-wrap">
              <XTextarea {...textareaProps} />
            </div>
            <div className="form-item teplate">
              <div className="btn-area">
                <div className="left"></div>
                <div className="btn-wrap">
                  <div
                    className="btn-item"
                    onMouseEnter={this.showEmailTemplateList}
                    onMouseLeave={this.hideTemplateList}
                  >
                    <div className={templateWrapClass}>
                      {showTemplateList ? (
                        <div className={templateListClass}>
                          {haveTemplates ? (
                            templateList.map((item, index) => {
                              return (
                                <div
                                  className="template-list-item"
                                  onClick={() => {
                                    this.applyTemplate(item.id);
                                  }}
                                >
                                  {item.template_name}
                                </div>
                              );
                            })
                          ) : (
                            <div className={templateListItem}>You have no templates.</div>
                          )}
                        </div>
                      ) : null}
                      <div className="jiantou-wrap">
                        {showTemplateList ? <div className="jiantou_down"></div> : null}
                      </div>
                    </div>
                    <span>Insert Templates</span>
                  </div>
                  <div className={saveClass} onClick={this.showTemplateModal}>
                    Save As New
                  </div>
                </div>
              </div>
            </div>
            <div className="form-item handle-wrap">
              {__isCN__ ? (
                <span></span>
              ) : (
                <div className="checkbox-list">
                  {gallery_password_switch && <XCheckBox {...passwordCheckboxProps} />}
                  {common_download_status && common_pin_status && (
                    <XCheckBox {...pinCheckboxProps} />
                  )}
                  <XCheckBox {...checkboxProps} />
                </div>
              )}
              <XIcon
                type="send-invite"
                theme="black"
                title="Send Invite"
                text={t('SHARE_SEND_INVITE')}
                onClick={this.onSendInvite}
              />
            </div>
          </div>
          {emailTheme && emailTheme.size ? (
            <div
              className="share-preview"
              dangerouslySetInnerHTML={{
                __html: renderEmail
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Share);
