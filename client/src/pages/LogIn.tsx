import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import TabPanel from "../components/TabPanel";

const LogIn = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(background.jpg)",
        backgroundSize: "cover",
      }}
    >
      <Stack width={{ sm: "50%", lg: "30%" }} spacing={2}>
        <Card>
          <CardContent>
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
              <Tab label="LogIn" />
              <Tab label="SignUp" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <form>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      label="Password"
                      fullWidth
                      required
                      variant="outlined"
                      type="password"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Button fullWidth variant="contained">
                      LOG IN
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <form>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <TextField
                      label="Name"
                      fullWidth
                      variant="outlined"
                      type="text"
                      required
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      label="Password"
                      fullWidth
                      required
                      variant="outlined"
                      type="password"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      label="Confirm Password"
                      fullWidth
                      required
                      variant="outlined"
                      type="password"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      type="file"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Button fullWidth variant="contained">
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default LogIn;
