import styled from "@emotion/styled";
import { Badge } from "@mui/material";

interface StyledBadgeProps {
  online: boolean;
}
const StyledBadge = styled(Badge)<StyledBadgeProps>(({ online }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: online ? "#44b700" : "#ff0000",
    color: online ? "#44b700" : "#ff0000",
    boxShadow: `0 0 0 2px`,
    "&::after": {
      position: "absolute",
      top: -1,
      left: -1,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default StyledBadge;
