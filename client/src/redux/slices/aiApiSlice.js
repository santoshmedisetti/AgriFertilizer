import { apiSlice } from './apiSlice';

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation({
      query: (data) => ({
        url: `/api/ai/chat`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSendChatMessageMutation } = aiApiSlice;
