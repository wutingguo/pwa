import classNames from 'classnames';
import { isEqual, template } from 'lodash';
import React, { Component, Fragment } from 'react';

import { GET_DOWNLOAD_URL_LINK, GET_ZIP_FILE_META_DATA } from '@resource/lib/constants/apiUrl';

import closePng from '@resource/static/icons/close.png';
import downloadPng from '@resource/static/icons/download2.png';
import indicate from '@resource/static/icons/indicate.png';
import loading from '@resource/static/icons/loading2.gif';
import pointPng from '@resource/static/icons/point.png';
import success from '@resource/static/icons/success_2.png';
import * as xhr from '@resource/websiteCommon/utils/xhr';

import BatchD from './batchDownload';

import './index.scss';

class Download extends Component {
  constructor(props) {
    super(props);
    const { useNewUI } = props;
    this.state = {
      downloadUrl: '',
      downloadFileName: '',
      fileCap: null,
      showPoint: false,
      btnText: useNewUI ? t('CLICK_START_DOWNLOAD') : t('RETOUCH_DOWNLOAD'),
      showErrTips: false,
      fileSize: 0,
    };
  }

  componentDidMount() {
    const { downloadUid, downloadType, projectDownloadProps } = this.props;
    if (downloadUid) {
      this.getDownload(downloadUid);
      this.getDownloadLoop(downloadUid);
      // this.getFileSize(downloadUid)
    }

    if (downloadType === 'project' && projectDownloadProps && projectDownloadProps.downloadUrl) {
      this.getDownloadProject(projectDownloadProps);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { downloadUid, projectDownloadProps } = this.props;
    if (downloadUid && !prevProps.downloadUid) {
      this.getDownload(downloadUid);
      this.getDownloadLoop(downloadUid);
    }

    if (projectDownloadProps && !isEqual(projectDownloadProps, prevProps.projectDownloadProps)) {
      this.getDownloadProject(projectDownloadProps);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getBtnText = () => {
    const { useNewUI } = this.props;
    return useNewUI ? t('CLICK_START_DOWNLOAD') : t('RETOUCH_DOWNLOAD');
  };

  getDownloadLoop = downloadUid => {
    this.timer = setInterval(() => {
      this.getDownload(downloadUid);
    }, 3000);
  };

  getDownload = downloadUid => {
    const { useNewUI } = this.props;
    this.getDownloadLink(downloadUid).then(linkRes => {
      if (linkRes) {
        this.timer && clearInterval(this.timer);
        const linkArr = linkRes.split('?')[0].split('/');
        const fileName = linkArr[linkArr.length - 1];
         this.getFileSize(downloadUid)
        this.setState(
          {
            downloadUrl:
              linkRes.indexOf('https') !== -1 ? linkRes : linkRes.replace('http', 'https'),
            // null,
            percent: 0,
            downloadFileName: decodeURI(fileName),
          },
          () => {
            if (!useNewUI) {
              this.download();
            }
          }
        );
      }
    });
  };

  getDownloadLink = downloadUid => {
    const { urls } = this.props;
    const url = template(GET_DOWNLOAD_URL_LINK)({
      saasBaseUrl: urls.get('saasBaseUrl'),
      guid: downloadUid,
    });

    return new Promise((resolve, reject) => {
      xhr
        .get(url)
        .then(res => {
          if (res.ret_code === 200000) {
            resolve(res.data);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  getFileSize = downloadUid => {
    const { urls } = this.props;
    const url = template(GET_ZIP_FILE_META_DATA)({
      saasBaseUrl: urls.get('saasBaseUrl'),
      guid: downloadUid,
    });

    return new Promise((resolve, reject) => {
      xhr
        .get(url)
        .then(res => {
          if (res.ret_code === 200000) {
            console.log('new file size', res.data.file_size);
            this.setState({fileSize: res.data.file_size})
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  getDownloadProject = projectDownloadProps => {
    const { downloadFileName, ...rest } = projectDownloadProps || {};
    this.setState(
      {
        downloadFileName: decodeURI(downloadFileName),
        ...rest,
      },
      () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('micromessenger') === -1) {
          this.download({ allowBatch: true });
        }
      }
    );
  };

  download = (extra = {}) => {
    const { downloadFileName, percent: _precent, downloadUrl } = this.state;
    if (_precent < 100 && _precent > 0) {
      return;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('micromessenger') !== -1) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFileName;
      link.target = '__blank';
      link.click();
      return;
    }
    new BatchD({
      url: downloadUrl,
      name: downloadFileName,
      sliceSize: 2 * 1024 * 1024,
      ...extra,
      onProgress: ({ percent, estimate }) => {
        this.setState({
          percent,
          btnText: percent === 0 ? this.state.btnText : `${t('DOWNLOADING')}${percent}%`,
        });
      },
      onSuccess: file => {
        this.setState({
          percent: 0,
          btnText: this.getBtnText(),
        });
      },
      callback: (text, length) => {
        this.setState({
          btnText: text || this.getBtnText(),
          fileCap: length ? length : this.state.fileCap,
        });
        setTimeout(() => {
          this.setState({
            percent: 0,
          });
        }, 300);
      },
    });
  };

  pointMessage = () => {
    clearTimeout(this.setTimeoutTimer);
    this.setState(
      {
        showPoint: true,
      },
      () => {
        this.setTimeoutTimer = setTimeout(() => {
          this.setState({
            showPoint: false,
          });
        }, 3000);
      }
    );
  };

  getTips = (downloadUrl, fileCap, downloadUrlError, useNewUI) => {
    const { btnText } = this.state;
    if (downloadUrlError) {
      return (
        <div className="tips">
          <div>{t('DOWNLOAD_FILE_NOT_EXIST')}</div>
          <div>{t('COLLECTION_WAS_DELETED')}</div>
        </div>
      );
    }

    console.log('downloadUrl:----- ', downloadUrl);
    if (!downloadUrl) {
      if (useNewUI) {
        return (
          <div className="newTips">
            <div className="loadingText">
              <img src={loading} />
              {t('PREPARING_YOUR_PHOTOS')}
            </div>
            {__isCN__ ? (
              <div className="waitingText">
                可能需要一段时间，您可以离开当前页面，完成后，我们会在
                <span style={{ color: '#0077CC', cursor: 'pointer' }} onClick={this.pointMessage}>
                  &nbsp;工作台消息中心&nbsp;
                </span>
                提醒您 如果您愿意，您也可以停留在当前页面继续等待
              </div>
            ) : (
              <div className="waitingText">
                This will take a few minutes. You will receive a
                <span style={{ color: '#0077CC', cursor: 'pointer' }} onClick={this.pointMessage}>
                  &nbsp;Notification&nbsp;
                </span>
                in your Workspace once your download is ready.
                <br />
                You can also stay on this page if your prefer.
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="tips">
          <div>{t('SYSTEM_PREPARING_DOWNLOAD')}</div>
          <div>{t('PLEASE_WAIT')}</div>
        </div>
      );
    }

    if (useNewUI) {
      return (
        <div className="tips">
          <div className="successText">
            <img src={success} />
            {t('YOUR_PHOTOS_ARE_READY_TO_DOWNLOAD')}
          </div>
          <div className="tipsText">{btnText}</div>
        </div>
      );
    }

    return (
      <div className="tips">
        {fileCap && (
          <div className="fileCap">
            {t('FILE_SIZE')} {(fileCap / 1024 / 1024).toFixed(2)}M
          </div>
        )}
        <div>{t('PREPARE_DOWNLAOD_TIP')}</div>
      </div>
    );
  };

  openErrTips = (e, status) => {
    e.stopPropagation();
    this.setState({
      showErrTips: status,
    });
  };

  renderContent = () => {
    const { downloadFileName, downloadUrl, percent = 0, btnText, fileCap, fileSize } = this.state;
    const { downloadUrlError, useNewUI = false } = this.props;
    if (useNewUI) {
      return (
        <Fragment>
          {/* <div className="fileName" title={downloadFileName}>
            {downloadFileName}
          </div> */}
          {this.getTips(downloadUrl, fileCap, downloadUrlError, useNewUI)}
          {downloadUrl && !downloadUrlError && (
            <div
              className={`downloadBtn newUIDownloadBtn`}
              onClick={() => this.download({ allowBatch: true })}
            >
              <img src={downloadPng} />
              <span className="filename" title={downloadFileName}>
                {downloadFileName}
              </span>
              {
                fileSize && <span className="size">{ (fileSize / 1024 / 1024).toFixed(2)}M</span>
              }
              <span
                className={`percent ${!percent ? 'disappearance' : ''}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="title">{t('YOUR_DOWNLOAD_FILE')}</div>
        <div className="fileName" title={downloadFileName}>
          {downloadFileName}
        </div>
        {this.getTips(downloadUrl, fileCap, downloadUrlError)}
        {downloadUrl && !downloadUrlError && (
          <div
            className={`downloadBtn ${percent ? 'percenting' : ''}`}
            onClick={() => this.download({ allowBatch: true })}
          >
            <span className="btnText">{btnText}</span>
            <span className="percent" style={{ width: `${percent}%` }} />
          </div>
        )}
      </Fragment>
    );
  };

  copyLink = () => {
    const { boundGlobalActions } = this.props;
    const { downloadUrl } = this.state;
    const obj = document.querySelector('#textToCopy');
    obj.select();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(downloadUrl);
    } else {
      document.execCommand('Copy');
    }
    window.logEvent.addPageEvent({
      name: 'GalleryDownloadHelp_Click_CopyLink',
    });
    boundGlobalActions.addNotification({
      message: '链接已复制',
      level: 'success',
      autoDismiss: 2,
    });
  };

  downloadXunlei = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryDownloadHelp_Click_DownloadXunlei',
    });
    window.open('/clientassets-cunxin-saas/portal/softwarePackages/迅雷安装包.zip');
  };

  render() {
    const { useNewUI = false } = this.props;
    const { showPoint, showErrTips, downloadUrl } = this.state;
    let imgSrc = __isCN__
      ? '/clientassets-cunxin-saas/portal/images/pc/aiphoto/download.jpg'
      : '/clientassets-zno-saas/portal/images/pc/aiphoto/down0623.jpg';
    if (useNewUI) {
      imgSrc = __isCN__
        ? '/clientassets-cunxin-saas/portal/images/pc/aiphoto/new-download.png'
        : '/clientassets/portal/v2/images/saas/downloadcover.png';
    }
    const pointClass = classNames('pointWrapper', { showPoint: showPoint, USPoint: !__isCN__ });
    return (
      <div
        className={`collectionsDownloadWrapper ${
          useNewUI ? 'newUICollectionsDownloadWrapper' : ''
        }`}
      >
        <div className={pointClass}>
          <img src={__isCN__ ? pointPng : indicate} />
        </div>
        <div
          className="closeTab"
          onClick={() => {
            window.close();
          }}
        >
          {`< ${t('BACK')}`}
        </div>
        {__isCN__ && (
          <div
            className={`${useNewUI ? 'downloadErrTips' : 'hidden'} ${showErrTips ? 'show' : ''}`}
            onClick={e => this.openErrTips(e, true)}
          >
            {!showErrTips ? (
              <span className={`${showErrTips ? 'hidden' : 'show'}`}>浏览器下载中断怎么办？</span>
            ) : null}
            {showErrTips ? (
              <div className={`${!showErrTips ? 'hidden' : 'errTipsContent'}`}>
                <img src={closePng} onClick={e => this.openErrTips(e, false)} />
                <div className="errText">
                  <div>
                    对于小于2G的文件，浏览器一般能够顺利完成文件的下载，建议您返回前一级页面，直接点击文件开始下载
                  </div>
                  <div>
                    对于超过2G的文件，浏览器可能会由于负荷过大而下载中断，建议您复制下载链接到迅雷中完成下载，参看如下提示
                  </div>
                </div>
                <div className="errBtns">
                  <span onClick={this.downloadXunlei}>下载迅雷</span>
                  <span onClick={this.copyLink}>复制下载链接</span>
                  <input
                    type="text"
                    value={downloadUrl}
                    id="textToCopy"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}
        <img src={imgSrc} style={{ width: 300, marginBottom: 16 }} />
        {this.renderContent()}
      </div>
    );
  }
}

export default Download;
