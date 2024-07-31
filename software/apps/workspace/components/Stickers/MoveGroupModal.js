import classNames from 'classnames';
import React, { Component } from 'react';

import './moveGroupModal.scss';

class MoveGroupModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCatId: '',
      isValidCat: false
    };

    this.onSelectCat = this.onSelectCat.bind(this);
    this.getRenderCat = this.getRenderCat.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  onSelectCat(item, e) {
    logEvent.addPageEvent({ name: 'YX_PC_StickerManager_Click_HiddenMenuSelectGroup' });
    this.setState({
      selectedCatId: item.uidpk,
      isValidCat: false
    });
    e.stopPropagation();
    e.preventDefault();
  }

  getRenderCat() {
    const { category = [] } = this.props;
    const { selectedCatId } = this.state;
    const html = [];

    category.forEach((item, index) => {
      const { name, uidpk } = item;
      const isSelected = selectedCatId === uidpk;
      const className = classNames('', {
        selected: isSelected
      });
      html.push(
        <li
          key={index}
          className={className}
          onClick={this.onSelectCat.bind(this, item)}
        >
          {name}
        </li>
      );
    });

    return html;
  }

  onOk(e) {
    const { actions } = this.props;
    const { handleOk } = actions;
    const { selectedCatId } = this.state;
    this.setState({
      isValidCat: false
    });
    if (selectedCatId) {
      handleOk(selectedCatId, e);
    } else {
      this.setState({
        isValidCat: true
      });
    }
  }

  render() {
    const { actions } = this.props;
    const { isValidCat } = this.state;
    const { handleClose } = actions;
    return (
      <div className="move-group-modal" title="">
        <div className="backdrop" />
        <div className="content">
          <ul className="grp-list clearfix">{this.getRenderCat()}</ul>
          <div className="btns clearfix">
            {
              isValidCat ? <div className="error-tip">请选择分组</div> : null
            }
            <a href="javascript:;" className="btn" onClick={this.onOk}>
              确定
          </a>
            <a
              href="javascript:;"
              className="btn btn-white2"
              onClick={handleClose}
            >
              取消
          </a>
          </div>
        </div>
      </div>
    );
  }
}

MoveGroupModal.propTypes = {};

MoveGroupModal.defaultProps = {
  actions: {
    handleClose: () => { },
    handleOk: () => { },
    handleCancel: () => { }
  }
};

export default MoveGroupModal;
