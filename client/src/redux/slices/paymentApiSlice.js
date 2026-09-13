import { apiSlice } from './apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: '/api/payment/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/api/payment/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    recordCOD: builder.mutation({
      query: (data) => ({
        url: '/api/payment/cod',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    getPaymentHistory: builder.query({
      query: () => ({
        url: '/api/payment/history',
      }),
      providesTags: ['Payment'],
    }),
    getPaymentById: builder.query({
      query: (id) => ({
        url: `/api/payment/${id}`,
      }),
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useRecordCODMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentByIdQuery,
} = paymentApiSlice;
