import { XPureComponent } from '@common/components';
import React from 'react';
import DownloadRecordTable from './components/DownloadRecordTable';
import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import { getPackageDownloadColumns, getSingleDownloadColumns } from './tableConfig';
import './index.scss';

class Download extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          id: 1,
          name: t('GALLERY_PHOTO')
        },
        {
          id: 2,
          name: t('SINGLE_PHOTO')
        }
      ],
      currentTabId: 1,
      isLoadedPackageDownloadRecords: false,
      isLoadedSingleDownloadRecords: false
    };
    this.handleJumpPhotoSet = this.handleJumpPhotoSet.bind(this);
  }

  componentDidMount() {
    const { userInfo, boundProjectActions, collectionDetail, location } = this.props;
    const { search } = location;
    if (search) {
      const tab = search.split('=')[1];
      if (+tab) {
        this.changeTab(+tab);
      }
    }
    const userId = userInfo.get('id');
    const collectionId = collectionDetail && collectionDetail.get('collection_uid');
    //刷新页面有可能拿不到userInfo
    if (userId != -1 && collectionId) {
      boundProjectActions
        .getPackageDownloadRecords(collectionId)
        .then(res => this.setState({ isLoadedPackageDownloadRecords: true }));
      boundProjectActions
        .getSingleDownloadRecords(collectionId)
        .then(res => this.setState({ isLoadedSingleDownloadRecords: true }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      userInfo,
      boundProjectActions,
      collectionDetail,
      downloadActivities,
      location
    } = this.props;
    const { location: preLocation } = prevProps;
    const { search } = location;
    const { search: preSearch } = preLocation;
    const { isLoadedPackageDownloadRecords, isLoadedSingleDownloadRecords } = this.state;
    const userId = userInfo.get('id');
    const { packageDownloadRecords, singlePhotoDownloadRecords } = downloadActivities.toJS();
    const collectionId = collectionDetail && collectionDetail.get('collection_uid');
    if (userId != -1 && collectionId) {
      if (!isLoadedPackageDownloadRecords && !packageDownloadRecords.length) {
        boundProjectActions
          .getPackageDownloadRecords(collectionId)
          .then(res => this.setState({ isLoadedPackageDownloadRecords: true }));
      }
      if (!isLoadedSingleDownloadRecords && !singlePhotoDownloadRecords.length) {
        boundProjectActions
          .getSingleDownloadRecords(collectionId)
          .then(res => this.setState({ isLoadedSingleDownloadRecords: true }));
      }
    }
    if (preSearch !== search) {
      const tab = search.split('=')[1];
      if (+tab) {
        this.changeTab(+tab);
      }
    }
  }

  componentWillUnmount() {
    console.log('activities unmount');
  }

  getSortedDownloadRecords = records => {
    if (records && records.length) {
      return records.sort((r1, r2) => r2.create_time - r1.create_time);
    }
    return null;
  };

  changeTab = tabId => {
    this.setState({
      currentTabId: tabId
    });
  };

  handleJumpPhotoSet = (url, collectionId, setUid) => {
    const { history, boundProjectActions } = this.props;
    const { getSetPhotoList, changeSelectedSet, setDetailContentLoading } = boundProjectActions;
    const { push } = history;
    changeSelectedSet(setUid);
    setDetailContentLoading({ loading: true });
    getSetPhotoList(collectionId, setUid)
      .then(response => {
        setDetailContentLoading({ loading: false });
      })
      .catch(err => {
        setDetailContentLoading({ loading: false });
      });
    push(url);
  };

  render() {
    const {
      history,
      match,
      urls,
      defaultImgs,
      downloadActivities,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions
    } = this.props;
    const {
      tabs,
      currentTabId,
      isLoadedPackageDownloadRecords,
      isLoadedSingleDownloadRecords
    } = this.state;
    const sortedPackageDownloadRecords = this.getSortedDownloadRecords(
      downloadActivities.get('packageDownloadRecords')
    );
    const sortedSingleDownloadRecords = this.getSortedDownloadRecords(
      downloadActivities.getIn(['singlePhotoDownloadRecords'])
    );
    const sortedDownloadRecords =
      currentTabId === 1 ? sortedPackageDownloadRecords : sortedSingleDownloadRecords;
    const showEmpty = !sortedDownloadRecords || !sortedDownloadRecords.length;

    const actions = {
      handleJumpPhotoSet: this.handleJumpPhotoSet
    };
    const renderColumns =
      currentTabId === 1
        ? getPackageDownloadColumns(actions)
        : getSingleDownloadColumns(urls, defaultImgs);
    const emptyTipKey =
      currentTabId === 1 ? 'GALLERY_DOWNLOADS_EMPTY_TEXT' : 'SINGLE_PHOTO_DOWNLOADS_EMPTY_TEXT';
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: match.params.id,
      title: t('DOWNLOAD_ACTIVITIES'),
      hasHandleBtns: false
    };
    const tableProps = {
      className: 'editor-activities-download-table',
      history,
      match,
      urls,
      defaultImgs,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions,
      data: sortedDownloadRecords,
      columns: renderColumns
    };
    const isShowLoading =
      currentTabId === 1 ? !isLoadedPackageDownloadRecords : !isLoadedSingleDownloadRecords;
    return (
      <div className="gllery-editor-content-wrapper editor-activities-download-container">
        <div className="content">
          <CollectionDetailHeader {...headerProps} />
          <div className="editor-activities-download-table-wrapper">
            <div className="tab-layout">
              {tabs.map(tab => {
                return (
                  <span
                    className={tab.id === currentTabId ? 'tab-item active' : 'tab-item'}
                    onClick={() => this.changeTab(tab.id)}
                  >
                    {tab.name}
                  </span>
                );
              })}
            </div>
            {showEmpty && <div className="download-show-empty-content">{t(emptyTipKey)}</div>}
            {!isShowLoading && !showEmpty && <DownloadRecordTable {...tableProps} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Download;
