import { HomeOutlined } from '@ant-design/icons';
import React from 'react';
import { defer } from 'react-router-dom';
import { Comment, Post } from '../../api';
import { ErrorHandler } from '../../components';
import All from './all';
import Show from './show';

export default {
  path: '/',
  element: <All errorHandler={ErrorHandler} />,
  description: '首頁',
  key: 'home',
  icon: <HomeOutlined />,
  loader: async () => {
    const reviews = Post.getIndex();

    return defer({ reviews });
  },
  children: [
    {
      path: '/posts/:postId',
      element: <Show errorHandler={ErrorHandler} />,
      description: 'post',
      key: 'post',
      loader: async ({ params }) => {
        const post = Post.show({ id: params.postId });
        const comments = Comment.all({ postId: params.postId });

        return defer({ post, comments });
      },
    },
  ],
};
