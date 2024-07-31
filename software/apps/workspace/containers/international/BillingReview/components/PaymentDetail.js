import React from 'react';
import classnames from 'classnames';
import Table from './Table';
import Title from './Title';
import NewCredit from './NewCredit';

export default ({ useNewCredit, titleProps, newCreditRef, detailLoading, creditListProps = {} }) => {
  const { className, ...listProps } = creditListProps;
  const newCreditCls = classnames({
    hide: !useNewCredit
  });

  const tableCls = classnames({
    [className]: !!className,
    hide: useNewCredit
  })

  return (
    <div className="payment-detail">
      <div className="title">
        <Title {...titleProps} />
      </div>
      <NewCredit ref={newCreditRef} className={newCreditCls} detailLoading={detailLoading} />
      <Table {...listProps} className={tableCls} />
    </div>
  )
}
