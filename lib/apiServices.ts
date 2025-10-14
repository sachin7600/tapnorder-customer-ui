import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';


const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions
) => {
  const result = await fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  })(args, api, extraOptions);

  // Example of handling specific error codes
  if (result.error && result.error.status === 401) {
    // Logic to handle 401 errors (e.g., refresh token)
  }

  return result;
};

export const apiService = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'apiService'
});

export default apiService;
