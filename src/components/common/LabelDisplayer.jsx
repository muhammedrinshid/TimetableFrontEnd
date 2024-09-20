import React from "react";

const LabelDisplayer = ({ label, data, bgColor, size = "medium" }) => {
  const getBgColor = () => bgColor || "bg-slate-200";

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-10 py-1";
      case "medium":
        return "h-12 py-1.5";
      case "large":
      default:
        return "h-16 py-2";
    }
  };

  const getFontSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-vs";
      case "medium":
        return "text-xs";
      case "large":
      default:
        return "text-sm";
    }
  };

  const labelClass = `font-light text-slate-500 ${getFontSizeClasses()}`;
  const dataClass = `font-medium ${getFontSizeClasses()}`;

  return (
    <div
      className={`w-[90%] px-3 rounded-lg ml-1 flex flex-col mt-4 ${getBgColor()} ${getSizeClasses()}`}
    >
      <div className="flex flex-col justify-center h-full">
        <p className={labelClass}>{label}</p>
        <h6 className={dataClass}>{data}</h6>
      </div>
    </div>
  );
};

export default LabelDisplayer;
