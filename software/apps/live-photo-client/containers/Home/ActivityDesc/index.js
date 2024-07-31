import React, { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import './index.scss';
import Empty from '@apps/live/components/Empty';

// getTargetOperationCount

export default function ActivityDesc(props) {
  const { activityDesc } = props;
  const content = activityDesc.get('activity_desc') || '';
  const isEmpty = content.trim().length === 0;
  return (
    <>
      {isEmpty ? (
        <Empty />
      ) : (
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }}></div>
      )}
    </>
  );
}
