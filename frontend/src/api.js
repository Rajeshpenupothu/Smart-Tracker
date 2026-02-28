// Central API URL config
// Reads from VITE_API_URL env variable when deployed, falls back to localhost for local dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default API_URL;
