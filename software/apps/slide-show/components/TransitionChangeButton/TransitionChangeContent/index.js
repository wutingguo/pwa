import React, { PureComponent } from 'react';
import main from './handle/main';
import TransitionEffectSection from './TransitionEffectSection';
import { XButton } from '@common/components';

import './index.scss';

class TransitionChangeContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModeSelector: false,
      transition_mode: props.transition_mode,
      transition_duration: props.transition_duration
    }
  }

  getTransitionModeSelect = () => main.getTransitionModeSelect(this)
  onModeChange = (option) => main.onModeChange(this, option)
  onDurationChange = (event) => main.onDurationChange(this, event)
  handleSave = () => main.handleSave(this)

  toogleModeSelector = () => {
    this.setState({
      showModeSelector: !this.state.showModeSelector
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transition_mode !== this.state.transition_mode ||
      nextProps.transition_duration !== this.state.transition_duration
    ) {
      this.setState({
        transition_mode: nextProps.transition_mode,
        transition_duration: nextProps.transition_duration
      });
    }
  }

  render() {
    const {
      showModeSelector,
      transition_mode,
      transition_duration
    } = this.state;
    const {
      transitionModes
    } = this.props;
    const selectedMode = transitionModes.find(item => item.get('type') == transition_mode);
    if (!selectedMode) return null; 
    return (
      <div className="transition-change-content">
        <div className="transition-change-title">{t("TRANSITION_EFFECT")}</div>
        <div
          className="transition-change-mode-container"
        >
          <div
            className="transition-change-mode-value"
            onClick={this.toogleModeSelector}
          >{selectedMode.get('name')}</div>
          {showModeSelector && this.getTransitionModeSelect()}
        </div>
        <TransitionEffectSection
          transition_mode={transition_mode}
          transition_duration={transition_duration}
        />
        <div className="transition-change-duration-container">
          <input
            className="transition-change-duration-input"
            type="range"
            min={selectedMode.getIn(['duration', 'min_value'])}
            max={selectedMode.getIn(['duration', 'max_value'])}
            step={selectedMode.getIn(['duration', 'step'])}
            value={transition_duration}
            disabled={!selectedMode.getIn(['duration', 'can_change'])}
            onChange={this.onDurationChange}
          />
          <span>{transition_duration} s</span>
        </div>
        <div className="button-container">
          <XButton
              className="black"
              width={80}
              height={32}
              onClicked={this.handleSave}
            >{t("SAVE")}</XButton>
        </div>
      </div>
    );
  }
}
 
export default TransitionChangeContent;