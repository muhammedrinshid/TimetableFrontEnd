import React, { useEffect, useState } from "react";
import TeacherTimeTableComponent from "./TimeTableforTeacher";

import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import StudentTimeTableComponent from "./TimeTableforStudent";
import TimetableControlPanel from "../BuildSchedule/TimetableControlPanel";

const SavedTimeTableViewer = ({ timeTableId }) => {
  const { headers, apiDomain } = useAuth();

  const [selectedDay, setSelectedDay] = useState("MON");
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
  const [lessonsPerDay, setLessonsPerDay] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };
  const fetchTeacherTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-teacher-view-week/`,
        {
          headers,
        }
      );
      setTeacherWeekTimetable(response.data.week_timetable);
      setLessonsPerDay(response.data.lessons_per_day);
    } catch (error) {
      console.error(
        `Error fetching teacher timetable: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(`Failed to load teacher timetable. Please try again.`);
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
    } catch (error) {
      console.error(
        `Error fetching student timetable: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(`Failed to load student timetable. Please try again.`);
    }
  };

  // Usage in a React component
  useEffect(() => {
    fetchTeacherTimetable();
    fetchStudentTimetable();
  }, []);

  const days = Object.keys(teacherWeekTimetable).map((day) => day);
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

      <div className="w-full flex justify-center mb-4">
        {Object.keys(teacherWeekTimetable).map((day) => (
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

      {isTeacherView ? (
        <TeacherTimeTableComponent
          teacherTimetable={teacherWeekTimetable[selectedDay]}
          searchTerm={searchTerm}
        />
      ) : (
        <StudentTimeTableComponent
          StudentTimeTable={studentWeekTimetable[selectedDay]}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default SavedTimeTableViewer;
