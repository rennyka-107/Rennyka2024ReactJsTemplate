import MasterLayout from "@/layouts/master";
import DashboardPage from ".";

const DashboardRouter = [
  {
    path: "/",
    element: (
      <MasterLayout>
        <DashboardPage />
      </MasterLayout>
    ),
    private: true,
  },
];

export default DashboardRouter;
