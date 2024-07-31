import React, { useEffect, useState } from 'react';
import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';
import XButton from '@resource/components/XButton';
import CheckBox from '@resource/components/XCheckBox';
import CommonModal from '../commonModal/index';
import './index.scss';

const AssignToCollection = props => {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const { urls, data, boundGlobalActions } = props;
  const store_id = data.get('store_id');
  const rack_id = data.get('rack_id');
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const saasBaseUrl = urls.get('saasBaseUrl');

  useEffect(() => {
    estoreService.getListCollectionInfo({ estoreBaseUrl }).then(res => {
      const { data = [] } = res;
      if (data.length) {
        setCollectionList(data);
        // const selected = data.filter(item => item.bind_rack);
        // setSelected(selected);
      }
    });
  }, []);

  const selectCollection = (collection, { checked: isSelected }) => {
    if (isSelected) {
      setSelected(selected.concat(collection));
    } else {
      const filter = selected.filter(item => item.collection_uid !== collection.collection_uid);
      setSelected(filter);
    }
  };

  const selectedAll = isSelectedAll => {
    if (isSelectedAll) {
      setSelected(collectionList);
    } else {
      setSelected([]);
    }
  };

  const bindCollection = store_status => {
    window.logEvent.addPageEvent({
      name: store_status
        ? 'Estore_Products_AssignPriceSheetToCollectionsPop2_Click_AssignAndTurnOn'
        : 'Estore_Products_AssignPriceSheetToCollectionsPop2_Click_AssignAndKeep'
    });
    estoreService
      .bindCollection({
        saasBaseUrl,
        collection_ids: selected.map(item => item.collection_uid),
        store_id,
        store_status,
        rack_id
      })
      .then(res => {
        boundGlobalActions.addNotification({
          message: t('SUCCESSFULLY_ASSIGNED'),
          level: 'success',
          autoDismiss: 2
        });
        boundGlobalActions.hideModal(localModalTypes.DOUBLE_CHECK_ASSIGN);
        boundGlobalActions.hideModal(localModalTypes.ASSIGN_TO_COLLECTIONS);
      });
  };

  const applyAssign = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Products_AssignPriceSheetToCollectionsPop1_Click_Apply'
    });
    boundGlobalActions.showModal(localModalTypes.DOUBLE_CHECK_ASSIGN, {
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Products_AssignPriceSheetToCollectionsPop2_Click_Cancel'
        });
        boundGlobalActions.hideModal(localModalTypes.DOUBLE_CHECK_ASSIGN);
      },
      handleAssign: status => bindCollection(status)
    });
  };

  const modalProps = {
    hideBtnList: true,
    title: () => (
      <div className="assignToCollectionTitle">
        <div className="title">{t('ASSIGN_TO_COLLECTIONS')}</div>
        <XButton disabled={!selected.length} onClick={applyAssign}>
          {t('ESTORE_SETUP_PAYPAL_APPLY')}
        </XButton>
      </div>
    )
  };

  return (
    <CommonModal className="assignToCollectionModal" {...props} {...modalProps}>
      <div className="selectedWrapper">
        <div>{`${selected.length} ${t('SELECTED1')}`}</div>
        <div className="blue" onClick={() => selectedAll(true)}>
          {t('SELECT_ALL')}
        </div>
        <div className="blue" onClick={() => selectedAll(false)}>
          {t('CLEAR_SELECTION')}
        </div>
      </div>
      <div className="collectionWrapper">
        {collectionList.map((item, i) => {
          return (
            <div key={`${item.collection_uid}_${i}`}>
              <CheckBox
                checked={selected.find(sub => sub.collection_uid === item.collection_uid)}
                text={item.collection_name}
                isShowChecked
                className="custom-checkout black-theme"
                onClicked={clicked => selectCollection(item, clicked)}
              />
            </div>
          );
        })}
      </div>
    </CommonModal>
  );
};

export default AssignToCollection;
