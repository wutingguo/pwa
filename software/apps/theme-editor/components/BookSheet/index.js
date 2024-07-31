import React, { PureComponent } from 'react';
import XAnimation from '@resource/components/XAnimation';
import BookPage from '@apps/theme-editor/konva/BookPage';

class BookSheet extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { ratio, page, pagination } = this.props;
    const { current, prev } = pagination.toJS();
    const animationProps = {
      direction: prev > current ? 'right' : 'left'
    };
    const bookPageProps = {
      key: page.get('id'), // NOTICE: 很重要 不然动画没办法展示
      ...this.props
    };
    const sheetStyle = {
      width: page.get('width') * ratio,
      height: page.get('height') * ratio,
      overflow: 'hidden'
    };
    return (
      <div className="sheet-container" style={sheetStyle}>
        <XAnimation {...animationProps}>
          <BookPage {...bookPageProps} />
        </XAnimation>
      </div>
    );
  }
}

export default BookSheet;
