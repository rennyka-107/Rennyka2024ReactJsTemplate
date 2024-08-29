import IconAcount from "@/components/Icon/acount";
import IconArrow from "@/components/Icon/arrow";
import IconHome from "@/components/Icon/home";
import IconNote from "@/components/Icon/note";
import IconReport from "@/components/Icon/report";
import IconSetting from "@/components/Icon/setting";
import { useUserStore } from "@/pages/authenticate/state";
import { JSX, MouseEventHandler, useEffect, useState } from "react";

interface INavbar {
  route: string;
  label: string;
  icon?: JSX.Element;
  childrens?: INavbar[];
}

const ListNavbar: INavbar[] = [
  { route: "/", label: "Trang chủ", icon: <IconHome /> },
  {
    route: "/users",
    label: "Người dùng",
    icon: <IconAcount />,
    childrens: [{ route: "/users/list", label: "Danh sách người dùng" }],
  },
  {
    route: "/diaries",
    label: "Nhật ký",
    icon: <IconNote />,
    childrens: [
      {
        route: "/work-diaries",
        label: "Nhật ký công việc",
        childrens: [
          {
            route: "/work-diaries/list",
            label: "Danh sách công việc",
            childrens: [
              { route: "/work1", label: "CV1" },
              { route: "/work2", label: "CV2" },
            ],
          },
          { route: "/work-diaries/create", label: "Tạo mới công việc" },
        ],
      },
      {
        route: "/produre-diaries",
        label: "Nhật ký sản xuất",
        childrens: [
          { route: "/produre-diaries/list", label: "Danh sách sản xuất" },
          { route: "/produre-diaries/create", label: "Tạo mới sản xuất" },
        ],
      },
    ],
  },
  { route: "/reports", label: "Báo cáo", icon: <IconReport /> },
  { route: "/settings", label: "Cài đặt", icon: <IconSetting /> },
];

const MasterHeader = () => {
  const { user, getUserInformation } = useUserStore();
  const [chooseNav, setChooseNav] = useState<string>("");
  const [numShowChild, setNumShowChild] = useState(0);

  const selectNav = (route: string) => () => setChooseNav(route);

  useEffect(() => {
    if (!user) {
      getUserInformation();
    }
  }, [user]);

  const calculateWidthRenderAnimation = () => {
    console.log(123)
    let num = 0;
    const list_child_nested = Array.from(
      document.getElementsByClassName("child-nested-nav")
    );
    list_child_nested.forEach((node: HTMLElement) => {
      if (getComputedStyle(node).display === "flex") {
        num += 1;
      }
    });
    setNumShowChild(num * 264);
  };

  const renderChildNav = (itemNav: INavbar) => {
    return (
      <div
        onMouseOver={() => calculateWidthRenderAnimation()}
        onMouseOut={() => calculateWidthRenderAnimation()}
        className="nested-nav border-l-2 border-purple-500 p-2 hover:bg-purple-100 rounded-[0_4px_4px_0]"
        key={itemNav.label + "-" + itemNav.route}
      >
        {itemNav.label}
        {itemNav.childrens && itemNav.childrens.length > 0 && (
          <div className="child-nested-nav left-[100%] top-0 gap-2 w-[240px] absolute">
            {itemNav.childrens.map((snc) => renderChildNav(snc))}
          </div>
        )}
      </div>
    );
  };

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
              onClick={selectNav(it.route)}
              key={it.label + "-" + it.route}
              className={`parent-nav flex items-center gap-2 py-2 px-4 ${
                chooseNav === it.route ? "bg-purple-100 rounded-[50px]" : ""
              } hover:bg-purple-100 hover:rounded-[50px] relative`}
            >
              {it.icon} {it.label}
              {it.childrens && it.childrens.length > 0 && (
                <div
                  className={`w-[${10 + numShowChild}rem] ${
                    chooseNav === it.route ? "block" : ""
                  } gap-2 child-nav top-[3rem] bg-white px-6 py-4 left-0 rounded-lg border border-purple-100 absolute shadow-[0px_4px_4px_0px_#f5ecfb]`}
                >
                  <div className="relative">
                    <div className="flex flex-col gap-2 w-[240px]">
                      {it.childrens.map((sn) => renderChildNav(sn))}
                    </div>
                  </div>
                </div>
              )}
              {it.childrens && it.childrens.length > 0 && <IconArrow />}
            </div>
          ))}
        </div>
      </div>
      <div>{user?.name}</div>
    </div>
  );
};

export default MasterHeader;
