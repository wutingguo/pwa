import React, { useMemo, useState } from 'react';

import { IntlConditionalDisplay } from '@common/components/InternationalLanguage';

import FButton from '@apps/live/components/FButton';
import FModal from '@apps/live/components/FDilog';

import ImageBox from './ImageBox';
import ViewModal from './ViewModal';
import backgroundEn from './images/background-en.jpg';
import background from './images/background.jpg';
import { BtnBox, Container, Content, Text } from './layout';

const ratio = 2.16;
const maxRatio = 3;
export default function ViewBox(props) {
  const { options, intl, lang } = props;
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [imgOpen, setImgOpen] = useState(false);
  const [view, setView] = useState({
    backgroundUrl: lang === 'cn' ? background : backgroundEn,
    width: 180,
    height: 120,
  });

  function handleOpen() {
    setOpen(true);
  }
  function onCancel() {
    setOpen(false);
    setCurrent(null);
  }

  function currentClick(record) {
    setCurrent(record);
    setImgOpen(true);
  }

  function viewChange(key, record) {
    const { width, height, backgroundUrl } = record;
    setView({
      backgroundUrl,
      width,
      height,
    });
  }
  // console.log('options', options)
  const computedOptions = useMemo(() => {
    const opts = options.map(item => {
      const { marginBottom, marginLeft, marginRight, marginTop } = item;
      const r = 1.388;
      return {
        ...item,
        marginBottom: marginBottom * r,
        marginLeft: marginLeft * r,
        marginRight: marginRight * r,
        marginTop: marginTop * r,
      };
    });

    return opts;
  }, [options]);
  return (
    <Container>
      <Content>
        <ImageBox
          backgroundUrl={view.backgroundUrl}
          width={view.width * ratio}
          height={view.height * ratio}
          options={options}
        />
        <BtnBox>
          <FButton className="btn" width={100} height={30} onClick={handleOpen}>
            {intl.tf('LP_WATERMARK_CHANGE')}
          </FButton>
        </BtnBox>
      </Content>
      <IntlConditionalDisplay reveals={['cn']}>
        <>
          <Text className="top-10">{intl.tf('LP_WARTERMARK_MESSAGE')}</Text>
          <Text style={{ whiteSpace: 'break-spaces' }}>{intl.tf('LP_WARTERMARK_Message_TWO')}</Text>
        </>
      </IntlConditionalDisplay>
      <ViewModal
        open={open}
        onCancel={onCancel}
        intl={intl}
        width="650px"
        options={options}
        currentClick={currentClick}
        lang={lang}
        onChange={viewChange}
      />
      {current ? (
        <FModal
          open={imgOpen}
          footer={null}
          onCancel={() => setImgOpen(false)}
          bodyStyle={{ display: 'flex', justifyContent: 'center' }}
        >
          <ImageBox
            backgroundUrl={current.backgroundUrl}
            width={current.width * maxRatio}
            height={current.height * maxRatio}
            options={computedOptions}
          />
        </FModal>
      ) : null}
    </Container>
  );
}
