import React from "react";
import {
  TeacherViewClassroomCard,
  TeacherListDashboard,
  TeacherViewHeading,
} from "../../common";

import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { grey } from "@mui/material/colors";
import { useAuth } from "../../../context/Authcontext";



const TeacherViewOneDayTt = ({
  teacherTimetable,
  changeTecherStatus,
  toggleDrawer,
  setSelectedSession,

  toggleFullDayLeaveorPresent,
}) => {
  const { NumberOfPeriodsInAday, apiDomain } = useAuth();

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
    <div className=" shadow-xl rounded-lg">
      <div style={{ minWidth: `${150 + NumberOfPeriodsInAday * 180}px` }}>
        <table className="w-full">
          <thead className="sticky top-0 left-0 z-20 backdrop-blur-[6.4px]">
            <tr className="bg-gradient-to-r from-light-primary to-light-secondary text-white">
              <th className="w-[150px] p-4 text-left font-semibold sticky left-0 z-10 backdrop-blur-[8.4px]  border-r border-white">
                {teacherRow1[0]}
              </th>
              {teacherRow1.slice(1).map((header, index) => (
                <th
                  key={index}
                  className="w-[180px] p-4 text-left font-semibold cursor-pointer   border-l border-white "
                  onClick={() => setSelectedSession(index)}
                >
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
                  <td className="border-b p-4 sticky left-0 z-10 w-[150px]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[9.4px] border border-white/7">
                    <TeacherListDashboard
                      teacher={teacher.instructor}
                      toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
                      fullDayPresent={fullDayPresent}
                      toggleDrawer={toggleDrawer}
                      index={teacherIndex}
                      sessions={teacher?.sessions}
                    />
                  </td>
                  {teacher.sessions
                    .slice(0, NumberOfPeriodsInAday)
                    .map((session, sessionIndex) => (
                      <td key={sessionIndex} className="border-b border-r p-2 w-[180px]">
                        <div
                          className={`rounded-lg h-full ${getSessionColor(
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
                                  } text-vs font-semibold uppercase rounded-full tracking-wider`}
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
                          <div className="w-full flex flex-row justify-around self-end mt-2">
                            <div className="basis-1/3 flex justify-center items-center p-1 border-t border-r border-black border-opacity-10 text-opacity-40 text-black cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
                              {teacher.instructor.present[sessionIndex] ===
                              false ? (
                                <Tooltip title="Present this period">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      toggleDrawer("noToggle");
                                      changeTecherStatus(
                                        teacher.instructor.teacher_id,
                                        sessionIndex
                                      );
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
                                      changeTecherStatus(
                                        teacher.instructor.teacher_id,
                                        sessionIndex
                                      )
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
                                teacher.instructor.present[sessionIndex] ==
                                  true && "cursor-not-allowed"
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
                                      teacher
                                    )
                                  }
                                  disabled={
                                    teacher.instructor.present[sessionIndex] ||
                                    teacher.sessions.subject === null
                                  }
                                  sx={{
                                    "& svg": {
                                      color:
                                        !teacher.instructor.present[
                                          sessionIndex
                                        ] &&
                                        teacher.sessions[sessionIndex] !== null
                                          ? "#009ee3"
                                          : grey[500],
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
                            <div className="basis-1/3 flex justify-center items-center border-t border-l text-opacity-40 text-black border-black border-opacity-10 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-light-primary">
                              <Tooltip title="Copy data">
                                <IconButton size="small">
                                  <CopyAllIcon
                                    fontSize="small"
                                    color="inherit"
                                  />
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
    </div>
  );
};

export default TeacherViewOneDayTt;
