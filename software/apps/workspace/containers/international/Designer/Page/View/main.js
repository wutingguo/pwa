import React, { Component, Fragment } from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import XGroup from '@src/containers/international/Designer/components/Group';
// 公共组件
import XImageArray from '@src/containers/international/Designer/components/ImageArray';
import XItemBox from '@src/containers/international/Designer/components/ItemBox';
import XLabelItem from '@src/containers/international/Designer/components/LabelItem';
import XTitle from '@src/containers/international/Designer/components/Title';

const Empty = () => {
  return <span>None</span>;
};

class Main extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      productConfirmat,
      currPage,
      sequence,
      coverDesign,
      coverArr,
      favoriteArr,
      groupArr,
      instructions,
      liningDesign,
      edgeDesign,
      imageSelection,
    } = this.props;
    console.log('props', this.props);
    return (
      <Fragment>
        <XItemBox>
          <XTitle title={'1. Product Confirmation'} className="title mb24" />
          <XTitle className="sub-title mb24" />
          {Array.isArray(productConfirmat) && productConfirmat.length ? (
            productConfirmat.map(p => {
              return <XLabelItem key={p.value} label={`${p.label}:`} value={p.value} />;
            })
          ) : (
            <Empty />
          )}
        </XItemBox>

        <XItemBox>
          <XTitle title="2. Total # of Pages (1 sheet = 2 pages)" className="title mb24" />
          {currPage > 0 ? <XLabelItem value={`${currPage} pages`} /> : <Empty />}
        </XItemBox>

        <XItemBox>
          <XTitle title="3. Photo Sequence" className="title mb24" />
          {sequence ? <XLabelItem value={sequence} /> : <Empty />}
        </XItemBox>

        <XItemBox>
          <XTitle title="4. Cover Design" className="title mb24" />
          {Array.isArray(coverDesign) && coverDesign.length ? (
            coverDesign.map(c => {
              return <XLabelItem key={c} className="max-width mb24" value={c} />;
            })
          ) : (
            <Empty />
          )}
          {Array.isArray(coverArr) && coverArr.length ? (
            <XImageArray className="mt40" list={coverArr} />
          ) : null}
        </XItemBox>
        <XItemBox>
          <XTitle title="5. Lining Design" className="title mb24" />
          {sequence ? <XLabelItem value={liningDesign} /> : <Empty />}
        </XItemBox>
        <XItemBox>
          <XTitle title="6. Edge Design" className="title mb24" />
          {sequence ? <XLabelItem value={edgeDesign} /> : <Empty />}
        </XItemBox>
        <XItemBox>
          <XTitle title="7. Favorite Images" className="title mb24" />
          {Array.isArray(favoriteArr) && favoriteArr.length ? (
            <XImageArray list={favoriteArr} />
          ) : (
            <Empty />
          )}
        </XItemBox>

        <XItemBox>
          <XTitle title="8. Image Groupings" className="title mb24" />
          {Array.isArray(groupArr) && groupArr.length ? (
            groupArr.map(g => {
              return <XGroup key={g.groupName} groupName={g.groupName} list={g.imageList} />;
            })
          ) : (
            <Empty />
          )}
        </XItemBox>
        <XItemBox>
          <XTitle title="9. Image Selection" className="title mb24" />
          {imageSelection ? <XLabelItem value={imageSelection} /> : <Empty />}
        </XItemBox>

        <XItemBox>
          <XTitle title="10. Additional Instructions" className="title mb24" />
          {instructions ? <XLabelItem value={instructions} className="max-width" /> : <Empty />}
        </XItemBox>
      </Fragment>
    );
  }
}

export default Main;
