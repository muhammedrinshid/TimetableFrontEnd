import React from "react";
import { Calendar, Search, LayoutGrid } from "lucide-react";

const TimetableControlPanel = ({
  selectedDay,
  days,
  handleDayChange,
  searchTerm,
  handleSearch,
  isTeacherView,
  handleViewToggle,
}) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <select
            value={selectedDay}
            onChange={handleDayChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="relative w-full sm:w-auto flex-grow">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>

        <button
          onClick={handleViewToggle}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isTeacherView
              ? "bg-light-primary bg-opacity-80 text-white hover:bg-blue-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>{isTeacherView ? "Teacher View" : "Student View"}</span>
        </button>
      </div>
    </div>
  );
};

export default TimetableControlPanel;
