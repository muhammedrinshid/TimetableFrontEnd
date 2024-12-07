import React, {  useState } from "react";
import { CiSearch } from "../../assets/icons";
import { Loadings, ToggleButton } from "../../components/common";
import TeacherAttendanceStatus from "../../components/specific/DayPlanner/TeacherAttendanceStatus";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Authcontext";
import { motion } from "framer-motion";
import DraggableTeacherTimetable from "./EditTimetable/EditTeacherTimetable/DraggableTeacherTimetable";
import StudentDraggableTimetable from "./EditTimetable/EditStudentTimetable/StudentDraggableTimetable";
import ErrorDisplay from "./EditTimetable/EditTeacherTimetable/ErrorDisplay";
import RoomChangeDialog from "./EditTimetable/EditTeacherTimetable/RoomChangeDialog";
import StudentViewTeacherChangeDialog from "./EditTimetable/EditStudentTimetable/StudentViewTeacherChangeDialog";
import OverflowSessionsHandleDialog from "./EditTimetable/EditStudentTimetable/OverflowSessionsHandleDialog";
import StudentViewRoomChangeDialog from "./EditTimetable/EditStudentTimetable/StudentViewRoomChangeDialog";
import ChangeOrSwapSessionDialog from "./EditTimetable/EditStudentTimetable/ChangeOrSwapSessionDialog";
import DateSelectorForDayPlanner from "../../components/specific/DayPlanner/DateSelectorForDayPlanner";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";





const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



const DayPlanner = () => {
  const today = new Date();
  const { apiDomain, headers } = useAuth();




  // 1.  states
  const [teacherChangeDialogOpen, setTeacherChangeDialogOpen] = useState({
    isOpen: false,
    fromTeacher: null,
    toTeacher: null,
    type: null,
    selectedSessionForTeacherChange: null,
    fromSubject: null,
    sessionKey: null,
  });
  const [teacherConflicts, setteacherConflicts] = useState([]);
  const [studentsConflicts, setStudentsConflicts] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [changeOrSwapSessionDialog, setChangeOrSwapSessionDialog] = useState({
    isOpen: false,
    classroomId: null,
    sessionGrpIndex: null,
    session: null,
    dayOfWeek: null,
  });
  const [activeTimetableId, setActiveTimetableId] = useState(null);

  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState([]);
  const [selectedSessionForRoomNumber, setSelectedSessionForRoomNumber] =
    useState(0);
  const [capitalizedDay, setCapitalizedDay] = useState(
    getCapitalizedDay(today)
  );
  const [studentWeekTimetable, setStudentWeekTimetable] = useState([]);
  const [customTimetableIds, setCustomTimetableIds] = useState({
    timetable_date_id: null,
    day_timetable_id: null,
  });
  const [teacherTimetableDaySchedules, setTeacherTimetableDaySchedules] =
    useState([]);
  const [studentrTimetableDaySchedules, setStudentTimetableDaySchedules] =
    useState([]);
  const [roomStudentChangeDialogOpen, setRoomStudentChangeDialogOpen] =
    useState({
      isOpen: false,
      fromRoom: null,
      toRoom: null,
      type: null,
    });
  const [roomChangeDialogOpen, setRoomChangeDialogOpen] = useState({
    isOpen: false,
    fromRoom: null,
    toRoom: null,
    type: null,
  });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const [
    overflowSessionsHandleDialogState,
    overflowSessionsHandleDialogSetState,
  ] = useState({
    open: false,
    classroomId: null,
    selectedDay: null,
    sessionGrpIndex: null,
    overflowSessions: [],
  });
  const [viewType, setViewType] = useState(true);
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [teachers, setTeachers] = useState([]);
  const [isCustomTeacherTable, setIsCustomTeacherTable] = useState(false);
  const [isCustomStudentTable, setIsCustomStudentTable] = useState(false);
  const [isDeleteDayTimetableForm, setIsDeleteDayTimetableForm] = useState(null);







  // 2. data fetching functions for side effects
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/teacher/teachers`, {
        headers,
      });

      if (response.data.length === 0) {
        toast.info("You have no teachers. Create teacher to proceed.");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Error fetching teachers");
      throw error;
    }
  };

  const fetchTeacherWeekTimetable = async (day) => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/teacher-view-day/${day}/`,
        { headers }
      );

      return {
        timetable: { [capitalizedDay]: response.data?.day_timetable },
        activeTimetableId: response.data?.active_timetable_id,
        daySchedules: response.data?.day_schedules,
        isCustomTimetable: response.data?.is_custom_timetable,
        customTimetableIds: response.data?.custom_timetable_id,
      };
    } catch (error) {
      console.error(`Error fetching teacher timetable:`, error);
      toast.error(`Failed to load teacher timetable. Please try again.`);
      throw error;
    }
  };

  const fetchStudentWeekTimetable = async (day) => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/student-view-day/${day}/`,
        { headers }
      );

      return {
        timetable: { [capitalizedDay]: response.data?.day_timetable },
        daySchedules: response.data?.day_schedules,
        isCustomTimetable: response.data?.is_custom_timetable,
        customTimetableIds: response.data?.custom_timetable_id,
      };
    } catch (error) {
      console.error(`Error fetching student timetable:`, error);
      toast.error(`Failed to load student timetable. Please try again.`);
      throw error;
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/room/rooms/`, {
        headers,
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch available rooms");
      console.error("Error fetching available rooms:", err);
      throw err;
    }
  };


  // 3. useQuery for data fetching


  // Teachers  Query

  const {
    data: fetchedTeachers,
    error: teachersError,
    isLoading: teachersLoading,
    refetch: refetchTeachers,
  } = useQuery("teachers", fetchTeachers, {
    staleTime:0,

    onSuccess: (data) => setTeachers(data),
    onError: () => setTeachers([]),
  });

  // Teacher Timetable Query
  const {
    data: fetchedTeacherTimetable,
    error: teacherTimetableError,
    isLoading: teacherTimetableLoading,
    refetch: refetchTeacherTimetable,
  } = useQuery(
    ["teacherTimetable", selectedDate],
    () => fetchTeacherWeekTimetable(selectedDate),
    {
      enabled: !!selectedDate,
      onSuccess: (data) => {
        setTeacherWeekTimetable(data.timetable);
        setActiveTimetableId(data.activeTimetableId);
        setTeacherTimetableDaySchedules(data.daySchedules);
        setIsCustomTeacherTable(data.isCustomTimetable);
        setCustomTimetableIds(data.customTimetableIds);
      },
      staleTime:0,
      onError: () => {
        setTeacherWeekTimetable({});
        setActiveTimetableId(null);
        setTeacherTimetableDaySchedules([]);
        setIsCustomTeacherTable(false);
        setCustomTimetableIds([]);
      },
    }
  );

  // Student Timetable Query
  const {
    data: fetchedStudentTimetable,
    error: studentTimetableError,
    isLoading: studentTimetableLoading,
    refetch: refetchStudentsTimetable,
  } = useQuery(
    ["studentTimetable", selectedDate],
    () => fetchStudentWeekTimetable(selectedDate),
    {
      enabled: !!selectedDate,
      staleTime:0,

      onSuccess: (data) => {
        setStudentWeekTimetable(data.timetable);
        setStudentTimetableDaySchedules(data.daySchedules);
        setIsCustomStudentTable(data.isCustomTimetable);
        setCustomTimetableIds(data.customTimetableIds);
      },

      onError: () => {
        setStudentWeekTimetable({});
        setStudentTimetableDaySchedules([]);
        setIsCustomStudentTable(false);
        setCustomTimetableIds([]);
      },
    }
  );

  // Available Rooms Query
  const {
    data: fetchedRooms,
    error: roomsError,
    isLoading: roomsLoading,
    refetch: refetchRooms,
  } = useQuery("availableRooms", fetchAvailableRooms, {
    onSuccess: (data) => setAvailableRooms(data),
    onError: () => setAvailableRooms([]),
    staleTime:0,

  });

  // helper functions

  function getCapitalizedDay(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = date.getDay();

    // Return the capitalized version of the day of the week
    return daysOfWeek[dayIndex].toUpperCase();
  }




  const handleSelectTimetableForDelete = (id) => {
    setIsDeleteDayTimetableForm(id);
    console.log("ID set in state:", id); // You can use this ID for further logic
  };

  // handel functions
  const handleDateChange = (newDate) => {
    setSelectedDate(formatDate(newDate));
    setCapitalizedDay(getCapitalizedDay(newDate));
  };
  const handleCloseOverflowSessionsHandleDialog = () => {
    overflowSessionsHandleDialogSetState({
      open: false,
      classroomId: null,
      selectedDay: null,
      sessionGrpIndex: null,
      overflowSessions: [],
    });
  };
  // Function to handle opening the dialog
  const handleOpenAssignOverlappingSession = (
    classroomId,
    day,
    sessionGrpIndex
  ) => {
    console.log("HI");
    overflowSessionsHandleDialogSetState((prevState) => ({
      ...prevState,
      open: true,
      classroomId,
      selectedDay: day,
      sessionGrpIndex,
    }));
  };
  const handleOpenRoomChangeDialog = (
    teacherId,
    sessionGrpIdx,
    sessionIndex,
    room
  ) => {
    onChangesetSelectedSessionForRoomNumber(sessionGrpIdx);
    const newValue = {
      isOpen: true,
      fromRoom: {
        teacherId: teacherId,
        sessionGrpIdx: sessionGrpIdx,
        sessionIndex: sessionIndex,
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
  const handleConfirmDayTimetableDelete = async () => {
    if (isDeleteDayTimetableForm) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/time-table/day-timetable-date/delete/${isDeleteDayTimetableForm}`, // Make sure to include the UUID here
          {
            headers: headers, // Include headers such as Authorization if needed
          }
        );
        toast.success("DayTimetableDate deleted successfully");
        setIsDeleteDayTimetableForm(null);
        refetchStudentsTimetable();
        refetchTeacherTimetable();
        // Reset the state after deletion
        // refresh(); // Refresh the data, for example by re-fetching the timetable data
      } catch (error) {
        console.error(
          "There was an error deleting the DayTimetableDate:",
          error
        );
        toast.error("Error occurred while deleting");
      }
    }
  };

  const handleOpenStudentRoomChangeDialog = (
    classroomId,
    sessionGrpIdx,
    sessionKey,
    room
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
    setRoomStudentChangeDialogOpen(newValue);
  };
  const closeChangeOrSwapSessionDialog = () => {
    // Reset state to close the dialog and clear parameters
    setChangeOrSwapSessionDialog({
      isOpen: false,
      classroomId: null,
      sessionGrpIndex: null,
      session: null,
      dayOfWeek: null,
    });
  };
  const onChangesetSelectedSessionForRoomNumber = (index) => {
    setSelectedSessionForRoomNumber(index);
  };
  // function to change the present status of a teacher for a entair day
  const toggleFullDayLeaveorPresent = (teacher_id, present_or_leave) => {
    setTeacherWeekTimetable((prevTimetable) => {
      // Deep copy the timetable
      const deepCopiedTimetable = structuredClone(prevTimetable);
      console.log(present_or_leave);

      // Iterate through each day_of_week in the timetable
      Object.keys(deepCopiedTimetable).forEach((dayOfWeek) => {
        // Update each teacher's present status for the matching teacher_id
        deepCopiedTimetable[dayOfWeek] = deepCopiedTimetable[dayOfWeek]?.map(
          (teacher) =>
            teacher.instructor.teacher_id === teacher_id
              ? {
                  ...teacher,
                  instructor: {
                    ...teacher.instructor,
                    present: teacher.instructor.present.map(
                      () => present_or_leave === "present"
                    ),
                  },
                }
              : teacher
        );
      });

      return deepCopiedTimetable;
    });
  };

  // change theacher on specifc sesson
  const changeTecherStatus = (id, periodIndex) => {
    setTeacherWeekTimetable((prevTimetable) => {
      // Deep copy the timetable
      const deepCopiedTimetable = structuredClone(prevTimetable);

      // Extract the day_of_week key
      const dayOfWeek = Object.keys(deepCopiedTimetable)[0];

      // Update the copied structure
      deepCopiedTimetable[dayOfWeek] = deepCopiedTimetable[dayOfWeek]?.map(
        (teacher) =>
          teacher.instructor.id === id
            ? {
                ...teacher,
                instructor: {
                  ...teacher.instructor,
                  present: teacher.instructor.present.map((pre, index) =>
                    index === periodIndex ? !pre : pre
                  ),
                },
              }
            : teacher
      );

      return deepCopiedTimetable;
    });
  };

  // functon to get the statu of teacher with three values present absent half leave
  const getTeacherStatus = (booleanList) => {
    if (booleanList?.every((value) => value === true)) {
      return "present";
    } else if (booleanList?.every((value) => value === false)) {
      return "absent";
    } else {
      return "half leave";
    }
  };

  // function to count the number of teachers are present in specific day
  const countPresentTeachers = (dataList) => {
    return dataList.filter(
      (data) =>
        getTeacherStatus(data.present) === "present" ||
        getTeacherStatus(data.present) === "half leave"
    ).length;
  };
  const openChangeOrSwapSessionDialog = (
    classroomId,
    sessionGrpIndex,
    session,
    dayOfWeek
  ) => {
    console.log(session);
    if (session.type === "Core" && session.class_distribution.length === 1) {
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





  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
      className="grid grid-rows-[1fr_10fr_10fr] grid-cols-[4fr_2fr_2fr] overflow-auto pl-6 pr-4 pb-6 gap-4 h-full max-h-full"
    >
      {/* Control panel */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-row items-center">
        {/* View controller teacher and student */}
        <div className="flex flex-row h-full basis-1/2 flex-shrink-0 flex-grow rounded-lg mr-2">
          <ToggleButton onChange={setViewType} value={viewType} />
        </div>

        {/* Search place */}
        <div className="flex items-center justify-around px-2 shadow_box bg-white dark:bg-dark-secondary rounded-lg h-full flex-shrink-0">
          <CiSearch className="text-xl dark:text-dark-muted" />

          <input
            type="text"
            className="outline-none border-none placeholder:text-opacity-50 focus:ring-0 focus:border focus:border-b-2 focus:border-light-primary dark:focus:border-dark-accent dark:bg-dark-secondary dark:text-dark-text dark:placeholder-dark-muted"
            name="search"
            placeholder=" Search...."
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>
      </div>

      {/* Date selector */}

      <DateSelectorForDayPlanner
        handleDateChange={handleDateChange}
        isCustomStudentTable={isCustomStudentTable}
        isCustomTeacherTable={isCustomTeacherTable}
        selectedDate={selectedDate}
        selectedDay={capitalizedDay}
        teacherWeekTimetable={teacherWeekTimetable}
        viewType={viewType}
        activeTimetableId={activeTimetableId}
        handleSelectTimetableForDelete={handleSelectTimetableForDelete}
        customTimetableIds={customTimetableIds}
        refetchStudentsTimetable={refetchStudentsTimetable}
        refetchTeacherTimetable={refetchTeacherTimetable}
        studentWeekTimetable={studentWeekTimetable}
        studentsConflicts={studentsConflicts}
        teacherConflicts={teacherConflicts}
      />
      {/* Teacher present status of the day */}
      <div className="col-start-3 col-end-4 row-start-1 row-end-3 shadow_box flex flex-col overflow-hidden dark:bg-dark-secondary bg-light-background1  rounded-lg shadow-sm bg-opacity-60">
        <ErrorDisplay
          errors={viewType ? teacherConflicts : studentsConflicts}
          viewType={viewType ? "teacher" : "student"}
        />
      </div>

      {/* Teacher view and student view */}
      <div className="relative col-start-1 overflow-auto col-end-3 row-start-2 row-end-4 shadow-custom-10 rounded-lg border dark:border-dark-border bg-white dark:bg-dark-background1">
        <div className="relative w-full h-full flex items-center justify-center overflow-x-auto">
          <div className="absolute inset-0 w-full h-full flex justify-center items-center">
            {viewType ? (
              teacherTimetableLoading ? (
                <Loadings.ThemedMiniLoader />
              ) : (
                <DraggableTeacherTimetable
                  selectedDay={capitalizedDay}
                  setTeacherWeekTimetable={setTeacherWeekTimetable}
                  NumberOfPeriodsInAday={
                    teacherTimetableDaySchedules?.teaching_slots || 0
                  }
                  teacherWeekTimetable={teacherWeekTimetable}
                  searchTerm={searchQuery}
                  conflicts={teacherConflicts}
                  setConflicts={setteacherConflicts}
                  onChangesetSelectedSessionForRoomNumber={
                    onChangesetSelectedSessionForRoomNumber
                  }
                  handleOpenRoomChangeDialog={handleOpenRoomChangeDialog}
                  changeTecherStatus={changeTecherStatus}
                  teacherTimetableLoading={teacherTimetableLoading}
                  selectedDate={selectedDate}
                  customTimetableIds={customTimetableIds}
                  refetchTeacherTimetable={refetchTeacherTimetable}
                  refetchStudentsTimetable={refetchStudentsTimetable}

                />
              )
            ) : studentTimetableLoading ? (
              <Loadings.ThemedMiniLoader />
            ) : (
              <StudentDraggableTimetable
                selectedDay={capitalizedDay}
                setStudentWeekTimetable={setStudentWeekTimetable}
                NumberOfPeriodsInAday={
                  teacherTimetableDaySchedules?.teaching_slots || 0
                }
                studentWeekTimetable={studentWeekTimetable}
                searchTerm={searchQuery}
                conflicts={studentsConflicts}
                setConflicts={setStudentsConflicts}
                openChangeOrSwapSessionDialog={openChangeOrSwapSessionDialog}
                handleOpenRoomChangeDialog={handleOpenStudentRoomChangeDialog}
                handleOpenTeacherChangeDialog={handleOpenTeacherChangeDialog}
                handleOpenAssignOverlappingSession={
                  handleOpenAssignOverlappingSession
                }
              />
            )}
          </div>
        </div>
      </div>

      <TeacherAttendanceStatus
        countPresentTeachers={countPresentTeachers}
        getTeacherStatus={getTeacherStatus}
        teachersLoading={teachersLoading}
        teacherWeekTimetable={teacherWeekTimetable[capitalizedDay] || []}
        toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
      />
      <RoomChangeDialog
        open={roomChangeDialogOpen.isOpen}
        onClose={() =>
          setRoomChangeDialogOpen({
            isOpen: false,
            fromRoom: null,
            toRoom: null,
            type: null,
          })
        }
        availableRooms={availableRooms}
        teacherWeekTimetable={teacherWeekTimetable}
        selectedDay={capitalizedDay}
        selectedSessionForRoomNumber={selectedSessionForRoomNumber}
        roomChangeDialogOpen={roomChangeDialogOpen}
        setRoomChangeDialogOpen={setRoomChangeDialogOpen}
        setTeacherWeekTimetable={setTeacherWeekTimetable}
      />

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
        open={roomStudentChangeDialogOpen.isOpen}
        onClose={() =>
          setRoomStudentChangeDialogOpen({
            isOpen: false,
            fromRoom: null,
            toRoom: null,
            type: null,
            selectedSessionForRoomNumber: null,
          })
        }
        availableRooms={availableRooms}
        studentWeekTimetable={studentWeekTimetable}
        selectedDay={capitalizedDay}
        roomChangeDialogOpen={roomStudentChangeDialogOpen}
        setRoomChangeDialogOpen={setRoomStudentChangeDialogOpen}
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
        selectedDay={capitalizedDay}
        teacherChangeDialogOpen={teacherChangeDialogOpen}
        setTeacherChangeDialogOpen={setTeacherChangeDialogOpen}
        setStudentWeekTimetable={setStudentWeekTimetable}
      />
      <OverflowSessionsHandleDialog
        open={overflowSessionsHandleDialogState.open}
        studentWeekTimetable={studentWeekTimetable}
        handleClose={handleCloseOverflowSessionsHandleDialog}
        overflowSessionsHandleDialogState={overflowSessionsHandleDialogState}
        overflowSessionsHandleDialogSetState={
          overflowSessionsHandleDialogSetState
        }
        setStudentWeekTimetable={setStudentWeekTimetable}
      />
      <DeleteConfirmationPopup
        isOpen={isDeleteDayTimetableForm !== null} // Open the popup if an ID is set for deletion
        onClose={() => setIsDeleteDayTimetableForm(null)} // Close the popup without doing anything
        onConfirm={handleConfirmDayTimetableDelete} // Call the delete function when confirmed
      />
    </motion.div>
  );
};

export default DayPlanner;
