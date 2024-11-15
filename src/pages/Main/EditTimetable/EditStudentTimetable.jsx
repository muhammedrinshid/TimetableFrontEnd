import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { Loadings } from "../../../components/common";
import ErrorDisplay from "./EditTeacherTimetable/ErrorDisplay";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from "react-icons/tfi";
import StudentDraggableTimetable from "./EditStudentTimetable/StudentDraggableTimetable.jsx";
import EditStudentTimetableControlePanel from "./EditStudentTimetable/EditStudentTimetableControlePanel.jsx";
import ChangeOrSwapSessionDialog from "./EditStudentTimetable/ChangeOrSwapSessionDialog.jsx";
import StudentViewRoomChangeDialog from "./EditStudentTimetable/StudentViewRoomChangeDialog.jsx";
import StudentViewTeacherChangeDialog from "./EditStudentTimetable/StudentViewTeacherChangeDialog.jsx";


const EditStudentTimetable = ({ timeTableId }) => {
  const { apiDomain, headers } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonsPerDay, setLessonsPerDay] = useState(5);
  const [loading, setLoading] = useState(true); // Loading state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentWeekTimetable, setStudentWeekTimetable] = useState({});
    //  const [
    //    studentWeekTimetable,
    //    { set: setStudentWeekTimetable, undo, redo, canUndo, canRedo },
    //  ] = useUndo({
    //    MON: [],
    //    TUE: [],
    //    WED: [],
    //    THU: [],
    //    FRI: [],
    //    SAT: [],
    //    SUN: [],
    //  }  );

  const [changeOrSwapSessionDialog, setChangeOrSwapSessionDialog] = useState({
    isOpen: false,
    classroomId: null,
    sessionGrpIndex: null,
    session: null,
    dayOfWeek:null
  });
    const [roomChangeDialogOpen, setRoomChangeDialogOpen] = useState({
      isOpen: false,
      fromRoom: null,
      toRoom: null,
      type: null,
      selectedSessionForRoomNumber:null,
    });
    const [teacherChangeDialogOpen, setTeacherChangeDialogOpen] = useState({
      isOpen: false,
      fromTeacher: null,
      toTeacher: null,
      type: null,
      selectedSessionForTeacherChange:null,
      fromSubject:null,
      sessionKey:null,
    });
  const fetchStudentTimetable = async () => {
    setLoading(true); // Set loading to true before fetching

    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/edit-student-week-timetable/${timeTableId}/`,
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
  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/room/rooms/`, {
        headers,
      });
      setAvailableRooms(response.data);
    } catch (err) {
      toast.error("Failed to fetch available rooms");
      console.error("Error fetching available rooms:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/teacher/teachers`, {
        headers,
      });
      setTeachers(response.data);

      // Check if response.data is empty
      if (response.data.length === 0) {
        toast.info("You have no teachers. Create teacher to proceed.");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Error fetching teachers");
    }
  };
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  useEffect(() => {
    fetchStudentTimetable();
      fetchAvailableRooms();
      fetchTeachers()
  }, [timeTableId]);

  const days = Object.keys(studentWeekTimetable).map((day) => day);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const openChangeOrSwapSessionDialog = (
    classroomId,
    sessionGrpIndex,
    session,
    dayOfWeek
  ) => {
    console.log(session)
    if (
      session.type === "Core" &&
      session.class_distribution.length === 1
    ) {
      // Update state to open the dialog and set parameters
      setChangeOrSwapSessionDialog({
        isOpen: true,
        classroomId,
        sessionGrpIndex,
        session,
        dayOfWeek,
      });
    }
  };


   const closeChangeOrSwapSessionDialog = () => {
     // Reset state to close the dialog and clear parameters
     setChangeOrSwapSessionDialog({
       isOpen: false,
       classroomId: null,
       sessionGrpIndex: null,
       session: null,
       dayOfWeek:null,
     });
   };
  const handleOpenRoomChangeDialog = (
    classroomId,
    sessionGrpIdx,
    sessionKey,
    room,
  ) => {
    const newValue = {
      isOpen: true,
      selectedSessionForRoomNumber: sessionGrpIdx,
      fromRoom: {
        classroomId: classroomId,
        sessionGrpIdx: sessionGrpIdx,
        sessionKey: sessionKey,
        room: room,
      },
      toRoom: {},
      type: null,
    };
    setRoomChangeDialogOpen(newValue);
  };
  const handleOpenTeacherChangeDialog = (
    fromTeacherId,
    sessionGrpIdx,
    sessionKey,
    subject
  ) => {
    const newValue = {
      isOpen: true,
      selectedSessionForTeacherChange: sessionGrpIdx,
      fromTeacher: fromTeacherId,
      toTeacher: null,
      sessionKey: sessionKey,
      fromSubject: subject,
      type: null,
    };
    setTeacherChangeDialogOpen(newValue);
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
        <EditStudentTimetableControlePanel
          days={days}
          handleDayChange={handleDayChange}
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          selectedDay={selectedDay}
          timeTableId={timeTableId}
          // canRedo={canRedo}
          // canUndo={canUndo}
          // onRedo={redo}
          // onUndo={undo}
          conflicts={conflicts}
          studentWeekTimetable={studentWeekTimetable}
        />
        <StudentDraggableTimetable
          selectedDay={selectedDay}
          setStudentWeekTimetable={setStudentWeekTimetable}
          NumberOfPeriodsInAday={lessonsPerDay}
          studentWeekTimetable={studentWeekTimetable}
          searchTerm={searchTerm}
          conflicts={conflicts}
          setConflicts={setConflicts}
          openChangeOrSwapSessionDialog={openChangeOrSwapSessionDialog}
          handleOpenRoomChangeDialog={handleOpenRoomChangeDialog}
          handleOpenTeacherChangeDialog={handleOpenTeacherChangeDialog}
        />
      </div>

      {/* Right Panels with smooth collapse/expand */}

      {!isCollapsed && (
        <div
          className={`col-start-2 col-end-3 row-start-1 row-end-3 transition-[max-width] duration-500 ease-in-out overflow-hidden pb-3 w-full h-full`}
        >
          <ErrorDisplay errors={conflicts} viewType={"student"} />
        </div>
      )}

      <ChangeOrSwapSessionDialog
        open={changeOrSwapSessionDialog.isOpen}
        onClose={closeChangeOrSwapSessionDialog}
        classroomId={changeOrSwapSessionDialog.classroomId}
        sessionGrpIndex={changeOrSwapSessionDialog.sessionGrpIndex}
        session={changeOrSwapSessionDialog.session}
        dayOfWeek={changeOrSwapSessionDialog.dayOfWeek}
        studentWeekTimetable={studentWeekTimetable}
        setStudentWeekTimetable={setStudentWeekTimetable}
      />
      <StudentViewRoomChangeDialog
        open={roomChangeDialogOpen.isOpen}
        onClose={() =>
          setRoomChangeDialogOpen({
            isOpen: false,
            fromRoom: null,
            toRoom: null,
            type: null,
            selectedSessionForRoomNumber: null,
          })
        }
        availableRooms={availableRooms}
        studentWeekTimetable={studentWeekTimetable}
        selectedDay={selectedDay}
        roomChangeDialogOpen={roomChangeDialogOpen}
        setRoomChangeDialogOpen={setRoomChangeDialogOpen}
        setStudentWeekTimetable={setStudentWeekTimetable}
      />
      <StudentViewTeacherChangeDialog
        open={teacherChangeDialogOpen.isOpen}
        onClose={() =>
          setTeacherChangeDialogOpen({
            isOpen: false,
            fromTeacher: null,
            toTeacher: null,
            type: null,
            selectedSessionForTeacherChange: null,
            sessionKey: null,
            fromSubject: null,
          })
        }
        availableTeachers={teachers}
        studentWeekTimetable={studentWeekTimetable}
        selectedDay={selectedDay}
        teacherChangeDialogOpen={teacherChangeDialogOpen}
        setTeacherChangeDialogOpen={setTeacherChangeDialogOpen}
        setStudentWeekTimetable={setStudentWeekTimetable}
      />
    </div>
  );
};

export default EditStudentTimetable;
