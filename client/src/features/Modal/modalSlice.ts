import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
  drawerModal: boolean;
  profileModal: boolean;
  createGroupChatModal: boolean;
  groupChatSettingsModal: boolean;
  isUserModal: boolean;
}

const initialState: initialStateProps = {
  drawerModal: false,
  createGroupChatModal: false,
  groupChatSettingsModal: false,
  profileModal: false,
  isUserModal: true,
};

const modalSlice = createSlice({
  name: "modalSlice",
  initialState,
  reducers: {
    toggleDrawerModal: (state) => {
      state.drawerModal = !state.drawerModal;
    },
    toggleProfileModal: (state) => {
      state.profileModal = !state.profileModal;
    },
    toggleCreateGroupChatModal: (state) => {
      state.createGroupChatModal = !state.createGroupChatModal;
    },
    toggleGroupChatSettingsModal: (state) => {
      state.groupChatSettingsModal = !state.groupChatSettingsModal;
    },
    setIsUserModal: (state, action: PayloadAction<boolean, string>) => {
      state.isUserModal = action.payload;
    },
  },
});
export const {
  toggleDrawerModal,
  toggleCreateGroupChatModal,
  toggleProfileModal,
  toggleGroupChatSettingsModal,
  setIsUserModal,
} = modalSlice.actions;
export default modalSlice;
