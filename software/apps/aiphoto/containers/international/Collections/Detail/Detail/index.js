import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { XPureComponent } from '@common/components';
import renderRoutes from '@resource/lib/utils/routeHelper';
import EditorSidebar from '@apps/aiphoto/components/EditorSidebar';
import './index.scss';
import { fromJS } from 'immutable';
let timer = null;

class CollectionDetail extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDetailRequestDone: false
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id: encCollectionId }
      },
      boundProjectActions
    } = this.props;
    this.getCollectionDetail(encCollectionId);
    this.doSetInterval(encCollectionId);
    boundProjectActions.getPfcTopicEffects();
  }

  componentWillReceiveProps(nextProps) {
    const prevId = this.props.match.params.id;
    const nextId = nextProps.match.params.id;
    if (prevId && nextId && prevId != nextId) {
      this.getCollectionDetail(nextId);
    }
  }

  componentWillUnmount() {
    clearInterval(timer);
    timer = null;
  }

  doSetInterval = encCollectionId => {
    clearInterval(timer);
    timer = setInterval(() => {
      const { boundProjectActions, collectionDetail = fromJS({}) } = this.props;
      boundProjectActions.getCollectionProgress(encCollectionId).then(res => {
        // 修图中要轮询图片的状态
        const { ret_code, data } = res;
        if (ret_code === 200000) {
          const { collection_status = 0 } = data;
          const oldStatus = collectionDetail.get('collection_status') || 0;
          const isOriginal = collectionDetail.get('is_original');
          if (collection_status === 1 || collection_status !== oldStatus || isOriginal === 1) {
            boundProjectActions.getCollectionImageList(encCollectionId);
          }
        }
      });
    }, 3000);
  };

  // 获取collection的详情.
  getCollectionDetail = encCollectionId => {
    const { boundProjectActions } = this.props;
    const { setDetailContentLoading } = boundProjectActions;
    setDetailContentLoading({ loading: true });
    boundProjectActions.getCollectionProgress(encCollectionId).then(() => {
      this.setState({ isDetailRequestDone: true });
      boundProjectActions.setDetailContentLoading({ loading: false });
      boundProjectActions.updateCollectionId(encCollectionId);
      //获取图片
      boundProjectActions.getCollectionImageList(encCollectionId);
    });
  };

  backToList = () => {
    this.props.history.push('/software/retoucher/collection');
  };

  render() {
    const {
      history,
      match: { params },
      urls,
      loading,
      defaultImgs,
      collectionDetail,
      boundGlobalActions,
      boundProjectActions,
      effectsList,
      categoryList
    } = this.props;
    const { isDetailRequestDone } = this.state;
    const routeHtml = renderRoutes({
      isHash: false,
      props: { isDetailRequestDone, ...this.props }
    });

    // sidebarProps
    const sidebarProps = {
      history,
      params,
      urls,
      loading,
      defaultImgs,
      collectionDetail,
      boundGlobalActions,
      boundProjectActions,
      backToList: this.backToList,
      effectsList,
      categoryList
    };
    return (
      <Fragment>
        <div className="gllery-editor-container">
          {/* 左侧的sidebar */}
          <EditorSidebar {...sidebarProps} />

          {routeHtml}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(CollectionDetail);
