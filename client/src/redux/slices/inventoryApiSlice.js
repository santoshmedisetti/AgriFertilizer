import { apiSlice } from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryOverview: builder.query({
      query: (params) => ({
        url: `/api/inventory`,
        params,
      }),
      providesTags: ['Inventory'],
      keepUnusedDataFor: 5,
    }),
    getInventoryHistory: builder.query({
      query: () => ({
        url: `/api/inventory/history`,
      }),
      providesTags: ['InventoryHistory'],
      keepUnusedDataFor: 5,
    }),
    stockIn: builder.mutation({
      query: (data) => ({
        url: `/api/inventory/stock-in`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'InventoryHistory', 'Product'],
    }),
    stockOut: builder.mutation({
      query: (data) => ({
        url: `/api/inventory/stock-out`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'InventoryHistory', 'Product'],
    }),
    adjustStock: builder.mutation({
      query: (data) => ({
        url: `/api/inventory/adjust`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'InventoryHistory', 'Product'],
    }),
  }),
});

export const {
  useGetInventoryOverviewQuery,
  useGetInventoryHistoryQuery,
  useStockInMutation,
  useStockOutMutation,
  useAdjustStockMutation,
} = inventoryApiSlice;
