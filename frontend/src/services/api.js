import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws').replace('/api', '/ws');

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const tweetService = {
  getTrending: () => api.get('/trending'),
  getTweets: (hashtag) => api.get(`/tweets?hashtag=${encodeURIComponent(hashtag)}`),
  getSentiment: (hashtag) => api.get(`/sentiment?hashtag=${encodeURIComponent(hashtag)}`),
  getViral: () => api.get('/viral'),
  getInsights: (hashtag) => api.get(`/insights?hashtag=${encodeURIComponent(hashtag)}`),
  updateSearch: (query) => api.post('/search', { query }),
};

export default api;
