import React from 'react';

import './index.scss';

const src01 = './images/tip.png';
export default function WatermarkTipModal(props) {
  const { data } = props;
  const { handleClose } = data.toJS();
  return (
    <div className="watermark_tip_modal">
      <div className="watermark_tip_content">
        <img className="watermark_tip_img" src={src01} />
        <div className="watermark_tip_close" onClick={handleClose}></div>
      </div>
    </div>
  );
}
