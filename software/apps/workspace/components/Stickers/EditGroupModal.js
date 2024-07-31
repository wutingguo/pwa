import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './editGroupModal.scss';

class EditGroupModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      maxTextLength: 20,
      isValidName: false
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onNameChange(e) {
    const { value } = e.target;
    const { maxTextLength } = this.state;
    const reg = /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`.replace(reg, '');
    this.setState({
      name: newName,
      isValidName: false
    });
  }

  onOk(e) {
    const { actions } = this.props;
    const { handleOk } = actions;
    const { name } = this.state;
    this.setState({
      isValidName: false
    });
    if (name) {
      handleOk(name.trim(), e);
    } else {
      this.setState({
        isValidName: true
      });
    }
  }

  onKeyUp(e) {
    if (e && e.keyCode && e.keyCode === 13) {
      this.onOk(e);
    }
  }

  componentDidMount() {
    const { name } = this.props;
    this.setState({
      name
    });
  }

  render() {
    const { text, html, actions } = this.props;
    const { name, maxTextLength, isValidName } = this.state;
    const { handleClose, handleOk } = actions;
    return (
      <div className="edit-group-modal s-modal" title="">
        <div className="label">请输入分组名称</div>
        <div className="input-grp">
          <input
            type="text"
            placeholder="请输入名称"
            autoFocus
            value={name}
            maxLength={20}
            onChange={this.onNameChange}
            onKeyUp={this.onKeyUp}
          />
          <div className="tip">
            {name.length}/{maxTextLength}
          </div>
        </div>
        <div className="btns clearfix">
          {isValidName ? <div className="error-tip">请输入名称</div> : null}
          <a href="javascript:;" className="btn1" onClick={this.onOk}>
            确定
          </a>
          <a href="javascript:;" className="btn1 btn1-white" onClick={handleClose}>
            取消
          </a>
        </div>
      </div>
    );
  }
}

EditGroupModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired
  }).isRequired
};

EditGroupModal.defaultProps = {
  name: '',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};

export default EditGroupModal;
