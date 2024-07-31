import React from 'react';
import { template, assign } from 'lodash';
import { SHOW_EMAIL_TEMPLATE_MODAL } from '@apps/gallery/constants/modalTypes';

const getEmailTemplateList = that => {
  const { boundProjectActions } = that.props;
  boundProjectActions.getEmailTemplateList().then(res => {
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
  boundProjectActions.updateEmailTemplate(data).then(res => {
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
const editEmailTemplateList = (that, item) => {
  // console.log(that, 'lll', item);
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { templateList, isSameTemplateName } = that.state;
  window.logEvent.addPageEvent({
    name: 'GalleryEmailTemplate_Click_Edit'
  });
  const params = {
    title: 'Edit Email Template',
    id: 123123122,
    templateName: item.template_name,
    emailContent: item.template_content,
    isSameTemplateName,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_EMAIL_TEMPLATE_MODAL');
    },
    save: template => {
      // 保存
      handleEditEmail(that, template, item);
    }
  };
  boundGlobalActions.showModal(SHOW_EMAIL_TEMPLATE_MODAL, params);
};

const deleteEmailTemplate = (that, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
  window.logEvent.addPageEvent({
    name: 'GalleryEmailTemplate_Click_Delete'
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
          boundProjectActions.deleteEmailTemplate(item).then(response => {
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
const showTemplateModal = that => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { emailContent = '', templateList, isSameTemplateName } = that.state;

  window.logEvent.addPageEvent({
    name: 'GalleryEmailTemplate_Click_AddNew'
  });
  that.setState({ showTemplateList: false });
  showModal(SHOW_EMAIL_TEMPLATE_MODAL, {
    // className: 'gallery-tutorial-wrapper',
    title: 'Edit Email Template',
    id: 123123122,
    emailContent,
    isSameTemplateName,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_EMAIL_TEMPLATE_MODAL');
    },
    save: template => {
      // 保存
      handleSaveEmailTemplate(that, template);
    }
  });
};
const showEmailTemplateList = that => {
  window.logEvent.addPageEvent({
    name: 'GalleryEmailTemplate_Click_InsertTemplate'
  });
  const { boundProjectActions } = that.props;
  if (that.state.showTemplateList) {
    that.setState({
      showTemplateList: false
    });
  } else {
    boundProjectActions.getEmailTemplateList().then(res => {
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
export default {
  getEmailTemplateList,
  showTemplateModal,
  showEmailTemplateList,
  editEmailTemplateList,
  deleteEmailTemplate
};
