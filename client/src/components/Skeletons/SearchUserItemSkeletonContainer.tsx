import React from "react";
import SearchUserItemSkeleton from "./SearchUserItemSkeleton";

const SearchUserItemSkeletonContainer = () => {
  return (
    <>
      {new Array(30).fill(0).map((value, index) => (
        <SearchUserItemSkeleton key={index} />
      ))}
    </>
  );
};

export default SearchUserItemSkeletonContainer;
