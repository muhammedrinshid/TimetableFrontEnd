import React from "react";
import { useAuth } from "../../../context/Authcontext";
import { Avatar } from "@mui/material";
import ClassroomInfoCard from "./ClassroomInfoCard";
import EmptyDefaultTimetableState from "../../empty state management components/EmptyDefaultTimetableState";

const StudentViewOneDayTt = ({ studentTimeTable }) => {
  const { NumberOfPeriodsInAday, apiDomain } = useAuth();

  const getSessionColor = (session) => {
    switch (session.type) {
      case "Core":
        return "bg-blue-100 text-blue-800 dark:bg-dark-primaryShades-600 dark:text-dark-text";
      case "Elective":
        return "bg-purple-100 text-purple-800 dark:bg-dark-primaryShades-500 dark:text-dark-text";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-dark-primaryShades-600 dark:text-dark-text";
    }
  };

  const studentRow = [
    "Time",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];
  if (!studentTimeTable?.length) {
    return (
      <div className="h-full w-full">
        <EmptyDefaultTimetableState />
      </div>
    );
  }

  return (
    <div className="shadow-xl rounded-lg bg-white dark:bg-gray-900">
      <div style={{ minWidth: `${150 + NumberOfPeriodsInAday * 180}px` }}>
        <table className="w-full">
          <thead className="sticky top-0 left-0 z-20 backdrop-blur-[6.4px]">
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100">
              <th className="w-[150px] p-4 text-left text-white font-semibold sticky left-0 z-10 backdrop-blur-[8.4px] border-r border-gray-300 dark:border-gray-700">
                {studentRow[0]}
              </th>
              {studentRow?.slice(1)?.map((header, index) => (
                <th
                  key={index}
                  className="w-[180px] text-light-background1 p-4 text-left font-semibold cursor-pointer border-l border-gray-300 dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentTimeTable?.map((classData, classIndex) => (
              <tr
                key={classIndex}
                className="bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <td className="border-b p-4 sticky left-0 z-10 w-[150px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[9.4px] border border-white/7 dark:border-gray-700 dark:bg-gray-900">
                  <ClassroomInfoCard classData={classData} />
                </td>
                {classData.sessions
                  ?.slice(0, NumberOfPeriodsInAday)
                  ?.map((sessionGrp, sessionGrpIndex) => (
                    <td
                      key={sessionGrpIndex}
                      className="border-b border-r p-2 w-[180px] dark:border-gray-700"
                    >
                      {sessionGrp?.map((session, sessionIndex) => (
                        <div
                          key={sessionIndex}
                          className={`rounded-lg p-3 h-full ${getSessionColor(
                            session
                          )} transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-750`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-sm truncate flex-grow dark:text-gray-100">
                              {session.name}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                session?.type === "Elective"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                              }`}
                            >
                              {session?.type}
                            </span>
                          </div>
                          {session.class_distribution.map(
                            (distribution, distributionIndex) => (
                              <div
                                key={distributionIndex}
                                className="mt-2 bg-white dark:bg-gray-600 bg-opacity-50 rounded-md p-2 dark:shadow-lg dark:shadow-black/10"
                              >
                                <div className="flex items-center mb-1">
                                  <Avatar
                                    alt={distribution.teacher.name}
                                    src={
                                      distribution.teacher.profile_image
                                        ? `${apiDomain}/${distribution.teacher.profile_image}`
                                        : undefined
                                    }
                                    className="w-8 h-8 rounded-full mr-2 border-2 border-white dark:border-gray-600"
                                  >
                                    {!distribution.teacher.profile_image &&
                                      distribution.teacher.name.charAt(0)}
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-medium dark:text-gray-200">
                                      {distribution.teacher.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {distribution.subject}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-xs">
                                  {session?.type == "Elective" && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                      Students:{" "}
                                      {
                                        distribution.number_of_students_from_this_class
                                      }
                                    </p>
                                  )}
                                  {
                                    <p className="text-gray-600 dark:text-gray-300">
                                      Room: {distribution.room.name} (
                                      {distribution.room?.room_number})
                                    </p>
                                  }
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentViewOneDayTt;
