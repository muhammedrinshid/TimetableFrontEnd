import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/Authcontext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Loadings } from '../../../components/common';
import ErrorDisplay from './EditTeacherTimetable/ErrorDisplay';
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from 'react-icons/tfi';
import StudentDraggableTimetable from './EditStudentTimetable/StudentDraggableTimetable.jsx';

const EditStudentTimetable = ({ timeTableId }) => {
  const { apiDomain, headers } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsPerDay, setLessonsPerDay] = useState(5);
  const [loading, setLoading] = useState(true); // Loading state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});

  const fetchStudentTimetable = async () => {
    setLoading(true); // Set loading to true before fetching

    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/default-student-view-week/`,
        {
          headers,
        }
      );
      setStudentWeekTimetable(response.data.week_timetable);
      setLessonsPerDay(response.data.lessons_per_day);
    } catch (error) {
      console.error(
        `Error fetching student timetable: ${
          error.response?.status || "Network error"
        }. ${error.message}`
      );
      toast.error(`Failed to load student timetable. Please try again.`);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  useEffect(() => {
    fetchStudentTimetable();
  }, [timeTableId]);

  const days = Object.keys(studentWeekTimetable).map((day) => day);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
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
      className={`grid grid-rows-[3fr_2fr] grid-cols-[3fr_1fr] box-border gap-4 h-full w-full overflow-hidden pr-5 transition-all relative`}
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
        {/* Collapse/Expand Icon Button */}
      </div>
      {/* Large Left Panel */}
      <div
        className={`col-start-1 col-end-2 row-start-1 row-end-3 p-3 overflow-hidden ${
          isCollapsed ? "col-end-3" : ""
        } `}
      >
        <StudentDraggableTimetable
          selectedDay={selectedDay}
          setStudentWeekTimetable={setStudentWeekTimetable}
          NumberOfPeriodsInAday={lessonsPerDay}
          studentWeekTimetable={studentWeekTimetable}
          searchTerm={searchTerm}
          conflicts={conflicts}
          setConflicts={setConflicts}
        
        
        />
      </div>

      {/* Right Panels with smooth collapse/expand */}

      {!isCollapsed && (
        <>
          <div
            className={`col-start-2 col-end-3 row-start-1 row-end-2 transition-[max-width] duration-500 ease-in-out overflow-hidden pb-3 w-full h-full`}
          >
            <ErrorDisplay errors={conflicts} />
          </div>
          <div className=" col-start-2 col-end-3 row-start-2 row-end-3 h-full overflow-hidden pb-2"></div>
        </>
      )}
    </div>
  );};

export default EditStudentTimetable