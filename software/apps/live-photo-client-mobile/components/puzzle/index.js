import domtoimage from 'dom-to-image';
import QRCode from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';

import { useMessage } from '@common/hooks';

import pingIcon from '@apps/live-photo-client-mobile/icons/pingtu.png';
import puzzleLoading from '@apps/live-photo-client-mobile/icons/puzzleLoading.gif';

import './index.scss';

const Puzzle = props => {
  const locationUrl = window.location.href;
  const { puzzleTitle, selectPuzzleList, puzzleStepFn, puzzleStep, resetSelectPuzzleListFn } =
    props;
  const [selectType, setSelectType] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const [placeholder, message] = useMessage();
  // const [puzzleStep, setPuzzleStep] = useState(0);
  const [num, setNum] = useState(0);
  const puzzleDom = useRef(null);
  //拼图初始化一下
  const [title, setPuzzleTitle] = useState(puzzleTitle);
  // useEffect(() => {
  //   domtoimage.toPng(puzzleDom.current, { quality: 1 });
  // }, []);
  const handlePuzzleModal = async step => {
    if (step === 1) {
      // 当点击拼图按钮时清空选择
      resetSelectPuzzleListFn();
      setPuzzleTitle(puzzleTitle);
      setSelectType(0);
      // setNum(0);
    }
    if (step === 3) {
      if (selectType === 1 && selectPuzzleList.length % 2 !== 0) {
        message.waring('宫格拼图数量不能为单数');
        return;
      }
      puzzleStepFn(step);
      await domtoimage.toPng(puzzleDom.current);
      domtoimage.toPng(puzzleDom.current).then(url => {
        puzzleStepFn(4);
        setResultUrl(url);
      });
    } else {
      puzzleStepFn(step);
    }
  };
  // useEffect(() => {
  //   if (puzzleStep === 3 && num >= selectPuzzleList.length) {
  //     // const node = document.getElementById('puzzleDom');
  //     domtoimage.toPng(puzzleDom.current, { quality: 1 });
  //     setTimeout(() => {
  //       domtoimage.toPng(puzzleDom.current, { quality: 1 }).then(url => {
  //         // console.log('image', url);
  //         // domtoimage.toPng(node, { quality: 1 }).then(url => {
  //         puzzleStepFn(4);
  //         setResultUrl(url);
  //         // });
  //       });
  //     }, 200);
  //   }
  // }, [num, puzzleStep]);
  return (
    <>
      <div className="noticeFont">{placeholder}</div>
      {/* 拼图按钮 */}
      {puzzleStep === 0 && (
        <div className="commonFlex puzzleBtn" onClick={() => handlePuzzleModal(1)}>
          <img src={pingIcon} className="image" />
        </div>
      )}
      {/* 拼图操作步数 */}
      {puzzleStep === 1 && (
        <div className="commonFlex puzzleMask">
          <div className="pmaskTent">
            <div className="pmClose" onClick={() => handlePuzzleModal(0)}>
              ×
            </div>
            <div className="pmTitle">拼图样式</div>
            <div className="commonFlex pmSelectBox">
              <div
                className={selectType === 0 ? 'pmSelectActive' : ''}
                onClick={() => setSelectType(0)}
              >
                <div className="commonFlex gridLeft">
                  <p></p>
                  <p></p>
                </div>
                <p className="desc">拼接</p>
              </div>
              <div
                className={selectType === 1 ? 'pmSelectActive' : ''}
                onClick={() => setSelectType(1)}
              >
                <div className="commonFlex gridRight">
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <p className="desc">宫格</p>
              </div>
            </div>
            <p>拼图名称</p>
            <p>
              <input
                type="text"
                maxLength={100}
                className="commonFlex"
                value={title}
                onChange={e => setPuzzleTitle(e.target.value)}
              />
            </p>
            <p className="commonFlex" onClick={() => handlePuzzleModal(2)}>
              开始拼图
            </p>
          </div>
        </div>
      )}
      {puzzleStep === 2 && (
        <div className="commonFlex bottomMask">
          <p>
            已选择{selectPuzzleList.length}张片，还可以选择{10 - selectPuzzleList.length}张
          </p>
          <p onClick={() => handlePuzzleModal(0)}>取消</p>
          <p className="commonFlex" onClick={() => handlePuzzleModal(3)}>
            下一步
          </p>
        </div>
      )}
      {puzzleStep === 3 && (
        <div className="commonFlex puzzleStep3Mask">
          <img src="./images/puzzleLoading.gif" alt="puzzleLoading" />
          <p>正在拼接中</p>
        </div>
      )}
      {puzzleStep === 4 && (
        <div className="pazzleStep4Mask">
          <p className="commonFlex" onClick={() => handlePuzzleModal(0)}>
            ×
          </p>
          <img src={resultUrl} alt="puzzleImg" />
          <p className="commonFlex">长按图片保存至手机</p>
        </div>
      )}
      {/* 使用dom-to-image绘制的DOM */}
      <div className="commonFlex puzzleDom" id="puzzleDom" ref={puzzleDom}>
        {title && <div className="commonFlex pdTitle">{title}</div>}
        <div className={selectType === 0 ? 'imgContainer' : 'imgContainer gridType'}>
          {selectPuzzleList.map((item, index) => (
            // <img key={item.src} src={item.src} alt="img" onLoad={() => setNum(num + 1)} />
            <img key={item.src} src={item.src} alt="img" />
          ))}
        </div>

        <QRCode
          id="qrCode"
          renderAs="canvas"
          value={locationUrl}
          size={240}
          imageSettings={{
            height: 50,
            width: 50,
            excavate: false,
          }}
        />
        <p>扫码查看相册其他高清大图</p>
      </div>
    </>
  );
};

export default React.memo(Puzzle);
