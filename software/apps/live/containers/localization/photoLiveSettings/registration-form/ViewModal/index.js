import dayJs from 'dayjs';
import React, { useState } from 'react';

import XButton from '@resource/components/XButton';

import { XModal } from '@common/components';

import FPagePagination from '@apps/live/components/FPagePagination';
import FTable from '@apps/live/components/FTable';

import { PAGE_SIZE } from '../opts';

import { Container, Content, Footer, Header } from './layout';

/**
 * 查看客资名单弹窗
 * @typedef {Object} ViewModalProps
 * @property {Function} onClose 关闭弹窗
 * @property {Object} registerFormInfo 客资收集表信息
 * @property {Function} changePageNum 分页点击事件
 * @property {Function} exportExcel 导出Excel
 * @param {ViewModalProps} props
 */
const ViewModal = props => {
  const { onClose, registerFormInfo, changePageNum, exportExcel } = props;
  const { total, head_fields, tableData } = registerFormInfo || {};
  // 分页
  const [pageNum, setPageNum] = useState(1);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  /**
   * 列表的columns
   */
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 55,
      render: (_v, _r, index) => index + 1,
    },
    {
      title: '提交时间',
      dataIndex: 'submit_time',
      width: 255,
      render: value => {
        if (!value) {
          return null;
        }
        return dayJs(value).format('YYYY.MM.DD HH:mm:ss');
      },
    },
  ]
    .concat(
      head_fields?.map(item => ({
        title: item,
        dataIndex: item,
        ellipsis: true,
        width: 120,
      }))
    )
    .filter(Boolean);

  /**
   * 分页点击事件
   */
  const changeFilter = data => {
    const { value } = data; // value是页数
    setPageNum(value);
    changePageNum?.(value);
  };

  return (
    <XModal opened onClosed={onClose}>
      <Container>
        <Header>客资名单（{total}）</Header>
        <Content>
          <FTable
            className="viewModal__table"
            rowKey="record_id"
            columns={columns}
            data={tableData}
          />
          {totalPages > 1 && (
            <FPagePagination
              currentPage={pageNum}
              totalPage={totalPages}
              changeFilter={changeFilter}
            />
          )}
        </Content>
        <Footer>
          <XButton
            width={120}
            height={32}
            className="excel-button"
            onClicked={exportExcel}
            disabled={tableData?.length === 0}
          >
            导出为Excel
          </XButton>
        </Footer>
      </Container>
    </XModal>
  );
};

export default ViewModal;
