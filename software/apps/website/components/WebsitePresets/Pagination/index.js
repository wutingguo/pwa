import cls from 'classnames';
import { concat, isNaN, isNumber, range } from 'lodash';
import React, { memo, useCallback, useMemo, useState } from 'react';

import Button from '../components/Button';

import './index.scss';

const prefixCls = 'zno-website-designer-page-pagination';

const Jump = ({ onJump }) => {
  const [v, setV] = useState('');

  const handleChange = e => {
    const value = Number(e.target.value);
    !isNaN(value) && setV(value);
  };

  return (
    <div className={`${prefixCls}-jump`}>
      <input value={v} onChange={handleChange} /> <span style={{ marginRight: 8 }}>Pages</span>
      <Button black size="small" onClick={() => onJump(v - 1)}>
        Go
      </Button>
    </div>
  );
};

const MAX = 5;
const toPageLabel = page => page + 1;

const PageNumber = ({ children, active, disabled, onClick }) => {
  const pageNumberCls = `${prefixCls}-page-number`;

  const handleClick = () => {
    if (active || disabled) return;
    onClick();
  };

  return (
    <span className={cls(pageNumberCls, { active, disabled })} onClick={handleClick}>
      {children}
    </span>
  );
};

const Pagination = ({ total = 15 }) => {
  const [cur, setCur] = useState(0);

  const goto = ({ page = 0, step }) => {
    let num = page;
    if (step) {
      num = cur + step;
    }
    setCur(num);
  };

  const { pages, pageNumbers } = useMemo(() => {
    // 生成全部的页码 从0开始
    const all = range(0, total);
    const result = {
      pages: all,
      pageNumbers: [],
    };

    if (all.length <= MAX) {
      result.pageNumbers = all;
      return result;
    }

    if (MAX <= 3) {
      result.pageNumbers = all.slice(0, MAX - 1);
      return result;
    }

    // 跟据cur的位置 取出MAX个页码
    const curIndex = all.indexOf(cur);
    const startIndex = MAX - 2;
    const endIndex = all.length - 1 - MAX + 2;

    if (curIndex <= startIndex) {
      result.pageNumbers = concat(all.slice(0, MAX - 1), all[all.length - 1]);
    }

    if (curIndex > startIndex && curIndex < endIndex) {
      result.pageNumbers = concat(
        all[0],
        all.slice(curIndex - 1, curIndex + MAX - 2 - 1),
        all[all.length - 1]
      );
    }

    if (curIndex >= endIndex) {
      result.pageNumbers = concat(all[0], all.slice(1 - MAX));
    }

    return result;
  }, [total, cur]);

  const firstPage = pages[0];
  const lastPage = pages[pages.length - 1];

  const isFirst = cur === firstPage;
  const isLast = cur === lastPage;

  return (
    <div className={prefixCls}>
      {!isFirst && <PageNumber onClick={() => goto({ step: -1 })}>Prev</PageNumber>}

      {pageNumbers.reduce((result, number, index) => {
        result.push(
          <PageNumber key={number} active={cur === number} onClick={() => goto({ page: number })}>
            {toPageLabel(number)}
          </PageNumber>
        );
        // 如果页码不是连续的 并且不是最后一项 追加一个省略号
        if (number !== pageNumbers[index + 1] - 1 && number !== lastPage) {
          result.push(<PageNumber disabled>...</PageNumber>);
        }

        return result;
      }, [])}

      {!isLast && <PageNumber onClick={() => goto({ step: 1 })}>Next</PageNumber>}

      <Jump onJump={v => goto({ page: v })} />
    </div>
  );
};

export default memo(Pagination);
