import IconSetting from "@/components/Icon/setting";
import React from "react";

type Props = {};

const MasterFooter = (props: Props) => {
  return (
    <div className="h-[56px] px-8 py-4 text-sm flex gap-3 border-t-[1px] border-purple-500">
      Version 1.0.0 2024 <span className="text-purple-500">@Tachyon107</span>
      <IconSetting />
      Trợ giúp
    </div>
  );
};

export default MasterFooter;
