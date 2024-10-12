import React, { useState } from "react";

import { FiUserCheck, LuUserX } from "../../../assets/icons";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { Avatar, IconButton, Tooltip } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../../../context/Authcontext";

const TeacherListDashboard = ({
  teacher,
  toggleFullDayLeaveorPresent,
  fullDayPresent,
  toggleDrawer,
  index,
  sessions
}) => {
  const { apiDomain } = useAuth();
   const teachingPeriods = sessions.filter(
     (session) => session.subject !== null
   ).length;
   const planningPeriods = sessions.filter(
     (session) => session.subject === null
   ).length;
  return (
    <div className=" bg-light-secondary bg-opacity-20 rounded-lg p-2 shadow-custom-10 ">
      <div className="flex ">
        <div className="basis-1/3 flex flex-col justify-start gap-2 items-center">
          <Avatar
            src={
              teacher?.profile_image
                ? `${apiDomain}/${teacher?.profile_image}`
                : undefined
            }
            sx={{
              width: 55,
              height: 55,
              boxShadow: 1,
              border: "2px solid #fff",
            }}
          />
          <p className="text-vs font-bold text-text_2">{teacher.teacher_id}</p>
          <div>
            {!fullDayPresent ? (
              <Tooltip title="Mark as present">
                <IconButton
                  size="small"
                  onClick={() => {
                    toggleFullDayLeaveorPresent(teacher.teacher_id, "present");
                    toggleDrawer("noToggle");
                  }}
                  className="text-sm text-green-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-lightRed"
                >
                  <CheckIcon fontSize="small" sx={{ color: "green" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Mark as full day leave">
                <IconButton
                  size="small"
                  onClick={() =>
                    toggleFullDayLeaveorPresent(teacher.teacher_id, "leave")
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
        <div className=" flex flex-col pl-3 capitalize texlg py-4">
          <h3 className="font-medium text-base">{teacher.name} </h3>
          <h4 className="font-normal text-xs">{teacher.surname}</h4>

          {/* subject hast tags */}
          <div className="flex flex-row gap-1 mt-1 flex-wrap border-t border-white pt-2">
            {teacher?.qualified_subjects.map((sub) => (
              <p className="text-[10px] p-[2px] px-2 text-nowrap font-semibold  bg-pale_orange bg-opacity-60 text-white first:bg-purple-500 last:bg-blue-500  font-sans rounded-lg">
                {sub.name}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row pt-2 justify-evenly pr-2">
        <div className="flex flex-col justify- items-center">
          <h3 className="text-sm font-semibold text-red-500 font-sans">
            {teachingPeriods}
          </h3>
          <p className="text-vs font-sans text-red-300">Teaching</p>
        </div>

        <div className="flex flex-col justify- items-center">
          <h3 className="text-sm font-semibold text-blue-500 font-sans">
            {planningPeriods}
          </h3>
          <p className="text-vs font-sans text-blue-300">Planning</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherListDashboard;
