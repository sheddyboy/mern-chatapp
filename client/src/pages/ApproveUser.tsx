import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { useLogInMutation, useRegisterMutation } from "features/Auth/authApi";
import { logIn } from "features/Auth/authSlice";
import React, { useState } from "react";
import TabPanel from "../components/TabPanel";

const ApproveUser = () => {
  const dispatch = useAppDispatch();
  const [toggleTab, setToggleTab] = useState(0);
  const [registerUser] = useRegisterMutation();
  const [logInUser, { isLoading: logInLoading }] = useLogInMutation();
  const [registerFormData, setRegisterFormData] = useState(new FormData());
  const [loginFormData, setLoginFormData] = useState(new FormData());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setToggleTab(newValue);
  };

  const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logInUser(loginFormData)
      .unwrap()
      .then((data) => dispatch(logIn(data)))
      .catch((err) => console.log("err", err));
  };
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser(registerFormData)
      .unwrap()
      .then((data) => dispatch(logIn(data)))
      .catch((err) => console.log(err));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "register" | "login"
  ) => {
    const { name, value, files } = e.target;
    type === "register" && name === "image" && files
      ? registerFormData.set(name, files[0], value)
      : registerFormData.set(name, value);

    type === "login" && loginFormData.set(name, value);

    type === "register" && setRegisterFormData(registerFormData);
    type === "login" && setLoginFormData(loginFormData);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(chat-background.jpg)",
        backgroundSize: "cover",
      }}
    >
      <Stack width={{ xs: "90%", sm: "50%", lg: "30%" }} spacing={2}>
        <Card>
          <CardContent>
            <Tabs
              value={toggleTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="LogIn" />
              <Tab label="SignUp" />
            </Tabs>
            <TabPanel value={toggleTab} index={0}>
              <Box component="form" onSubmit={handleLogIn}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                      name="email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "login")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      fullWidth
                      required
                      variant="outlined"
                      type="password"
                      name="password"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "login")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={logInLoading}
                      type="submit"
                      sx={{ position: "relative" }}
                    >
                      {logInLoading ? "LOGGING IN..." : "LOG IN"}
                      {logInLoading && (
                        <CircularProgress
                          sx={{ position: "absolute" }}
                          size={20}
                        />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value={toggleTab} index={1}>
              <Box
                component="form"
                onSubmit={handleRegister}
                encType="multipart/form-data"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      variant="outlined"
                      type="text"
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "register")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                      name="email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "register")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      fullWidth
                      required
                      variant="outlined"
                      type="password"
                      name="password"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "register")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="image"
                      required
                      variant="outlined"
                      type="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "register")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" type="submit">
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ApproveUser;
