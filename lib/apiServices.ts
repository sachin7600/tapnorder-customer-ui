import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: any) => {
  authToken = token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  },
});

export const apiService = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'apiService',
});

export default apiService;
