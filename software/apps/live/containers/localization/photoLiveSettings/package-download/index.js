import dayJs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

import { IntlConditionalDisplay, useLanguage } from '@common/components/InternationalLanguage';

import { useMessage } from '@common/hooks';

import FButton from '@apps/live/components/FButton';
import FTable from '@apps/live/components/FTable';
import Add from '@apps/live/components/Icons/Add';
import Waring from '@apps/live/components/Icons/waring2';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { GENERATE_DOWNLOAD_LINK, LIVE_PACKAGE_DOWNLOAD } from '@apps/live/constants/modalTypes';
import * as localModalTypes from '@apps/live/constants/modalTypes';
import liveServices from '@apps/live/services';
import {
  deleteDownloadLink,
  getDownloadLink,
  getPackageList,
  hasDownloadPackageJob,
} from '@apps/live/services/photoLiveSettings';
import { openPayCard } from '@apps/live/utils/index';

import { Container, Left, Right, Tip, Title } from './layout';

function getStatus(time) {
  if (!time) return 0;

  return Date.now() - time;
}

export default function PackageDoenload(props) {
  const { boundGlobalActions, urls, baseInfo, userInfo } = props;
  const [placeholder, message] = useMessage();
  const { intl } = useLanguage();
  const [data, setData] = useState([]);
  const timeId = useRef(null);
  const baseUrl = urls.get('galleryBaseUrl');

  const columns = [
    {
      title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_NAME'),
      dataIndex: 'package_name',
      width: 400,
      render: name => {
        if (name) {
          const nameTime = name.substr(0, 19).replaceAll('-', '/');
          const tempTime =
            intl.lang === 'cn'
              ? dayJs(nameTime).format('YYYY.MM.DD HH:mm:ss')
              : dayJs(nameTime).format('MMMM D YYYY, h:mm:ss a');
          let packageName = '';
          if (intl.lang === 'cn') {
            packageName = `${tempTime}${name.substr(19)}`;
          } else {
            packageName = tempTime;
          }
          return packageName;
        }
        return null;
      },
    },
    intl.lang === 'cn' && {
      title: '子相册',
      dataIndex: 'category_name',
      width: 150,
    },
    // 数据类型-EN，图片版本-CN
    intl.lang === 'en'
      ? {
          title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_TYPE'),
          dataIndex: 'download_content_type',
          width: 150,
          render: type => {
            const options = {
              1: intl.tf('LP_NO_WATERMARK'),
              2: intl.tf('LP_HAVE_WATERMARK'),
              3: intl.tf('LP_WITH_AND_WITHOUT_WATERMARKS'),
            };
            return <span>{options[type]}</span>;
          },
        }
      : {
          title: '图片版本',
          dataIndex: 'pic_version',
          width: 150,
          render: type => {
            const options = {
              1: '全部原图',
              2: '人工已修图',
              3: 'AI已修图',
              4: '直播图',
            };
            return <span>{options[type]}</span>;
          },
        },
    {
      title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_TIME'),
      dataIndex: 'generate_time',
      width: 200,
      render: time => {
        if (time) {
          return intl.lang === 'cn'
            ? dayJs(time).format('YYYY.MM.DD HH:mm:ss')
            : dayJs(time).format('MM/DD/YYYY HH:mm:ss');
        }
        return null;
      },
    },
    {
      title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_EXPIRED'),
      dataIndex: 'expire_time',
      width: 200,
      render: time => {
        if (time) {
          return intl.lang === 'cn'
            ? dayJs(time).format('YYYY.MM.DD HH:mm:ss')
            : dayJs(time).format('MM/DD/YYYY HH:mm:ss');
        }
        return null;
      },
    },
    {
      title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_STATUS'),
      width: 150,
      render: record => {
        const code = getStatus(record.expire_time);
        let text = intl.tf('LP_NOT_OUT_OF_DATE');
        if (code < 0) {
          text = intl.tf('LP_NOT_OUT_OF_DATE');
        } else if (code > 0) {
          text = intl.tf('LP_EXPIRED');
        } else {
          text = null;
        }
        return <span>{text}</span>;
      },
    },
    {
      title: intl.tf('LP_ALBUM_DOWNLOAD_TABLE_OPERATION'),
      width: 80,
      render: record => {
        let disabled = false;
        const { expired } = baseInfo || {};
        const code = getStatus(record.expire_time);
        // 判断链接是否过期&相册是否过期
        if (code < 0 && expired !== 1) {
          disabled = false;
        } else {
          disabled = true;
        }
        return (
          <div style={{ minWidth: 300 }}>
            <FButton
              style={{ paddingLeft: 0 }}
              type="link"
              color={disabled ? '#ccc' : '#0077CC'}
              onClick={() => copyLink(record?.request_uuid)}
              disabled={disabled}
            >
              {intl.tf('LP_ALBUM_DOWNLOAD_OPERATION_COPY')}
            </FButton>
            <FButton
              type="link"
              color={disabled ? '#ccc' : '#0077CC'}
              onClick={() => goDownload(record?.request_uuid)}
              disabled={disabled}
            >
              {intl.tf('LP_DOWNLOAD')}
            </FButton>
            <FButton type="link" color="#CC0200" onClick={() => deleteLink(record?.request_uuid)}>
              {intl.tf('LP_ALBUM_DOWNLOAD_OPERATION_DELETE')}
            </FButton>
          </div>
        );
      },
    },
  ].filter(Boolean);

  useEffect(() => {
    queryTableData();
  }, [baseInfo?.enc_album_id]);

  // 获取table数据
  async function queryTableData() {
    if (!baseInfo) return;
    if (!timeId.current) {
      clearTimeout(timeId.current);
      timeId.current = null;
    }

    const { enc_album_id } = baseInfo;

    const params = {
      id: enc_album_id,
      baseUrl,
    };
    const res = await getPackageList(params);
    if (!res) return;
    setData(res);
    const isLoop = res.some(item => item.packaging_status === 0);
    if (isLoop) {
      timeId.current = setTimeout(() => {
        queryTableData();
        clearTimeout(timeId.current);
        timeId.current = null;
      }, 10000);
    }
  }

  // 弹窗关闭回调
  function okCallBack() {
    queryTableData();
  }
  // 报错回调
  function onError(err) {
    const { ret_code } = err;
    let text = '';
    if (ret_code === 408000) {
      text = intl.tf('LP_THE_BROADCAST_IS_NOT_OVER_YET_PLEASE_BE_PATIENT');
    } else if (ret_code === 400331) {
      text = intl.tf('LP_PACKAGING_FAILED_NO_PICTURES_IN_THE_ALBUM');
    } else if (ret_code === 405000) {
      text = intl.tf('LP_PACKAGING_FAILED_ALBUM_HAS_EXPIRED');
    } else if (ret_code === 400342) {
      text = intl.tf('LP_PACKAGING_FAILED_ALBUM_NOT_EXIST');
    } else if (ret_code === 408001) {
      text = intl.tf('LP_PACKAGING_FAILED_ACTIVITY_NOT_EXIST');
    } else {
      return;
    }
    message.error(text);
  }

  // 复制下载链接
  async function copyLink(id) {
    const params = {
      baseUrl,
      id,
    };
    const res = await getDownloadLink(params);
    if (!res) return;
    const input = document.createElement('input');
    input.value = res;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    message.success(intl.tf('LP_SUCCESSFUL_REPLICATION'));
    document.body.removeChild(input);
  }

  // 直接下载
  async function goDownload(id) {
    const params = {
      baseUrl,
      id,
    };
    const res = await getDownloadLink(params);
    if (!res) return;
    const link = document.createElement('a');
    link.target = '_bank';
    link.href = res;
    link.click();
  }

  // 删除下载
  async function deleteLink(id) {
    boundGlobalActions.showConfirm({
      title: intl.lang === 'cn' ? intl.tf('LP_WARM_REMINDER') : '',
      message: intl.tf(
        'LP_AFTER_DELETION_THE_LINK_WILL_BE_COMPLETELY_DELETED_AND_RESTORE_IS_NO_LONGER_SUPPORTED'
      ),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          text: intl.tf('CANCEL'),
          className: 'white',
        },
        {
          onClick: async () => {
            const params = {
              baseUrl,
              id,
            };
            const res = await deleteDownloadLink(params);
            if (!res) return;
            queryTableData();
            message.success(intl.tf('LP_DELETE_SUCCESSFULLY'));
          },
          text: intl.tf('CONTINUE'),
        },
      ],
    });
  }

  /**
   * CN-提示框
   */
  async function tipModal() {
    if (intl.lang === 'cn') {
      try {
        const params = {
          baseUrl,
          enc_album_id: baseInfo?.enc_album_id,
        };
        const res = await hasDownloadPackageJob(params);
        // false-无下载任务 true-有下载任务
        if (!res) {
          return true;
        }
        boundGlobalActions.showConfirm({
          title: '温馨提示',
          message: '当前有生成任务正在进行，请在当前生成任务完成后再创建新的生成任务',
          close: boundGlobalActions.hideConfirm,
        });
        return false;
      } catch (error) {
        const { ret_code } = error;
        if (ret_code === 400342) {
          message.error(intl.tf('LP_PACKAGING_FAILED_ALBUM_NOT_EXIST'));
        }
        return false;
      }
    }
    return true;
  }

  // 生成下载链接事件
  async function createLink() {
    const { uidPk } = userInfo.toJS();
    const data = { baseUrl, scene: 1, id: uidPk };
    const isAuth = await liveServices.verifyAuth(data);
    if (!isAuth) {
      const url = urls.get('saasBaseUrl');
      boundGlobalActions.showConfirm({
        title: '',
        message: intl.tf('LP_FREE_VERSION_PURCHASE_TIPS'),
        close: boundGlobalActions.hideConfirm,
        buttons: [
          {
            onClick: () => {
              openPayCard({ boundGlobalActions, baseUrl: url });
              boundGlobalActions.hideConfirm();
            },
            text: intl.tf('LP_UPGRADES'),
          },
        ],
      });
      return;
    }
    // 中文新增判断提示，英文直接弹窗
    const hasModal = await tipModal();
    if (!hasModal) {
      return;
    }
    // 中英文区分
    const modalName = intl.lang === 'cn' ? GENERATE_DOWNLOAD_LINK : LIVE_PACKAGE_DOWNLOAD;
    const params = {
      close: type => {
        if (type === 'icon') {
          boundGlobalActions.hideModal(modalName);
        } else {
          preview();
        }
      },
      onOk: () => {
        boundGlobalActions.hideModal(modalName);
      },
      okCallBack,
      onError,
      title: intl.tf('LP_ALBUM_DOWNLOAD_MODAL_TITLE'),
      okText: intl.tf('NEXT'),
      cancelText: intl.tf('LP_ALBUM_DOWNLOAD_MODAL_BTN_PREVIEW'),
      baseInfo,
    };
    boundGlobalActions.showModal(modalName, params);
  }

  // 预览
  function preview() {
    // https://www.cnasovx.com.dd/live-photo-client/index.html?enc_broadcast_id=${enc_broadcast_id}#/home
    const { enc_broadcast_id } = baseInfo;
    const { broadcastBaseUrl } = urls.toJS();
    const src =
      broadcastBaseUrl + `live-photo-client/index.html?enc_broadcast_id=${enc_broadcast_id}#/home`;
    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank';
    link.click();
  }

  function openShare() {
    const { enc_broadcast_id, album_name } = baseInfo;
    boundGlobalActions.showModal(localModalTypes.LIVE_SHARE_MODAL, {
      close: () => boundGlobalActions.hideModal(localModalTypes.LIVE_SHARE_MODAL),
      enc_broadcast_id,
      album_name,
      message,
    });
  }
  return (
    <WithHeaderComp title={intl.tf('LP_ALBUM_DOWNLOAD')} titleStyle={{ fontWeight: 500 }}>
      <Container>
        <Tip>
          <Waring style={{ marginRight: 5 }} />
          <span>{intl.tf('LP_ALBUM_DOWNLOAD_MESSAGE')}</span>
        </Tip>
        <Title>
          <Left>
            <div className="title">{baseInfo?.album_name}</div>
            <div className="info">
              <span className="activity_time">
                {intl.tf('LP_ALBUM_DOWNLOAD_TIME')}：
                {intl.lang === 'cn'
                  ? dayJs(baseInfo?.begin_time).format('YYYY.MM.DD')
                  : dayJs(baseInfo?.begin_time).format('MMMM DD YYYY')}{' '}
                {/* MMMM DD YYYY, h:mm:ss a */}
              </span>
              <IntlConditionalDisplay reveals={['cn']}>
                <span className="activity_address">活动地点：{baseInfo?.city}</span>
              </IntlConditionalDisplay>
            </div>
          </Left>
          <Right>
            <IntlConditionalDisplay reveals={['en']}>
              <FButton
                style={{
                  color: '#222',
                  background: '#fff',
                  border: '1px solid #3a3a3a',
                  marginRight: 20,
                }}
                onClick={openShare}
              >
                Generate QR Code
              </FButton>
            </IntlConditionalDisplay>
            <FButton
              style={{
                color: '#222',
                background: '#fff',
                border: '1px solid #3a3a3a',
                marginRight: 20,
              }}
              onClick={preview}
            >
              {intl.tf('LP_ALBUM_DOWNLOAD_PREVIEW')}
            </FButton>
            <FButton onClick={createLink}>
              {intl.lang === 'cn' && <Add fill="#fff" style={{ width: 14 }} />}
              {intl.tf('LP_ALBUM_DOWNLOAD_CREATE_LINK')}
            </FButton>
          </Right>
        </Title>
        <FTable
          style={{ marginTop: 20 }}
          emptyText={intl.tf('LP_ALBUM_DOWNLOAD_TABLE_MESSAGE')}
          columns={columns}
          data={data}
        />
      </Container>
      {placeholder}
    </WithHeaderComp>
  );
}
