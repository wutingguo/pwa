import React from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import FButton from '@apps/live/components/FButton';
import FDilog from '@apps/live/components/FDilog';

import { Container, Content, Footer } from './layout';

export default function ConfirModal(props) {
  const { intl } = useLanguage();
  const { data } = props;
  const {
    title,
    onClose,
    content,
    footer,
    oKText,
    cancelText,
    onConfirm,
    width = '400px',
  } = data.toJS();

  return (
    <FDilog
      titleStyle={{ marginBottom: 0 }}
      open
      width={width}
      title={title}
      onCancel={onClose}
      footer={null}
    >
      <Container>
        <Content>{content}</Content>
        {footer !== undefined ? (
          footer
        ) : (
          <Footer>
            <FButton className="btn_cancel" onClick={onClose}>
              {oKText || intl.tf('CANCEL')}
            </FButton>
            <FButton className="btn_next" onClick={onConfirm}>
              {cancelText || intl.tf('CONFIRMED')}
            </FButton>
          </Footer>
        )}
      </Container>
    </FDilog>
  );
}
