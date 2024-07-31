import React, { Component } from 'react';
import PropTypes from 'prop-types';

class XUploadMoreButton extends Component {
  constructor(props) {
    super(props);
    this.onAddImages = this.onAddImages.bind(this);
    this.onAddMoreClick = this.onAddMoreClick.bind(this);
  }

  onAddImages(event) {
    if (event.target.value) {
      this.props.actions.onAddImages([...event.target.files]);
    }
  }

  onAddMoreClick() {
    this.inputFile.click();
  }

  render() {
    const { acceptFileType, multiple } = this.props;

    return (
      <div className="add-more-btn-container">
        <button className="button white" onClick={this.onAddMoreClick}>
          {t('UPLOADMODAL_ADD_MORE_PHOTOS')}
        </button>
        <input
          type="file"
          name="myfile"
          ref={node => {
            this.inputFile = node;
          }}
          accept={acceptFileType}
          multiple={multiple}
          onChange={this.onAddImages}
        />

        {this.props.children}
      </div>
    );
  }
}

XUploadMoreButton.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.shape({
    onAddImages: PropTypes.func.isRequired
  }).isRequired
};

XUploadMoreButton.defaultProps = {
  acceptFileType: 'image/jpeg,image/x-png,image/png',
  multiple: true
};

export default XUploadMoreButton;
