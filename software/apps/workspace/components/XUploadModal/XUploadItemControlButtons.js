import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uploadStatus } from '../../constants/strings';

class XUploadItemControlButtons extends Component {
  constructor(props) {
    super(props);

    this.onRetry = this.onRetry.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
  }

  onRetry() {
    this.props.actions.onRetry(this.props.uploadImage.guid);
  }

  onDeleteItem() {
    this.props.actions.onDeleteItem(this.props.uploadImage.guid);
  }

  render() {
    const { uploadImage, actions } = this.props;

    if (!uploadImage.isFatalError) {
      return (
        <div className="control-btns">
          {uploadImage.status === uploadStatus.FAIL ? (
            uploadImage.retryCount < 2 || !actions.onShowHelp ? (
              <i className="icon icon-retry" onClick={this.onRetry} />
            ) : (
              null
            )
          ) : null}

          <i className="icon icon-delete" onClick={this.onDeleteItem} />
        </div>
      );
    }
    return <div className="fatal-error">{t('FAILED')}</div>;
  }
}

XUploadItemControlButtons.propTypes = {
  uploadImage: PropTypes.shape({
    guid: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(uploadStatus))
  }).isRequired,
  actions: PropTypes.shape({
    onRetry: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onShowHelp: PropTypes.func
  }).isRequired
};

export default XUploadItemControlButtons;
