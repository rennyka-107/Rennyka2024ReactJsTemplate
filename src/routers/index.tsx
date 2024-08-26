import { Route, Routes } from "react-router-dom";
import AuthenticateRouter from "@/pages/authenticate/router";
import { v4 as uuidv4 } from "uuid";
import DashboardRouter from "@/pages/dashboard/router";

const routes = [
  ...AuthenticateRouter,
  ...DashboardRouter
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
