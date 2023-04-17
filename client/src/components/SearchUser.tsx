import {
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useLazyFetchUsersQuery } from "features/Auth/authApi";
import { useSingleChatMutation } from "features/Chat/chatApi";
import { toggleDrawerModal } from "features/Modal/modalSlice";
import React, { useState } from "react";
import socket from "socket";
import SearchUserItem from "./SearchUserItem";
import SearchUserItemSkeletonContainer from "./Skeletons/SearchUserItemSkeletonContainer";

const SearchUser = () => {
  const { user } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  const [singleChat, { isLoading: singleChatLoading }] =
    useSingleChatMutation();
  const [inputValue, setInputValue] = useState("");
  const [getUsers, { data, isFetching }] = useLazyFetchUsersQuery();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) return setOpen(true);
    getUsers(inputValue);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInputValue(e.target.value);
  };
  const handleClick = (userId: string) => {
    singleChat({ receiverId: userId })
      .unwrap()
      .then((chat) => {
        socket.emit("new_chat", chat, user);
        dispatch(toggleDrawerModal());
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
  return (
    <Container>
      <Stack>
        <Typography fontWeight="300" variant="body1" paddingY={1.5}>
          Search Users
        </Typography>
        <Stack
          component="form"
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          marginBottom={2}
          onSubmit={handleSubmit}
        >
          <TextField size="small" onChange={handleChange} value={inputValue} />
          <Button variant="contained" type="submit">
            Go
          </Button>
        </Stack>

        {inputValue &&
          (isFetching ? (
            <Stack spacing={1}>
              <SearchUserItemSkeletonContainer />
            </Stack>
          ) : (
            <Stack spacing={1}>
              {data?.map((user) => (
                <SearchUserItem
                  user={user}
                  onClick={() => handleClick(user._id)}
                  isLoading={singleChatLoading}
                  key={user._id}
                />
              ))}
            </Stack>
          ))}
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Please enter a user name or email
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SearchUser;
