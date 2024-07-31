import React, { Component, Fragment } from 'react';
import { XFileUpload, XIcon } from '@common/components';
import main from './handle/main';
import XButton from '@resource/components/XButton';
import Email from './img/1.png';
import './index.scss';

class EmailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateList: [],
      init: false,
      showTemplateList: false
    };
  }
  componentDidMount() {
    this.getEmailTemplateList();
    // this.setState({init:true})
  }
  deleteEmailTemplate = (...opt) => main.deleteEmailTemplate(this, ...opt);
  showTemplateModal = () => main.showTemplateModal(this);
  getEmailTemplateList = () => main.getEmailTemplateList(this);
  editEmailTemplateList = (...opt) => main.editEmailTemplateList(this, ...opt);
  render() {
    const { init, templateList } = this.state;
    return (
      <div className="email-list">
        {templateList.map(item => (
          <div className="item" key={item.id}>
            <div className="pic">
              <img src={Email} />
            </div>
            <div className="name">
              <div className="text">{item.template_name}</div>
              <div className="extra">
                <XIcon
                  type="rename"
                  iconWidth={16}
                  iconHeight={16}
                  onClick={() => this.editEmailTemplateList(item)}
                />
                <XIcon
                  type="delete"
                  iconWidth={16}
                  iconHeight={16}
                  onClick={() => this.deleteEmailTemplate(item)}
                />
              </div>
            </div>
          </div>
        ))}
        {init && templateList.length < 10 ? (
          <div className="item add">
            <XButton onClick={this.showTemplateModal}>
              <span style={{ color: '#fff', fontSize: '14px' }}>{t('ADD_EMAIL_TEMPTATE')}</span>
            </XButton>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default EmailList;
