import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authApi from "features/Auth/authApi";
import authSlice from "features/Auth/authSlice";
import chatApi from "features/Chat/chatApi";
import chatSlice from "features/Chat/chatSlice";
import dashboardSlice from "features/Modal/modalSlice";
import messageApi from "features/Message/messageApi";
import messageSlice from "features/Message/messageSlice";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [dashboardSlice.name]: dashboardSlice.reducer,
    [messageSlice.name]: messageSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      chatApi.middleware,
      messageApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
