import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:5000',
  credentials: 'include',
});

// Wrapper to intercept 401 Unauthorized responses
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Product', 'Order', 'Cart', 'Wishlist'],
  endpoints: (builder) => ({}),
});
