import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { Avatar, Chip } from "@mui/material";

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
        const sessionMatch = teacher.sessions.some((session) => {
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
        });
        return nameMatch || sessionMatch;
      });
      setFilteredTimetable(filtered);
    } else {
      setFilteredTimetable(teacherTimetable);
    }
  }, [searchTerm, teacherTimetable]);

  const getSessionColor = (session) => {
    if (!session?.subject) return "bg-green-100 text-green-800";
    switch (session?.type) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Elective":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSessionBorderColor = (session) => {
    switch (session?.type) {
      case "Core":
        return "#1976d2";
      case "Elective":
        return "#9c27b0";
      default:
        return "#f0f0f0";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse">
        Teacher Timetable
      </h2>
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
            {filteredTimetable?.map((teacher, teacherIndex) => (
              <tr
                key={teacherIndex}
                className="bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="border-b p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={
                        teacher?.instructor?.profile_image
                          ? `${apiDomain}/media/${teacher?.instructor?.profile_image}`
                          : undefined
                      }
                      className="w-10 h-10 rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                    >
                      {!teacher?.instructor?.profile_image &&
                        teacher?.instructor?.name?.[0]}
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-gray-800 truncate">
                        {teacher?.instructor?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {teacher?.instructor?.teacher_id}
                      </p>
                    </div>
                  </div>
                </td>
                {teacher?.sessions
                  ?.slice(0, NumberOfPeriodsInAday)
                  .map((session, sessionIndex) => (
                    <td key={sessionIndex} className="border-b p-2">
                      <div
                        className={`rounded-lg p-3 h-full ${getSessionColor(
                          session
                        )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden`}
                        style={{
                          borderTop: `4px solid ${getSessionBorderColor(
                            session
                          )}`,
                        }}
                      >
                        {session?.subject ? (
                          <div className="session-card flex flex-col jus h-full">
                            <div className="flex flex-col justify-between items-start mb-3">
                              <div
                                className={`${
                                  session?.type === "Core"
                                    ? "bg-blue-200 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                } text-xs font-normal capitalize px-1 py-1 rounded-full tracking-wider mb-2`}
                              >
                                {session?.type}
                              </div>
                              <h3 className="font-semibold text-base text-gray-800 leading-tight">
                                {session?.subject ||
                                  session?.elective_subject_name}
                              </h3>
                            </div>
                            <p className="room text-xs mb-2 flex justify-between items-center text-gray-600">
                              <span className="font-medium">
                                Room {session?.room?.room_number}
                              </span>
                            </p>
                            <div className="class-details text-sm flex-grow">
                              {session?.class_details?.map(
                                (classDetail, index) => (
                                  <div
                                    key={index}
                                    className="class-info flex justify-between items-center mb-2 bg-white bg-opacity-50 rounded-md p-2"
                                  >
                                    <span className="class-name text-xs font-semibold text-gray-700">
                                      {classDetail?.standard}{" "}
                                      {classDetail?.division}
                                    </span>
                                    {session?.type === "Elective" && (
                                      <span className="student-count text-gray-500 text-vs">
                                        {classDetail?.number_of_students}{" "}
                                        students
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTimeTableComponent;
