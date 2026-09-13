import { apiSlice } from './apiSlice';

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: `/api/brands`,
      }),
      keepUnusedDataFor: 5,
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: `/api/brands`,
        method: 'POST',
        body: data,
      }),
    }),
    updateBrand: builder.mutation({
      query: (data) => ({
        url: `/api/brands/${data.brandId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (brandId) => ({
        url: `/api/brands/${brandId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApiSlice;
