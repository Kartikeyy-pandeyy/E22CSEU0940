import axios from 'axios';

const api = axios.create({
  baseURL: '', // Empty baseURL since proxy handles it
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const getUsers = () => api.get('/users');
export const getUserPosts = (userId) => api.get(`/users/${userId}/posts`);
export const getPostComments = (postId) => api.get(`/posts/${postId}/comments`);