import React, { useCallback, useState } from 'react';

import { emailReg } from '@resource/lib/constants/reg';

import deleteIcon from '@resource/static/icons/handleIcon/delete_2.png';

import { XButton, XModal } from '@common/components';

import './index.scss';

function ManageClientsModal(props) {
  const {
    closeModal,
    clientWhiteList = [],
    onSave,
    boundProjectActions,
    boundGlobalActions,
    collection_uid,
  } = props;
  const [clients, setClients] = useState(clientWhiteList);
  const [isLoading, setLoading] = useState(false);
  const handleDeleteClient = (client, indexNum) => {
    setClients(
      clients.filter((item, index) => {
        return !(item.client_email === client.client_email && indexNum === index);
      })
    );
  };
  const handleClientChange = (e, client, indexNum) => {
    const newClients = clients.map((item, index) => {
      if (item.client_email === client.client_email && indexNum === index) {
        item.client_email = e.target.value;
      }
      return item;
    });
    setClients(newClients);
  };
  const handleAddClient = () => {
    setClients([...clients, { client_email: '' }]);
  };
  const checkForm = useCallback(() => {
    const invalidClients = clients.map(item => {
      if (!item.client_email || !emailReg.test(item.client_email)) {
        item.errorText = !item.client_email ? 'Email is required. ' : 'Email is invalid.';
      } else if (item.errorText) {
        delete item.errorText;
      }
      return item;
    });
    setClients(invalidClients);
    const hasEmpty = invalidClients.every(item => !item.errorText);
    return hasEmpty;
  }, [clients]);
  const handleSave = () => {
    const isLegal = checkForm();
    if (!isLegal) return;
    setLoading(true);
    boundProjectActions
      .saveDownloadClinetWhiteList({ collection_uid, client_emails: clients })
      .then(res => {
        setLoading(false);
        if (res.ret_code === 200000) {
          onSave(clients);
          closeModal();
          boundGlobalActions.addNotification({
            message: `Successfully updated.`,
            level: 'success',
            autoDismiss: 2,
          });
        }
        if (res.ret_code === 403063) {
          const DuplicateClients = clients.map(item => {
            if (item.client_email === res.data) {
              item.errorText = 'Duplicate email address.';
            }
            return item;
          });
          setClients(DuplicateClients);
        }
      });
  };
  return (
    <XModal className="manage-clients-modal" opened={true} onClosed={closeModal} isHideIcon={false}>
      <div className="modal-title">Manage Clients</div>
      <div className="modal-body">
        {clients.map((item, index) => {
          const { client_email, errorText } = item;
          return (
            <div className="clients-item">
              <input
                type="text"
                name="clientbox"
                className="clients-input"
                placeholder="Please enter a client email."
                value={client_email}
                onChange={e => handleClientChange(e, item, index)}
              />
              <div
                className="clients-icon-container"
                onClick={() => handleDeleteClient(item, index)}
              >
                <img src={deleteIcon} className="delete-icon" />
              </div>
              <div className="error-text">{errorText}</div>
            </div>
          );
        })}
        <div className="add-client" onClick={handleAddClient}>
          + Add Client
        </div>
      </div>
      <div className="modal-footer">
        <XButton onClicked={closeModal} className="white">
          {t('CANCEL')}
        </XButton>
        <XButton
          isWithLoading={true}
          isShowLoading={isLoading}
          onClicked={handleSave}
          className="black"
        >
          {t('SAVE')}
        </XButton>
      </div>
    </XModal>
  );
}

export default ManageClientsModal;
