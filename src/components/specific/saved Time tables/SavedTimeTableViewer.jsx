import React, { useEffect, useState } from "react";
import TeacherTimeTableComponent from "./TimeTableforTeacher";

import { toast } from "react-toastify";
import {

    Typography,
  
    Switch,
    FormControlLabel,
 
  } from "@mui/material";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import StudentTimeTableComponent from "./TimeTableforStudent";
import { weeklyTimetablestudent } from "../../../assets/datas/studentTimetable";
  
const SavedTimeTableViewer = ({}) => {
    const {headers,apiDomain}=useAuth()

  const [selectedDay, setSelectedDay] = useState("MON");
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };
  useEffect(() => {
    const fetchTimetable = async (view, setTimetable) => {
      try {
        const response = await axios.get(`${apiDomain}/api/time-table/${view}/`, {
          headers,
        });
        setTimetable(response.data);
      } catch (error) {
        console.error(`Error fetching ${view}:`, error);
        toast.error(`Failed to load ${view.replace('-', ' ')}. Please try again.`);
      }
    };
  
    fetchTimetable("teacher-view-week", setTeacherWeekTimetable);
    fetchTimetable("student-view-week", setStudentWeekTimetable);
  }, []);
  return (
    <div className="mt-8">
      <div className="w-full flex justify-between items-center mb-4">
        <Typography variant="h5" className="text-gray-800 font-bold">
          Weekly Timetable
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isTeacherView}
              onChange={handleViewToggle}
              color="primary"
            />
          }
          label={isTeacherView ? "Teacher View" : "Student View"}
        />
      </div>

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
        />
      ) : (
        <StudentTimeTableComponent
          StudentTimeTable={studentWeekTimetable[selectedDay]}
        />
        
      )}
    </div>
  );
};

export default SavedTimeTableViewer;