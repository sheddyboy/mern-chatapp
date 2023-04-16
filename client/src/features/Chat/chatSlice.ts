import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatProps } from "models";

interface InitialStateProps {
  selectedChat: ChatProps | null;
}

const initialState: InitialStateProps = {
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<ChatProps, string>) => {
      state.selectedChat = action.payload;
    },
    removeSelectedChat: (state) => {
      state.selectedChat = null;
    },
  },
});

export const { setSelectedChat, removeSelectedChat } = chatSlice.actions;

export default chatSlice;
