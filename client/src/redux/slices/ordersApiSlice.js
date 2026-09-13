import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `/api/orders`,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `/api/orders/myorders`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),
    createRazorpayOrder: builder.mutation({
      query: (amount) => ({
        url: `/api/orders/razorpay`,
        method: 'POST',
        body: { amount },
      }),
    }),
    getOrders: builder.query({
      query: (params) => ({
        url: `/api/orders`,
        params,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, comment }) => ({
        url: `/api/orders/${orderId}/status`,
        method: 'PUT',
        body: { status, comment },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useCreateRazorpayOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice;
