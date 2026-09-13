import { apiSlice } from './apiSlice';

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, sort }) => ({
        url: `/api/reviews/product/${productId}?sort=${sort || 'latest'}`,
      }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `/api/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/reviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    markHelpful: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: ['Review'],
    }),
    getMyReviews: builder.query({
      query: () => ({
        url: `/api/reviews/my`,
      }),
      providesTags: ['Review'],
    }),
    getAdminReviews: builder.query({
      query: (status = '') => ({
        url: `/api/admin/reviews?status=${status}`,
      }),
      providesTags: ['Review'],
    }),
    updateReviewStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/reviews/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkHelpfulMutation,
  useGetMyReviewsQuery,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
} = reviewsApiSlice;
