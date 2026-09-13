import { apiSlice } from './apiSlice';

export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `/api/customer/stats`,
      }),
      providesTags: ['CustomerStats'],
    }),
    getProfile: builder.query({
      query: () => ({
        url: `/api/customer/profile`,
      }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/api/customer/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    getAddresses: builder.query({
      query: () => ({
        url: `/api/customer/addresses`,
      }),
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: `/api/customer/addresses`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/customer/addresses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/api/customer/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: `/api/customer/notifications`,
      }),
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/api/customer/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/api/customer/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    getSupportTickets: builder.query({
      query: () => ({
        url: `/api/customer/support`,
      }),
      providesTags: ['Support'],
    }),
    createSupportTicket: builder.mutation({
      query: (data) => ({
        url: `/api/customer/support`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
} = customerApiSlice;
