import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { Avatar, Chip, Tooltip } from "@mui/material";
import SavedTimeTableTeacherListCard from "./SavedTimeTableTeacherListCard";
import EmptyDefaultTimetableState from "../../empty state management components/EmptyDefaultTimetableState";

const TeacherTimeTableComponent = ({ teacherTimetable, searchTerm }) => {
  const { apiDomain, NumberOfPeriodsInAday } = useAuth();
  const [filteredTimetable, setFilteredTimetable] = useState(teacherTimetable);
  const teacherRow1 = [
    "Instructor",
    ...Array(NumberOfPeriodsInAday)
      .fill()
      .map((_, i) => `Session${i + 1}`),
  ];

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = teacherTimetable?.filter((teacher) => {
        const nameMatch = teacher.instructor.name
          .toLowerCase()
          .includes(lowercasedSearch);

        // Handle nested session arrays
        const sessionMatch = teacher.sessions.some((sessionGroup) =>
          sessionGroup.some((session) => {
            const subjectMatch = (
              session?.subject ||
              session?.elective_subject_name ||
              ""
            )
              .toLowerCase()
              .includes(lowercasedSearch);
            const roomMatch = session?.room?.room_number
              ?.toString()
              .toLowerCase()
              .includes(lowercasedSearch);
            return subjectMatch || roomMatch;
          })
        );

        return nameMatch || sessionMatch;
      });
      setFilteredTimetable(filtered);
    } else {
      setFilteredTimetable(teacherTimetable);
    }
  }, [searchTerm, teacherTimetable]);

const getSessionBorderColor = (session) => {
  if (!session || !session.subject) {
    return "border-gray-300 dark:border-gray-300";
  }
  switch (session.type) {
    case "Core":
      return "border-blue-500 ";
    case "Elective":
      return "border-purple-500 ";
    default:
      return "border-gray-300 ";
  }
};

const getSessionColor = (session) => {
  if (!session || !session.subject) {
    return "bg-gradient-to-b from-green-200 via-white to-green-200 text-green-900 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 dark:text-gray-400";
  }
  switch (session.type) {
    case "Core":
      return "bg-gradient-to-b from-blue-200 via-white to-blue-200 text-blue-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-800 dark:to-black dark:text-gray-200";
    case "Elective":
      return "bg-gradient-to-b from-purple-300 via-white to-purple-200 text-purple-900 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-300";
    default:
      return "bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-700 dark:to-black dark:text-gray-400";
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
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse">
        Teacher Timetable
      </h2>
      {/* Outer container with fixed height and vertical scroll */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        {/* Inner container for horizontal scroll */}
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="w-full border-collapse">
            <thead className="sticky top-0">
              <tr className="sticky left-0 top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200">
                <th className="w-[160px] min-w-[160px] p-4 text-left font-semibold border-r sticky left-0 z-30 ">
                  {teacherRow1[0]}
                </th>
                {teacherRow1.slice(1).map((header, index) => (
                  <th
                    key={index}
                    className="w-[140pxpx] min-w-[140px] p-4 text-left font-semibold border-r last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTimetable?.map((teacher, teacherIndex) => (
                <tr
                  key={teacherIndex}
                  className="bg-white hover:bg-gray-50 transition-colors duration-300 dark:bg-gray-800"
                >
                  <td className="w-[160px] min-w-[160px] p-4 border-b border-r sticky left-0 bg-white dark:bg-gray-800 z-10">
                    <SavedTimeTableTeacherListCard teacher={teacher} />
                  </td>
                  {teacher?.sessions
                    ?.slice(0, NumberOfPeriodsInAday)
                    .map((sessionGroup, sessionGroupIndex) => (
                      <td
                        key={sessionGroupIndex}
                        className="w-[140px] min-w-[140px] border-b border-r p-3 last:border-r-0"
                      >
                        {sessionGroup.length > 0 ? (
                          sessionGroup.map((session, sessionIndex) => (
                            <div
                              key={sessionIndex}
                              className="h-[150px] mb-2 last:mb-0"
                            >
                              {session?.subject ? (
                                <div
                                  className={`h-full border-t-4 rounded-lg overflow-hidden ${getSessionBorderColor(
                                    session
                                  )} p-2 ${getSessionColor(session)}`}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <Tooltip
                                      title={
                                        session.subject ||
                                        session.elective_subject_name
                                      }
                                    >
                                      <h3 className="font-bold text-sm leading-tight truncate max-w-[70%]">
                                        {session.subject ||
                                          session.elective_subject_name ||
                                          "Free Period"}
                                      </h3>
                                    </Tooltip>
                                    {session.type && (
                                      <div
                                        className={`${
                                          session.type === "Core"
                                            ? "bg-blue-500 dark:bg-blue-400 text-white bg-opacity-30"
                                            : "bg-purple-500 dark:bg-purple-400 text-gray-900 dark:text-white bg-opacity-30"
                                        } text-xs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
                                      >
                                        {session.type?.charAt(0)}
                                      </div>
                                    )}
                                  </div>

                                  {session.class_details && (
                                    <div className="text-xs overflow-y-auto max-h-[90px]">
                                      {session.class_details.map(
                                        (classDetail, classIndex) => (
                                          <div
                                            key={classIndex}
                                            className="flex justify-between items-center mb-1 bg-gray-100 dark:bg-gray-600 bg-opacity-50 rounded-md p-1"
                                          >
                                            <span className="font-semibold text-nowrap">
                                              {classDetail.standard}{" "}
                                              {classDetail.division}
                                            </span>
                                            {session.type === "Elective" && (
                                              <span className="text-gray-500 dark:text-gray-400 text-nowrap">
                                                {classDetail.number_of_students}{" "}
                                                cadet
                                              </span>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`h-full border-t-4 rounded-lg overflow-hidden ${getSessionColor(
                                    session
                                  )} flex items-center justify-center bg-opacity-50 backdrop-blur-sm`}
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
                            </div>
                          ))
                        ) : (
                          <div className="h-[150px] flex items-center justify-center">
                            <div className="text-center">
                              <p className="font-semibold text-gray-600 dark:text-gray-300">
                                Free Period
                              </p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Time to recharge!
                              </p>
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimeTableComponent;
