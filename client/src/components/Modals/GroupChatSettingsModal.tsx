import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef, useState } from "react";
import SearchUserItem from "components/SearchUserItem";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { toggleGroupChatSettingsModal } from "features/Modal/modalSlice";
import { UserProps } from "models";
import { useLazyFetchUsersQuery } from "features/Auth/authApi";
import { useUpdateGroupChatMutation } from "features/Chat/chatApi";
import debounce from "lodash.debounce";

const GroupChatSettingsModal = () => {
  const [{ groupChatSettingsModal }, { selectedChat }] = useAppSelector(
    (state) => [state.modalSlice, state.chatSlice]
  );
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState(selectedChat?.chatName);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat?.users);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<UserProps[] | null>(null);
  const [fetchUsers] = useLazyFetchUsersQuery();
  const [updateGroupChat, { isLoading }] = useUpdateGroupChatMutation();
  useEffect(() => {
    if (!selectedChat) return;
    setGroupName(selectedChat.chatName);
    setSelectedUsers(selectedChat.users);
  }, [selectedChat]);

  const handleClick = (user: UserProps) => {
    if (!selectedUsers || selectedUsers?.some((x) => x._id === user._id))
      return;
    const dummySelectedUsers = [...selectedUsers];
    dummySelectedUsers.push(user);
    setSelectedUsers(dummySelectedUsers);
  };
  const handleDelete = (removedUser: UserProps) => {
    setSelectedUsers((selectedUsers) =>
      selectedUsers?.filter((user) => user._id !== removedUser._id)
    );
  };
  const handleUserSearchDebounce = useRef(
    debounce((userName: string) => {
      if (userName === "") return;
      fetchUsers(userName)
        .unwrap()
        .then((data) => setUsers(data))
        .catch((err) => console.log(err));
    }, 1000)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupName || !selectedChat || !selectedUsers) return;
    const selectedUsersIds = selectedUsers.map((user) => user._id);
    updateGroupChat({
      chatName: groupName,
      groupId: selectedChat._id,
      usersIds: selectedUsersIds,
    })
      .then(() => dispatch(toggleGroupChatSettingsModal()))
      .catch((err) => console.log(err));
  };
  return (
    <Modal
      open={groupChatSettingsModal}
      onClose={() => dispatch(toggleGroupChatSettingsModal())}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card>
        <CardHeader
          action={
            <IconButton
              onClick={() => dispatch(toggleGroupChatSettingsModal())}
            >
              <CloseIcon />
            </IconButton>
          }
          title="Update Group Chat"
        />
        <CardContent component="form" onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            fullWidth
            size="small"
            label="Group Name"
            sx={{ marginBottom: 1 }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            variant="standard"
            fullWidth
            size="small"
            label="Users"
            sx={{ marginBottom: 1 }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              handleUserSearchDebounce.current(e.target.value);
            }}
          />
          <Box maxWidth="350px" overflow="scroll" marginBottom={1} py={1}>
            <Stack direction="row" spacing={1}>
              {selectedUsers?.map((user) => (
                <Chip
                  avatar={<Avatar />}
                  label={user.name}
                  variant="outlined"
                  onDelete={() => {
                    handleDelete(user);
                  }}
                  color="primary"
                  key={user._id}
                />
              ))}
            </Stack>
          </Box>
          {userName && (
            <Box maxHeight="300px" overflow="scroll">
              <Stack spacing={1}>
                {users?.map((user) => (
                  <SearchUserItem
                    onClick={() => {
                      handleClick(user);
                    }}
                    user={user}
                    key={user._id}
                  />
                ))}
              </Stack>
            </Box>
          )}
          <Button
            type="submit"
            variant="outlined"
            disabled={isLoading}
            sx={{ marginTop: 1, position: "relative" }}
          >
            {isLoading ? "Updating" : "Update Chat"}
            {isLoading && (
              <CircularProgress sx={{ position: "absolute" }} size={20} />
            )}
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default GroupChatSettingsModal;
