import Immutable from 'immutable';
import React, { useMemo, useState } from 'react';

import './index.scss';

function ImgMaskSelect(props) {
  const { info, puzzle, src } = props;
  const { puzzleStep, fn, list } = puzzle;
  const infoTemp = useMemo(() => {
    return Immutable.isImmutable(info) ? info.toJSON() : info;
  }, [info]);
  const index = useMemo(() => {
    // console.log('list', list);
    return list.findIndex(item => {
      return item.show_enc_content_id === infoTemp.show_enc_content_id;
    });
  }, [info, list]);
  const [selectTag, setSelectTag] = useState(false);

  const select = event => {
    event.stopPropagation();
    setSelectTag(!selectTag);
    fn(index, { ...infoTemp, src });
  };
  return puzzleStep === 2 ? (
    <div className="imgSelectMask">
      <div className={index > -1 ? 'selectMask maskSelectActive' : 'selectMask'} onClick={select}>
        <p className="commonFlex selectCircle">{index + 1}</p>
      </div>
    </div>
  ) : (
    ''
  );
}
export default React.memo(ImgMaskSelect);
