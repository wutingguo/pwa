import React, { Component } from 'react';
import loadingImg from './loading.gif';
import './index.scss';

export default class LoadingImg extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loading-img">
        <img src={loadingImg} />
      </div>
    );
  }
};
