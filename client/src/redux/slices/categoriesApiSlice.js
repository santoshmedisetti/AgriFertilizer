import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: `/api/categories`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `/api/categories`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `/api/categories/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/api/categories/${categoryId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
