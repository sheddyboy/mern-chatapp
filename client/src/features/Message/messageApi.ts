import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { MessageProps } from "models";

const messageApi = createApi({
  reducerPath: "messageApi",
  tagTypes: ["Messages"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authSlice.token;
      headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatMessages: builder.query<MessageProps[], { chatId: string }>({
      query: ({ chatId }) => `/api/message/${chatId}`,

      providesTags: (result, err, { chatId }) => [
        { type: "Messages", id: chatId },
      ],
    }),
  }),
});

export const { useLazyGetChatMessagesQuery, useGetChatMessagesQuery } =
  messageApi;

export default messageApi;
