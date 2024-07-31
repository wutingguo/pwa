import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import XEditor from '@resource/components/XEditor';
import { sessionStorageEditorStoreKey } from '@resource/components/XEditor/constants/config';
import Storage from '@resource/components/XEditor/lib/utils/storage';
import XPureComponent from '@resource/components/XPureComponent';

import mapDispatch from '@apps/gallery-client-mobile/redux/selector/mapDispatch';
import mapState from '@apps/gallery-client-mobile/redux/selector/mapState';

@connect(mapState, mapDispatch)
class Editor extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      hasRedirect: false,
      hasLoadSets: false,
      editorProps: {},
    };
  }

  componentDidMount() {
    const { selectedImgBeforeInEditor, editorEnv, productInfo, store, sets, boundProjectActions, project } =
      this.props;
    // 创建Project
    if (productInfo && productInfo.size) {
      const user = store.get('user');
      this.setState({
        editorProps: {
          categoryCode: productInfo.get('categoryCode'),
          skuCode: productInfo.get('sku_uuid'),
          title: 'Untitled',
          productName: productInfo.get('productName'),
          spuUid: productInfo.get('spu_uuid'),
          rackSkuId: productInfo.get('rack_sku_id'),
          entityId: productInfo.get('entity_id'),
          rackId: productInfo.get('rack_id'),
          rackSpuId: productInfo.get('rack_spu_uid'),
          storeId: productInfo.get('store_id'),
          collectionId: productInfo.get('collectionId'),
          collectionUid: productInfo.get('collectionUidUrlComponent'),
          supplierId: productInfo.get('supplierId'),
          estoreSource: '1',
          userId: user.get('id'),
          customerIdentify: user.get('customer_identify'),
          packageType: 'single',
          sets: sets.toJS(),
          editorEnv: editorEnv.toJS(),
          project: project.toJS()
        },
      });
      boundProjectActions.clearProductInfo();
    }

    const projectModel = Storage.getSessionItemJson(sessionStorageEditorStoreKey);
    // 当前Session存储projectid时打开编辑器
    if (
      (projectModel && projectModel.virtualProjectGuid > 0) ||
      (selectedImgBeforeInEditor && selectedImgBeforeInEditor.length > 0)
    ) {
      // 加载project
      if (projectModel.virtualProjectGuid) {
        this.setState({
          editorProps: {
            ...projectModel,
          },
        });
      }
      this.setState({ hasLoaded: true });
    } else {
      this.setState({ hasRedirect: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sets } = nextProps;
    const { hasLoadSets, editorProps } = nextState;
    if ((sets?.size > 0 || editorProps?.sets?.length > 0) && !hasLoadSets) {
      this.setState({ hasLoadSets: true });
      return true;
    }
    return false;
  }

  render() {
    const { hasLoaded, hasRedirect, editorProps } = this.state;
    return (
      <Fragment>
        {hasLoaded && <XEditor {...this.props} editorProps={editorProps} />}
        {hasRedirect && <Redirect to="/printStore/categories" />}
      </Fragment>
    );
  }
}

export default Editor;
