import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import renderRoutes from '@resource/lib/utils/routeHelper';
import mapState from '@src/redux/selector/mapState';
import mapDispatch from '@src/redux/selector/mapDispatch';
import SettingsList from './components/SettingsList';
import { settingsConfig } from './handle/config';
import { getCurrentSidebarKey } from './handle/main';
import './index.scss';

@connect(mapState, mapDispatch)
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreate: false
    }
  }
  componentDidMount() {

  }

  onSelect = ({key}) => {
    const {
      history: { push }
    } = this.props;
    const { path } = settingsConfig.find(item => item.key === key);
    push(path);
  }

  render() {
    const {
      history: { location: { pathname } },
    } = this.props;
    
    const { selectedKeys } = getCurrentSidebarKey(pathname, settingsConfig);
  
    const routeHtml = renderRoutes({
      isHash: false,
      props: { ...this.props }
    });

    const settingsListProps = {
      items: settingsConfig,
      selectedKeys,
      onSelect: this.onSelect
    }

    return (
      <div className='global-settings-container'>
        <SettingsList {...settingsListProps} />
        
        {routeHtml}
      </div>
    )
  }
}

export default withRouter(Settings);
