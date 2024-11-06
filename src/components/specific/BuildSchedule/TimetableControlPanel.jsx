import React from "react";
import { Calendar, Search, LayoutGrid, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { TbEditCircle } from "react-icons/tb";

const TimetableControlPanel = ({
  selectedDay,
  days,
  handleDayChange,
  searchTerm,
  handleSearch,
  isTeacherView,
  handleViewToggle,
  timeTableId,
}) => {
  const editButtonText = isTeacherView
    ? "Edit Teacher Schedule"
    : "Edit Students Schedule";
  const editLinkPath = isTeacherView
    ? `/edit-timetable/teacher/${timeTableId}`
    : `/edit-timetable/student/${timeTableId}`;

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-[200px]">
          <select
            value={selectedDay}
            onChange={handleDayChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#312ECB] focus:border-[#312ECB] transition-all duration-300 appearance-none shadow-sm"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-auto flex-grow flex items-center space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#312ECB] focus:border-[#312ECB] transition-all duration-300 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>

          {timeTableId !== null ? (
            <Link
              to={editLinkPath}
              className="btn btn-gradient-primary btn-icon btn-icon-left"
            >
              <TbEditCircle className="w-4 h-4" />
              <span>{editButtonText}</span>
            </Link>
          ) : (
            <button
              disabled
              className="btn btn-disabled btn-icon btn-icon-left"
            >
              <Edit className="w-4 h-4" />
              <span>{editButtonText}</span>
            </button>
          )}
        </div>

        <button
          onClick={handleViewToggle}
          className="btn btn-gradient-primary btn-icon btn-icon-left"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{!isTeacherView ? "Teacher View" : "Student View"}</span>
        </button>
      </div>
    </div>
  );
};

export default TimetableControlPanel;
