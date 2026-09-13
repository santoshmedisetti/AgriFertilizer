import { apiSlice } from './apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => ({
        url: `/api/coupons`,
      }),
      providesTags: ['Coupon'],
      keepUnusedDataFor: 5,
    }),
    getCouponById: builder.query({
      query: (id) => ({
        url: `/api/coupons/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `/api/coupons`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/coupons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `/api/coupons/apply`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponsApiSlice;
