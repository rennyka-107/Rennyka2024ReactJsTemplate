import IconAcount from "@/components/Icon/acount";
import IconHome from "@/components/Icon/home";
import IconNote from "@/components/Icon/note";
import IconReport from "@/components/Icon/report";
import IconSetting from "@/components/Icon/setting";
import { useUserStore } from "@/pages/authenticate/state";
import { JSX, useEffect } from "react";

interface INavbar {
  route: string;
  label: string;
  icon?: JSX.Element;
  childrens?: INavbar[];
}

const ListNavbar: INavbar[] = [
  { route: "/", label: "Trang chủ", icon: <IconHome /> },
  { route: "/users", label: "Người dùng", icon: <IconAcount /> },
  {
    route: "/diaries",
    label: "Nhật ký",
    icon: <IconNote />,
    childrens: [
      {
        route: "/work-diaries",
        label: "Nhật ký công việc",
        childrens: [
          { route: "/work-diaries/list", label: "Danh sách công việc" },
        ],
      },
      { route: "/produre-diaries", label: "Nhật ký sản xuất" },
    ],
  },
  { route: "/reports", label: "Báo cáo", icon: <IconReport /> },
  { route: "/settings", label: "Cài đặt", icon: <IconSetting /> },
];

const MasterHeader = () => {
  const { user, getUserInformation } = useUserStore();

  useEffect(() => {
    if (!user) {
      getUserInformation();
    }
  }, [user]);

  return (
    <div className="h-[80px] border-b-[1px] border-purple-500 px-8 py-6 flex items-center justify-between">
      <div className="flex gap-16 items-center">
        <div className="flex gap-1 items-center text-[24px]">
          <img
            alt="logo tachyon"
            className="h-[60px]"
            src="/assets/tachyon-purple.png"
          />
          <span className="text-[#333333] font-semibold">Tachyon</span>
          <span className="text-purple-500 font-semibold">107</span>
        </div>
        <div className="flex items-center text-size-medium text-[#000000] gap-8">
          {ListNavbar.map((it) => (
            <div
              key={it.label + "-" + it.route}
              className="parent-nav flex items-center gap-2 py-2 px-4 hover:bg-purple-100 hover:rounded-[50px] relative"
            >
              {it.icon} {it.label}
              {it.childrens && it.childrens.length > 0 && (
                <div className="gap-2 child-nav bottom-[-8rem] bg-white px-6 py-4 w-[360px] left-0 rounded-lg border border-purple-100 absolute shadow-[0px_4px_4px_0px_#f5ecfb]">
                  {it.childrens.map((sn) => (
                    <div className="border-l-2 border-purple-500 p-2 bg-purple-100 rounded-[0_4px_4px_0]" key={sn.label + "-" + sn.route}>{sn.label}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>{user?.name}</div>
    </div>
  );
};

export default MasterHeader;
