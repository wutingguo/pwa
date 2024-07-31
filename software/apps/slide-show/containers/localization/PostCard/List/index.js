import React from 'react';
import { XPureComponent, XIcon } from '@common/components';
import TableList from './component/TableList';
import './index.scss';

class PostCardList extends XPureComponent {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidMount() {
    const { boundProjectActions } = this.props;
    boundProjectActions && boundProjectActions.getPostCardList()
  }

  handleCreate() {
    const { history } = this.props;
    history.push('/software/slide-show/post-card/create')
  }

  render() {
    const { postCardList, history, boundGlobalActions, boundProjectActions, urls } = this.props;
    const tableProps = {
      urls,
      list: postCardList.toJS(),
      history,
      boundGlobalActions,
      boundProjectActions
    };
    return (
      <div className="post-card-list">
        <div className="add-post-card-button">
          <XIcon
            type="add"
            iconWidth={12}
            iconHeight={12}
            theme="black"
            title={t('NEW_POST_CARD')}
            text={t('NEW_POST_CARD')}
            onClick={this.handleCreate}
          />
        </div>
        { postCardList.size ? <TableList {...tableProps} /> : <div className="empty-card-list">
          暂时没有明信片
        </div>}

      </div>
    )
  }
}

export default PostCardList;
