import React from 'react';
import classNames from 'classnames';

const getTransitionModeSelect = that => {
  const { transitionModes } = that.props;
  const { transition_mode } = that.state;
  return (
    <div className="transition-change-mode-select">
      <div />
      {transitionModes.map(item => {
        const itemCN = classNames('transition-change-mode-option', {
          selected: transition_mode === item.get('type')
        });
        return (
          <div key={item.get('name')} className={itemCN} onClick={() => that.onModeChange(item)}>
            {item.get('name')}
          </div>
        );
      })}
    </div>
  );
};

const onModeChange = (that, option) => {
  const { transition_duration } = that.state;
  const minValue = option.getIn(['duration', 'min_value']);
  const maxValue = option.getIn(['duration', 'max_value']);
  const defaultValue = option.getIn(['duration', 'default_value']);
  const can_change = option.getIn(['duration', 'can_change']);
  let newDuration = transition_duration;
  const isInRange = transition_duration >= minValue && transition_duration <= maxValue;
  if (!can_change || !isInRange) {
    newDuration = defaultValue;
  }
  that.setState({
    transition_mode: option.get('type'),
    transition_duration: newDuration
  });
  that.toogleModeSelector();
};

const onDurationChange = (that, event) => {
  that.setState({
    transition_duration: Number(event.target.value)
  });
};

export const handleSave = that => {
  const { transitionModes } = that.props;
  const { transition_mode, transition_duration } = that.state;

  const transitionName = transitionModes
    .filter(mode => mode.get('type') == transition_mode)
    .getIn(['0', 'name']);
  console.log(transitionName);
  window.logEvent.addPageEvent({
    name: 'SlideshowsTransition_Click_Save',
    Effect: transitionName,
    Seconds: transition_duration
  });

  const { hideSubContent, boundProjectActions } = that.props;
  hideSubContent();

  boundProjectActions
    .changeTransition({
      transition_mode,
      transition_duration
    })
    .then(() => {
      // TODO: 保存数据以更新状态，并重新获取详情
      boundProjectActions.saveSlideshow();
    });
};

export default {
  getTransitionModeSelect,
  onModeChange,
  onDurationChange,
  handleSave
};
