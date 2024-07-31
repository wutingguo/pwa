import cls from 'classnames';
import React, { useRef, useState } from 'react';

import { clauseContent, clauseContentEn } from '@common/utils/liveClause';

import FButton from '@apps/live/components/FButton/index.js';
import FModal from '@apps/live/components/FDilog';

import { Article, Container, Footer, Instructions, Title } from './layout.js';

export default function TermsOfUseModal(props) {
  const { open, onCancel, updateConfig, title, openType, intl } = props;
  const contextRef = useRef();
  const [hasEnd, setHasEnd] = useState(false);

  function handleScroll(e) {
    const { scrollTop } = e.target;
    const { height } = e.target.getBoundingClientRect();
    const contextHeight = contextRef.current.getBoundingClientRect().height;
    if (scrollTop + height > contextHeight + 50) {
      setHasEnd(true);
    }
  }

  function handleOk() {
    onCancel();
  }

  function success() {
    if (!hasEnd) return;
    updateConfig({
      auto_detect: true,
    });
    onCancel();
  }
  const footer = (
    <Footer>
      <FButton className="btn" onClick={handleOk}>
        {intl.tf('LP_AI_FACE_KONOW')}
      </FButton>
      {openType === 1 ? (
        <FButton
          className={cls('success', {
            disabled: !hasEnd,
            isEN: intl.lang === 'en',
          })}
          onClick={success}
        >
          {intl.tf('LP_AI_FACE_AGREE')}
        </FButton>
      ) : null}
    </Footer>
  );

  const titleEl = (
    <>
      <p>{title}</p>
      {openType === 1 ? <p className="sub_title">{intl.tf('LP_AI_FACE_BROWSE') + ':'}</p> : null}
    </>
  );

  const baseClauseContent = intl.lang === 'en' ? clauseContentEn : clauseContent;
  return (
    <FModal
      open={open}
      onCancel={onCancel}
      title={<Title>{titleEl}</Title>}
      footer={footer}
      width="870px"
      style={{ top: '10%' }}
    >
      <Container>
        <Article onScroll={handleScroll}>
          <div ref={contextRef}>
            {baseClauseContent.map(item => {
              return (
                <>
                  <p>{item.header}</p>
                  {item.contents ? (
                    <ul>
                      {item.descriptions?.map(description => {
                        return <li>{description}</li>;
                      })}
                      {item.contents.map((content, index) => {
                        return <li key={index}>{`${index + 1}. ` + content}</li>;
                      })}
                    </ul>
                  ) : null}
                </>
              );
            })}
          </div>
        </Article>
        {!hasEnd && openType === 1 ? (
          <Instructions>{intl.tf('LP_AI_FACE_AGREE_BOTTOM_TIP')}</Instructions>
        ) : null}
      </Container>
    </FModal>
  );
}
