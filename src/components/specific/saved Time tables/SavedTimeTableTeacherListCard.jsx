import React from "react";
import { useAuth } from "../../../context/Authcontext";

const SavedTimeTableTeacherListCard = ({ teacher }) => {
  const { apiDomain } = useAuth();
  const teachingPeriods = teacher?.sessions.filter(
    (sessionGrp) => sessionGrp[0].subject !== null
  ).length;

  const planningPeriods = teacher?.sessions.filter(
    (sessionGrp) => sessionGrp[0].subject === null
  ).length;

  return (
    <td className="sticky left-0 bg-white dark:bg-gray-800   z-10 backdrop-blur-md bg-opacity-50 p-2 flex justify-center items-center">
      <div className="w-56 backdrop-blur-md bg-light-background1/50 dark:bg-gray-900/70 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
        <div className="p-3 space-y-2">
          {/* Header Section */}
          <div className="flex items-center gap-3">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                <img
                  src={
                    teacher?.instructor?.profile_image
                      ? `${apiDomain}/${teacher?.instructor?.profile_image}`
                      : "/api/placeholder/48/48"
                  }
                  alt={teacher?.instructor?.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
                />
              </div>
              <div className="mt-0.5 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {teacher?.instructor.teacher_id}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {teacher?.instructor.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                {teacher?.instructor.surname}
              </p>
            </div>
          </div>

          {/* Subject Tags */}
          <div className="relative">
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {teacher?.instructor?.qualified_subjects.map((sub, index) => (
                <span
                  key={index}
                  className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    index % 3 === 0
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                      : index % 3 === 1
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
                  }`}
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-slate-200 dark:bg-gray-700/50">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  {teachingPeriods}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Teaching
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-slate-200 dark:bg-gray-700/50">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {planningPeriods}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Planning
              </span>
            </div>
          </div>
        </div>
      </div>
    </td>
  );
};

export default SavedTimeTableTeacherListCard;
