import React, { useState } from "react";
import {
  Calendar,
  Search,
  LayoutGrid,
  Edit,
  Undo2,
  Redo2,
  Save,
  AlertTriangle,
  Users,
  User,
  BookOpen,
  HomeIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/Authcontext";
import { Clock } from "@mui/x-date-pickers/ClockPicker/Clock";



const formatSessionTime = (sessionGroup) => {
  const sessionTimes = {
    AM: "9:00 AM - 12:00 PM",
    PM: "1:00 PM - 4:00 PM",
    EVE: "6:00 PM - 9:00 PM",
  };
  return sessionTimes[sessionGroup] || sessionGroup;
};


const EditTeacherTimetableControlPanel = ({
  selectedDay,
  days,
  handleDayChange,
  searchTerm,
  handleSearch,
  timeTableId,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  conflicts,
  teacherWeekTimetable,
}) => {
  const { apiDomain, headers, darkMode: isDarkMode } = useAuth();
  const [showConflictDialog, setShowConflictDialog] = useState(false);



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
  const renderTeacherError = (error, index, i) => {
    const { symbol, color, bgColor, description, solution } =
      teacherErrorTypeDetails[error.type] || {};

    return (
      <div
        key={index}
        className={`rounded-lg border ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        } ${bgColor} transition-all duration-200 hover:shadow-md`}
      >
        {/* <button
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
        </button> */}

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
          </div>
        </div>
      </div>
    );
  };
  const handleProceed = () => {
    setShowConflictDialog(true);
  };

  const handleSubmit = async (force = false) => {
    try {
      const response = await axios.put(
        `${apiDomain}/api/time-table/submit-edit-teacher-week-timetable/${timeTableId}/`,
        {
          week_timetable: teacherWeekTimetable,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Timetable updates submitted successfully!");
        setShowConflictDialog(false);
      }
    } catch (error) {
      console.error(
        `Error submitting timetable updates: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(
        error.response?.data?.error ||
          "Failed to submit timetable updates. Please try again."
      );
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-md p-4 transition-all duration-300 w-full border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <select
            value={selectedDay}
            onChange={handleDayChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 appearance-none"
          >
            {days?.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="relative w-full sm:w-auto flex-grow flex items-center space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <Button
            onClick={onUndo}
            disabled={!canUndo}
            variant="outlined"
            size="small"
            sx={{
              minWidth: "42px",
              width: "42px",
              height: "42px",
              padding: "8px",
              borderRadius: "8px",
              color: "primary.main",
              borderColor: "primary.main",
            }}
          >
            <Undo2 className="w-5 h-5" />
          </Button>

          <Button
            onClick={onRedo}
            disabled={!canRedo}
            variant="outlined"
            size="small"
            sx={{
              minWidth: "42px",
              width: "42px",
              height: "42px",
              padding: "8px",
              borderRadius: "8px",
              color: "primary.main",
              borderColor: "primary.main",
            }}
          >
            <Redo2 className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => handleProceed()}
            variant="contained"
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              gap: 1,
            }}
          >
            {conflicts?.length > 0 && <AlertTriangle className="w-5 h-5" />}
            <Save className="w-5 h-5" />
            <span>Submit Changes</span>
          </Button>

          {timeTableId !== null && (
            <Link
              to={`/edit-timetable/student/${timeTableId}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "secondary.main",
                  "&:hover": {
                    bgcolor: "secondary.dark",
                  },
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  gap: 1,
                }}
              >
                <Edit className="w-5 h-5" />
                <span>Edit Students Schedule</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Dialog
        open={showConflictDialog}
        onClose={() => setShowConflictDialog(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            {conflicts?.length > 0 ? (
              <>
                <AlertTriangle className="text-red-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Schedule Conflicts Detected
                </h2>
              </>
            ) : (
              <>
                <CheckCircle className="text-green-500 mr-2" />
                <h2 className="text-lg font-semibold text-green-500">
                  Finalization Successful
                </h2>
              </>
            )}
          </div>

          <div className="px-4 py-4">
            {conflicts?.length > 0 ? (
              <div className="space-y-4">
                {conflicts?.map((conflict, index) =>
                  renderTeacherError(conflict, index)
                )}
              </div>
            ) : (
              <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-400 rounded-lg">
                <AlertCircle className="text-amber-600 dark:text-amber-300 h-5 w-5 mr-3" />
                <div>
                  <h2 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Proceed with Caution
                  </h2>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Are you sure you want to update this timetable? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-x-3">
            <button
              onClick={() => setShowConflictDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit Anyway
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EditTeacherTimetableControlPanel;
