import React, { useEffect, useState } from "react";
import TeacherTimeTableComponent from "./TimeTableforTeacher";

import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import StudentTimeTableComponent from "./TimeTableforStudent";
import TimetableControlPanel from "../BuildSchedule/TimetableControlPanel";
import { Loadings } from "../../common";
import AbbreviatedSavedTimetableViewerDialog from "./AbbreviatedSavedTimetableViewerDialog";
import { FaFileDownload } from "react-icons/fa";
import { Tooltip } from "recharts";

const SavedTimeTableViewer = ({ timeTableId }) => {
  const { headers, apiDomain, user } = useAuth();

  const [selectedDay, setSelectedDay] = useState("MON");
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
  const [studentCondensedTimetable, setStudentCondensedTimetable] = useState(
    {}
  );
  const [studentTimetableDaySchedules, setStudentTimetableDaySchedules] =
    useState([]);
  const [teacherTimetableDaySchedules, setTeacherTimetableDaySchedules] =
    useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTimetableLoading, setIsTimetableLoading] = useState(false);
  const [
    isAbbreviatedSavedTimetableViewerDialogIsOpen,
    setIsAbbreviatedSavedTimetableViewerDialogIsOpen,
  ] = useState(false);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };
  const fetchTeacherTimetable = async () => {
    setIsTimetableLoading(true);
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-teacher-view-week/`,
        {
          headers,
        }
      );
      setTeacherWeekTimetable(response.data?.week_timetable);
      setTeacherTimetableDaySchedules(response.data?.day_schedules);
    } catch (error) {
      const errorMessage = error.response
        ? `Error fetching teacher timetable: ${error.response.status}. ${
            error.response.data?.message || error.message
          }`
        : `Network error. ${error.message}`;
      console.error(errorMessage);
      toast.error("Failed to load teacher timetable. Please try again.");
    } finally {
      setIsTimetableLoading(false);
    }
  };

  const fetchStudentTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-student-view-week/`,
        {
          headers,
        }
      );
      setStudentWeekTimetable(response.data.week_timetable);
      setStudentTimetableDaySchedules(response?.data?.day_schedules);
    } catch (error) {
      console.error(
        `Error fetching student timetable: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(`Failed to load student timetable. Please try again.`);
    }
  };
  const fetchStudentCondensedTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-student-condensed-view-week/`,
        {
          headers,
        }
      );

      if (response.data && response.data.timetable) {
        setStudentCondensedTimetable(response.data.timetable);
        toast.success(
          response.data.message || "Timetable retrieved successfully"
        );
      } else {
        toast.warning("No timetable data found");
      }
    } catch (error) {
      console.error("Timetable fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to retrieve timetable. Please try again."
      );
    } finally {
    }
  };
  // Usage in a React component
  useEffect(() => {
    fetchTeacherTimetable();
    fetchStudentTimetable();
    fetchStudentCondensedTimetable();
  }, []);

  const days = teacherTimetableDaySchedules
    ? teacherTimetableDaySchedules.map(
        (teacherTimetableDaySchedule) => teacherTimetableDaySchedule.day
      )
    : [];
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const openAbbreviateTimetableViewerDialogTimetableDialog = () =>
    setIsAbbreviatedSavedTimetableViewerDialogIsOpen(true);
  const closeAbbreviateTimetableViewerDialogTimetableDialog = () =>
    setIsAbbreviatedSavedTimetableViewerDialogIsOpen(false);

  const handleDownloadStudentTimetable = async (isPdf = false) => {
    try {
      const file_type = isPdf ? "pdf" : "xlsx";
      const response = await axios.get(
        `${apiDomain}/api/time-table/download-whole-classroom-timetable/?file_type=${file_type}`,
        {
          headers,
          responseType: "blob",
          // params: { format },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${user.name}student_timetable.${file_type}` // Remove the trailing slash
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Timetable downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download timetable. Please try again.");
    }
  };
  return (
    <div className="mt-8">
      <TimetableControlPanel
        selectedDay={selectedDay}
        days={days}
        handleDayChange={handleDayChange}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        isTeacherView={isTeacherView}
        handleViewToggle={handleViewToggle}
        timeTableId={timeTableId}
      />
      <button             onClick={handleDownloadStudentTimetable}
      >
        View Abbreviated Timetable
      </button>
        <Tooltip title={"Download Time Table File"}>
          <button
            onClick={handleDownloadStudentTimetable}
            className="  p-4 bg-primary hover:bg-primary-dark bg-light-primary rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Add new subject"
          >
            <FaFileDownload className="w-6 h-6 text-white" />
            dfa
          </button>
        </Tooltip>

      <div className="w-full flex justify-center mb-4">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`px-4 py-2 text-sm font-medium border ${
              selectedDay === day
                ? "bg-light-primaryShades-800 text-white border-light-primaryShades-600 dark:border-dark-primaryShades-700 hover:bg-light-primaryShades-700 dark:bg-dark-primaryShades-700"
                : "bg-white text-light-primaryShades-800 border-light-primaryShades-300 dark:border-dark-primaryShades-800 hover:bg-light-primaryShades-400 hover:text-blue-800 dark:text-dark-primaryShades-200 dark:bg-dark-primaryShades-600"
            } focus:z-10 focus:ring-2 focus:ring-light-primaryShades-500 focus:bg-light-primaryShades-500 focus:text-white
          first:rounded-l-lg last:rounded-r-lg
          transition-all duration-300`}
          >
            {day}
          </button>
        ))}
      </div>
      {isTimetableLoading ? (
        <Loadings.ThemedMiniLoader />
      ) : isTeacherView ? (
        <TeacherTimeTableComponent
          teacherTimetable={teacherWeekTimetable?.[selectedDay] || []}
          searchTerm={searchTerm}
          teacherTimetableDaySchedules={teacherTimetableDaySchedules?.find(
            (daySchedule) => daySchedule.day == selectedDay
          )}
        />
      ) : (
        <StudentTimeTableComponent
          studentTimeTable={studentWeekTimetable?.[selectedDay] || []}
          searchTerm={searchTerm}
          studentTimetableDaySchedules={studentTimetableDaySchedules?.find(
            (daySchedule) => daySchedule.day == selectedDay
          )}
        />
      )}
      <AbbreviatedSavedTimetableViewerDialog
        open={isAbbreviatedSavedTimetableViewerDialogIsOpen}
        onClose={closeAbbreviateTimetableViewerDialogTimetableDialog}
        studentWeekTimetable={studentCondensedTimetable}
      ></AbbreviatedSavedTimetableViewerDialog>
    </div>
  );
};

export default SavedTimeTableViewer;
