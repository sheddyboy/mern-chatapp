import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storeUserDetailsInLS, removeUserDetailsInLS } from "helpers";
import { AuthResProps, UserProps } from "models";

interface initialStateProps {
  user: UserProps | null;
  token: string | null;
  isLoggedIn: boolean;
  isSocketConnected: boolean;
  selectedUser: UserProps | null;
  onlineUserIds: string[];
}

const initialState: initialStateProps = {
  user: null,
  token: null,
  isLoggedIn: false,
  isSocketConnected: false,
  selectedUser: null,
  onlineUserIds: [],
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<AuthResProps, string>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      storeUserDetailsInLS(action.payload);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      removeUserDetailsInLS();
    },
    setSocketConnection: (state, action: PayloadAction<boolean, string>) => {
      state.isSocketConnected = action.payload;
    },
    setSelectedUser: (
      state,
      action: PayloadAction<UserProps | null, string>
    ) => {
      state.selectedUser = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProps, string>) => {
      state.user = action.payload;
    },
    setOnlineIds: (state, action: PayloadAction<string[] | string, string>) => {
      if (Array.isArray(action.payload)) {
        state.onlineUserIds = action.payload;
      } else {
        if (state.onlineUserIds.includes(action.payload)) return;
        state.onlineUserIds.push(action.payload);
      }
    },
    removeFromOnlineIds: (state, action: PayloadAction<string, string>) => {
      state.onlineUserIds = state.onlineUserIds.filter(
        (userId) => userId !== action.payload
      );
    },
  },
});

export const {
  logIn,
  logOut,
  setSocketConnection,
  setSelectedUser,
  setUser,
  setOnlineIds,
  removeFromOnlineIds,
} = authSlice.actions;

export default authSlice;
