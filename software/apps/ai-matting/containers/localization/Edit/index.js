import React from 'react';
import { aiMattingMessageType } from '@resource/lib/constants/strings';
import Header from '../../../components/Header';
import MainPanel from '../../../components/MainPanel';
import getPrefixCls from '../../../utils/getPrefixCls';
import './index.scss';

const prefixCls = getPrefixCls('edit')

class Edit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }


  render() {
    const {
      boundGlobalActions,
      boundProjectActions,
      urls,
      images,
      property,
      ratio,
      page,
      exitImageMatting,
      showRetryModal
    } = this.props;


    const headerProps = {
      exitImageMatting
    };

    return (
      <div className={prefixCls}>
        <Header {...headerProps} />
        <MainPanel {...this.props} />
      </div>
    );
  }
}

export default Edit;
