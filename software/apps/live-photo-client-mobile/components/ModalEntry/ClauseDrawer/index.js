import cls from 'classnames';
import React from 'react';

import { clauseContent, clauseContentEn } from '@common/utils/liveClause';

import BaseDrawer from '@apps/live-photo-client-mobile/components/BaseDrawer';
import Close from '@apps/live/components/Icons/IconClose';

import './index.scss';

export default function ClauseDrawer(props) {
  const { data } = props;
  const { handleClose, style } = data.toJS();

  const baseClauseContent = !__isCN__ ? clauseContentEn : clauseContent;

  return (
    <BaseDrawer open maskClick={handleClose} style={style}>
      <article className={cls('clause_drawer_article')}>
        {/* 关闭按钮 */}
        <Close className={cls('clause_drawer_close')} width={30} onClick={handleClose} />
        {/* 标题 */}
        <h4 className={cls('clause_drawer_title')}>{t('LIVE_AI_FACE_TERMS_TITLE')}</h4>
        {/* 协议内容 */}
        <section className={cls('clause_drawer_content')}>
          {baseClauseContent.map(item => (
            <section key={item.header} className={cls('item')}>
              <p>{item.header}</p>
              <ul>
                {item.descriptions?.map(description => {
                  return <li>{description}</li>;
                })}
                {item.contents.map((ele, index) => (
                  <li key={ele}>
                    {index + 1}. {ele}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      </article>
    </BaseDrawer>
  );
}
