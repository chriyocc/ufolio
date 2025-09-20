// config.js
//this is unnecessary if using react in the future, use .env.production/.enc.devolepment instead
export const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api/v1/'
  : 'https://api.yoyojun.site/api/v1/';
