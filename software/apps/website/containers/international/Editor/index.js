import React from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import WebsitePresets from '@apps/website/components/WebsitePresets';

import './index.scss';

class WebsiteEditor extends XPureComponent {
  constructor(props) {
    super(props);
  }
  state = {};

  componentDidMount() {
    const { boundGlobalActions } = this.props;
  }
  componentWillReceiveProps() {}

  render() {
    const { boundGlobalActions } = this.props;
    const {} = this.state;

    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get('id');
    const name = urlParams.get('name');
    const editUrl = id ? `/website/${id}`: `/website?name=${name}`

    return (
      <div className="website-editor-page-container">
        <iframe
          style={{ width: '100%', height: "calc(100vh - 64px)", border: 'none'}}
          src={editUrl}
        ></iframe>
      </div>
    );
  }
}

export default WebsiteEditor;
