import qs from 'qs';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import BatchDownLoad from '@common/components/BatchDownLoad';

import mapDispatch from '@apps/aiphoto/redux/selector/mapDispatch';
import mapState from '@apps/aiphoto/redux/selector/mapState';

@connect(mapState, mapDispatch)
class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadUrl: '',
      percent: 0,
      downloadFileName: '',
    };
  }

  componentDidMount() {
    const { boundProjectActions } = this.props;
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { project_name, project_id, reGetDownloadLink, id, downloadLink = '' } = urlParams;

    const downloadUrl =
      localStorage.getItem(`downloadUrl_${project_id}`) || decodeURIComponent(downloadLink);

    if (downloadUrl && reGetDownloadLink === 'no' && project_id) {
      this.setState({
        downloadUrl: downloadUrl,
        percent: 0,
        downloadFileName: decodeURI(project_name),
      });
    } else if (
      reGetDownloadLink === 'yes' ||
      (!downloadUrl && reGetDownloadLink === 'no' && project_id)
    ) {
      // 链接过期需要重新请求
      boundProjectActions.getProjectExportUrl(id, project_id).then(res => {
        const { url } = res;
        if (url) {
          this.setState({
            downloadUrl: url,
            percent: 0,
            downloadFileName: decodeURI(project_name),
          });
        }
      });
    }
  }

  componentWillUnmount() {
    const { project_id } = this.state;
    localStorage.removeItem(`downloadUrl_${project_id}`);
  }

  render() {
    const { downloadUrl, percent, downloadFileName } = this.state;
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { uid } = urlParams;
    const dProps = {
      downloadType: 'project',
      projectDownloadProps: {
        downloadUrl,
        percent,
        downloadFileName,
      },
      ...this.props,
    };
    const extraInfo = uid ? { downloadUid: uid } : {};
    return <BatchDownLoad {...dProps} {...extraInfo} />;
  }
}

export default Download;
