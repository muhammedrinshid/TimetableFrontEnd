import React, { useEffect, useState } from "react";
import TeacherTimeTableComponent from "./TimeTableforTeacher";

import { toast } from "react-toastify";
import { Typography, Switch, FormControlLabel } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import StudentTimeTableComponent from "./TimeTableforStudent";
import TimetableControlPanel from "../BuildSchedule/TimetableControlPanel";

const SavedTimeTableViewer = ({}) => {
  const { headers, apiDomain } = useAuth();

  const [selectedDay, setSelectedDay] = useState("MON");
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
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
      setTeacherWeekTimetable(response.data);
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
      setStudentWeekTimetable(response.data);
      
      
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

  const days = Object.keys(teacherWeekTimetable).map((day) => day)
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
      />


      <div className="w-full flex justify-center mb-4">
        {Object.keys(teacherWeekTimetable).map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`px-4 py-2 text-sm font-medium border ${
              selectedDay === day
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            } focus:z-10 focus:ring-2 focus:ring-blue-500 focus:bg-blue-500 focus:text-white
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
