import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../../context/Authcontext";
import TeacherTimeTableComponent from "../saved Time tables/TimeTableforTeacher";
import StudentTimeTableComponent from "../saved Time tables/TimeTableforStudent";
import TimetableControlPanel from "./TimetableControlPanel";
import TimetableScoreDisplay from "./TimetableScoreDisplay";
import { Loadings } from "../../common";

const GeneratedTimeTableViewer = ({ timeTableId, generatedTimetableScore }) => {
  const { headers, apiDomain } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleViewToggle = () => {
    setIsTeacherView(!isTeacherView);
  };

    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

  const fetchTeacherTimetable = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/teacher-view-week/${timeTableId}/`,
        { headers }
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
        `${apiDomain}/api/time-table/student-view-week/${timeTableId}/`,
        { headers }
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

  useEffect(() => {
    const fetchData = async () => {
      if (timeTableId) {
        setIsLoading(true);
        await Promise.all([fetchTeacherTimetable(), fetchStudentTimetable()]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeTableId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loadings.ThemedMiniLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  ">
      <TimetableScoreDisplay scores={generatedTimetableScore} />

      <TimetableControlPanel
        selectedDay={selectedDay}
        days={days}
        handleDayChange={handleDayChange}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        isTeacherView={isTeacherView}
        handleViewToggle={handleViewToggle}
      />

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

export default GeneratedTimeTableViewer;
