import {
  CloseOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, List, message, Modal, Skeleton, Spin, Tooltip } from 'antd';
import React, { useReducer, useState } from 'react';
import { useAsyncValue, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../api';
import { datetime } from '../../lib';
import { useUserContext } from '../../UserContext';
import CommentInput from './CommentInput';

const CommentAvatar = styled(Avatar)`
  margin: 5px;
`;

/**
 * 虛擬列表分頁器
 * @param {state.listSet} listSet id 收集器
 * @param {state.renderData} renderData 渲染資料
 * @param {action.type} type 動作類型
 * @param {action.data} data 資料
 * @returns
 */
function reducer(state, { type, data }) {
  const { currentPage, listSet, renderData, total } = state;

  switch (type) {
    case 'loading': {
      return {
        ...state,
        renderData: renderData.concat({ loading: true }),
      };
    }
    case 'loaded': {
      const appendData = data.filter(
        (item) => !listSet.has(item.id),
      );

      appendData.forEach((item) => listSet.add(item.id));

      return {
        ...state,
        currentPage: currentPage + 1,
        renderData: renderData.slice(0, -1).concat(appendData),
      };
    }
    case 'add': {
      return {
        ...state,
        total: total + 1,
        renderData: [data, ...renderData],
      };
    }
    case 'update': {
      return {
        ...state,
        renderData: renderData.map(
          (item) => (data.id === item.id ? { ...item, ...data } : item),
        ),
      };
    }
    case 'delete': {
      return {
        ...state,
        total: total - 1,
        renderData: renderData.filter((comment) => comment.id !== data),
      };
    }
    default: {
      throw new Error();
    }
  }
}

/**
 * 評論區域元件
 *
 * @returns {React.ReactElement}
 */
export default function CommentsBlock() {
  const user = useUserContext();
  const { data = [], paginator } = useAsyncValue();

  const [targetId, setTargetId] = useState(false);
  const [storeSpinning, setStoreSpinning] = useState(false);
  const [updateSpinning, setUpdateSpinning] = useState(false);
  const { postId } = useParams();

  const [{ renderData, currentPage, total }, dispatch] = useReducer(reducer, {
    currentPage: paginator.current_page,
    listSet: new Set(data.map((comment) => comment.id)),
    renderData: data,
    total: paginator.total,
  });

  const getDropdownItems = (commentId) => [
    {
      label: 'update',
      key: '0',
      onClick: () => {
        setTargetId(commentId);
      },
    },
    {
      label: 'delete',
      key: '1',
      onClick: () => {
        Modal.confirm({
          title: 'Are you sure delete this post?',
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            await api.Comment.delete({ id: commentId });
            dispatch({ type: 'delete', data: commentId });
            message.info('刪除成功');
          },
        });
      },
    },
  ];

  const getExtra = (comment) => (
    <Dropdown
      menu={{ items: getDropdownItems(comment.id) }}
      trigger={['click']}
      placement="bottomRight"
      disabled={(comment.user.id !== user.id)}
    >
      <Button
        style={{ float: 'right' }}
        icon={<EllipsisOutlined />}
        type="link"
      />
    </Dropdown>
  );

  const onLoadMore = () => {
    dispatch({ type: 'loading' });

    if (paginator.last_page >= currentPage) {
      api.Comment.all({ postId, page: currentPage + 1 })
        .then((res) => dispatch({ type: 'loaded', data: res.data }));
    }
  };

  const loadMore = currentPage !== paginator.last_page && (
    <Button onClick={onLoadMore}>loading more</Button>
  );

  return (
    <List
      className="comment-list"
      header={[
        <div key="replies">{`${total} replies`}</div>,
        <Tooltip key="0" title="Enter 送出">
          <CommentAvatar gap="10" icon={<UserOutlined />} />
          <Spin spinning={storeSpinning} wrapperClassName="comment-input-spin">
            <CommentInput
              targetId={postId}
              dispatch={dispatch}
              action="store"
              setSpinning={setStoreSpinning}
            />
          </Spin>
        </Tooltip>,
      ]}
      loadMore={loadMore}
      dataSource={renderData}
      renderItem={
        (item) => (item?.loading
          ? <Skeleton avatar active style={{ width: '35vw', margin: '25px' }} />
          : (
            <List.Item actions={[getExtra(item)]}>
              <div>
                <CommentAvatar>{item.user.name[0].toUpperCase()}</CommentAvatar>
                <Tooltip title={datetime.format(item.updated_at)}>
                  <span style={{ fontSize: 1, color: 'LightGray' }}>
                    {`${datetime.toNow(item.updated_at)} ago`}
                  </span>
                </Tooltip>

                <div
                  style={{
                    background: 'rgb(239, 242, 245)',
                    borderRadius: '5px',
                    padding: '5px',
                    width: 'calc(45vw - 100px)',
                  }}
                >
                  <div>
                    <b>{item.user.name}</b>
                    <br />
                  </div>

                  {targetId !== item.id && item.content}
                  {targetId === item.id && (
                    <Spin spinning={updateSpinning} wrapperClassName="comment-input-spin">
                      <CommentInput
                        targetId={targetId}
                        value={item.content}
                        dispatch={dispatch}
                        action="update"
                        setSpinning={setUpdateSpinning}
                        onFinish={() => setTargetId(null)}
                      />
                      <Button
                        icon={<CloseOutlined />}
                        type="link"
                        onClick={() => setTargetId(null)}
                      >
                        取消
                      </Button>
                    </Spin>
                  )}
                </div>
              </div>
            </List.Item>
          ))
      }
    />
  );
}
