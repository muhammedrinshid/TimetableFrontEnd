import React, { useState } from "react";
import { Dialog, IconButton, styled, TextField, Tooltip } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  AddCircleOutline,
  AddIcCallTwoTone,
  EditOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import {
  AlertTriangle,
  Delete,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    padding: "8px 12px",
    borderRadius: "8px",
  },
  "& .MuiInputBase-input": {
    padding: "0px",
  },
});


const DateSelectorForDayPlanner = ({
  viewType,
  isCustomStudentTable,
  isCustomTeacherTable,
  handleDateChange,
  selectedDate,
  selectedDay,
  teacherWeekTimetable,
  activeTimetableId,
  handleSelectTimetableForDelete,
  customTimetableIds,
  refetchStudentsTimetable,
  refetchTeacherTimetable,
  studentsConflicts,
  teacherConflicts,
  studentWeekTimetable,
}) => {
  const { apiDomain, headers, logoutUser,isDarkMode } = useAuth();

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
      description:
        "Multiple sessions are scheduled concurrently for this class.",
      solution:
        "The timetable coordinator will review and adjust the session timings.",
    },
  };
  const renderStudentError = (error, index) => {

 
    const { symbol, color, bgColor, description } =
      studentErrorTypeDetails[error.type] || {};
  
    return (
      <div
        key={index}
        className={`rounded-lg border overflow-hidden ${
          isDarkMode ? "border-gray-800" : "border-gray-300"
        } ${bgColor} transition-all duration-200 hover:shadow-md`}
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
                    {`${error?.classRooms?.[0]?.standard}-${error?.classRooms?.[0]?.division}`}
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
          </div>
        </div>
      </div>
    );
  };
  
  const [showConflictDialog, setShowConflictDialog] = useState({
    isOpen: false,
    type: false,
  });
  const handleSaveDayTimetable = async () => {
    try {
      const response = await axios.post(
        `${apiDomain}/api/time-table/create-day-timetable/`,
        {
          week_timetable: teacherWeekTimetable,
        },
        {
          headers: headers,
          params: {
            date: selectedDate,
            day_of_week: selectedDay,
            active_timetable_id: activeTimetableId,
          },
        }
      );

      toast.success("Day timetable saved successfully!");
      refetchStudentsTimetable();
      refetchTeacherTimetable();
    } catch (err) {
      if (err.response) {
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            `Error occurred: ${
              err.response.data?.message || "Unexpected error"
            }`
          );
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
    }
  };

  const handleSubmitStudentTimetableEdit = async () => {
    try {
      // Prepare the request to submit the student's timetable edit for a specific day
      const response = await axios.put(
        `${apiDomain}/api/time-table/submit-custom-student-day-timetable/${customTimetableIds.day_timetable_id}/${selectedDate}/`,
        {
          day_timetable: studentWeekTimetable[selectedDay], // Assuming `studentDayTimetable` is the data to be sent
        },
        {
          headers, // Make sure you have the required headers (like authentication)
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        toast.success("Student timetable updated successfully!");
        setShowConflictDialog({ isOpen: false, type: false }); // Close the dialog or handle the UI state change accordingly
      }
    } catch (error) {
      // Handle errors gracefully
      console.error(
        `Error submitting student timetable update: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(
        error.response?.data?.error ||
          "Failed to submit timetable updates. Please try again."
      );
    }
  };

  const handleSubmitTeacherTimetableEdit = async () => {
    try {
      // Prepare the request to submit the teacher's timetable edit for a specific day
      const response = await axios.put(
        `${apiDomain}/api/time-table/submit-custom-teacher-day-timetable/${customTimetableIds?.day_timetable_id}/${selectedDate}/`,
        {
          day_timetable: teacherWeekTimetable[selectedDay], // Assuming `teacherDayTimetable` is the data to be sent
        },
        {
          headers, // Make sure you have the required headers (like authentication)
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        toast.success("Teacher timetable updated successfully!");
        refetchStudentsTimetable()
        refetchTeacherTimetable()
        setShowConflictDialog({ isOpen: false, type: false }); // Close the dialog or handle the UI state change accordingly
      }
    } catch (error) {
      // Handle errors gracefully
      console.error(
        `Error submitting teacher timetable update: ${
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
    <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-row justify-between items-center gap-2 bg-white dark:bg-dark-secondary rounded-lg px-3 py-2">
      <div className="flex-grow flex items-center overflow-hidden">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  className: "dark:text-dark-text",
                }}
                className="dark:bg-dark-secondary bg-white w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: "16px",
                    padding: "4px 8px",
                  },
                  "& .MuiInputBase-input": {
                    paddingX: "8px",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </div>

      {/* Buttons for Teacher and Student Timetables */}
      <div className="flex justify-center items-center">
        {viewType ? (
          isCustomTeacherTable ? (
            <Tooltip title="Update the teacher's timetable for the selected day">
              <IconButton
                onClick={() =>
                  setShowConflictDialog({ isOpen: true, type: true })
                }
                className="group relative overflow-hidden border border-transparent hover:border-blue-200 
            bg-blue-50/50 hover:bg-blue-50 text-blue-500 rounded-full p-2 
            transition-all duration-300 ease-in-out hover:text-blue-700
            before:content-[''] before:absolute before:inset-0 
            before:bg-blue-100 before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-20 active:before:opacity-40"
              >
                <EditOutlined className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Create a new custom day time table">
              <IconButton
                onClick={handleSaveDayTimetable}
                className="group relative overflow-hidden border border-transparent hover:border-green-200 
            bg-green-50/50 hover:bg-green-50 text-green-500 rounded-full p-2 
            transition-all duration-300 ease-in-out hover:text-green-700
            before:content-[''] before:absolute before:inset-0 
            before:bg-green-100 before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-20 active:before:opacity-40"
              >
                <AddCircleOutline className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </IconButton>
            </Tooltip>
          )
        ) : (
          isCustomStudentTable && (
            <Tooltip title="Update the student's timetable for the selected day">
              <IconButton
                onClick={() =>
                  setShowConflictDialog({ isOpen: true, type: false })
                }
                className="group relative overflow-hidden border border-transparent hover:border-blue-200 
          bg-blue-50/50 hover:bg-blue-50 text-blue-500 rounded-full p-2 
          transition-all duration-300 ease-in-out hover:text-blue-700
          before:content-[''] before:absolute before:inset-0 
          before:bg-blue-100 before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-20 active:before:opacity-40"
              >
                <EditOutlined className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </IconButton>
            </Tooltip>
          )
        )}

        {customTimetableIds?.day_timetable_id && (
          <Tooltip title="Delete this custom day timetable">
            <IconButton
              onClick={() =>
                handleSelectTimetableForDelete(
                  customTimetableIds.timetable_date_id
                )
              }
              className="group relative overflow-hidden border border-transparent hover:border-green-200 
          bg-green-50/50 hover:bg-green-50 text-green-500 rounded-full p-2 
          transition-all duration-300 ease-in-out hover:text-green-700
          before:content-[''] before:absolute before:inset-0 
          before:bg-green-100 before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-20 active:before:opacity-40"
            >
              <Delete className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Dialog
        open={showConflictDialog.isOpen}
        onClose={() => setShowConflictDialog({ isOpen: false, type: false })}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            {/* Conditional rendering based on conflicts */}
            {(showConflictDialog.type ? teacherConflicts : studentsConflicts)
              ?.length > 0 ? (
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
            {/* Conditional rendering for conflicts based on type */}
            {(showConflictDialog.type ? teacherConflicts : studentsConflicts)
              ?.length > 0 ? (
              <div className="space-y-4">
                {(showConflictDialog.type
                  ? teacherConflicts
                  : studentsConflicts
                )?.map((conflict, index) =>
                  renderStudentError(conflict, index)
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
              onClick={() =>
                setShowConflictDialog({ isOpen: false, type: false })
              }
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
             onClick={() => {
              // Check the condition and invoke the appropriate function
              if (showConflictDialog.type) {
                handleSubmitTeacherTimetableEdit();
              } else {
                handleSubmitStudentTimetableEdit();
              }
            }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {showConflictDialog.type ? "Submit Anyway" : "Submit"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DateSelectorForDayPlanner;
