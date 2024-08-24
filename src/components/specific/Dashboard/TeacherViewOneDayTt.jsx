import React from "react";
import {
  TeacherViewClassroomCard,
  TeacherListDashboard,
  TeacherViewHeading,
} from "../../common";

import { Avatar, Chip } from "@mui/material";

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

  toggleDrawer,

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

  const getSessionColor = (session) => {
    if (!session.subject) return "bg-green-100 text-green-800"; // Free period
    switch (session.type) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Elective":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              <th key={index} className="w-1/12 p-4 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teacherTimetable?.map((teacher, teacherIndex) => {
            const fullDayPresent = teacher.instructor.present.every((condition) => condition);
            return (
              <tr
                key={teacherIndex}
                className="bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="border-b px-4">
                  {/* <div className="flex items-center space-x-3">
        <Avatar
          src={
            teacher?.instructor?.profile_image
              ? `${apiDomain}/media/${teacher?.instructor?.profile_image}`
              : undefined
          }
          className="w-10 h-10 rounded-full shadow-md transition-transform duration-300 hover:scale-110"
        >
          {!teacher?.instructor?.profile_image &&
            teacher.instructor.name[0]}
        </Avatar>
        <div className="overflow-hidden">
          <p className="font-bold text-sm text-gray-800 truncate">
            {teacher.instructor.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {teacher.instructor.teacher_id}
          </p>
        </div>
      </div> */}
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
                        className={`rounded-lg p-4 h-full ${getSessionColor(
                          session
                        )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden`}
                        style={{
                          borderTop: `4px solid ${getSessionBorderColor(
                            session
                          )}`,
                        }}
                      >
                        {session.subject ? (
                          <div className="session-card flex flex-col h-full">
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
