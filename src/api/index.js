import { request } from '../lib';

export { default as Comment } from './Comment';
export { default as Post } from './Post';
export { default as User } from './User';

export const userLogin = ({ email, password }) => request('post', '/api/auth/login', { email, password });
