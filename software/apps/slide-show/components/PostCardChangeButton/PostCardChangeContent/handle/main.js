import React from 'react';
import classNames from 'classnames';

const getPostCardListSelect = that => {
  const { postCardList } = that.props;
  const { visiting_card } = that.state;
  return (
    <div className="transition-change-mode-select">
      <div />
      {postCardList.map(item => {
        const itemCN = classNames('transition-change-mode-option', {
          selected: visiting_card == item.get('id')
        });
        return (
          <div key={item.get('id')} className={itemCN} onClick={() => that.onModeChange(item)}>
            {item.get('card_name')}
          </div>
        );
      })}
    </div>
  );
};

const onModeChange = (that, option) => {
  that.setState({
    visiting_card: option.get('id'),
  });
  that.toogleModeSelector();
};

const onDurationChange = (that, event) => {
  that.setState({
    transition_duration: Number(event.target.value)
  });
};

export const handleSave = that => {
  const { visiting_card, isUnUsePostCard } = that.state;
  const { hideSubContent, boundProjectActions, projectId, boundGlobalActions } = that.props;
  const { addNotification } = boundGlobalActions;
  hideSubContent();
  boundProjectActions.setPostCard({
    project_id: projectId,
    visiting_card_id: isUnUsePostCard ? 0 : visiting_card
  }).then(res => {
    if(res.ret_code === 200000 && res.data) {
      boundProjectActions.getCollectionDetail(projectId);
      addNotification({
        message: t('ADD_POST_CARD_SUCCESS'),
        level: 'success',
        autoDismiss: 2
      });
    }
  })
};

export default {
  getPostCardListSelect,
  onModeChange,
  onDurationChange,
  handleSave
};
