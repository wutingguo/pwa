import React, { Component } from 'react';
import qs from 'qs';
import BatchDownLoad from '@common/components/BatchDownLoad';

class Download extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { uid } = urlParams;

    return <BatchDownLoad useNewUI={true} downloadUid={uid} {...this.props} />;
  }
}

export default Download;
