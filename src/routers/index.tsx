import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import AuthenticateRouter from "@/pages/authenticate/router";
import { v4 as uuidv4 } from "uuid";
import LoginPage from "@/pages/authenticate/login";

const routes = [
  {
    path: "/",
    element: <LoginPage />,
    private: true,
  },
  ...AuthenticateRouter,
];

export default function RouteList() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={uuidv4()} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
