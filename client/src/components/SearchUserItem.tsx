import {
  Avatar,
  Card,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { UserProps } from "models";
import React, { useState } from "react";
interface SearchUserItemProps {
  user: UserProps;
  onClick: () => void;
  isLoading?: boolean;
}

const SearchUserItem = ({ user, onClick, isLoading }: SearchUserItemProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card
      sx={{
        cursor: loading && isLoading ? "progress" : "pointer",
        ":hover": { backgroundColor: "#1976d2", color: "#fff" },
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => {
        onClick();
        setLoading(true);
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={user?.picture}
            sx={{ objectPosition: "top" }}
            imgProps={{
              sx: {
                objectPosition: "top",
              },
            }}
          />
        }
        title={<Typography variant="inherit">{user.name}</Typography>}
        subheader={
          <Typography color="inherit" variant="subtitle2">
            {user.email}
          </Typography>
        }
      />
      {loading && isLoading && (
        <CircularProgress sx={{ position: "absolute", right: 12 }} size={30} />
      )}
    </Card>
  );
};

export default SearchUserItem;
