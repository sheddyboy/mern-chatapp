import { Card, CardHeader, Skeleton } from "@mui/material";

const SearchUserItemSkeleton = () => {
  return (
    <Card sx={{ cursor: "progress" }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton height={10} width="40%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton height={10} width="80%" />}
      />
    </Card>
  );
};

export default SearchUserItemSkeleton;
