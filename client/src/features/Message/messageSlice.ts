import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageProps } from "models";

interface InitialStateProps {
  notifications: MessageProps[];
}

const initialState: InitialStateProps = {
  notifications: [],
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    setNotification: (
      state,
      action: PayloadAction<MessageProps | MessageProps[], string>
    ) => {
      if (Array.isArray(action.payload)) {
        state.notifications = action.payload;
      } else {
        state.notifications.push(action.payload);
      }
    },
  },
});

export const { setNotification } = messageSlice.actions;

export default messageSlice;
