import React from 'react';
import { template, assign } from 'lodash';
import { SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL } from '@apps/slide-show/constants/modalTypes';

const getEmailTemplateList = that => {
  const { boundProjectActions } = that.props;
  boundProjectActions.getSlideshowEmailTemplateList().then(res => {
    if (res.ret_code === 200000 && res.data) {
      that.setState({
        templateList: res.data,
        init: true
      });
    }
  });
};
const handleEditEmail = (that, template, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { templateName, templateContent } = template;

  const data = {
    id: item.id,
    template_name: templateName,
    template_content: templateContent
  };
  boundProjectActions.updateSlideshowEmailTemplate(data).then(res => {
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
const editEmailTemplateList = (that, item) => {
  // console.log(that, 'lll', item);
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { templateList, isSameTemplateName } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_Edit'
  });
  const params = {
    title: 'Edit Email Template',
    id: 123123122,
    templateName: item.template_name,
    emailContent: item.template_content,
    isSameTemplateName,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL');
    },
    save: template => {
      // 保存
      handleEditEmail(that, template, item);
    }
  };
  boundGlobalActions.showModal(SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL, params);
};

const deleteEmailTemplate = (that, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_Delete'
  });
  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    message: t('SURE_TO_DELETE_EMAIL_WATERMARK'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          boundProjectActions.deleteSlideshowEmailTemplate(item).then(response => {
            // addNotification({
            //   message: t('COLLECTION_DELETE_SUCCESSED_TOAST', { collectionName }),
            //   level: 'success',
            //   autoDismiss: 2
            // });
            that.getEmailTemplateList();
            hideConfirm();
          });
        }
      }
    ]
  };
  showConfirm(data);
};
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
const showTemplateModal = that => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { emailContent = '', templateList, isSameTemplateName } = that.state;

  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_AddNew'
  });
  // debugger
  that.setState({ showTemplateList: false });
  showModal(SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL, {
    // className: 'gallery-tutorial-wrapper',
    title: 'Edit Email Template',
    id: 123123122,
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
const showEmailTemplateList = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowEmailTemplate_Click_InsertTemplate'
  });
  const { boundProjectActions } = that.props;
  if (that.state.showTemplateList) {
    that.setState({
      showTemplateList: false
    });
  } else {
    boundProjectActions.getSlideshowEmailTemplateList().then(res => {
      if (res.ret_code === 200000 && res.data) {
        that.setState({
          templateList: res.data,
          showTemplateList: true
        });
      }
    });
  }
  // that.setState({
  //   showTemplateList: !that.state.showTemplateList
  // });
};
const renderEmailTemplate = that => {
  const {
    emailTheme,
    match: {
      params: { id }
    },
    pinSetting
  } = that.props;
  const themeContent = emailTheme.get('theme_content');
  const collectionName = emailTheme.get('collection_name');
  const linkurl = emailTheme.get('link_url');
  const emailCoverUrl = emailTheme.get('emailCoverUrl');
  // exif // TODO
  const imgRot = emailTheme.get('imgRot');

  const { showDownloadPin, showDownloadPassword } = that.state;
  const pin = pinSetting && pinSetting.get('pin');
  const password = pinSetting && pinSetting.get('gallery_password');
  const passwordSwitch = pinSetting && pinSetting.get('gallery_password_switch');

  // console.log('themeContent,,,,', themeContent);

  return template(themeContent)({
    collection_name: collectionName,
    collection_cover_url: emailCoverUrl,
    email_share_link: linkurl,
    email_content: '',
    pin,
    password,
    // exif
    collection_cover_rotate: imgRot,

    viewPhotosBtn: t('SHSRE_VIEW_POHOTOS'),
    //自定义样式
    cover_image_link_class: `disabled-link ${showDownloadPin ? 'no-padding' : ''}`,
    pin_wrapper_class: !showDownloadPin ? 'hide-pin-content' : '',
    password_wrapper_class: passwordSwitch && showDownloadPassword ? '' : 'hide-password-content'
  });
};
export default {
  getEmailTemplateList,
  showTemplateModal,
  showEmailTemplateList,
  editEmailTemplateList,
  deleteEmailTemplate
};
