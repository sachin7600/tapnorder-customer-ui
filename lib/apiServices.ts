'use client'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const setAuthToken = (token: string | null) => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('authToken', token);
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
    }
    return headers;
  },
});

export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery,
  endpoints: () => ({}),
});

export default apiService;
