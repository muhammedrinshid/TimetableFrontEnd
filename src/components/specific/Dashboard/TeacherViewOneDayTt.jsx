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
import EmptyDefaultTimetableState from "../../empty state management components/EmptyDefaultTimetableState";

const TeacherViewOneDayTt = ({
  teacherTimetable,
  changeTecherStatus,
  toggleDrawer,
  setSelectedSession,

  toggleFullDayLeaveorPresent,
}) => {
  const { NumberOfPeriodsInAday, darkMode } = useAuth();

  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

const getSessionColor = (session, teacher, index) => {
  let colorClass = "";

  if (!session.subject) {
    colorClass =
      "bg-gradient-to-b  from-green-200 via-white to-green-200 text-green-90 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 dark:text-gray-400 bg-gradient-moving"; // Free period with gradient
  } else {
    switch (session.type) {
      case "Core":
        colorClass =
          "from-blue-200 bg-gradient-to-b  via-white to-blue-200 text-blue-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-800 dark:to-black dark:text-gray-200 "; // Core class with gradient
        break;
      case "Elective":
        colorClass =
          " from-purple-300 bg-gradient-to-b via-white to-purple-200 text-purple-900 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-300"; // Elective class with gradient
        break;
      default:
        colorClass =
          "bg-gradient-moving bg-gradient-to-b  from-gray-100 via-white to-gray-200 text-gray-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-700 dark:to-black dark:text-gray-400"; // Default fallback with gradient
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
      return "border-blue-500 dark:border-gray-800"; // Dark border for Core classes
    case "Elective":
      return "border-purple-500 dark:border-gray-500"; // Dark border for Elective classes
    default:
      return "border-gray-300 dark:border-gray-300"; // Light gray for light mode, darker gray in dark mode
  }
};

if (!teacherTimetable?.length) {
  return (
    <div className="h-full w-full">
      <EmptyDefaultTimetableState />
    </div>
  );
}

  return (
    <div className="shadow-xl rounded-lg bg-white dark:bg-gray-800">
      <div style={{ minWidth: `${150 + NumberOfPeriodsInAday * 180}px` }}>
        <table className="w-full">
          <thead className="sticky top-0 left-0 z-20 backdrop-blur-[6.4px]">
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-900 dark:from-gray-800 dark:to-gray-500 dark:text-gray-200">
              <th className="w-[150px] p-4 text-left text-white font-semibold sticky left-0 z-10 backdrop-blur-[8.4px] border-r border-gray-300 dark:border-gray-600">
                {teacherRow1[0]}
              </th>
              {teacherRow1.slice(1).map((header, index) => (
                <th
                  key={index}
                  className="w-[180px] text-light-background1 p-4 text-left font-semibold cursor-pointer border-l border-gray-300 dark:border-gray-600"
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
                  className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-dark-background transition-colors duration-300"
                >
                  <td className="border-b p-4 sticky left-0 z-10 w-[150px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[9.4px] border border-gray-300 dark:border-gray-600">
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
                    .map((sessionGrp, sessionGrpIndex) => (
                      <td
                        key={sessionGrpIndex}
                        className="border-b border-r p-2 w-[180px] border-gray-300 dark:border-gray-600"
                      >
                        {sessionGrp.map((session, sessionIndex) => (
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
                                  <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                    {session.subject ||
                                      session.elective_subject_name}
                                  </h3>
                                  <div
                                    className={`${
                                      session.type === "Core"
                                        ? "bg-green-500 dark:bg-green-400 text-white"
                                        : "bg-yellow-500 dark:bg-yellow-400 text-gray-900 dark:text-white"
                                    } text-vs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
                                  >
                                    {session.type.charAt(0)}
                                  </div>
                                </div>

                                <p className="room text-xs mb-3 flex justify-between items-center text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">
                                    Room {session?.room?.room_number}
                                  </span>
                                </p>
                                <div className="class-details text-sm flex-grow">
                                  {session.class_details.map(
                                    (classDetail, index) => (
                                      <div
                                        key={index}
                                        className="class-info flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-600 bg-opacity-50 rounded-md p-2"
                                      >
                                        <span className="class-name font-semibold text-gray-900 dark:text-white text-sm text-nowrap">
                                          {classDetail.standard}{" "}
                                          {classDetail.division}
                                        </span>
                                        {session.type === "Elective" && (
                                          <span className="student-count text-gray-500 dark:text-gray-400 text-vs text-nowrap justify-self-end">
                                            {classDetail.number_of_students}{" "}
                                            cadet
                                          </span>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`mb-2 last:mb-0 border-t-4 rounded-lg overflow-hidden py-4 ${getSessionColor(
                                  session
                                )} h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm`}
                              >
                                <div className="text-center p-4 space-y-2">
                                  <p className="font-medium text-sm tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                                    Free Period
                                  </p>
                                  <div className="w-12 h-0.5 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full" />
                                  <p className="text-[11px] text-gray-400 dark:text-gray-500 font-light tracking-wide">
                                    Time to recharge!
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="w-full flex flex-row justify-around self-end mt-2">
                              <div className="basis-1/3 flex justify-center items-center p-1 border-t border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
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
                                        sx={{
                                          color: darkMode
                                            ? "#FFFFFF"
                                            : "inherit",
                                        }}
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
                                        sx={{
                                          color: darkMode
                                            ? "#FFFFFF"
                                            : "inherit",
                                        }} // White in dark mode, black in light mode
                                      />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>

                              <div
                                className={`basis-1/3 flex justify-center items-center border-t border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200 ${
                                  teacher.instructor.present[sessionIndex] ===
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
                                      teacher.instructor.present[
                                        sessionIndex
                                      ] ||
                                      teacher?.sessions[sessionIndex]
                                        ?.subject === null
                                    }
                                    sx={{
                                      "& svg": {
                                        color:
                                          teacher.instructor.present[
                                            sessionIndex
                                          ] ||
                                          teacher?.sessions[sessionIndex]
                                            ?.subject === null
                                            ? darkMode
                                              ? "#A9A9A9" // Gray color in dark mode when teacher is present
                                              : "gray" // Gray color in light mode when teacher is present
                                            : darkMode
                                            ? "#FFFFFF" // White color in dark mode when teacher is absent
                                            : "inherit", // Default color in light mode when teacher is absent
                                      },
                                    }}
                                  >
                                    <ChangeCircleIcon
                                      fontSize="small"
                                      sx={{ color: "inherit" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>

                              <div className="basis-1/3 flex justify-center items-center border-t border-l border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
                                <Tooltip title="Copy data">
                                  <IconButton size="small">
                                    <CopyAllIcon
                                      fontSize="small"
                                      sx={{
                                        color: darkMode ? "#FFFFFF" : "inherit",
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        ))}
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
