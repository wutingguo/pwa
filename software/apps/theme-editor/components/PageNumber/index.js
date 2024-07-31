import React, { PureComponent } from 'react';
import './index.scss';

class PageNumber extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { sheetIndex } = this.props;
    const leftNumber = 2 * sheetIndex + 1;
    const rightNumber = leftNumber + 1;
    return (
      <ul className="page-number">
        <li>{leftNumber}</li>
        <li>{rightNumber}</li>
      </ul>
    );
  }
}

export default PageNumber;
