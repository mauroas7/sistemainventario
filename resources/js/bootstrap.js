import axios from 'axios';
window.axios = axios;

// API base for front-end requests (serves /api/* endpoints)
window.axios.defaults.baseURL = '/api';
window.axios.defaults.withCredentials = true; // useful if using Sanctum
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
