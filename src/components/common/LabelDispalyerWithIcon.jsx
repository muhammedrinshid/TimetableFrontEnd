import { IconButton } from "@mui/material";
import React from "react";
import CopyAllIcon from "@mui/icons-material/CopyAll";
const LabelDispalyerWithIcon = ({label,data}) => {

    const handleCopy = (contentToCopy) => {
        navigator.clipboard.writeText(contentToCopy);
      };
  return (
    <div className="w-[90%] px-3 py-2 rounded-lg  bg-slate-200 ml-1 flex flex-row mt-8 justify-between">
      <div className="max-w-[75%]">
        <p className="text-xs font-light text-slate-500">{label}</p>
        <h6 className="text-sm font-medium text-ellipsis  truncate">{data}</h6>
      </div>
      <div className="">
        <IconButton onClick={()=>handleCopy(data)}>
          <CopyAllIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default LabelDispalyerWithIcon;
