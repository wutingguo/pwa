import React, { Component } from 'react';
import classNames from 'classnames';
import './index.scss';

class PageNumberSimple extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { page, pageArray, style, className, isActive } = this.props;
    const pageNumberClassName = classNames('page-number-simple', className, {});
    const textActiveClassName = classNames({ active: isActive });
    const sheetIndex = pageArray.findIndex(item => item.get('id') === page.get('id'));
    let text = '';
    if (sheetIndex !== -1) {
      const leftNumber = 2 * sheetIndex + 1;
      const rightNumber = leftNumber + 1;
      text = `${t('PAGE_NUMBER_INNTER_TEXT_PREFIX')} ${leftNumber} & ${rightNumber} ${t('PAGE')}`;
    }
    return (
      <div className={pageNumberClassName} style={style}>
        <div className={textActiveClassName} style={{ height: '15px' }}>
          <span>{text}</span>
        </div>
      </div>
    );
  }
}

export default PageNumberSimple;
