import { request } from '../lib';

const Post = {
  getIndex: ({ page = 1 } = {}) => request('get', '/api/posts', { page }),
  store: ({ title, content }) => request('post', '/api/posts', { title, content }),
  show: ({ id }) => request('get', `/api/posts/${id}`),
  update: ({ id, content }) => request('put', `/api/posts/${id}`, { content }),
  delete: ({ id }) => request('delete', `/api/posts/${id}`),
};

export default Post;
