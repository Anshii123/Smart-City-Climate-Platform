// Base API URL configuration
// When deployed on Vercel as a unified fullstack app or in local development with Vite proxy,
// API_BASE_URL is empty string and relative URLs (/api/...) are used seamlessly.
// If the frontend is deployed separately from the backend, set VITE_API_BASE_URL in Vercel environment variables.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default getApiUrl;
