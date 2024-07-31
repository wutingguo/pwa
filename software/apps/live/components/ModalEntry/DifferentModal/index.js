import React from 'react';

import XButton from '@resource/components/XButton';

import { useLanguage } from '@common/components/InternationalLanguage';

import { XModal } from '@common/components';

import { Container, List } from './layout';

export default function DifferentModal(props) {
  const { data } = props;
  const { close, className, style, onOk, messages = [] } = data.toJS();
  const { intl } = useLanguage();

  return (
    <XModal className={className} styles={style} opened={true} onClosed={close}>
      <Container>
        <div className="modal-title">{intl.tf('LP_PHOTO_REPLACE_MESSAGE_TITLE')}</div>
        <div className="modal-body">
          <div className="sub-title">{intl.tf('LP_PHOTO_REPLACE_MESSAGE_SUBTITLE')}</div>
          <List>
            {messages?.map(msg => {
              return <div>{msg}</div>;
            })}
          </List>
        </div>
        <div className="modal-footer">
          <XButton onClicked={onOk} width={140}>
            {intl.tf('OK')}
          </XButton>
        </div>
      </Container>
    </XModal>
  );
}
