import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  uiType?: "secondary" | "white";
  uiSize?: "medium" | "large";
  twClassAddition?: string;
  twColor?: string;
};

const BaseButton = ({title, uiSize, uiType, twClassAddition, twColor = "denim", ...buttonProps}: Props) => {
  if (uiType === "secondary") {
    return (
      <button className={`hover:bg-${twColor}-500 hover:text-white bg-white border-[1px] border-${twColor}-500 ${uiSize ? uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-${twColor}-500 font-medium text-[14px] ` + twClassAddition} {...buttonProps}>
        {title}
      </button>
    );
  }
  if (uiType === "white") {
    return (
      <button className={`hover:shadow-white-sm bg-white border-[1px] border-iron-200 hover:sha ${uiSize ? uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-masala-800 font-medium text-[14px] ` + twClassAddition} {...buttonProps}>
        {title}
      </button>
    );
  }
  return (
    <button className={`hover:bg-${twColor}-700 bg-${twColor}-600 ${uiSize ? uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-white font-medium text-[14px] ` + twClassAddition} {...buttonProps}>
      {title}
    </button>
  );
};

export default BaseButton;
