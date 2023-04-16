import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";
import { AuthResProps, UserProps } from "models";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authSlice.token;
      token && headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<AuthResProps, FormData>({
      query: (body) => ({
        url: "/api/user/register",
        body,
        method: "POST",
      }),
    }),
    logIn: builder.mutation<AuthResProps, FormData>({
      query: (body) => ({
        url: "/api/user/login",
        body,
        method: "POST",
      }),
    }),
    verify: builder.mutation<AuthResProps, { token: string }>({
      query: (body) => ({
        url: "/api/user/verify",
        body,
        method: "POST",
      }),
    }),
    fetchUsers: builder.query<UserProps[], string>({
      query: (user) => `/api/user?search=${user}`,
    }),
  }),
});

export const {
  useLogInMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLazyFetchUsersQuery,
  useFetchUsersQuery,
} = authApi;

export default authApi;
