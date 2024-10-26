import React, { useState } from "react";
import {
  AlertTriangle,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

const ErrorDisplay = ({ errors, viewType }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedErrors, setExpandedErrors] = useState({});

  const teacherErrorTypeDetails = {
    "Unqualified Teacher": {
      symbol: "👩‍🏫",
      color: "text-red-500",
      bgColor: isDarkMode ? "bg-red-900/10" : "bg-red-50",
      description:
        "Teacher does not meet the required certification standards for this course.",
      solution:
        "Assign a certified instructor or provide necessary certification training.",
    },
    "Room Conflict": {
      symbol: "🏪",
      color: "text-amber-500",
      bgColor: isDarkMode ? "bg-amber-900/10" : "bg-amber-50",
      description: "Room is double-booked for this time slot.",
      solution:
        "Check available rooms in building B or C during this time slot.",
    },
    "Class Conflict": {
      symbol: "📅",
      color: "text-blue-500",
      bgColor: isDarkMode ? "bg-blue-900/10" : "bg-blue-50",
      description: "Schedule overlap detected for student or instructor.",
      solution:
        "Review alternative time slots or consider remote learning options.",
    },
    "Concurrent Sessions": {
      symbol: "⏰",
      color: "text-purple-500",
      bgColor: isDarkMode ? "bg-purple-900/10" : "bg-purple-50",
      description: "Instructor scheduled for multiple classes simultaneously.",
      solution: "Adjust session timing or assign an additional instructor.",
    },
    "Teacher Schedule Conflict": {
      symbol: "👥",
      color: "text-rose-500",
      bgColor: isDarkMode ? "bg-rose-900/10" : "bg-rose-50",
      description:
        "Teacher is assigned to multiple classes in the same time slot.",
      solution:
        "Reassign one of the classes to a different teacher or time slot.",
    },
  };

const studentErrorTypeDetails = {
  "Room Conflict": {
    symbol: "🏫",
    color: "text-red-500",
    bgColor: isDarkMode ? "bg-red-900/10" : "bg-red-50",
    description:
      "Multiple classes are scheduled in the same room during this period.",
    solution:
      "Please wait for the administration to resolve the room allocation conflict.",
  },
  "Empty Period": {
    symbol: "⌛",
    color: "text-amber-500",
    bgColor: isDarkMode ? "bg-amber-900/10" : "bg-amber-50",
    description: "There is no class scheduled during this period.",
    solution: "Check with your class teacher for the updated schedule.",
  },
  "Teacher Conflict": {
    symbol: "👨‍🏫",
    color: "text-orange-500",
    bgColor: isDarkMode ? "bg-orange-900/10" : "bg-orange-50",
    description:
      "A teacher is scheduled to teach multiple classes during this period.",
    solution:
      "The administration will reassign teachers to resolve the scheduling conflict.",
  },
  "Concurrent Sessions": {
    symbol: "⚠️",
    color: "text-purple-500",
    bgColor: isDarkMode ? "bg-purple-900/10" : "bg-purple-50",
    description: "Multiple sessions are scheduled concurrently for this class.",
    solution:
      "The timetable coordinator will review and adjust the session timings.",
  },
};
  const formatSessionTime = (sessionGroup) => {
    const sessionTimes = {
      AM: "9:00 AM - 12:00 PM",
      PM: "1:00 PM - 4:00 PM",
      EVE: "6:00 PM - 9:00 PM",
    };
    return sessionTimes[sessionGroup] || sessionGroup;
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleErrorExpand = (index) => {
    setExpandedErrors((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderTeacherError = (error, index, isExpanded) => {
    const { symbol, color, bgColor, description, solution } =
      teacherErrorTypeDetails[error.type] || {};

    return (
      <div
        key={index}
        className={`rounded-lg border ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        } ${bgColor} transition-all duration-200 hover:shadow-md`}
      >
        <button
          className="w-full p-3 cursor-pointer flex items-center justify-between"
          onClick={() => toggleErrorExpand(index)}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{symbol}</span>
            <div className="text-left">
              <h3 className="text-sm font-semibold">{error.type}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={12} className="opacity-60" />
                <p className="text-xs opacity-75">
                  {formatSessionTime(error.sessionGroup)}
                </p>
              </div>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <div
            className={`p-3 border-t ${
              isDarkMode
                ? "border-gray-800 bg-gray-800/50"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div
              className={`p-2 rounded-md mb-2 text-xs ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } ${color}`}
            >
              <p>{description}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-[auto,1fr] gap-2">
                <span className="font-medium">Session:</span>
                <span>{formatSessionTime(error.sessionGroup)}</span>

                {error.type === "Unqualified Teacher" && (
                  <>
                    <span className="font-medium">Course:</span>
                    <span>{error.subject}</span>
                    <span className="font-medium">Staff:</span>
                    <span>{error.teachers.map((t) => t.name).join(", ")}</span>
                  </>
                )}
                {error.type === "Room Conflict" && (
                  <>
                    <span className="font-medium">Location:</span>
                    <span>{error.room}</span>
                    <span className="font-medium">Instructors:</span>
                    <span>{error.teachers.map((t) => t.name).join(", ")}</span>
                  </>
                )}
                {error.type === "Class Conflict" && (
                  <>
                    <span className="font-medium">Class:</span>
                    <span>{error.class}</span>
                    <span className="font-medium">Instructors:</span>
                    <span>{error.teachers.map((t) => t.name).join(", ")}</span>
                  </>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-dashed border-gray-700/50">
                <p className="font-medium mb-1">Suggested Resolution:</p>
                <p className="italic opacity-75">{solution}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

const renderStudentError = (error, index, isExpanded) => {
  const { symbol, color, bgColor, description, solution } =
    studentErrorTypeDetails[error.type] || {};

  return (
    <div
      key={index}
      className={`rounded-lg border ${
        isDarkMode ? "border-gray-800" : "border-gray-100"
      } ${bgColor} transition-all duration-200 hover:shadow-md`}
    >
      <button
        className="w-full p-3 cursor-pointer flex items-center justify-between"
        onClick={() => toggleErrorExpand(index)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{symbol}</span>
          <div className="text-left">
            <h3 className="text-sm font-semibold">{error.type}</h3>
            {error.sessionGroup && (
              <div className="flex items-center gap-2 mt-1">
                <Clock size={12} className="opacity-60" />
                <p className="text-xs opacity-75">
                  {`Session ${error.sessionGroup}`}
                </p>
              </div>
            )}
            {error.period && (
              <div className="flex items-center gap-2 mt-1">
                <Clock size={12} className="opacity-60" />
                <p className="text-xs opacity-75">{`Period ${error.period}`}</p>
              </div>
            )}
          </div>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div
          className={`p-3 border-t ${
            isDarkMode
              ? "border-gray-800 bg-gray-800/50"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <div
            className={`p-2 rounded-md mb-2 text-xs ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } ${color}`}
          >
            <p>{description}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-[auto,1fr] gap-2">
              {error.type === "Room Conflict" && (
                <>
                  <span className="font-medium">Room:</span>
                  <span>{error.room}</span>
                  <span className="font-medium">Conflicting Classes:</span>
                  <div className="space-y-1">
                    {error.classRooms.map((classroom, idx) => (
                      <div key={idx} className="text-xs">
                        {`${classroom.standard}-${classroom.division}`}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {error.type === "Empty Period" && (
                <>
                  <span className="font-medium">Class:</span>
                  <span>{error.class}</span>
                  <span className="font-medium">Period:</span>
                  <span>{error.period}</span>
                </>
              )}

              {error.type === "Teacher Conflict" && (
                <>
                  <span className="font-medium">Teacher:</span>
                  <span>{error.teacher}</span>
                  <span className="font-medium">Period:</span>
                  <span>{error.period}</span>
                  <span className="font-medium">Conflicting Classes:</span>
                  <div className="space-y-1">
                    {error.classRooms.map((classroom, idx) => (
                      <div key={idx} className="text-xs">
                        {`${classroom.standard}-${classroom.division}`}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {error.type === "Concurrent Sessions" && (
                <>
                  <span className="font-medium">Session Group:</span>
                  <span>{error.sessionGroup}</span>
                  <span className="font-medium">Class:</span>
                  <span>
                    {`${error.classRooms[0].standard}-${error.classRooms[0].division}`}
                  </span>
                  <span className="font-medium">Concurrent Sessions:</span>
                  <div className="space-y-1">
                    {error.sessions.map((session, idx) => (
                      <div key={idx} className="text-xs">
                        {session.subject}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-dashed border-gray-700/50">
              <p className="font-medium mb-1">Suggested Resolution:</p>
              <p className="italic opacity-75">{solution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  return (
    <div
      className={`max-w-2xl mx-auto rounded-xl shadow-lg font-sans transition-colors duration-300 w-full h-full ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <h2 className="text-base font-medium">Schedule Alerts </h2>
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-500">
            {errors.length} issues found
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="p-3 space-y-2 h-full max-h-full overflow-y-auto">
        {errors.map((error, index) => {
          const isExpanded = expandedErrors[index];
          return viewType === "teacher"
            ? renderTeacherError(error, index, isExpanded)
            : renderStudentError(error, index, isExpanded);
        })}
      </div>
    </div>
  );
};

export default ErrorDisplay;
