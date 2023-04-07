import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import "./App.css";
import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<LogIn />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
