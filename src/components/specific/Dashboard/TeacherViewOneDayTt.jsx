import React from "react";
import {
  TeacherViewClassroomCard,
  TeacherListDashboard,
  TeacherViewHeading,
} from "../../common";

import { Avatar, Chip } from "@mui/material";

import { IoTimeOutline } from "../../../assets/icons";
import { formatDuration } from "../../../assets/converts";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { grey } from "@mui/material/colors";
import { useAuth } from "../../../context/Authcontext";

const getGridClassName = (NumberOfPeriodsInAday) => {
  const gridClasses = {
    1: "grid-cols-[minmax(160px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]",
    2: "grid-cols-[minmax(160px,_1.5fr)_repeat(2,_minmax(140px,_1fr))]",
    3: "grid-cols-[minmax(160px,_1.5fr)_repeat(3,_minmax(140px,_1fr))]",
    4: "grid-cols-[minmax(160px,_1.5fr)_repeat(4,_minmax(140px,_1fr))]",
    5: "grid-cols-[minmax(160px,_1.5fr)_repeat(5,_minmax(140px,_1fr))]",
    6: "grid-cols-[minmax(160px,_1.5fr)_repeat(6,_minmax(140px,_1fr))]",
    7: "grid-cols-[minmax(160px,_1.5fr)_repeat(7,_minmax(140px,_1fr))]",
    8: "grid-cols-[minmax(160px,_1.5fr)_repeat(8,_minmax(140px,_1fr))]",
    9: "grid-cols-[minmax(160px,_1.5fr)_repeat(9,_minmax(140px,_1fr))]",
    10: "grid-cols-[minmax(160px,_1.5fr)_repeat(10,_minmax(140px,_1fr))]",
    11: "grid-cols-[minmax(160px,_1.5fr)_repeat(11,_minmax(140px,_1fr))]",
    12: "grid-cols-[minmax(160px,_1.5fr)_repeat(12,_minmax(140px,_1fr))]",
  };

  return (
    gridClasses[NumberOfPeriodsInAday] ||
    "grid-cols-[minmax(160px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]"
  );
};

const TeacherViewOneDayTt = ({
  teacherTimetable,
  changeTecherStatus,
  toggleDrawer,
  setSelectedSession,

  toggleFullDayLeaveorPresent,
}) => {
  const { NumberOfPeriodsInAday, apiDomain } = useAuth();
  const gridClassName = getGridClassName(NumberOfPeriodsInAday);

  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

  const getSessionColor = (session, teacher, index) => {
    let colorClass = "";

    if (!session.subject) {
      colorClass = "bg-green-100 text-green-800 "; // Free period
    } else {
      switch (session.type) {
        case "Core":
          colorClass = "bg-blue-100 text-blue-800";
          break;
        case "Elective":
          colorClass = "bg-purple-100 text-purple-800";
          break;
        default:
          colorClass = "bg-gray-100 text-gray-800";
          break;
      }
    }

    // Add blinking-top-border class if the condition is met
    if (
      teacher?.instructor?.present[index] === false &&
      teacher?.sessions[index]?.subject !== null
    ) {
      colorClass += " blinking-top-border leave__card";
    }

    return colorClass;
  };

  const getSessionBorderColor = (session) => {
    switch (session.type) {
      case "Core":
        return "#1976d2"; // MUI primary color
      case "Elective":
        return "#9c27b0"; // MUI secondary color
      default:
        return "#f0f0f0"; // Light gray for free periods
    }
  };

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <th className="w-1/6 p-4 text-left font-semibold">
              {teacherRow1[0]}
            </th>
            {teacherRow1.slice(1).map((header, index) => (
              <th key={index} className="w-1/12 p-4 text-left font-semibold cursor-pointer" onClick={()=>setSelectedSession(index)}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teacherTimetable?.map((teacher, teacherIndex) => {
            const fullDayPresent = teacher.instructor.present.every(
              (condition) => condition
            );
            return (
              <tr
                key={teacherIndex}
                className="bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="border-b px-4">
      
                  <TeacherListDashboard
                    teacher={teacher.instructor}
                    toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
                    fullDayPresent={fullDayPresent}
                    toggleDrawer={toggleDrawer}
                  />
                </td>
                {teacher.sessions
                  .slice(0, NumberOfPeriodsInAday)
                  .map((session, sessionIndex) => (
                    <td key={sessionIndex} className="border-b p-2">
                      <div
                        className={`rounded-lg  h-full ${getSessionColor(
                          session,
                          teacher,
                          sessionIndex
                        )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden`}
                        style={{
                          borderTop: `4px solid ${getSessionBorderColor(
                            session
                          )}`,
                        }}
                      >
                        {session.subject ? (
                          <div className="session-card flex flex-col h-full p-3">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-sm text-gray-800 leading-tight">
                                {session.subject ||
                                  session.elective_subject_name}
                              </h3>
                              <div
                                className={`${
                                  session.type === "Core"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                } text-vs font-semibold uppercase  rounded-full tracking-wider`}
                              >
                                {session.type.charAt(0)}
                              </div>
                            </div>

                            <p className="room text-xs mb-3 flex justify-between items-center text-gray-600">
                              <span className="font-medium">
                                Room {session?.room?.room_number}
                              </span>
                            </p>
                            <div className="class-details text-sm flex-grow">
                              {session.class_details.map(
                                (classDetail, index) => (
                                  <div
                                    key={index}
                                    className="class-info flex justify-between items-center mb-2 bg-white bg-opacity-50 rounded-md p-2"
                                  >
                                    <span className="class-name font-semibold text-gray-700 text-sm text-nowrap">
                                      {classDetail.standard}{" "}
                                      {classDetail.division}
                                    </span>
                                    {session.type === "Elective" && (
                                      <span className="student-count text-gray-500 text-vs text-nowrap justify-self-end">
                                        {classDetail.number_of_students} cadet
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="free-period text-center py-8">
                            <p className="font-semibold text-xl text-gray-600">
                              Free Period
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              Time to recharge!
                            </p>
                          </div>
                        )}
                        <div className=" w-full flex flex-row justify-around  self-end mt-2">
                          {/* <FaUserSlash />
                        <FiUserCheck /> */}
                          <div className="basis-1/3 flex justify-center items-center p-1 border-t border-r border-black border-opacity-10 text-opacity-40 text-black cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
                            {teacher.instructor.present[sessionIndex] === false ? (
                              <Tooltip title=" present  this period">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    toggleDrawer("noToggle");
                                    changeTecherStatus(teacher.instructor.teacher_id, sessionIndex);
                                  }}
                                >
                                  <CheckIcon
                                    fontSize="small"
                                    sx={{ color: "#90EE90" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Absent this period">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    changeTecherStatus(teacher.instructor.teacher_id, sessionIndex)
                                  }
                                >
                                  <CancelPresentationIcon
                                    fontSize="small"
                                    sx={{ color: "#FFB6C1" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                          <div
                            className={`basis-1/3 flex justify-center items-center border-t border-black border-opacity-10 text-opacity-40 text-black cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary ${
                              teacher.instructor.present[sessionIndex] == true && "cursor-not-allowed "
                            }`}
                          >
                            <Tooltip title="Assign a free teacher">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  toggleDrawer(
                                    "toggle",
                                    sessionIndex,
                                    teacher.sessions[sessionIndex].subject,
                                    teacher,
                                  )
                                }
                                disabled={
                                  teacher.instructor.present[sessionIndex] ||
                                  teacher.sessions.subject === null
                                }
                                sx={{
                                  "& svg": {
                                    color:
                                      !teacher.instructor.present[sessionIndex] &&
                                      teacher.sessions[sessionIndex] !== null
                                        ? "#009ee3"
                                        : grey[500], // Change color of the icon based on disabled state
                                  },
                                }}
                              >
                                <ChangeCircleIcon
                                  fontSize="small"
                                  sx={{ color: "#009ee3" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div className="basis-1/3 flex justify-center items-center border-t border-l text-opacity-40 text-black border-black border-opacity-10  cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
                            <Tooltip title="copy data">
                              <IconButton size="small">
                                <CopyAllIcon fontSize="small" color="inherit" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherViewOneDayTt;
