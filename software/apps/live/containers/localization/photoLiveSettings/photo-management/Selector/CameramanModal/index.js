import React, { useEffect, useState } from 'react';

import { IntlText, useLanguage } from '@common/components/InternationalLanguage';

import FButton from '@apps/live/components/FButton';
import FModal from '@apps/live/components/FDilog';
import { encryptPhoneNumber } from '@apps/live/containers/localization/photoLiveSettings/photo-management/util';
import userSelect from '@apps/live/static/background/selectUser.png';
import user from '@apps/live/static/background/user.png';

import { Container, Footer } from './layout';

export default function CameramanModal(props) {
  const { open, onChange, list, ids, onOk, onCancel, allChange, allChecked = false } = props;

  const { intl } = useLanguage();

  const footer = (
    <Footer>
      <div className="checkbox_line">
        <label className="checkbox_label">
          <input checked={allChecked} className="checkbox" type="checkbox" onChange={allChange} />
          <span className="checkbox_text">{intl.tf('LP_SELECT_ALL')}</span>
        </label>
      </div>
      <div className="operator_line">
        <FButton onClick={onOk}>{intl.tf('CONFIRMED')}</FButton>
      </div>
    </Footer>
  );
  return (
    <FModal
      open={open}
      title={intl.tf('LP_PHOTOGRAPHER_LIST')}
      onCancel={onCancel}
      width="956px"
      footer={footer}
    >
      <Container>
        <span className="pm-selector-list">
          {list?.map((item, index) => (
            <span key={item.customer_id}>
              <span className="pm-selector-wrap" onClick={() => onChange(item.customer_id + '')}>
                <span className="pm-selector-input">
                  {ids.includes(item.customer_id + '') ? (
                    <span className="pm-selector-img-checked">
                      {' '}
                      <img src={userSelect} alt="" />
                    </span>
                  ) : (
                    <span className="pm-selector-img">
                      <img src={user} alt="" />
                    </span>
                  )}
                </span>
                <span className="pm-selector-content">
                  <div
                    className="pm-selector-name"
                    title={item.name || encryptPhoneNumber(item.phone)}
                  >
                    {item.name || encryptPhoneNumber(item.phone)}
                  </div>
                  <IntlText>
                    {(lang, intl) => {
                      return lang === 'cn' ? (
                        <div className="pm-selector-number">已传 {item.photo_count || 0} 张</div>
                      ) : (
                        <div className="pm-selector-number">
                          {item.photo_count || 0} {intl.tf('LP_UPLOADED')}
                        </div>
                      );
                    }}
                  </IntlText>
                </span>
              </span>
            </span>
          ))}
        </span>
      </Container>
    </FModal>
  );
}
