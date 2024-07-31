import React from 'react';

import { addMouseWheelEvent } from '@resource/lib/utils/mouseWheel';

import SinglePageNavigation from './SinglePageNavigation';
import * as handler from './handler';

import './index.scss';

class PageNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.handlerMouseWheel = dir => handler.handlerMouseWheel(this, dir);
    this.renderPagNavigation = this.renderPagNavigation.bind(this);
    this.onClickFile = () => handler.onClickFile(this);
  }

  componentDidMount() {
    if (this.pageNav) {
      addMouseWheelEvent(this.pageNav, dir => {
        this.handlerMouseWheel(dir);
      });
    }
  }

  renderPagNavigation() {
    const { ratio, pagination, pageArray, boundGlobalActions, boundProjectActions } = this.props;
    let html = [];
    pageArray.forEach(page => {
      const singlePageProps = {
        ratio,
        page,
        pageArray,
        pagination,
        boundGlobalActions,
        boundProjectActions,
      };

      html.push(<SinglePageNavigation key={page.get('id')} {...singlePageProps} />);
    });
    return html;
  }

  render() {
    const { pageArray } = this.props;
    if (!pageArray || !pageArray.size) {
      return null;
    }
    const typeParams = {
      multiple: true,
      accept: '.psd',
    };
    return (
      <div className="pages-navigation" ref={pageNav => (this.pageNav = pageNav)}>
        <div className="add-page" onClick={() => this.onClickFile()} id="addpage">
          <span>+</span> 添加页面
          <input
            ref={fileNode => (this.fileNode = fileNode)}
            type="file"
            onChange={e => handler.onSelectPsdFiles(this, e)}
            {...typeParams}
          />
        </div>
        <div className="page-navigation-content">{this.renderPagNavigation()}</div>
      </div>
    );
  }
}

export default PageNavigation;
