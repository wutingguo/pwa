import { template, assign } from 'lodash';
import { emailReg, SPACE_REG } from '@resource/lib/constants/reg';
import { GET_DIRECT_LINK_MODAL } from '@apps/gallery/constants/modalTypes';
import { throttle } from '@resource/lib/utils/timeout';

const didMount = that => {
  const {
    match: { params },
    boundProjectActions
  } = that.props;
  const { id } = params;
  boundProjectActions.getEmailShareEmailTheme(id, 1).then(res => {
    const { emailTheme } = that.props;
    if (emailTheme && emailTheme.size) {
      that.setState({
        emailSubject: t('SHARE_EMAIL_THEME', { collectionName: emailTheme.get('project_name') })
      });
    }
  });
};

const willReceiveProps = (that, nextProps) => {
  const { emailTheme } = nextProps;
  if (emailTheme && emailTheme.size) {
    that.setState({
      emailSubject: t('SHARE_EMAIL_THEME', { collectionName: emailTheme.get('project_name') })
    });
  }
};

// 返回详情页
const onBack = that => {
  const {
    history,
    match: {
      params: { id }
    }
  } = that.props;
  history.push(`/software/slide-show/collection/${id}/publish`);
};

// 获取直白链接
const onGetDirectLink = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsShareEmail_Click_GetDirectLink'
  });

  const {
    match: { params },
    boundGlobalActions,
    boundProjectActions
  } = that.props;
  const { getEmailShareDirectLink } = boundProjectActions;
  const { hideModal, showModal } = boundGlobalActions;
  const { id } = params;
  const data = {
    title: t('SHARE_GET_MV_LINK'),
    topic: t('SHARE_GET_DIRECT_TOPIC'),
    tip: t('SLIDESHOW_SHARE_GET_DIRECT_TIP'),
    copyBtnText: t('SHARE_GET_DIRECT_BTN_COPY'),
    copiedBtnText: t('SHARE_GET_DIRECT_BTN_COPIED'),
    handleCopy: () => {},
    close: () => {
      hideModal(GET_DIRECT_LINK_MODAL);
    }
  };
  getEmailShareDirectLink(id).then(res => {
    const shareDirectLink = res.data;
    showModal(GET_DIRECT_LINK_MODAL, assign(data, { shareDirectLink }));
  });
};

// 邮箱
const onEmailChange = (that, e) => {
  const shareEmail = e.target.value;
  that.setState({
    shareEmail,
    isShowEmailTip: !!shareEmail ? false : true
  });
};

// 副标题
const onSubjectChange = (that, e) => {
  const emailSubject = e.target.value;
  that.setState({ emailSubject });
};

// 正文
const onTextChange = (that, e) => {
  const emailContent = e.target.value;
  document.querySelector('#preview-custom-message').innerText = emailContent;
  that.setState({ emailContent });
};

// 拷贝
const onSendCopy = (that, e) => {
  const { checked } = e;
  // console.log('checkbox: ', e);
  that.setState({
    sendCopy: checked
  });
};

const validateEmail = that => {
  const { shareEmail } = that.state;
  const emailRequiredTip = t('EMAIL_CANNOT_BE_BLANK');
  const emailIllegalTip = t('EMAIL_BE_ILLEGAL');
  let isEmailLegal = true;
  if (shareEmail.indexOf(',') !== -1) {
    shareEmail.split(',').forEach(email => {
      if (!emailReg.test(email)) {
        isEmailLegal = false;
      }
    });
  } else {
    isEmailLegal = emailReg.test(shareEmail);
  }
  const isEmailEmptyStr = SPACE_REG.test(shareEmail);
  let emailTipContent = '';
  let isShowEmailTip = false;
  if (!shareEmail || isEmailEmptyStr) {
    isShowEmailTip = true;
    emailTipContent = emailRequiredTip;
  } else if (!isEmailLegal) {
    isShowEmailTip = true;
    emailTipContent = emailIllegalTip;
  }

  that.setState({
    isShowEmailTip,
    emailTipContent
  });

  return !isShowEmailTip;
};

const validateSubject = that => {
  const { emailSubject } = that.state;
  const subjectRequiredTip = t('SUBJECT_CANNOT_BE_BLANK');
  const isEmailEmptyStr = SPACE_REG.test(emailSubject);
  let subjectTipContent = '';
  let isShowSubjectTip = false;
  if (!emailSubject || isEmailEmptyStr) {
    isShowSubjectTip = true;
    subjectTipContent = subjectRequiredTip;
  }

  that.setState({
    isShowSubjectTip,
    subjectTipContent
  });

  return !isShowSubjectTip;
};

const onSendEmailInvite = (that, body) => {
  const { boundProjectActions } = that.props;
  const { sendEmailInvite } = boundProjectActions;
  return sendEmailInvite(body);
};

const handleSendInvite = (that, body) => {
  const { boundGlobalActions, boundProjectActions, emailTheme } = that.props;

  const { addNotification, hideConfirm } = boundGlobalActions;

  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    title: `${t('SHARE_SEND_MV_INVITE')}?`,
    message: t('SHARE_SEND_INVITES_TIP'),
    style: { width: '400px' },
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_CANCEL'),
        onClick: hideConfirm
      },
      {
        className: 'pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_SEND'),
        onClick: () => {
          onSendEmailInvite(that, body).then(
            res => {
              addNotification({
                message: t('SHARE_SEND_INVITE_SUCCESSED'),
                level: 'success',
                autoDismiss: 2
              });
              document.querySelector('#preview-custom-message').innerText = '';
              that.setState({
                shareEmail: '',
                emailSubject: t('SHARE_EMAIL_THEME', {
                  collectionName: emailTheme.get('project_name')
                }),
                emailContent: '',
                sendCopy: true
              });
            },
            error => {
              console.log(error);
              addNotification({
                message: t('SHARE_SEND_INVITE_FAILED'),
                level: 'error',
                autoDismiss: 2
              });
            }
          );
        }
      }
    ]
  };
  boundGlobalActions.showConfirm(data);
};

// 发送邀请
const onSendInvite = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsShareEmail_Click_SendInvite'
  });

  const { shareEmail, emailSubject, emailContent, sendCopy } = that.state;
  const {
    match: { params },
    boundProjectActions,
    emailTheme
  } = that.props;
  const { id } = params;
  const themeUid = emailTheme.get('theme_uid');
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  // exif // TODO
  const imgRot = emailTheme.get('imgRot');
  if (validateEmail(that) && validateSubject(that)) {
    const body = {
      project_id: id,
      share_email: shareEmail,
      email_subject: emailSubject,
      email_content: emailContent
        .replace(/\r\n/g, '<br/>')
        .replace(/\n/g, '<br/>')
        .replace(/\s/g, ' '),
      send_me_copy: +sendCopy,
      theme_uid: themeUid,
      project_cover_url: emailCoverUrl,
      // exif
      project_cover_rotate: imgRot
    };

    handleSendInvite(that, body);
  }
};

const renderEmailTemplate = that => {
  const {
    emailTheme,
    match: {
      params: { id }
    }
  } = that.props;
  return template(emailTheme.get('theme_content'))({
    project_name: emailTheme.get('project_name'),
    project_cover_url: emailTheme.get('emailCoverUrl'),
    email_share_link: emailTheme.get('link_url'),
    email_content: '',
    // exif // TODO
    project_cover_rotate: emailTheme.get('imgRot')
  });
};

export default {
  didMount,
  willReceiveProps,
  onEmailChange,
  onSubjectChange,
  onTextChange,
  onSendCopy,
  onSendInvite,
  onBack,
  onGetDirectLink,
  renderEmailTemplate
};
