import { apiSlice } from './apiSlice';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: `/api/wishlist`,
      }),
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: `/api/wishlist`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
