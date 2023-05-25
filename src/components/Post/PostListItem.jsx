import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Modal, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../UserContext';
import { Post } from '../../api';
import UserInfoPopover from '../User/UserInfoPopover';

/**
 * 貼文列表項目元件
 *
 * @returns {React.ReactElement}
 */
export default function PostListItem({
  item,
  setTargetId,
  setEditOpen,
  dispatch,
  usersState,
}) {
  const user = useUserContext();
  const navigate = useNavigate();

  const getHeaderDropdownItems = (postId) => [
    {
      label: '編輯貼文',
      key: '0',
      onClick: () => {
        setEditOpen(true);
        setTargetId(postId);
      },
    },
    {
      label: '刪除貼文',
      key: '1',
      onClick: () => {
        Modal.confirm({
          title: 'Are you sure delete this post?',
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            try {
              await Post.delete({ id: postId });
              dispatch({ type: 'delete', data: { id: postId } });
              message.info('刪除成功');
            } catch (error) {
              message.error(error.message);
            }
          },
        });
      },
    },
  ];

  const getTitle = ({ id: postId, user: { id: userId, name } }) => (
    <>
      <UserInfoPopover userId={userId} usersState={usersState}>
        <Avatar icon={<UserOutlined />} />
        <span style={{ marginLeft: '10px' }}>{name}</span>
      </UserInfoPopover>
      <Dropdown
        menu={{ items: getHeaderDropdownItems(postId) }}
        trigger={['click']}
        placement="bottomRight"
        disabled={(userId !== user.id)}
      >
        <Button
          style={{ float: 'right' }}
          icon={<EllipsisOutlined />}
          type="link"
        />
      </Dropdown>
    </>
  );

  return (
    <Card
      style={{ margin: '10px' }}
      className="content-card"
      key={item.id}
      title={getTitle(item)}
      actions={[
        <MessageOutlined onClick={() => navigate(`/posts/${item.id}`)} />,
      ]}
    >
      <h3>{item.title}</h3>
      {item.content}
    </Card>
  );
}
