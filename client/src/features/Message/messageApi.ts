import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { MessageProps } from "models";
import socket from "socket";
import { setNotification } from "./messageSlice";

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
      onCacheEntryAdded({ chatId }, { cacheDataLoaded, getState, dispatch }) {
        cacheDataLoaded
          .then(() => {
            const subscriptions = getState().messageApi.subscriptions;
            const subscriptionsLength = Object.keys(subscriptions).length;
            if (subscriptionsLength !== 1) return;
            socket.on("receive_message", (message: MessageProps) => {
              const { selectedChat } = (getState() as RootState).chatSlice;
              dispatch(
                messageApi.util.updateQueryData(
                  "getChatMessages",
                  { chatId: message.chat._id },
                  (messagesCache) => {
                    messagesCache.push(message);
                  }
                )
              );
              if (message.chat._id !== selectedChat?._id) {
                console.log("send notification");
                dispatch(setNotification(message));
              }
            });
          })
          .catch((err) => console.log(err));
      },
      providesTags: (result, err, { chatId }) => [
        { type: "Messages", id: chatId },
      ],
    }),
    sendMessage: builder.mutation<
      MessageProps,
      { chatId: string; message: string }
    >({
      query: (body) => ({
        method: "POST",
        body,
        url: "/api/message",
      }),
      onQueryStarted({ chatId }, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then(({ data: message }) => {
            socket.emit("send_message", message);

            dispatch(
              messageApi.util.updateQueryData(
                "getChatMessages",
                { chatId },
                (cachedMessages) => {
                  cachedMessages.push(message);
                }
              )
            );
          })
          .catch((err) => {
            console.log(err);
          });
      },
    }),
  }),
});

export const {
  useLazyGetChatMessagesQuery,
  useSendMessageMutation,
  useGetChatMessagesQuery,
} = messageApi;

export default messageApi;
