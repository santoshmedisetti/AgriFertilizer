import { apiSlice } from './apiSlice.js';

const USERS_URL = '/api/auth';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: `/api/users/profile/addresses`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/api/users/profile/addresses/${addressId}`,
        method: 'DELETE',
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `/api/users`,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetUsersQuery,
} = usersApiSlice;
