import React, { useEffect, useState } from 'react';

import FButton from '@apps/live/components/FButton';

import { Container } from './layout';

export default function SaveNotWatermarkContent(props) {
  const { intl, handleClose, goToStep, savePrintWatermark } = props;

  async function nextClick() {
    await savePrintWatermark();
    goToStep(2);
    // console.log(props, 'props');
  }

  async function onColse() {
    // await savePrintWatermark();
    // handleClose?.();
    goToStep(2);
  }
  return (
    <Container>
      <div className="content">{intl.tf('LP_WATERMARK_REPRINT_TIPS')}</div>
      <div className="bottom_btns">
        <FButton className="btn_cancel" onClick={onColse}>
          {intl.tf('LP_WATERMARK_NO')}
        </FButton>
        <FButton className="btn_next" onClick={nextClick}>
          {intl.tf('LP_WATERMARK_YES')}
        </FButton>
      </div>
    </Container>
  );
}
