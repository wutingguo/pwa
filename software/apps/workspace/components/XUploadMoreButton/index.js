import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class XUploadMoreButton extends Component {
  constructor(props) {
    super(props);
    this.onAddImages = this.onAddImages.bind(this);
    this.onAddMoreClick = this.onAddMoreClick.bind(this);
  }

  onAddImages(event) {
    if (event.target.value) {
      this.props.actions.onAddImages([].slice.call(event.target.files, 0));
      this.inputFile.value = '';

      logEvent.addPageEvent({
        name: 'AddMore'
      });
    }
  }

  onAddMoreClick() {
    const { actions } = this.props;
    const { onClickAddPhoto, onTracker } = actions;
    this.inputFile.click();
    onClickAddPhoto && onClickAddPhoto();
    logEvent.addPageEvent({
      name: 'Click_AddPhotos'
    });

  }

  render() {
    const buttonContainerClassName = classNames(
      'add-more-btn-container',
      this.props.className
    );
    return (
      <div className={buttonContainerClassName} id="addPhotoBtn">
        <button className="button" onMouseDown={this.onAddMoreClick}>
          {this.props.label}
        </button>
        <input
          type="file"
          name="myfile"
          ref={node => {
            this.inputFile = node;
          }}
          accept="image/jpeg,image/x-png,image/png"
          multiple
          onChange={this.onAddImages}
        />

        {this.props.children}
      </div>
    );
  }
}

XUploadMoreButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  actions: PropTypes.shape({
    onAddImages: PropTypes.func.isRequired
  }).isRequired
};

XUploadMoreButton.defaultProps = {
  label: '添加更多照片'
};

export default XUploadMoreButton;
