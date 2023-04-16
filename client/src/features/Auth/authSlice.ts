import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storeUserDetailsInLS, removeUserDetailsInLS } from "helpers";
import { AuthResProps, UserProps } from "models";

interface initialStateProps {
  user: UserProps | null;
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: initialStateProps = {
  user: null,
  token: null,
  isLoggedIn: false,
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
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice;
