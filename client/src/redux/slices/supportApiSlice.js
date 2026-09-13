import { apiSlice } from './apiSlice';

export const supportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTickets: builder.query({
      query: () => ({ url: '/api/support' }),
      providesTags: ['Support'],
    }),
    createTicket: builder.mutation({
      query: (data) => ({
        url: '/api/support',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
    replyToTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/support/${id}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
    // Admin Endpoints
    getAllTickets: builder.query({
      query: () => ({ url: '/api/admin/support' }),
      providesTags: ['Support'],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/admin/support/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useGetMyTicketsQuery,
  useCreateTicketMutation,
  useReplyToTicketMutation,
  useGetAllTicketsQuery,
  useUpdateTicketStatusMutation,
} = supportApiSlice;
