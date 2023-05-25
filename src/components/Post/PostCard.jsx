import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import React from 'react';
import { useAsyncValue } from 'react-router-dom';

/**
 * 貼文卡片元件
 *
 * @returns {React.ReactElement}
 */
export default function PostCard() {
  const { result: post } = useAsyncValue();

  return (
    <Card bordered={false}>
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={post.user.name}
        style={{ margin: '5px' }}
      />
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </Card>
  );
}
