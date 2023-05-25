import { request } from '../lib';

const User = {
  store: ({ name, email, password }) => request('post', '/api/users', {
    name,
    email,
    password,
  }),
  show: ({ id, query = {} }) => request('get', `/api/users/${id}`, query),
};

export default User;
