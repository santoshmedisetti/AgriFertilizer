import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/overview` }),
      keepUnusedDataFor: 5,
    }),
    getRevenueAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/revenue` }),
      keepUnusedDataFor: 5,
    }),
    getOrderAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/orders` }),
      keepUnusedDataFor: 5,
    }),
    getProductAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/products` }),
      keepUnusedDataFor: 5,
    }),
    getInventoryAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/inventory` }),
      keepUnusedDataFor: 5,
    }),
    getCustomerAnalytics: builder.query({
      query: () => ({ url: `/api/admin/analytics/customers` }),
      keepUnusedDataFor: 5,
    }),
    getReports: builder.query({
      query: (type) => ({ url: `/api/admin/analytics/reports?type=${type}` }),
    }),
  }),
});

export const {
  useGetOverviewAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetProductAnalyticsQuery,
  useGetInventoryAnalyticsQuery,
  useGetCustomerAnalyticsQuery,
  useGetReportsQuery,
} = adminApiSlice;
