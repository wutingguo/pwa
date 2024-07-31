import React, { useRef, useState } from 'react';
import RcStep from 'react-step-wizard';

import { useLanguage } from '@common/components/InternationalLanguage';

import FDilog from '@apps/live/components/FDilog';

import CategoryContent from './CategoryContent';
import SaveNotWatermarkContent from './SaveNotWatermarkContent';
import WatermarkPrinting from './WatermarkPrinting';
import { Container, Title } from './layout';

const custom = {
  enterRight: 'your custom css transition classes',
  enterLeft: 'your custom css transition classes',
  exitRight: 'your custom css transition classes',
  exitLeft: 'your custom css transition classes',
  intro: 'your custom css transition classes',
};

export default function AgainPrintWatermarkModal(props) {
  const { data, urls, boundGlobalActions } = props;
  const { baseInfo, onClose, defaultActivity = 1, savePrintWatermark } = data.toJS();
  const { intl } = useLanguage();
  const SW = useRef(null);
  const baseUrl = urls.get('galleryBaseUrl');

  const [current, setCurrent] = useState(defaultActivity);

  function handleClose() {
    onClose?.();
  }

  function onStepChange(record) {
    const { activeStep } = record;

    setCurrent(activeStep);
  }
  // console.log("🚀 ~ AgainPrintWatermarkModal ~ current:", current, typeof current);
  return (
    <FDilog
      hideCloseIcon={current !== 3}
      width="400px"
      open
      title={<Title>{intl.tf('LP_REPRINT_WATERMARK')}</Title>}
      footer={null}
      onCancel={handleClose}
    >
      <Container>
        <RcStep
          transitions={custom}
          instance={ref => (SW.current = ref)}
          isLazyMount
          initialStep={defaultActivity}
          onStepChange={onStepChange}
        >
          <SaveNotWatermarkContent
            handleClose={handleClose}
            intl={intl}
            savePrintWatermark={savePrintWatermark}
          />
          <CategoryContent
            baseInfo={baseInfo}
            intl={intl}
            baseUrl={baseUrl}
            handleClose={handleClose}
          />
          <WatermarkPrinting
            handleClose={handleClose}
            baseInfo={baseInfo}
            intl={intl}
            baseUrl={baseUrl}
            boundGlobalActions={boundGlobalActions}
          />
        </RcStep>
      </Container>
    </FDilog>
  );
}
