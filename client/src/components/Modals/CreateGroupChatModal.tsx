import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  TextField,
  Box,
  Stack,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { toggleCreateGroupChatModal } from "features/Modal/modalSlice";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import SearchUserItem from "components/SearchUserItem";
import { useFetchUsersQuery } from "features/Auth/authApi";
import { UserProps } from "models";
import { useCreateGroupChatMutation } from "features/Chat/chatApi";
import { Close } from "@mui/icons-material";

const CreateGroupChatModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [createGroupChat, { isLoading }] = useCreateGroupChatMutation();
  const [groupName, setGroupName] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserProps[]>([]);
  const { data: users } = useFetchUsersQuery(userName);
  const { createGroupChatModal } = useAppSelector((state) => state.modalSlice);
  const dispatch = useAppDispatch();
  const handleClick = (user: UserProps) => {
    if (selectedUsers.includes(user)) return;
    setSelectedUsers((prev) => [...prev, user]);
  };
  const handleDelete = (delUser: UserProps) => {
    const filteredSelectedUsers = selectedUsers.filter(
      (user) => user !== delUser
    );
    setSelectedUsers(filteredSelectedUsers);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUsers.length < 2) return setOpen(true);
    const selectedUsersId = selectedUsers.map((user) => user._id);
    createGroupChat({ chatName: groupName, usersIds: selectedUsersId })
      .unwrap()
      .then(() => {
        setGroupName("");
        setUserName("");
        setSelectedUsers([]);
        dispatch(toggleCreateGroupChatModal());
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Modal
        open={createGroupChatModal}
        onClose={() => dispatch(toggleCreateGroupChatModal())}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Card>
          <CardHeader
            action={
              <IconButton
                onClick={() => dispatch(toggleCreateGroupChatModal())}
              >
                <CloseIcon />
              </IconButton>
            }
            title="Create Group Chat"
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
              onChange={(e) => setUserName(e.target.value)}
            />
            <Box maxWidth="350px" overflow="scroll" marginBottom={1} py={1}>
              <Stack direction="row" spacing={1}>
                {selectedUsers.map((user) => (
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
              {isLoading ? "Creating" : "Create Chat"}
              {isLoading && (
                <CircularProgress sx={{ position: "absolute" }} size={20} />
              )}
            </Button>
          </CardContent>
        </Card>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={open}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Add min of 2 users
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateGroupChatModal;
