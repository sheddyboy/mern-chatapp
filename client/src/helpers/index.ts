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

function getRandomColor(id: string): string {
  const hash = id.split("").reduce((acc, val) => {
    acc = (acc << 5) - acc + val.charCodeAt(0);
    return acc & acc;
  }, 0);
  const color = Math.floor(Math.abs(hash % 16777215)).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
}

export {
  storeUserDetailsInLS,
  removeUserDetailsInLS,
  getAuthDetailsInLS,
  getRandomColor,
};
