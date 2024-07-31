import React, { Component } from 'react';
import qs from 'qs';
import { connect } from 'react-redux';
import BatchDownLoad from '@common/components/BatchDownLoad';
import mapState from '@apps/aiphoto/redux/selector/mapState';
import mapDispatch from '@apps/aiphoto/redux/selector/mapDispatch';
@connect(mapState, mapDispatch)
class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadUid: '',
      downloadUrlError: false
    };
  }

  componentDidMount() {
    const { boundProjectActions } = this.props;
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { collectionUid } = urlParams;

    boundProjectActions.getDownloadUUID(collectionUid).then(res => {
      const { result_code, result } = res;
      if (result_code === 1000) {
        this.setState({
          downloadUid: result
        });
      } else if (result_code === 1001) {
        this.setState({
          downloadUrlError: true
        });
      }
    });
  }

  render() {
    const { downloadUid, downloadUrlError } = this.state;
    const dProps = {
      downloadUid,
      downloadUrlError,
      ...this.props
    };

    return <BatchDownLoad {...dProps} />;
  }
}

export default Download;
