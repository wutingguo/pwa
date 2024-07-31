import React from 'react';
import { withRouter } from 'react-router';
import equals from '@resource/lib/utils/compare';
import {
  XPureComponent
} from '@common/components';

import main from './handle/main';

import './index.scss';

class Preview extends XPureComponent {
  constructor(props) {
    super(props);

    const { match: { params } } = this.props;
    const { id } = params;

    this.state = {
      product_id: id,
      isRequesting: true,
      shareUrl: ''
    };
  }

  getCollectionDetail = (product_id) => {
    main.getCollectionDetail(this, product_id);
  };

  getShareUrl = (product_id) => {
    const {
      boundProjectActions
    } = this.props;
    const { getSlideshowShareUrl } = boundProjectActions;
    getSlideshowShareUrl(product_id).then(data => {
      const { data: shareUrl } = data;
      this.setState({
        shareUrl
      });
    });
  }

  componentDidMount() {
    const { product_id } = this.state;
    this.getCollectionDetail(product_id);
    this.getShareUrl(product_id);
  }

  render() {
    const { isRequesting } = this.state;
    return <div className="collection-preview-wrap">
      {!isRequesting && main.renderPreview(this)}
    </div>
  }
};

export default withRouter(Preview);
