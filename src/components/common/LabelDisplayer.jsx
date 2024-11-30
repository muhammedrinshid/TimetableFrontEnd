import { Avatar } from '@mui/material';
import React from 'react';
import { useAuth } from "../../context/Authcontext";

const LabelDisplayer = ({
  label,
  data,
  bgColor,
  size = "medium",
  avatarProfile = null,
}) => {
  const getBgColor = () => bgColor || "bg-slate-200";

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "min-h-10";
      case "medium":
        return "min-h-12";
      case "large":
      default:
        return "min-h-16";
    }
  };

  const getFontSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-xs";
      case "medium":
        return "text-sm";
      case "large":
      default:
        return "text-base";
    }
  };
  const { apiDomain } = useAuth();

  return (
    <div className={`w-[90%] rounded-lg ${getBgColor()} ${getSizeClasses()} p-2 pl-4 mt-4`}>
      <div className="flex flex-col h-full">
        <span className={`text-slate-500 ${getFontSizeClasses()}`}>
          {label}
        </span>
        <div className="flex items-center gap-2 mt-1">
          {avatarProfile && (
            <Avatar 
              className="h-8 w-8"
              src={`${apiDomain}${avatarProfile}`}
              alt={label}
            />
          )}
          <span className={`font-medium ${getFontSizeClasses()}`}>
            {data}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LabelDisplayer;