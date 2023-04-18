import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { useLogInMutation, useRegisterMutation } from "features/Auth/authApi";
import { logIn } from "features/Auth/authSlice";
import React, { useEffect, useState } from "react";
import TabPanel from "../components/TabPanel";
import { AuthErrorProps } from "models";

const ApproveUser = () => {
  const dispatch = useAppDispatch();
  const [toggleTab, setToggleTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState<AuthErrorProps | null>(null);
  const [toggleError, setToggleError] = useState(false);
  const [registerUser, { isLoading: signUpLoading }] = useRegisterMutation();
  const [logInUser, { isLoading: logInLoading }] = useLogInMutation();
  const [registerFormData, setRegisterFormData] = useState(new FormData());
  const [loginFormData, setLoginFormData] = useState(new FormData());

  useEffect(() => {
    if (error && error.status === 400) {
      setToggleError(true);
      setErrorMessage(error.data.message);
      return;
    }
    if (error && error.status === 401) {
      setToggleError(true);
      setErrorMessage(error.data.message);
      return;
    }
    if (error) {
      setToggleError(true);
      setErrorMessage("Something went wrong");
    }
  }, [error]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setToggleTab(newValue);
  };

  const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logInUser(loginFormData)
      .unwrap()
      .then((data) => dispatch(logIn(data)))
      .catch((err) => setError(err));
  };
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser(registerFormData)
      .unwrap()
      .then((data) => dispatch(logIn(data)))
      .catch((err) => setError(err));
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
                      type="submit"
                      disabled={logInLoading}
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
                      variant="outlined"
                      type="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "register")
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      type="submit"
                      disabled={logInLoading}
                      sx={{ position: "relative" }}
                    >
                      {signUpLoading ? "SIGNING UP..." : "SIGN UP"}
                      {signUpLoading && (
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
          </CardContent>
        </Card>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={toggleError}
        autoHideDuration={3000}
        onClose={() => setToggleError((prev) => !prev)}
      >
        <Alert
          onClose={() => setToggleError((prev) => !prev)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApproveUser;
