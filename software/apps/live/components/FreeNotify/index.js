import React, { useMemo } from 'react';

import XButton from '@resource/components/XButton';

import { saasProducts } from '@resource/lib/constants/strings';

import { Container, Left, Right } from './layout';

function FreeNotify(props) {
  const { planList } = props;
  const show = useMemo(() => {
    let hidden = false;
    const list = planList[saasProducts.live] || [];

    hidden = list.some(item => item.chargePolicyCode !== 'ALBUM_LIVE_FREE');
    return !hidden;
  }, [planList]);
  const text =
    'Upgrade to Instant Premium Plans for unlimited cloud storage, unrestricted photo uploads, and limitless access. Experience the full potential of Instant with unparalleled freedom – no storage limits, no photo count restrictions, and unlimited access at your fingertips. Elevate your Instant experience today!';
  if (!show) return null;

  function click() {
    const path = `/saascheckout.html?product_id=${saasProducts.instant}&plan_id=39&from=saas`;
    location.href = path;
  }
  return (
    <Container>
      <Left>{text}</Left>
      <Right>
        <XButton onClicked={click} width={145}>
          Upgrade
        </XButton>
      </Right>
    </Container>
  );
}

export default FreeNotify;
