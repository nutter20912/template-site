import { Empty } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useRef, useState } from 'react';
import { useAsyncValue } from 'react-router-dom';
import { Post } from '../../api';
import useVirtualList from '../useVirtualList';
import EditModal from './EditModal';
import PostListItem from './PostListItem';
import TopCard from './TopCard';

/**
 * 貼文卡片列表元件
 *
 * @returns {React.ReactElement}
 */
export default function PostList() {
  const result = useAsyncValue();
  const listRef = useRef(null);

  const [editOpen, setEditOpen] = useState(false);
  const [targetId, setTargetId] = useState(false);
  const usersState = useState({});

  const {
    state: { renderData },
    dispatch,
    onScroll,
    containerHeight,
    itemHeight,
  } = useVirtualList(result, 0.38, Post.getIndex);

  const getListItem = (item, index) => (
    <>
      {index === 0 && <TopCard key="top-card" dispatch={dispatch} />}
      <PostListItem
        item={item}
        setTargetId={setTargetId}
        setEditOpen={setEditOpen}
        dispatch={dispatch}
        usersState={usersState}
      />
    </>
  );

  return (
    <div style={{ width: '50vw' }}>
      {renderData.length === 0 && ([
        <TopCard key="top-card" dispatch={dispatch} />,
        <Empty key="empty" />,
      ])}
      <EditModal
        open={editOpen}
        setOpen={setEditOpen}
        targetId={targetId}
        dispatch={dispatch}
      />
      <VirtualList
        id="list"
        ref={listRef}
        data={renderData}
        height={containerHeight}
        itemHeight={itemHeight}
        itemKey="id"
        onScroll={onScroll}
      >
        {(item, index) => getListItem(item, index)}
      </VirtualList>
    </div>
  );
}
