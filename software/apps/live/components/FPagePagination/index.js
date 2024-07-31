import classNames from 'classnames';
import React, { Component } from 'react';

import './index.scss';

class FPagePagination extends Component {
  constructor(props) {
    super(props);
    this.getPageItems = this.getPageItems.bind(this);
    this.changePageIndex = this.changePageIndex.bind(this);
    this.turnPrevPage = this.turnPrevPage.bind(this);
    this.turnNextPage = this.turnNextPage.bind(this);
    this.changeToTargetPage = this.changeToTargetPage.bind(this);
    this.changeEditPage = this.changeEditPage.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.state = {
      editedPage: props.currentPage || 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.state.editedPage) {
      this.setState({ editedPage: nextProps.currentPage });
    }
  }

  componentWillMount() {
    const { totalPage, currentPage } = this.props;
    const fixedPageIndex = currentPage > totalPage ? totalPage : currentPage;
    this.setState({ editedPage: fixedPageIndex });
  }

  getPageItems() {
    const { totalPage, currentPage } = this.props;
    const fixedPageIndex = currentPage > totalPage ? totalPage : currentPage;

    const pageItems = [];
    // 如果只有五页就全部展示
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        pageItems.push({
          pageIndex: i,
          pageText: i,
          isDisabled: false,
          isActive: fixedPageIndex === i,
        });
      }
      return pageItems;
    }

    // 显示头三页
    if (fixedPageIndex <= 4) {
      for (let i = 1; i < 5; i++) {
        pageItems.push({
          pageIndex: i,
          pageText: i,
          isDisabled: false,
          isActive: fixedPageIndex === i,
        });
      }
      pageItems.push({
        pageIndex: 0,
        pageText: '...',
        isDisabled: true,
        isActive: false,
      });
      pageItems.push({
        pageIndex: totalPage,
        pageText: totalPage,
        isDisabled: false,
        isActive: false,
      });
      return pageItems;
    }
    // 显示尾三页
    if (totalPage - fixedPageIndex < 4) {
      pageItems.push({
        pageIndex: 1,
        pageText: 1,
        isDisabled: false,
        isActive: false,
      });
      pageItems.push({
        pageIndex: 0,
        pageText: '...',
        isDisabled: true,
        isActive: false,
      });
      for (let i = totalPage - 3; i <= totalPage; i++) {
        pageItems.push({
          pageIndex: i,
          pageText: i,
          isDisabled: false,
          isActive: fixedPageIndex === i,
        });
      }
      return pageItems;
    }

    // 剩下的显示中间三页
    pageItems.push({
      pageIndex: 1,
      pageText: 1,
      isDisabled: false,
      isActive: false,
    });
    pageItems.push({
      pageIndex: 0,
      pageText: '...',
      isDisabled: true,
      isActive: false,
    });
    for (let i = fixedPageIndex - 1; i <= fixedPageIndex + 1; i++) {
      pageItems.push({
        pageIndex: i,
        pageText: i,
        isDisabled: false,
        isActive: fixedPageIndex === i,
      });
    }
    pageItems.push({
      pageIndex: 0,
      pageText: '...',
      isDisabled: true,
      isActive: false,
    });
    pageItems.push({
      pageIndex: totalPage,
      pageText: totalPage,
      isDisabled: false,
      isActive: false,
    });
    return pageItems;
  }

  changeEditPage(event) {
    const { target } = event;
    this.setState({
      editedPage: target.value,
    });
  }

  goToPage() {
    const { editedPage } = this.state;
    this.changePageIndex(editedPage);
  }

  changePageIndex(pageIndex) {
    const { totalPage, changeFilter } = this.props;
    let pageIndexNumber = parseInt(pageIndex);
    if (isNaN(pageIndexNumber) || pageIndexNumber < 1) {
      pageIndexNumber = 1;
      this.setState({ editedPage: pageIndexNumber });
    }
    if (pageIndexNumber > totalPage) {
      pageIndexNumber = totalPage;
    }
    changeFilter &&
      changeFilter({
        keyName: 'currentPage',
        value: pageIndexNumber,
      });
    window.scrollTo(0, 0);
  }

  turnPrevPage() {
    const { currentPage } = this.props;
    this.changePageIndex(currentPage - 1);
  }

  turnNextPage() {
    const { currentPage } = this.props;
    this.changePageIndex(currentPage + 1);
  }

  changeToTargetPage(itemData) {
    if (!itemData || itemData.isDisabled || itemData.isActive) return;
    this.changePageIndex(itemData.pageIndex);
  }
  onKeyUp(e) {
    // 回车键
    if (e.keyCode == 13) {
      this.goToPage();
    }
  }

  render() {
    const { totalPage, currentPage, showJump = false } = this.props;
    const { editedPage } = this.state;
    const pageItems = this.getPageItems();
    const isShowPrevButton = currentPage > 1 && totalPage > 1;
    const isShowNextButton = currentPage < totalPage;

    const prevButtonClass = classNames('turnpage-button prev pagination-item', {
      opacity0: !isShowPrevButton,
    });
    const nextButtonClass = classNames('turnpage-button next pagination-item', {
      opacity0: !isShowNextButton,
    });

    return (
      <div className="page-pagination">
        <div className={prevButtonClass} onClick={this.turnPrevPage}>
          {t('PAGE_PREV')}
        </div>
        {pageItems.map((item, i) => {
          const itemClassName = classNames('pagination-item', {
            disabled: item.isDisabled,
            active: item.isActive,
          });
          return (
            <div key={i} className={itemClassName} onClick={() => this.changeToTargetPage(item)}>
              {item.pageText}
            </div>
          );
        })}
        <div className={nextButtonClass} onClick={this.turnNextPage}>
          {t('PAGE_NEXT')}
        </div>
        {showJump && (
          <div className="input-page-container">
            <input
              className="page-input"
              value={editedPage}
              onChange={this.changeEditPage}
              onKeyUp={this.onKeyUp}
            />
            <span className="pages">{t('PAGE_PAGES')}</span>
            <span className="go-button" onClick={this.goToPage}>
              {t('PAGE_GO')}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default FPagePagination;
