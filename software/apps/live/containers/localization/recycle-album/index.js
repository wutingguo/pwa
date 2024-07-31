import React, { useEffect, useState } from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import useMessage from '@common/hooks/useMessage';

import Empty from '@apps/live/components/Empty';
import FButton from '@apps/live/components/FButton';
import Waring from '@apps/live/components/Icons/waring';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import LiveItemCard from '@apps/live/components/liveItemCard';
import liveServices from '@apps/live/services';

import { Container } from './layout';

export default function RecycleAlbum(props) {
  const { urls, boundProjectActions, boundGlobalActions } = props;
  const baseUrl = urls.get('galleryBaseUrl');

  const [placeholder, message] = useMessage();
  const [list, setList] = useState([]);
  const { intl, lang } = useLanguage();

  useEffect(() => {
    queryList();
  }, []);

  // 获取回收站列表
  async function queryList() {
    const params = {
      baseUrl,
      album_status_list: [3],
    };
    const res = await liveServices.getAlbumRecycleList(params);
    if (!res) return;
    setList([...res]);
  }

  // 还原
  async function reload(id) {
    const params = {
      id,
      baseUrl,
    };
    const res = await liveServices.rollbackAlbumRecycle(params);
    if (!res) return;
    message.success(intl.tf('LP_ALBUM_RESTORED'));
    queryList();
  }

  // 一键清空
  function clearAlbum() {
    const ids = list.reduce((pre, cur, index) => {
      if (index !== 0) {
        pre += ',';
      }
      pre += cur.enc_album_id;
      return pre;
    }, '');
    // console.log('ids', ids);
    boundGlobalActions.showConfirm({
      title: intl.lang === 'cn' ? intl.tf('LP_WARM_REMINDER') : '',
      message: intl.tf('LP_DELETE_ALL_MESSAGE'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: () => {
            deleteFunc(ids);
            boundGlobalActions.hideConfirm();
          },
          className: 'white',
          text: intl.tf('CONTINUE'),
        },
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
        },
      ],
    });
  }

  async function deleteFunc(id) {
    const params = {
      id,
      baseUrl,
    };
    const res = await liveServices.deleteAlbumRecycle(params);
    if (!res) return;
    queryList();
    message.success(intl.tf('LP_ALBUM_DELTED_SUESSS'));
  }

  // 删除
  async function deleteAlbum(id) {
    boundGlobalActions.showConfirm({
      title: intl.lang === 'cn' ? intl.tf('LP_WARM_REMINDER') : '',
      message: intl.tf('LP_DELETE_MESSAGE'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: async () => {
            deleteFunc(id);
          },
          className: 'white',
          text: intl.tf('CONTINUE'),
        },
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
        },
      ],
    });
  }

  const title = (
    <span>
      <span style={{ fontWeight: 600 }}>{intl.tf('LP_RECYCLE_BIN')}</span>
      <Waring
        fill="#CC0200"
        style={{ width: 20, verticalAlign: 'middle', margin: '0 4px 0 20px' }}
      />
      <span style={{ color: '#CC0200', fontSize: 14, fontweight: 400 }}>
        {intl.tf('LP_RECYCLE_BIN_MESSAGE')}
      </span>
    </span>
  );
  return (
    <WithHeaderComp
      title={title}
      extra={
        <FButton
          style={{ background: '#cc0200' }}
          disabled={list.length === 0}
          onClick={clearAlbum}
        >
          {intl.tf('LP_DELETE_ALL')}
        </FButton>
      }
    >
      <Container>
        {list.length > 0 ? (
          list?.map(item => {
            return (
              <LiveItemCard
                {...item}
                getAlbums={queryList}
                key={item.enc_album_id}
                urls={urls}
                isRecycle
                boundProjectActions={boundProjectActions}
                boundGlobalActions={boundGlobalActions}
                reload={reload}
                deleteAlbum={deleteAlbum}
              />
            );
          })
        ) : (
          <Empty style={{ height: '100%' }} />
        )}
      </Container>
      {placeholder}
    </WithHeaderComp>
  );
}
