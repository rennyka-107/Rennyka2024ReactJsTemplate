type Props = {
  title: string;
  uiType?: "secondary" | "white";
  uiSize?: "medium" | "large";
  [key: string]: any
};

const BaseButton = (props: Props) => {
  if (props.uiType === "secondary") {
    return (
      <button className={`hover:bg-denim-500 hover:text-white bg-white border-[1px] border-denim-500 ${props.uiSize ? props.uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-denim-500 font-medium text-[14px]`}>
        {props.title}
      </button>
    );
  }
  if (props.uiType === "white") {
    return (
      <button className={`hover:shadow-white-sm bg-white border-[1px] border-iron-200 hover:sha ${props.uiSize ? props.uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-masala-800 font-medium text-[14px]`}>
        {props.title}
      </button>
    );
  }
  return (
    <button className={`hover:bg-denim-950 bg-denim-600 ${props.uiSize ? props.uiSize === "medium" ? "px-[18px] py-[10px]" : "px-5 py-3" : "px-4 py-2" } rounded-radius-6 text-white font-medium text-[14px]`}>
      {props.title}
    </button>
  );
};

export default BaseButton;
