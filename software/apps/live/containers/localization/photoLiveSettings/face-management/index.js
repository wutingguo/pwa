import React, { useEffect, useRef, useState } from 'react';
import RcStep from 'react-step-wizard';

import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import useLiveSetting from '@apps/live/hooks/useLiveSetting';
import { getFaceList } from '@apps/live/services/photoLiveSettings';

import AdjustingFacialInformation from './AdjustingFacialInformation';
import Management from './Management';
import { Container } from './layout';

// import useLiveSetting from '@apps/live/hooks/useLiveSetting';

export default function FaceManagement(props) {
  const { baseInfo, urls } = props;
  const { showLoading, hideLoading } = useLiveSetting();

  const [record, setRecord] = useState(null);
  // console.log("🚀 ~ FaceManagement ~ record:", record)

  const SW = useRef(null);
  const [users, setUsers] = useState([]);
  const baseUrl = urls?.get('galleryBaseUrl');

  useEffect(() => {
    if (baseInfo?.enc_album_id) {
      queryFaceList();
    }
  }, [baseInfo?.enc_album_id]);

  async function queryFaceList() {
    const { enc_album_id } = baseInfo;
    try {
      const params = {
        enc_album_id,
        baseUrl,
      };
      showLoading();
      const res = await getFaceList(params);
      setUsers(res?.detail_info_list || []);
      hideLoading();
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  }

  function onChange(value) {
    setRecord(value);
  }

  return (
    <WithHeaderComp title="Face Management">
      <Container>
        <RcStep
          initialStep={1}
          className="step_box"
          style={{ height: '100%' }}
          instance={ref => (SW.current = ref)}
        >
          <Management
            onChange={onChange}
            baseInfo={baseInfo}
            urls={urls}
            users={users}
            queryUser={queryFaceList}
          />
          <AdjustingFacialInformation
            record={record}
            urls={urls}
            baseInfo={baseInfo}
            users={users}
            queryUser={queryFaceList}
          />
        </RcStep>
      </Container>
    </WithHeaderComp>
  );
}
