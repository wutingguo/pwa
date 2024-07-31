import React from 'react';
import { withRouter } from 'react-router';
import { template } from 'lodash';
import equals from '@resource/lib/utils/compare';
import {
  XInput,
  XTextarea,
  XCheckBox,
  XIcon,
  XPureComponent
} from '@common/components';

import main from './handler/main';

import './index.scss';

class Share extends XPureComponent {
  constructor(props) {
    super(props);
    this.state={
      shareEmail: '',
      emailSubject: '',
      emailContent: '',
      sendCopy: true,

      isShowEmailTip: false,
      emailTipContent: '',
      isShowSubjectTip: false,
      subjectTipContent: '',

    };
  }

  didMount = () => main.didMount(this);
  onEmailChange = (e) => main.onEmailChange(this, e);
  onSubjectChange = (e) => main.onSubjectChange(this, e);
  onTextChange = (e) => main.onTextChange(this, e);
  onSendCopy = (e) => main.onSendCopy(this, e);
  onSendInvite = () => main.onSendInvite(this);
  onBack = () => main.onBack(this);
  onGetDirectLink = () => main.onGetDirectLink(this);
  renderEmailTemplate = () => main.renderEmailTemplate(this);

  didMount = () => main.didMount(this);
  willReceiveProps = nextProps => main.willReceiveProps(this, nextProps);

  componentDidMount() {
    this.didMount();
  }  

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
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
    } = this.state;

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
      onChanged: this.onTextChange
    }

    const checkboxProps = {
      className: "sm theme-1 share-checkbox",
      onClicked: this.onSendCopy,
      checked: sendCopy,
      text: t('SHARE_SEND_ME'),
    }

    return (
      <div className="collection-share-wrap">
        <div className="share-header">
          <div className="back" onClick={this.onBack}><XIcon type='back' />
            {t('SHARE_BACK_TO_COLLECTION', {collectionName: emailTheme && emailTheme.size ? emailTheme.get('project_name') : ''})}
          </div>
          <div className="handles">
            <div className="get-link" onClick={this.onGetDirectLink}>
              <XIcon type='link' />{t('SHARE_GET_MV_LINK')}
            </div>
          </div> 
        </div>
        <div className="share-content-wrap">
          <div className="share-form">
            <div className="form-item">
              <span className="label ellipsis" title={t('SHARE_EMAIL_LABEL')}>{t('SHARE_EMAIL_LABEL')}</span>
              <XInput {...emailProps} />
            </div>
            <div className="form-item">
              <span className="label ellipsis" title={t('SHARE_SUBJECT_LABEL')}>{t('SHARE_SUBJECT_LABEL')}</span>
              <XInput {...subjectProps} />
            </div>
            <div className="form-item textarea-wrap">
              <XTextarea {...textareaProps} />
            </div>
            <div className="form-item handle-wrap">
              {!__isCN__ && <XCheckBox {...checkboxProps} />}
              <XIcon type="send-invite" theme="black" title={t('SHARE_SEND_MV_INVITE')} text={t('SHARE_SEND_MV_INVITE')} onClick={this.onSendInvite} />
            </div>
          </div>
          {
            emailTheme && emailTheme.size ? (
              <div
                className="share-preview"
                dangerouslySetInnerHTML={{
                  __html: this.renderEmailTemplate()
                }}
              />
            ) : null
          }
        </div>
      </div>
    );
  }
};

export default withRouter(Share);
