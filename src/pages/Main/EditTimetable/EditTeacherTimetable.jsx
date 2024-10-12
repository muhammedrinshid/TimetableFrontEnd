import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import DraggableTeacherTimetable from "./EditTeacherTimetable/DraggableTeacherTimetable";
import { Loadings } from "../../../components/common";

const EditTeacherTimetable = ({ timeTableId }) => {
  const { apiDomain, headers } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsPerDay, setLessonsPerDay] = useState(5);
  const [loading, setLoading] = useState(true); // Loading state

  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});

  const fetchTeacherTimetable = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/edit-teacher-week-timetable/${timeTableId}/`,
        { headers }
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
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  useEffect(() => {
    fetchTeacherTimetable();
  }, [timeTableId]);
  const days = Object.keys(teacherWeekTimetable).map((day) => day);
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loadings.ThemedMiniLoader />
        </div>
      );
    }
  return (
<div class="grid grid-cols-[7fr_1fr] grid-rows-[1fr_4fr] box-border gap-4 h-full w-full overflow-hidden pr-5">
  <div class="col-start-1 col-end-2 row-start-1 row-end-3 p-3 overflow-hidden"> 
    <DraggableTeacherTimetable
      selectedDay={selectedDay}
      setTeacherWeekTimetable={setTeacherWeekTimetable}
      NumberOfPeriodsInAday={lessonsPerDay}
      teacherTimetable={teacherWeekTimetable[selectedDay]}
    />
  </div>
  <div class="bg-blue-500 col-start-2 col-end-3 row-start-1 row-end-2">
    Row 1, Column 2 (2fr Width, 1fr Height)
  </div>
  <div class="bg-green-500 col-start-2 col-end-3 row-start-2 row-end-3">
    Row 2, Column 2 (2fr Width, 4fr Height)
  </div>
</div>

  );
};

export default EditTeacherTimetable;
