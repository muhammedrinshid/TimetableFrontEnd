import React from "react";
import { useAuth } from "../../../context/Authcontext";
import { Avatar } from "@mui/material";
import ClassroomInfoCard from "./ClassroomInfoCard";

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

  return (
    <div className="shadow-xl rounded-lg dark:bg-dark-background">
      <div style={{ minWidth: `${150 + NumberOfPeriodsInAday * 180}px` }}>
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white dark:from-dark-primary dark:to-dark-secondary">
              <th className="w-[150px] text-white p-4 text-left font-semibold sticky left-0 z-10 backdrop-blur-[8.4px] bg-blue-500 dark:bg-dark-primary border-r border-white/20">
                {studentRow[0]}
              </th>
              {studentRow?.slice(1)?.map((header, index) => (
                <th
                  key={index}
                  className="w-[180px] p-4 text-left font-semibold cursor-pointer border-l border-white/20"
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
                className="bg-white dark:bg-dark-background hover:bg-gray-50 dark:hover:bg-dark-background1 transition-colors duration-300"
              >
                <td className="border-b p-4 sticky left-0 z-10 w-[150px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[9.4px] border border-white/7 dark:border-dark-border">
                  <ClassroomInfoCard classData={classData} />
                </td>
                {classData.sessions
                  ?.slice(0, NumberOfPeriodsInAday)
                  ?.map((sessionGrp, sessionGrpIndex) => (
                    <td
                      key={sessionGrpIndex}
                      className="border-b border-r p-2 w-[180px] dark:border-dark-border"
                    >
                      {sessionGrp?.map((session, sessionIndex) => (
                        <div
                          key={sessionIndex}
                          className={`rounded-lg p-3 h-full ${getSessionColor(
                            session
                          )} transition-all duration-300 hover:shadow-md`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-sm truncate flex-grow">
                              {session.name}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                session?.type === "Elective"
                                  ? "bg-blue-100 text-blue-800 dark:bg-dark-secondary dark:text-dark-text"
                                  : "bg-purple-100 text-purple-800 dark:bg-dark-primary dark:text-dark-text"
                              }`}
                            >
                              {session?.type}
                            </span>
                          </div>
                          {session.class_distribution.map(
                            (distribution, distributionIndex) => (
                              <div
                                key={distributionIndex}
                                className="mt-2 bg-white dark:bg-dark-secondary bg-opacity-50 rounded-md p-2"
                              >
                                <div className="flex items-center mb-1">
                                  <Avatar
                                    alt={distribution.teacher.name}
                                    src={
                                      distribution.teacher.profile_image
                                        ? `${apiDomain}/${distribution.teacher.profile_image}`
                                        : undefined
                                    }
                                    className="w-8 h-8 rounded-full mr-2 border-2 border-white dark:border-dark-border"
                                  >
                                    {!distribution.teacher.profile_image &&
                                      distribution.teacher.name.charAt(0)}
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-medium dark:text-dark-text">
                                      {distribution.teacher.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                                      {distribution.subject}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-xs">
                                  {session?.type == "Elective" && (
                                    <p className="text-gray-600 dark:text-dark-muted">
                                      Students:{" "}
                                      {
                                        distribution.number_of_students_from_this_class
                                      }
                                    </p>
                                  )}
                                  {
                                    <p className="text-gray-600 dark:text-dark-muted">
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
