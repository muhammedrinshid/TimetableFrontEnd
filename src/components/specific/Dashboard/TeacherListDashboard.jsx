import React, { useState } from "react";

import { FiUserCheck, LuUserX } from "../../../assets/icons";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { IconButton, Tooltip } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

const TeacherListDashboard = ({
  ele,
  toggleFullDayLeaveorPresent,
  fullDayPresent,
  toggleDrawer
}) => {
  return (
    <div className="sticky left-0  bg-white  z-10 p-2 border border-gray-300 border-opacity-15  bg-opacity-70 backdrop-blur-sm">
      <div className="flex bg-light-secondary bg-opacity-20 rounded-lg p-2 shadow-custom-10 ">
        <div className="basis-1/3 flex flex-col justify-start gap-2 items-center">
          <img src={ele.image} alt="" width={50} className="rounded-full" />
          <p className="text-vs font-bold text-text_2">{ele.teacher_id}</p>
          <div>
            {!fullDayPresent ? (
              <Tooltip title="Mark as present">
                <IconButton
                  size="small"
                  onClick={() =>
                   { toggleFullDayLeaveorPresent(ele.teacher_id, "present")
                    toggleDrawer("noToggle")}
                  }
                  className="text-sm text-green-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightRed"
                >
                  <CheckIcon fontSize="small" sx={{color:"green"}} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Mark as full day leave">
                <IconButton
                  size="small"
                  onClick={() =>
                    toggleFullDayLeaveorPresent(ele.teacher_id, "leave")
                  }
                  className="text-sm text-red-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightGreen"
                >
                  <DoDisturbAltIcon
                    fontSize="small"
                    sx={{ color: "#FFB6C1" }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
        <div className=" flex flex-col pl-3">
          <h3 className="font-medium text-sm">{ele.name} </h3>
          <h4 className="font-normal text-xs">{ele.surname}</h4>

          {/* subject hast tags */}
          <div className="flex flex-row gap-1 mt-1 flex-wrap border-t border-white pt-2">
            {ele.qualified_subjects.map((sub) => (
              <p className="text-[8px] p-[2px] px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                {sub}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherListDashboard;
