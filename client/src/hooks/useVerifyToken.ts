import { useAppDispatch } from "app/hooks";
import { useVerifyMutation } from "features/Auth/authApi";
import { logIn } from "features/Auth/authSlice";
import { getAuthDetailsInLS } from "helpers";
import { useEffect } from "react";

const useVerifyToken = () => {
  const dispatch = useAppDispatch();
  const [verifyToken] = useVerifyMutation();

  useEffect(() => {
    const { token } = getAuthDetailsInLS();
    token &&
      verifyToken({ token })
        .unwrap()
        .then((auth) => {
          dispatch(logIn(auth));
        })
        .catch((err) => console.log(err));
  }, [dispatch, verifyToken]);

  return;
};

export default useVerifyToken;
