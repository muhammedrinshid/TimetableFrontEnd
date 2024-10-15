import React, { useState } from "react";
import { AlertTriangle, Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";

const ErrorDisplay = ({ errors }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedErrors, setExpandedErrors] = useState({});

  const errorTypeDetails = {
    "Unqualified Teacher": {
      symbol: "❌",
      color: "text-red-500",
      bgColor: isDarkMode ? "bg-red-900/20" : "bg-red-100",
      description: "The assigned teacher lacks the necessary qualifications for this subject. This could lead to subpar instruction and potential accreditation issues.",
      solution: "Review the teacher's credentials and reassign a qualified instructor for this subject.",
    },
    "Room Conflict": {
      symbol: "🚪",
      color: "text-yellow-500",
      bgColor: isDarkMode ? "bg-yellow-900/20" : "bg-yellow-100",
      description: "Multiple classes are scheduled in the same room at overlapping times. This will cause disruption and confusion for students and teachers.",
      solution: "Relocate one of the conflicting classes to an available room or adjust the class schedule.",
    },
    "Class Conflict": {
      symbol: "📚",
      color: "text-orange-500",
      bgColor: isDarkMode ? "bg-orange-900/20" : "bg-orange-100",
      description: "A student or teacher is scheduled for multiple classes at the same time. This makes it impossible for them to attend all assigned sessions.",
      solution: "Adjust the class schedule to eliminate overlaps. For elective conflicts, consider offering alternative time slots.",
    },
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleErrorExpand = (index) => {
    setExpandedErrors(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={`max-w-3xl mx-auto rounded-lg shadow-custom-3 font-Inter text-sm transition-colors duration-300 overflow-hidden ${
      isDarkMode ? "bg-dark-background text-dark-text" : "bg-white text-gray-800"
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <AlertTriangle className="mr-2 text-red-500" size={24} />
          <h2 className="text-xl font-semibold">Scheduling Conflicts</h2>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {errors.map((error, index) => {
          const { symbol, color, bgColor, description, solution } = errorTypeDetails[error.type] || {};
          const isExpanded = expandedErrors[index];
          return (
            <div
              key={index}
              className={`rounded-md overflow-hidden transition-all duration-300 ${bgColor}`}
            >
              <div 
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleErrorExpand(index)}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${color} text-2xl`}>{symbol}</span>
                  <div>
                    <h3 className="font-bold text-lg">{error.type}</h3>
                    <p className="text-sm opacity-80">Session {error.session}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {isExpanded && (
                <div className={`p-4 ${isDarkMode ? "bg-dark-secondary" : "bg-white"}`}>
                  <p className="mb-3 text-sm">{description}</p>
                  <div className="mb-3 text-sm">
                    <h4 className="font-semibold mb-1">Details:</h4>
                    {error.type === "Unqualified Teacher" && (
                      <>
                        <p><strong>Subject:</strong> {error.subject}</p>
                        <p><strong>Teacher(s):</strong> {error.teachers.map((t) => t.name).join(", ")}</p>
                      </>
                    )}
                    {error.type === "Room Conflict" && (
                      <>
                        <p><strong>Room:</strong> {error.room}</p>
                        <p><strong>Conflicting Teachers:</strong> {error.teachers.map((t) => t.name).join(", ")}</p>
                      </>
                    )}
                    {error.type === "Class Conflict" && (
                      <>
                        <p><strong>Class:</strong> {error.class}</p>
                        <p><strong>Conflicting Teachers:</strong> {error.teachers.map((t) => t.name).join(", ")}</p>
                        {error.isElectiveConflict && (
                          <p className="mt-1 font-semibold text-dark-warning">⚠️ This involves an elective course</p>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Recommended Action:</h4>
                    <p className="text-sm italic">{solution}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ErrorDisplay;