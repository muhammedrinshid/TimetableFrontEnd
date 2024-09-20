import React from "react";
import { Typography, Box } from "@mui/material";

const StatsPairDisplayer = ({
  title,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  bgColor = "bg-slate-200",
  size = "medium",
  leftColor = "text-green-600",
  rightColor = "text-blue-600",
  text,
  icon,
  specialComponents,

}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return " pt-1 text-xs";
      case "medium":
        return "pt-2 text-sm";
      case "large":
      default:
        return " pt-2 text-base";
    }
  };



  return (
    <div
      className={`mt-4 w-full  rounded-lg flex flex-col ${bgColor} ${getSizeClasses()} overflow-hidden pt-3`}
    >
      {title && (
        <h3 className="text-xs mb-2 font-light text-slate-500 text-center">
          {title}
        </h3>
      )}
      {specialComponents}
      <div className="flex justify-between items-center h-full mb-2">
        <div className="flex flex-col items-center flex-1">
          <p className="font-medium text-ellipsis  truncate">{leftLabel}</p>
          <div className="flex mt-2">
            <span className={`${leftColor} font-bold`}>{leftValue}</span>
          </div>
        </div>
        <div className="w-px bg-slate-300 h-3/4" />
        <div className="flex flex-col items-center flex-1">
          <p className=" font-medium text-ellipsis  truncate">{rightLabel}</p>
          <div className="flex mt-2">
            <span className={`${rightColor} font-bold`}>{rightValue}</span>
          </div>
        </div>
      </div>

      {text && (
        <div className=" flex justify-center items-center w-full gap-3 bg-slate-300 py-1  ">
          {icon}

          <p className="font-normal text-slate-500">{text}</p>
        </div>
      )}
    </div>
  );
};

export default StatsPairDisplayer;
