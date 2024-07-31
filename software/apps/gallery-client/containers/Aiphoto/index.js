import Immutable, { fromJS } from 'immutable';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import * as cache from '@resource/lib/utils/cache';

import { AIGroupsModal } from '@common/components/ModalEntry';

import * as localModalTypes from '@apps/gallery-client/constants/modalTypes';
import mapDispatch from '@apps/gallery-client/redux/selector/mapDispatch';
import mapState from '@apps/gallery-client/redux/selector/mapState';

import EditUserPhone from './EditUserPhone';

import './index.scss';

@connect(mapState, mapDispatch)
class Aiphoto extends XPureComponent {
  constructor(props) {
    super(props);
  }
  // openAimodal = () => {
  //     const {
  //         boundGlobalActions,
  //         qs
  //     } = this.props;
  //     const collection_uid = qs.get('collection_uid');

  //     boundGlobalActions.showModal(localModalTypes.AI_GROUPS_MODAL, {
  //         collectionDetail: fromJS({
  //             enc_collection_uid: collection_uid
  //         }),
  //     });
  // }
  freshReader = () => {
    this.forceUpdate();
  };
  render() {
    const { isLoadCollectionCompleted, boundGlobalActions, urls, qs } = this.props;
    if (!isLoadCollectionCompleted) {
      return <XLoading />;
    }
    const aiFaceUserEditPhone = cache.get('aiFaceUserEditPhone');
    const collection_uid = qs.get('collection_uid');
    const data = fromJS({
      collectionDetail: {
        enc_collection_uid: collection_uid,
      },
      enterType: 'galleryClient',
    });

    const parms = {
      boundGlobalActions,
      urls,
      closeModal: () => {},
    };
    return (
      <StickyContainer>
        <div className="main-container">
          {aiFaceUserEditPhone !== collection_uid ? (
            <EditUserPhone {...this.props} freshReader={this.freshReader} />
          ) : (
            <AIGroupsModal {...parms} data={data} />
          )}
        </div>
      </StickyContainer>
    );
  }
}

export default Aiphoto;
