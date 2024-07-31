import React, { Component } from 'react';
import './index.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import prevIcon from './icons/prev.png';
import nextIcon from './icons/next.png';

import 'swiper/swiper-bundle.css';
class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowBtns: true,
      prevBtnDisabled: true,
      nextBtnDisabled: false
    };
  }
  nextPage = () => this.nextPage();
  prevPage = () => this.prevPage();
  onSlideChange = () => this.onSlideChange();

  nextPage = () => {
    const swiper = document.querySelector('.swiper').swiper;
    swiper.slideNext();
    console.log(swiper.allowSlideNext);
    console.log(swiper.allowSlidePrev);
    this.chnageBtnState(swiper);
  };

  prevPage = () => {
    const swiper = document.querySelector('.swiper').swiper;
    swiper.slidePrev();
    this.chnageBtnState(swiper);

    console.log(swiper.allowSlideNext);
    console.log(swiper.allowSlidePrev);
  };

  onSlideChange = () => {
    const swiper = document.querySelector('.swiper').swiper;
    this.chnageBtnState(swiper);
  };

  chnageBtnState(swiper) {
    this.setState({
      prevBtnDisabled: swiper.isBeginning,
      nextBtnDisabled: swiper.isEnd
    });
  }

  getRenderImagesHTML() {
    const { spu_asset_list, urls = {} } = this.props;
    const html = [];
    if (spu_asset_list && spu_asset_list.length) {
      spu_asset_list.forEach((item, index) => {
        html.push(
          <SwiperSlide>
            <img className="image" src={`${urls.imgBaseUrl}${item.storage_path}`}></img>
          </SwiperSlide>
        );
      });
    }

    return html;
  }

  render() {
    const { prevBtnDisabled, nextBtnDisabled } = this.state;

    const prevWrapper = classNames('image prev', {
      disabled: prevBtnDisabled
    });
    const nextWrapper = classNames('image next', {
      disabled: nextBtnDisabled
    });

    return (
      <div className="estore-image-slider">
        <div className="prev-next-page prev" onClick={this.prevPage}>
          {' '}
          <img className={prevWrapper} src={prevIcon}></img>{' '}
        </div>
        <Swiper
          spaceBetween={15}
          slidesPerView={4}
          className="image-container"
          onSlideChange={this.onSlideChange}
        >
          {this.getRenderImagesHTML()}
        </Swiper>
        <div className="prev-next-page next" onClick={this.nextPage}>
          {' '}
          <img className={nextWrapper} src={nextIcon}></img>{' '}
        </div>
      </div>
    );
  }
}

export default ImageSlider;
