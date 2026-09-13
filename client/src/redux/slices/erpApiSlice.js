import { apiSlice } from './apiSlice';

export const erpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => ({
        url: `/api/erp/banners`,
      }),
      providesTags: ['Banner'],
      keepUnusedDataFor: 5,
    }),
    createBanner: builder.mutation({
      query: (data) => ({
        url: `/api/erp/banners`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Banner'],
    }),
    deleteBanner: builder.mutation({
      query: (bannerId) => ({
        url: `/api/erp/banners/${bannerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
    adjustInventory: builder.mutation({
      query: (data) => ({
        url: `/api/erp/inventory/adjust`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    exportProducts: builder.mutation({
      query: () => ({
        url: `/api/erp/products/export`,
        method: 'GET',
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useAdjustInventoryMutation,
  useExportProductsMutation,
} = erpApiSlice;
