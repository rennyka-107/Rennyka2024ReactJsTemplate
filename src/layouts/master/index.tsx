import { PropsWithChildren } from "react";
import MasterFooter from "./footer";
import MasterHeader from "./header";
import "./style.scss";

const MasterLayout = (props: PropsWithChildren) => {
  return (
    <div className="master-layout">
      <MasterHeader />
      <div className="px-8 py-6 bg-purple-50">{props.children}</div>
      <MasterFooter />
    </div>
  );
};

export default MasterLayout;
