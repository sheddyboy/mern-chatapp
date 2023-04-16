import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { ChatProps } from "models";

const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Chat"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authSlice.token;
      token && headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserChats: builder.query<ChatProps[], void>({
      query: () => `/api/chat`,
      providesTags: (chat) =>
        chat
          ? [
              ...chat.map(({ _id }) => ({ type: "Chat" as const, id: _id })),
              "Chat",
            ]
          : ["Chat"],
    }),
    singleChat: builder.mutation<ChatProps, { receiverId: string }>({
      query: (body) => ({ url: "/api/chat", method: "POST", body }),
      invalidatesTags: ["Chat"],
    }),
    createGroupChat: builder.mutation<
      ChatProps,
      { usersIds: string[]; chatName: string }
    >({
      query: (body) => ({ url: "/api/chat/group", method: "POST", body }),
      invalidatesTags: ["Chat"],
    }),
    updateGroupChat: builder.mutation<
      ChatProps,
      { usersIds: string[]; chatName: string; groupId: string }
    >({
      query: (body) => ({ url: `/api/chat/group`, method: "PUT", body }),
      invalidatesTags: (chat, err, { groupId }) => [
        { type: "Chat", id: groupId },
      ],
    }),
  }),
});

export const {
  useFetchUserChatsQuery,
  useSingleChatMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useLazyFetchUserChatsQuery,
} = chatApi;

export default chatApi;
