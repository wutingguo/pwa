import React from 'react';

import { getUploadPsdHistory } from '@apps/theme-editor/services/project';

import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import MainPanel from '../../../components/MainPanel';

import * as introHandle from './handle/intro';

import './index.scss';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    // 新手指引
    this.onIntroSkip = () => introHandle.onSkip(this);
    this.onIntroDone = () => introHandle.onDone(this);
    this.onIntroOrderStep = () => introHandle.onOrderStep(this);
    this.onIntroNext = () => introHandle.onNext(this);
    this.onIntroPrevious = () => introHandle.onPrevious(this);
    this.onIntroGoto = stepIndex => introHandle.onGoto(this, stepIndex);
    this.showIntroModal = () => introHandle.showIntroModal(this);
  }

  componentDidMount() {
    const { baseUrl, pageArray } = this.props;
    const arr = pageArray.toJS();
    const page = arr[0];
    if (page?.themeCode) {
      const params = new URLSearchParams(window.location.search);
      const uploadThemeId = params.get('uploadThemeId');
      window.logEvent.addPageEvent({
        name: 'DesignerMaterialMT_AnalyzedTheme',
        themeCode: page.themeCode,
        uploadThemeId,
      });
    }
    getUploadPsdHistory(baseUrl).then(data => {
      if (!data) {
        this.showIntroModal();
      }
    });
  }
  componentWillUnmount() {
    this.onIntroDone();
  }

  render() {
    const {
      pagination,
      pageArray,
      ratios,
      property,
      undoData,
      boundGlobalActions,
      boundProjectActions,
    } = this.props;

    const mainPanelProps = {
      ratios,
      pageArray,
      pagination,
      undoData,
      boundGlobalActions,
      boundProjectActions,
    };

    const headerProps = {
      property,
      pageArray,
      boundGlobalActions,
      boundProjectActions,
    };
    const footerProps = {
      ratios,
      pageArray,
      pagination,
      boundGlobalActions,
      boundProjectActions,
    };

    return (
      <div className="theme-editor">
        <Header {...headerProps} />
        <MainPanel {...mainPanelProps} />
        <Footer {...footerProps} />
      </div>
    );
  }
}

export default Edit;
