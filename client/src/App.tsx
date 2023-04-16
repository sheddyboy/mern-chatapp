import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Root from "layouts/Root";
import Dashboard from "pages/Dashboard";
import ApproveUser from "pages/ApproveUser";
import { useAppSelector } from "app/hooks";
import useVerifyToken from "hooks/useVerifyToken";

function App() {
  const { isLoggedIn } = useAppSelector((state) => state.authSlice);
  useVerifyToken();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <ApproveUser />}
        />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
