import React from 'react';
import { withRouter } from 'react-router';
import { template } from 'lodash';
import classNames from 'classnames';
import equals from '@resource/lib/utils/compare';
import { XInput, XTextarea, XCheckBox, XIcon, XPureComponent } from '@common/components';

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
      checkPin: false,
      checkPassword: false,
      showTemplateList: false,
      templateList: [], // 邮件模板列表
      pin: '',
      // 下载 pin  是否开启
      download_pin_status: false,
      slideshow_password_switch: false,
      renderEmail: null
    };
  }

  didMount = () => main.didMount(this);
  onEmailChange = e => main.onEmailChange(this, e);
  onSubjectChange = e => main.onSubjectChange(this, e);
  onTextChange = e => main.onTextChange(this, e);
  onSendCopy = e => main.onSendCopy(this, e);
  onSendInvite = () => main.onSendInvite(this);
  onBack = () => main.onBack(this);
  onGetDirectLink = () => main.onGetDirectLink(this);
  renderEmailTemplate = () => main.renderEmailTemplate(this);
  onCheckPin = e => main.onCheckPin(this, e);
  onCheckPassword = e => main.onCheckPassword(this, e);
  didMount = () => main.didMount(this);
  willReceiveProps = nextProps => main.willReceiveProps(this, nextProps);
  showEmailTemplateList = () => main.showEmailTemplateList(this);
  hideTemplateList = () => main.hideTemplateList(this);
  getEmailTemplateList = () => main.getEmailTemplateList(this);
  showTemplateModal = () => main.showTemplateModal(this);
  applyTemplate = id => main.applyTemplate(this, id);

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
    const { emailTheme } = this.props;
    const {
      shareEmail,
      emailSubject,
      emailContent,
      sendCopy,
      isShowEmailTip,
      emailTipContent,
      isShowSubjectTip,
      subjectTipContent,
      checkPin,
      checkPassword,
      download_pin_status,
      slideshow_password_switch,
      showTemplateList,
      templateList = [], // 邮件模板列表
      renderEmail
    } = this.state;
    // console.log("this.statellk....",this.state)

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
    // console.log("subjectProps...",subjectProps)

    const textareaProps = {
      className: 'share-textarea',
      value: emailContent,
      placeholder: t('SHARE_TEXTAREA_PLACEHOLDER'),
      onChanged: this.onTextChange
    };

    const checkboxProps = {
      className: 'sm theme-1 share-checkbox',
      onClicked: this.onSendCopy,
      checked: sendCopy,
      text: t('SHARE_SEND_ME')
    };

    const checkboxPropsPin = {
      className: 'sm theme-1 share-checkbox pin',
      onClicked: this.onCheckPin,
      checked: checkPin,
      text: 'Download PIN'
    };
    const saveClass = classNames('btn-item', { gray: templateList.length >= 10 });
    const haveTemplates = !!templateList.length;
    const templateListClass = classNames('template-list', { 'item-center': !haveTemplates });
    const templateListItem = classNames('template-list-item', { 'text-center': !haveTemplates });
    const checkboxPropsPassword = {
      className: 'sm theme-1 share-checkbox pin',
      onClicked: this.onCheckPassword,
      checked: checkPassword,
      text: 'Slideshow Password'
    };
    const templateWrapClass = classNames('template-wrap', { hide: !showTemplateList });
    return (
      <div className="collection-share-wrap">
        <div className="share-header">
          <div className="back" onClick={this.onBack}>
            <XIcon type="back" />
            {t('SHARE_BACK_TO_COLLECTION', {
              collectionName: emailTheme && emailTheme.size ? emailTheme.get('project_name') : ''
            })}
          </div>
          <div className="handles">
            <div className="get-link" onClick={this.onGetDirectLink}>
              <XIcon type="link" />
              {t('SHARE_GET_MV_LINK')}
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
              <div className="checkbox-wrap">
                {slideshow_password_switch && <XCheckBox {...checkboxPropsPassword} />}
                {!__isCN__ && download_pin_status && <XCheckBox {...checkboxPropsPin} />}
                {!__isCN__ && <XCheckBox {...checkboxProps} />}
              </div>
              <XIcon
                type="send-invite"
                theme="black"
                title={t('SHARE_SEND_MV_INVITE')}
                text={t('SHARE_SEND_MV_INVITE')}
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
