import React from 'react';

import section_bg from './imgs/section_bg.png';

import './index.scss';

export default function LiveStatusSection() {
  return (
    <div className="section_box">
      <div className="section_header">
        <div className="section_title">Zno Instant™</div>
        <div className="section_sub_title">Delight Clients With Every Shutter Click</div>
      </div>
      <div className="section_body">
        <img className="section_bg" src={section_bg} />
      </div>
    </div>
  );
}
