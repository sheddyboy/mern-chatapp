import { AuthResProps, UserProps } from "models";

const storeUserDetailsInLS = (authDetails: AuthResProps) => {
  localStorage.setItem("User", JSON.stringify(authDetails));
};

const removeUserDetailsInLS = () => {
  localStorage.removeItem("User");
};

const getAuthDetailsInLS = () => {
  const auth = localStorage.getItem("User");
  let user = null;
  let token = null;

  if (auth) {
    user = JSON.parse(auth).user as UserProps;
    token = JSON.parse(auth).token as string;
  }

  return { user, token };
};

export { storeUserDetailsInLS, removeUserDetailsInLS, getAuthDetailsInLS };
