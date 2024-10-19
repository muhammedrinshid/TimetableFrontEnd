import { Avatar, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/Authcontext";
import { ArrowLeftRight, Calendar, CalendarDays } from "lucide-react";

const TeacherSwapDealDisplayer = ({ data, selected = false }) => {
  const { apiDomain } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [swappedSessions, setSwappedSessions] = useState(null);
useEffect(() => {
  if (selected) {
    const interval = setInterval(() => {
      setIsAnimating(true);

      // Reset animation after completion
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 3000);
    return () => clearInterval(interval);
  }
}, [selected]);

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
const renderTeacherInfo = (teacher) => {
  const workingLoadEntries = Object.entries(teacher?.instructor.working_load || {});
  console.log(teacher?.instructor.working_load);
  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-2">
        <Avatar
          src={
            teacher?.instructor.profile_image
              ? `${apiDomain}/${teacher?.instructor.profile_image}`
              : "/api/placeholder/40/40"
          }
          sx={{
            width: 40,
            height: 40,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "2px solid #fff",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
        <div className="min-w-0">
          <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
            {teacher.instructor.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {teacher.instructor.teacherId}
          </div>
        </div>
      </div>

      {workingLoadEntries.length > 0 && (
        <div className="ml-2 space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Calendar size={12} />
            <span className="font-medium">Working Load:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {workingLoadEntries.map(([day, load]) => (
              <div 
                key={day} 
                className="bg-gray-50 dark:bg-gray-800 rounded p-1.5 text-xs"
              >
                <div className="font-medium text-gray-700 dark:text-gray-200">
                  {day}
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-blue-600 dark:text-blue-400">
                    T: {load.teaching}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    P: {load.planning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

  const renderHeader = (header, index) => (
    <th
      key={index}
      className="relative w-1/4 p-1 border-b border-indigo-100 dark:border-indigo-900"
    >
      <div
        className={`
        flex flex-col items-center justify-center p-1.5 rounded-md
        bg-indigo-50 dark:bg-indigo-900/20
        ${selected ? "transform hover:scale-105 hover:shadow-sm" : ""}
        transition-all duration-300
      `}
      >
        <div className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3 text-indigo-500" />
          <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-300">
            {header.dayofweek.slice(0, 3)}
          </span>
        </div>
        <span className="text-xs text-indigo-500 dark:text-indigo-300">
          Period {header.sessiongrpindx+1}
        </span>
      </div>
    </th>
  );

  const renderSession = (session, index, shouldAnimate, position) => (
    <div
      className={`
      relative h-full border-t-2 rounded-md overflow-hidden p-2 flex  items-center
      ${getSessionBorderColor(session)} ${getSessionColor(session)}
      transition-all duration-500 ease-out
      ${shouldAnimate ? "animate-session-swap" : ""}
      ${shouldAnimate && position === "left" ? "origin-right" : "origin-left"}
    `}
      style={{
        minHeight: selected ? "130px" : "90px",
      }}
    >
      {!session.subject ? (
        <div className="h-full w-full flex flex-col justify-center items-center p-1 space-y-0.5">
          <p className="font-medium text-xs tracking-wide text-gray-500 dark:text-gray-400 uppercase">
            Free Period
          </p>
          <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Time to recharge!
          </p>
        </div>
      ) : (
        <div className="h-full p-1.5 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xs leading-tight truncate max-w-[70%]">
              {session.subject || session.elective_subject_name}
            </h3>
          </div>
          {session.room && (
            <p className="text-xs my-0.5 flex items-center text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                Room {session.room.room_number}
              </span>
            </p>
          )}
          {session.class_details && (
            <div className="space-y-0.5 mt-auto">
              {session.class_details.map((classDetail, classIndex) => (
                <div
                  key={classIndex}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-600 bg-opacity-50 rounded p-0.5"
                >
                  <span className="font-semibold text-xs">
                    {classDetail.standard} {classDetail.division}
                  </span>
                  {session.type === "Elective" && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {classDetail.number_of_students} cadet
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl">
      <div
        className={`
        bg-white dark:bg-gray-900 rounded-lg
        ${selected ? "shadow-md" : "shadow-sm"}
        transition-all duration-500 overflow-hidden
      `}
      >
        <style jsx global>{`
          @keyframes session-swap {
            0% {
              transform: translateY(0) scale(1);
            }
            25% {
              transform: translateY(-20px) scale(0.95);
              opacity: 0.9;
            }
            75% {
              transform: translateY(-20px) scale(1.05);
              opacity: 0.9;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          .animate-session-swap {
            animation: session-swap 1s cubic-bezier(0.4, 0, 0.2, 1);
            animation-fill-mode: forwards;
          }
        `}</style>

        {selected && (
          <div className="flex justify-center py-2 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-indigo-900/20">
            <div className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/40 px-4 py-1 rounded-full shadow-sm">
              <ArrowLeftRight className="w-3 h-3 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                Active Period Swap
              </span>
            </div>
          </div>
        )}

        <div className="p-2">
          <div className="overflow-hidden rounded-md border border-indigo-100 dark:border-indigo-900/50">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50/50 to-white dark:from-gray-800 dark:to-gray-900">
                  <th className="w-1/4 p-1 text-left border-b border-indigo-100 dark:border-indigo-900">
                    <div className="px-2 py-1">
                      <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                        Teacher
                      </span>
                    </div>
                  </th>
                  {data.headers
                    .slice(1)
                    .map((header, index) => renderHeader(header, index))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/50 dark:divide-indigo-900/30">
                {data.teachers.map((teacher, teacherIndex) => (
                  <tr
                    key={teacherIndex}
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-200"
                  >
                    <td className="py-1 align-top">
                      {renderTeacherInfo(teacher)}
                    </td>
                    {teacher.sessions.map((session, sessionIndex) => {
                      let displaySession = session;
                      let shouldAnimate = false;
                      let position = "left";

                      if (selected && isAnimating) {
                        if (sessionIndex === 0 || sessionIndex === 1) {
                          displaySession =
                            teacher.sessions[sessionIndex === 0 ? 1 : 0];
                          shouldAnimate = true;
                          position = sessionIndex === 0 ? "left" : "right";
                        } else if (sessionIndex === 2 || sessionIndex === 3) {
                          displaySession =
                            teacher.sessions[sessionIndex === 2 ? 3 : 2];
                          shouldAnimate = true;
                          position = sessionIndex === 2 ? "left" : "right";
                        }
                      }

                      return (
                        <td key={sessionIndex} className="py-1 px-1 align-top text-center ">
                          {renderSession(
                            displaySession,
                            sessionIndex,
                            shouldAnimate,
                            position
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSwapDealDisplayer;
