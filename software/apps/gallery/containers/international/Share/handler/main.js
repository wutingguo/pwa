import { assign, template } from 'lodash';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { SAAS_SEND_COVER_URL } from '@resource/lib/constants/apiUrl';
import { NAME_REG, SPACE_REG, emailReg } from '@resource/lib/constants/reg';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import {
  GET_DIRECT_LINK_MODAL,
  SHOW_EMAIL_TEMPLATE_MODAL,
} from '@apps/gallery/constants/modalTypes';

const didMount = that => {
  const {
    match: { params },
    boundProjectActions,
  } = that.props;
  const { id } = params;
  boundProjectActions.getEmailShareEmailTheme(id, 3).then(res => {
    const { emailTheme } = that.props;
    if (emailTheme && emailTheme.size) {
      that.renderEmailTemplate();
      that.setState({
        emailSubject: t('SHARE_GALLREY_EMAIL_THEME', {
          collectionName: emailTheme.get('collection_name'),
        }),
      });
    }
  });
  boundProjectActions.getPinSetting(id);
};

const willReceiveProps = (that, nextProps) => {
  const { emailTheme } = nextProps;
  if (emailTheme && emailTheme.size) {
    that.setState({
      emailSubject: t('SHARE_GALLREY_EMAIL_THEME', {
        collectionName: emailTheme.get('collection_name'),
      }),
    });
  }
};

// 返回详情页
const onBack = that => {
  const {
    history,
    match: {
      params: { id },
    },
  } = that.props;
  history.push(`/software/gallery/collection/${id}/photos`);
};

// 获取直白链接
const onGetDirectLink = (that, params = {}) => {
  const { estoreInfo } = that.props;
  window.logEvent.addPageEvent({
    name: 'GalleryShare_Click_GetLink',
  });

  const { match, boundGlobalActions, boundProjectActions } = that.props;
  const { id } = match ? match.params : params;
  const data = {
    title: t('SHARE_GET_DIRECT_LINK'),
    topic: t('SHARE_GET_DIRECT_TOPIC'),
    tip: t('SHARE_GET_DIRECT_TIP'),
    copyBtnText: t('SHARE_GET_DIRECT_BTN_COPY'),
    copiedBtnText: t('SHARE_GET_DIRECT_BTN_COPIED'),
    handleCopy: () => {},
    close: () => {
      boundGlobalActions.hideModal(GET_DIRECT_LINK_MODAL);
    },
  };
  boundProjectActions.getEmailShareDirectLink(id).then(res => {
    let { share_link_url } = res.data;
    // 在存在estoreId时 把id补充到link中
    // if (estoreInfo && estoreInfo.id) {
    //   share_link_url += `&storeId=${estoreInfo.id}`;
    // }
    boundGlobalActions.showModal(
      GET_DIRECT_LINK_MODAL,
      assign(data, { shareDirectLink: share_link_url })
    );
  });
};

// 邮箱
const onEmailChange = (that, e) => {
  const shareEmail = e.target.value;
  that.setState({
    shareEmail,
    isShowEmailTip: !!shareEmail ? false : true,
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
  document.querySelector('#preview-custom-message').innerText = emailContent;
  that.setState({ emailContent });
};

// 拷贝
const onSendCopy = (that, e) => {
  const { checked } = e;
  // console.log('checkbox: ', e);
  that.setState({
    sendCopy: checked,
  });
};

// 改变Download Pin的状态
const changePinStatus = (that, e) => {
  const { checked } = e;
  const { emailContent } = that.state;
  that.setState(
    {
      showDownloadPin: checked,
    },
    () => {
      document.querySelector('#preview-custom-message').innerText = emailContent;
    }
  );
};

// 改变Download Pin的状态
const changePasswordStatus = (that, e) => {
  const { checked } = e;
  that.setState({
    showDownloadPassword: checked,
  });
};

const validateEmail = that => {
  const { shareEmail } = that.state;
  const emailRequiredTip = t('SHARE_EMAIL_REQUIER_TIP');
  const emailIllegalTip = t('SHARE_EMAIL_ILLEGAL_TIP');
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
    emailTipContent,
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
    subjectTipContent,
  });

  return !isShowSubjectTip;
};

const onSendEmailInvite = (that, body) => {
  const { send_me_copy, download_with_pin, collection_uid, gallery_password_switch } = body;

  window.logEvent.addPageEvent({
    name: 'GallerySharepopup_Click_Sent',
    SendMeACopy: __isCN__ ? undefined : send_me_copy ? 'On' : 'Off',
    DownloadPIN: __isCN__ ? undefined : download_with_pin ? 'On' : 'Off',
    collectionId: collection_uid,
    CollectionPassword: __isCN__ ? undefined : gallery_password_switch ? 'On' : 'Off',
  });

  const { boundProjectActions } = that.props;
  const { sendEmailInvite } = boundProjectActions;

  return sendEmailInvite(body);
};

const handleSendInvite = (that, body) => {
  const { boundGlobalActions, boundProjectActions, emailTheme } = that.props;

  const { addNotification, hideConfirm } = boundGlobalActions;
  const { sendEmailInvite } = boundProjectActions;

  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    title: `${t('SHARE_SEND_INVITES')}?`,
    message: t('SHARE_SEND_INVITES_TIP'),
    style: { width: '400px' },
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_CANCEL'),
        onClick: hideConfirm,
      },
      {
        className: 'pwa-btn',
        text: t('SHARE_SEND_INVITES_BTN_SEND'),
        onClick: () => {
          onSendEmailInvite(that, body).then(
            res => {
              console.log('res: ', res);
              addNotification({
                message: t('SHARE_SEND_INVITE_SUCCESSED'),
                level: 'success',
                autoDismiss: 2,
              });
              document.querySelector('#preview-custom-message').innerText = '';
              that.setState({
                shareEmail: '',
                emailSubject: t('SHARE_GALLREY_EMAIL_THEME', {
                  collectionName: emailTheme.get('collection_name'),
                }),
                emailContent: '',
                sendCopy: true,
              });
            },
            error => {
              console.log(error);
              addNotification({
                message: t('SHARE_SEND_INVITE_FAILED'),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };
  boundGlobalActions.showConfirm(data);
};

// 发送邀请
const onSendInvite = that => {
  window.logEvent.addPageEvent({
    name: 'GalleryShare_Click_SentInvite',
  });

  const {
    shareEmail,
    emailSubject,
    emailContent,
    sendCopy,
    showDownloadPin,
    showDownloadPassword,
  } = that.state;
  const {
    match: { params },
    pinSetting,
    emailTheme,
    baseUrl,
  } = that.props;
  const { id } = params;
  const themeUid = emailTheme.get('theme_uid');
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  // exif // TODO
  const imgRot = emailTheme.get('imgRot');
  const passwordSwitch = pinSetting && pinSetting.get('gallery_password_switch');
  const sendCoverUrl = template(SAAS_SEND_COVER_URL)({
    galleryBaseUrl: baseUrl,
    collection_uid: id,
    thumbnail_size: thumbnailSizeTypes.SIZE_1000,
    cover_version: emailTheme.getIn(['cover', 'cover_version']),
  });

  if (validateEmail(that) && validateSubject(that)) {
    const body = {
      collection_uid: id,
      share_email: shareEmail,
      email_subject: emailSubject,
      email_content: emailContent
        .replace(/\r\n/g, '<br/>')
        .replace(/\n/g, '<br/>')
        .replace(/\s/g, ' '),
      send_me_copy: +sendCopy,
      theme_uid: themeUid,
      cover_url: sendCoverUrl,
      // exif
      collection_cover_rotate: imgRot,
      download_with_pin: showDownloadPin,
      gallery_password_switch: passwordSwitch && showDownloadPassword,
    };

    handleSendInvite(that, body);
  }
};

const renderEmailTemplate = async that => {
  const {
    emailTheme,
    match: {
      params: { id },
    },
    pinSetting,
  } = that.props;
  const themeContent = emailTheme.get('theme_content');
  const collectionName = emailTheme.get('collection_name');
  const linkurl = emailTheme.get('link_url');
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  // exif // TODO
  const orientation = emailTheme.getIn(['cover', 'orientation']) || 1;
  const coverUrl = await getOrientationAppliedImage(emailCoverUrl, orientation);

  const { showDownloadPin, showDownloadPassword } = that.state;
  const pin = pinSetting && pinSetting.get('pin');
  const password = pinSetting && pinSetting.get('gallery_password');
  const passwordSwitch = pinSetting && pinSetting.get('gallery_password_switch');

  // console.log('themeContent,,,,', themeContent);
  const renderEmail = template(themeContent)({
    collection_name: collectionName,
    collection_cover_url: coverUrl,
    email_share_link: linkurl,
    email_content: '',
    pin,
    password,
    // exif
    collection_cover_rotate: 0,

    viewPhotosBtn: t('SHSRE_VIEW_POHOTOS'),
    //自定义样式
    cover_image_link_class: `disabled-link ${showDownloadPin ? 'no-padding' : ''}`,
    pin_wrapper_class: !showDownloadPin ? 'hide-pin-content' : '',
    password_wrapper_class: passwordSwitch && showDownloadPassword ? '' : 'hide-password-content',
  });
  that.setState({
    renderEmail,
  });
  return renderEmail;
};

const hideTemplateList = that => {
  that.setState({
    showTemplateList: false,
  });
};

const showEmailTemplateList = that => {
  window.logEvent.addPageEvent({
    name: 'GalleryEmailTemplate_Click_InsertTemplate',
  });
  const { boundProjectActions } = that.props;
  that.setState({
    showTemplateList: true,
  });
  return;
  if (that.state.showTemplateList) {
    that.setState({
      showTemplateList: false,
    });
  } else {
    boundProjectActions.getEmailTemplateList().then(res => {
      if (res.ret_code === 200000 && res.data) {
        that.setState({
          templateList: res.data,
          showTemplateList: true,
        });
      }
    });
  }
};
//获取 邮件模板列表
const getEmailTemplateList = that => {
  const { boundProjectActions } = that.props;
  boundProjectActions.getEmailTemplateList().then(res => {
    if (res.ret_code === 200000 && res.data) {
      that.setState({
        templateList: res.data,
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
      showTemplateList: false,
    },
    () => {
      boundGlobalActions.addNotification({
        message: 'Template inserted successfully',
        level: 'success',
        autoDismiss: 2,
      });
    }
  );
};

// 保存邮件模板
const handleSaveEmailTemplate = (that, template) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { templateName, templateContent } = template;

  const data = {
    template_name: templateName,
    template_content: templateContent,
  };
  boundProjectActions.addEmailTemplate(data).then(res => {
    // console.log('res,,,,', res);
    if (res.ret_code === 200000) {
      boundGlobalActions.hideModal('SHOW_EMAIL_TEMPLATE_MODAL');

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
    name: 'GalleryEmailTemplate_Click_SaveAsNew',
  });
  that.setState({ showTemplateList: false });
  showModal(SHOW_EMAIL_TEMPLATE_MODAL, {
    // className: 'gallery-tutorial-wrapper',
    title: 'Edit Email Template',
    id: 12312312,
    emailContent,
    isSameTemplateName,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_EMAIL_TEMPLATE_MODAL');
    },
    save: template => {
      // 保存
      handleSaveEmailTemplate(that, template);
    },
  });
};

export default {
  didMount,
  willReceiveProps,
  onEmailChange,
  onSubjectChange,
  onTextChange,
  onSendCopy,
  changePinStatus,
  onSendInvite,
  onBack,
  onGetDirectLink,
  renderEmailTemplate,
  changePasswordStatus,
  getEmailTemplateList,
  showTemplateModal,
  applyTemplate,
  showEmailTemplateList,
  hideTemplateList,
};
