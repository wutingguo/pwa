import React, { useEffect, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';
import { RcRadioGroup } from '@resource/components/XRadio';

import { useLanguage } from '@common/components/InternationalLanguage';

import { useMessage } from '@common/hooks';

import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { queryMenuInfo, updateMenuInfo } from '@apps/live/services/photoLiveSettings';

import MenuContent from './MenuContent';
// import { useParams } from 'react-router-dom';
import { Container, Content, Footer, Line } from './layout';
import initalData from './mockData';

export default function PhotoMenu(props) {
  const childRef = useRef(null);
  const { urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  // const { id } = useParams();
  const [radioValue, setRadioValue] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [placeholder, message] = useMessage();

  const [data, setData] = useState(null);
  const { intl, lang } = useLanguage();

  useEffect(() => {
    if (baseInfo) {
      getMenuInfo();
    }
  }, [baseInfo]);

  // 获取menu信息
  async function getMenuInfo() {
    const { broadcast_id } = baseInfo;
    const params = {
      baseUrl,
      id: broadcast_id,
    };
    const res = await queryMenuInfo(params);
    if (!res) return null;
    const { layout_type, menu_items } = res;
    if (menu_items === null) return;
    setRadioValue(layout_type);
    const newData = {};
    const column = {
      id: 'column',
      current: 'broadcast',
    };
    const tasks = JSON.parse(menu_items)
      .sort((a, b) => a.order - b.order)
      .map((item, index) => {
        if (index === 0) {
          column.current = item.id;
        }
        newData[item.id] = item;
        return item.id;
      });

    column.tasks = tasks;
    newData.column = column;
    setData({ ...newData });
    // console.log('res:::', newData);
  }
  function onClicked(e) {
    const { value } = e.target;

    setIsChange(true);
    setRadioValue(value);
    // console.log(value);
  }

  function onChange(values) {
    setIsChange(true);
    setData({ ...values });
  }

  // 保存数据
  async function save({ nextData }) {
    if (data.column.current === 'introduce') {
      // 合并活动介绍底部保存按钮
      const res = await childRef.current.onSave();
      if (!res) return;
      nextData = res;
    }

    const { broadcast_id } = baseInfo;
    const params = {
      broadcast_id,
      layout_type: radioValue,
    };

    const menuItems = Object.keys(nextData || data)
      .map(key => {
        if (key !== 'column') {
          return data[key];
        }
      })
      .filter(Boolean);

    params.menu_items = JSON.stringify(menuItems);
    await updateMenuInfo({ baseUrl, data: params });
    setData({ ...data });
    setIsChange(false);

    message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
  }

  return (
    <WithHeaderComp title={intl.tf('LP_PHOTO_CATEGORIES')}>
      <Container>
        <Content>
          <Line>
            <div className="title">{intl.tf('LP_DISPLAY_STYLE')}</div>
            <div className="content">
              <RcRadioGroup
                wrapperClass="znoRadio"
                onChange={onClicked}
                value={radioValue}
                options={[
                  {
                    value: 'LEFT',
                    label: intl.tf('LP_LEFT_ALIGNED'),
                  },
                  {
                    value: 'CENTER',
                    label: intl.tf('LP_CENTER_ALIGNED'),
                  },
                ]}
              />
            </div>
          </Line>

          <Line>
            <div className="title">{intl.tf('LP_SORTED_BY')}</div>
            <div className="content">
              {data ? (
                <MenuContent
                  ref={childRef}
                  data={data}
                  onChange={onChange}
                  save={save}
                  isChange={isChange}
                />
              ) : null}
            </div>
          </Line>
        </Content>
      </Container>
      <Footer>
        <XButton width={200} height={40} onClick={save}>
          {intl.tf('LP_SAVE_SETTING')}
        </XButton>
      </Footer>
      {placeholder}
    </WithHeaderComp>
  );
}
