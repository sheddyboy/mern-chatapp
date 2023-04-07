import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <Box sx={{ height: "100vh", display: "grid" }}>
      <Outlet />
    </Box>
  );
};

export default Root;
