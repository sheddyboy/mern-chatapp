import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { setUser } from "features/Auth/authSlice";
import { ChatProps, UserProps } from "models";
import socket from "socket";

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
      onCacheEntryAdded(arg, { dispatch }) {
        socket.on("new_chat_sent", (chat: ChatProps, user: UserProps) => {
          dispatch(
            chatApi.util.updateQueryData(
              "fetchUserChats",
              undefined,
              (cachedChats) => {
                cachedChats.push(chat);
              }
            )
          );
          dispatch(setUser(user));
        });
      },
    }),
    singleChat: builder.mutation<ChatProps, { receiverId: string }>({
      query: (body) => ({ url: "/api/chat", method: "POST", body }),
      // invalidatesTags: ["Chat"],
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
