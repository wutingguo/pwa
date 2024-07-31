import { template, assign } from 'lodash';
import { emailReg, SPACE_REG } from '@resource/lib/constants/reg';
import {
  GET_DIRECT_LINK_MODAL,
  SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL
} from '@apps/slide-show/constants/modalTypes';
import { getOrientationAppliedImage } from '@resource/lib/utils/exif';
import { SAAS_SEND_SLIDESHOW_URL } from '@resource/lib/constants/apiUrl';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

const didMount = that => {
  const {
    match: { params },
    boundProjectActions
  } = that.props;
  const { id } = params;
  const { getEmailShareEmailTheme, getDownloadPin, getSlideshowPwdSettings } = boundProjectActions;
  getEmailShareEmailTheme(id, 2).then(res => {
    const { emailTheme } = that.props;
    if (emailTheme && emailTheme.size) {
      const emailSubject = t('SHARE_EMAIL_THEME', {
        collectionName: emailTheme.get('project_name')
      });
      that.renderEmailTemplate();
      that.setState({
        emailSubject: emailSubject
      });
    }
  });

  getDownloadPin({ project_id: id }).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      const { download_pin_status, pin } = data;
      that.setState({
        download_pin_status,
        pin
        // checkPin: download_pin_status
      });
    }
  });

  getSlideshowPwdSettings({ project_id: id }).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      const { slideshow_password, slideshow_password_switch } = data;
      console.log('slideshow_password_switch', slideshow_password_switch);
      that.setState({
        slideshow_password,
        // 控制checkbox是否显示
        slideshow_password_switch,
        // 用下面这个作为passwordCheckBox是否选中
        checkPassword: !!slideshow_password_switch
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
  const emailContent = e.target.value.replace(/[ ]+/g, ' ');
  document.querySelector('#preview-custom-message').innerHTML = emailContent;
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

const onCheckPin = (that, e) => {
  const { checked } = e;
  const { emailContent } = that.state;
  that.setState(
    {
      checkPin: checked
    },
    () => {
      document.querySelector('#preview-custom-message').innerText = emailContent;
    }
  );
};

const onCheckPassword = (that, e) => {
  const { checked } = e;
  const { emailContent } = that.state;
  that.setState(
    {
      checkPassword: checked
    },
    () => {
      document.querySelector('#preview-custom-message').innerText = emailContent;
    }
  );
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
  const { sendCopy, checkPin, checkPassword } = that.state;

  const data = {
    className: 'delete-collection-modal',
    close: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowSharePop_Click_Cancel'
      });
      hideConfirm();
    },
    title: `${t('SHARE_SEND_MV_INVITE')}?`,
    message: t('SHARE_SEND_INVITES_TIP'),
    style: { width: '400px' },
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowSharePop_Click_Cancel'
          });
          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_SEND'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowSharePop_Click_Send',
            SendCopy: sendCopy ? 'ON' : 'OFF',
            DownloadPIN: checkPin ? 'ON' : 'OFF',
            SlideshowPassword: checkPassword ? 'ON' : 'OFF'
          });
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

  const { shareEmail, emailSubject, emailContent, sendCopy, checkPin, checkPassword } = that.state;
  const {
    match: { params },
    baseUrl,
    emailTheme
  } = that.props;
  const { id } = params;
  const themeUid = emailTheme.get('theme_uid');
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  // exif // TODO
  const imgRot = emailTheme.get('imgRot');
  const sendCoverUrl = template(SAAS_SEND_SLIDESHOW_URL)({
    galleryBaseUrl: baseUrl,
    enc_image_uid: emailTheme.getIn(['cover', 'enc_image_uid']),
    thumbnail_size: thumbnailSizeTypes.SIZE_1000
  });
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
      project_cover_url: sendCoverUrl,
      // exif
      project_cover_rotate: imgRot,
      download_with_pin: checkPin,
      slideshow_password_switch: !!checkPassword
    };

    handleSendInvite(that, body);
  }
};

const renderEmailTemplate = async that => {
  const {
    emailTheme,
    match: {
      params: { id }
    }
  } = that.props;
  const {
    showDownloadPin = true,
    pin,
    checkPin,
    checkPassword,
    slideshow_password,
    slideshow_password_switch
  } = that.state;
  // TODO
  const orientation = emailTheme.getIn(['cover', 'orientation']) || 1;
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  const coverUrl = await getOrientationAppliedImage(emailCoverUrl, orientation);
  const renderEmail = template(emailTheme.get('theme_content'))({
    project_name: emailTheme.get('project_name'),
    project_cover_url: coverUrl,
    email_share_link: emailTheme.get('link_url'),
    email_content: '',
    // exif
    project_cover_rotate: 0,
    // cover_image_link_class: `disabled-link ${1 ? 'no-padding' : ''}`,
    pin_wrapper_class: !checkPin ? 'hide-pin-content' : '',
    password_wrapper_class: checkPassword ? '' : 'hide-password-content',
    // pin_wrapper_class: '',
    pin,
    password: (checkPassword && slideshow_password) || ''
  });
  that.setState({
    renderEmail
  });
  return renderEmail;
};

const showEmailTemplateList = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_InsertTemplate'
  });
  const { boundProjectActions } = that.props;
  that.setState({
    showTemplateList: true
  });
  return;
  // if (that.state.showTemplateList) {
  //   that.setState({
  //     showTemplateList: false
  //   });
  // } else {
  //   boundProjectActions.getEmailTemplateList().then(res => {
  //     if (res.ret_code === 200000 && res.data) {
  //       that.setState({
  //         templateList: res.data,
  //         showTemplateList: true
  //       });
  //     }
  //   });
  // }
};

//获取 邮件模板列表
const getEmailTemplateList = that => {
  const { boundProjectActions } = that.props;
  boundProjectActions.getSlideshowEmailTemplateList().then(res => {
    if (res.ret_code === 200000 && res.data) {
      that.setState({
        templateList: res.data
      });
    }
  });
};

// 应用模板
const applyTemplate = (that, id) => {
  const { templateList } = that.state;
  const { boundGlobalActions, boundProjectActions } = that.props;
  const curTemplate = templateList.find(i => i.id === id);
  document.querySelector('#preview-custom-message').innerText = curTemplate.template_content;

  that.setState(
    {
      emailContent: curTemplate.template_content,
      showTemplateList: false
    },
    () => {
      boundGlobalActions.addNotification({
        message: 'Template inserted successfully',
        level: 'success',
        autoDismiss: 2
      });
    }
  );
};

const hideTemplateList = that => {
  that.setState({
    showTemplateList: false
  });
};

// 保存邮件模板
const handleSaveEmailTemplate = (that, template) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { templateName, templateContent } = template;

  const data = {
    template_name: templateName,
    template_content: templateContent
  };
  boundProjectActions.addSlideshowEmailTemplate(data).then(res => {
    // console.log('res,,,,', res);
    if (res.ret_code === 200000) {
      boundGlobalActions.hideModal('SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL');

      that.getEmailTemplateList();
    } else if (res.ret_code === 420303) {
      // boundGlobalActions.addNotification({
      //   message: "Template Name already exists.",
      //   level: 'error',
      //   autoDismiss: 2
      // });
    }
  });
};

//
const showTemplateModal = that => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { emailContent = '', templateList, isSameTemplateName } = that.state;

  if (templateList.length >= 10) {
    return;
  }

  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_SaveAsNew'
  });
  // debugger
  that.setState({ showTemplateList: false });
  showModal(SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL, {
    // className: 'gallery-tutorial-wrapper',
    title: 'Edit Email Template',
    id: 12312312,
    emailContent,
    isSameTemplateName,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL');
    },
    save: template => {
      // 保存
      handleSaveEmailTemplate(that, template);
    }
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
  renderEmailTemplate,
  onCheckPin,
  onCheckPassword,
  getEmailTemplateList,
  applyTemplate,
  hideTemplateList,
  showTemplateModal,
  showEmailTemplateList
};
