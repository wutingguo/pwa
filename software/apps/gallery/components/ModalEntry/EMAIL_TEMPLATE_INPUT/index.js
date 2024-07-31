import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';

import { XModal, XPureComponent, XInput, XTextarea } from '@common/components';
import { NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';
import { select } from 'react-cookies';

class EMAIL_TEMPLATE_INPUT extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      templateName: 'Untilted',
      templateContent: '',
      isShowTemplateNmaeTip: false,
      templateNameTipContent: '',
      isSameTemplateName: false
    };
  }

  onTemplateNameChange = e => {
    const name = e.target.value.replace(/[ ]+/g, ' ');
    this.setState({ templateName: name });
  };

  onTextChange = e => {
    const name = e.target.value.replace(/[ ]+/g, ' ');
    this.setState({ templateContent: name });
  };

  componentDidMount() {
    const { data } = this.props;
    const emailContent = data.get('emailContent');
    const templateName = data.get('templateName');
    this.setState({
      templateContent: emailContent || '',
      templateName: templateName || 'Untilted'
    });
  }

  //校验 邮件模板名称
  validateEmailTemplateName = () => {
    // debugger
    const { templateName } = this.state;
    let templateNameTipContent = '';
    let isShowTemplateNmaeTip = false;
    if (!templateName) {
      isShowTemplateNmaeTip = true;
      templateNameTipContent = t('GALLERY_TEMPLATE_NAME_EMPTY');
    } else if (!NAME_REG.test(templateName)) {
      isShowTemplateNmaeTip = true;
      templateNameTipContent = t('GALLERY_TEMPLATE_NAME_ERROR');
    }
    this.setState({
      isShowTemplateNmaeTip,
      templateNameTipContent
    });

    return isShowTemplateNmaeTip;
  };

  // 保存 模板
  save = () => {
    const { data } = this.props;
    const { templateName, templateContent } = this.state;
    const save = data.get('save');
    if (this.validateEmailTemplateName()) {
      return;
    }
    this.setState({ isShowTemplateNmaeTip: false, templateNameTipContent: '' });

    save({ templateName, templateContent });
  };
  componentWillReceiveProps(nextProps) {
    // console.log('nextProps...', nextProps);
    const { data } = this.props;
    const isSameTemplateName = data.get('isSameTemplateName');
    this.setState({ isSameTemplateName });
  }

  render() {
    const { data } = this.props;
    // console.log('模板弹窗this.state///', this.state);
    const {
      templateName,
      templateContent,
      isShowTemplateNmaeTip,
      templateNameTipContent,
      isSameTemplateName
    } = this.state;
    const close = data.get('close');
    const title = data.get('title');

    const wrapClass = classNames('template-input-wrap', data.get('className'));
    const saveClass = classNames('save', { gray: 1 });
    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');

    const templateNameProps = {
      className: 'template-name-input',
      value: templateName,
      placeholder: '',
      onChange: this.onTemplateNameChange,
      isShowTip: isShowTemplateNmaeTip,
      tipContent: templateNameTipContent,
      maxLength: 50
    };

    const textareaProps = {
      className: 'template-textarea',
      value: templateContent,
      placeholder: '',
      onChanged: this.onTextChange,
      maxlength: 2500
    };
debugger
    return (
      <XModal
        className={wrapClass}
        styles={style}
        opened={true}
        onClosed={close}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        <div className="modal-title">{title}</div>
        <div className="modal-body-email">
          <div className="left">
            <div className="title">Template Name</div>
            <div className="input-area">
              <XInput {...templateNameProps} />
            </div>
          </div>
          <div className="right">
            <div className="title">Email Content (optional)</div>
            <div className="text-area">
              <XTextarea {...textareaProps} />
              <div className="textarea-tip"></div>
            </div>
          </div>
        </div>
        <div className="save" onClick={this.save}>
          Save
        </div>
      </XModal>
    );
  }
}

EMAIL_TEMPLATE_INPUT.propTypes = {
  data: PropTypes.object.isRequired
};

EMAIL_TEMPLATE_INPUT.defaultProps = {};

export default EMAIL_TEMPLATE_INPUT;
