import React from 'react';
import PropTypes from 'prop-types';
import { uploadStatus } from '../../constants/strings';
import { formatFileSize } from '@resource/lib/utils/math';
import XUploadItemControlButtons from './XUploadItemControlButtons';

function trimFileName(fileName) {
  if (fileName.length < 17) {
    return fileName;
  }
  return `${fileName.substr(0, 6)}...${fileName.substr(fileName.length - 10)}`;
}

const XUploadItemPlaceHolder = () => (
  <div className="list-row">
    <div className="column-file" />
    <div className="column-size" />
    <div className="column-progress" />
  </div>
);

const XUploadItemList = ({
  needPlaceHolder,
  defaultPlaceHolderNum,
  incompleteUploadImages,
  actions
}) => {
  const placeHolders = [];

  if (needPlaceHolder && incompleteUploadImages.length < defaultPlaceHolderNum) {
    const placeHolderNum = defaultPlaceHolderNum - incompleteUploadImages.length;

    for (let i = 0; i < placeHolderNum; i += 1) {
      placeHolders.push(<XUploadItemPlaceHolder />);
    }
  }

  return (
    <div className="list-body">
      {incompleteUploadImages.map(obj => {
        return (
          <div className="list-row" key={obj.guid}>
            <div className="column-file" title={obj.fileName}>
              {trimFileName(obj.fileName)}
            </div>
            <div className="column-size" title={obj.file.size}>
              {formatFileSize(obj.file.size)}
            </div>
            <div className="column-progress">
              {obj.status !== uploadStatus.FAIL ? (
                <div className="progress-container">
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${obj.percent}%` }} />
                  </div>
                  <span className="progress-label">{obj.percent}%</span>
                </div>
              ) : (
                <span className="error-text">{obj.errorText}</span>
              )}

              <XUploadItemControlButtons
                uploadImage={obj}
                actions={{
                  onRetry: actions.onRetry,
                  onDeleteItem: actions.onDeleteItem,
                  onShowHelp: actions.onShowHelp
                }}
              />
            </div>
          </div>
        );
      })}

      {placeHolders}
    </div>
  );
};

XUploadItemList.propTypes = {
  needPlaceHolder: PropTypes.bool,
  defaultPlaceHolderNum: PropTypes.number,
  incompleteUploadImages: PropTypes.arrayOf(
    PropTypes.shape({
      guid: PropTypes.string.isRequired,
      percent: PropTypes.number.isRequired,
      status: PropTypes.oneOf(Object.values(uploadStatus)),
      fileName: PropTypes.string.isRequired,
      errorText: PropTypes.string,
      isFatalError: PropTypes.bool,
      retryCount: PropTypes.number
    })
  ).isRequired,
  actions: PropTypes.shape({
    onDeleteItem: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
    onShowHelp: PropTypes.func
  }).isRequired
};

XUploadItemList.defaultProps = {
  needPlaceHolder: false,
  defaultPlaceHolderNum: 5
};

export default XUploadItemList;
