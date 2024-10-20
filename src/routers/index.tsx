import { Route, Routes } from "react-router-dom";
import AuthenticateRouter from "@/pages/authenticate/router";
import { v4 as uuidv4 } from "uuid";
import DashboardRouter from "@/pages/dashboard/router";
import PrivatePage from "@/hocs/PrivatePage";
import ChatRouter from "@/pages/chat/router";

const routes = [...AuthenticateRouter, ...DashboardRouter, ...ChatRouter];

export default function RouteList() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={uuidv4()}
          path={route.path}
          element={
            route.private ? (
              <PrivatePage>{route.element}</PrivatePage>
            ) : (
              route.element
            )
          }
        />
      ))}
    </Routes>
  );
}
