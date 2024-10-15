import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import DraggableTeacherTimetable from "./EditTeacherTimetable/DraggableTeacherTimetable";
import { Loadings } from "../../../components/common";
import EditTeacherTimetableControlePanel from "./EditTeacherTimetable/EditTeacherTimetableControlePanel";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from "react-icons/tfi";
import ErrorDisplay from "./EditTeacherTimetable/ErrorDisplay";

const EditTeacherTimetable = ({ timeTableId }) => {
  const { apiDomain, headers } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsPerDay, setLessonsPerDay] = useState(5);
  const [loading, setLoading] = useState(true); // Loading state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conflicts, setConflicts] = useState([]);

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
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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
    <div
      className={`grid grid-rows-[1fr_4fr] box-border gap-4 h-full w-full overflow-hidden pr-5 transition-all relative`}
    >
      <div
        className="absolute top-1/2 -right-0 m-2 px-1 py-3 bg-opacity-65    "
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <TfiAngleDoubleLeft size={16} />
        ) : (
          <TfiAngleDoubleRight size={16} />
        )}
      </div>
      {/* Large Left Panel */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 p-3 overflow-hidden ">
        <EditTeacherTimetableControlePanel
          days={days}
          handleDayChange={handleDayChange}
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          selectedDay={selectedDay}
          timeTableId={timeTableId}
        />
        <DraggableTeacherTimetable
          selectedDay={selectedDay}
          setTeacherWeekTimetable={setTeacherWeekTimetable}
          NumberOfPeriodsInAday={lessonsPerDay}
          teacherTimetable={teacherWeekTimetable[selectedDay]}
          searchTerm={searchTerm}
          conflicts={conflicts}
          setConflicts={setConflicts}
        />
        {/* Collapse/Expand Icon Button */}
      </div>

      {/* Right Panels with smooth collapse/expand */}
      <div
        className={`col-start-2 col-end-3 row-start-1 row-end-3 transition-[max-width] duration-500 ease-in-out overflow-hidden  pb-3${
          isCollapsed ? "max-w-0" : "max-w-[300px]" // Use 'max-w' for smooth transitions
        }`}
      >
        <div className=" row-start-1 row-end-2 h-full">
          <ErrorDisplay errors={conflicts}/>
        </div>
        <div className="bg-green-500 row-start-2 row-end-3 h-full">
          Row 2, Column 2 (2fr Width, 4fr Height)
        </div>
      </div>
    </div>
  );

};

export default EditTeacherTimetable;
