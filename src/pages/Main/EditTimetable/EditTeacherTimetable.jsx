import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import DraggableTeacherTimetable from "./EditTeacherTimetable/DraggableTeacherTimetable";
import { Loadings } from "../../../components/common";
import EditTeacherTimetableControlePanel from "./EditTeacherTimetable/EditTeacherTimetableControlePanel";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from "react-icons/tfi";
import ErrorDisplay from "./EditTeacherTimetable/ErrorDisplay";
import RoomAvailabilityDisplayer from "./EditTeacherTimetable/RoomAvailabilityDisplayer";
import RoomChangeDialog from "./EditTeacherTimetable/RoomChangeDialog";

const EditTeacherTimetable = ({ timeTableId }) => {
  const { apiDomain, headers } = useAuth();
  const [selectedDay, setSelectedDay] = useState("MON");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedSessionForRoomNumber, setSelectedSessionForRoomNumber] =
    useState(0);
  const [roomChangeDialogOpen, setRoomChangeDialogOpen] = useState({
    isOpen: false,
    fromRoom: null,
    toRoom: null,
    type: null,
  });

  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState({});
  const [teacherTimetableDaySchedules, setTeacherTimetableDaySchedules] = useState([]);

  const fetchTeacherTimetable = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        `${apiDomain}/api/time-table/edit-teacher-week-timetable/${timeTableId}/`,
        { headers }
      );
      setTeacherWeekTimetable(response.data.week_timetable);
      setTeacherTimetableDaySchedules(response.data?.day_schedules);

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
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    fetchTeacherTimetable();
    fetchAvailableRooms();
  }, [timeTableId]);
  const days = teacherTimetableDaySchedules ? teacherTimetableDaySchedules.map((teacherTimetableDaySchedule)=>teacherTimetableDaySchedule.day) : [];
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const onChangesetSelectedSessionForRoomNumber = (index) => {
    setSelectedSessionForRoomNumber(index);
  };

  const handleOpenRoomChangeDialog = (
    teacherId,
    sessionGrpIdx,
    sessionIndex,
    room
  ) => {

    onChangesetSelectedSessionForRoomNumber(sessionGrpIdx)
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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loadings.ThemedMiniLoader />
      </div>
    );
  }
  const selectedDaySchedule = teacherTimetableDaySchedules?.find(
    (schedule) => schedule?.day === selectedDay
  );
  const NumberOfPeriodsInAday = selectedDaySchedule?.teaching_slots ?? 0;
  return (
    <div
      className={`grid grid-rows-[3fr_2fr] grid-cols-[3fr_1fr] box-border gap-4 h-full w-full  pr-5 transition-all relative`}
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
      <div
        className={`col-start-1 col-end-2 row-start-1 row-end-3 p-3 overflow-hidden flex flex-col ${
          isCollapsed ? "col-end-3" : ""
        } `}
      >
        <EditTeacherTimetableControlePanel
          days={days}
          handleDayChange={handleDayChange}
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          selectedDay={selectedDay}
          timeTableId={timeTableId}
          conflicts={conflicts}
          teacherWeekTimetable={teacherWeekTimetable}
        />
        <DraggableTeacherTimetable
          selectedDay={selectedDay}
          setTeacherWeekTimetable={setTeacherWeekTimetable}
          NumberOfPeriodsInAday={NumberOfPeriodsInAday}
          teacherWeekTimetable={teacherWeekTimetable}
          searchTerm={searchTerm}
          conflicts={conflicts}
          setConflicts={setConflicts}
          onChangesetSelectedSessionForRoomNumber={
            onChangesetSelectedSessionForRoomNumber
          }
          handleOpenRoomChangeDialog={handleOpenRoomChangeDialog}
        />
        {/* Collapse/Expand Icon Button */}
      </div>

      {/* Right Panels with smooth collapse/expand */}
      {!isCollapsed && (
        <>
          <div
            className={`col-start-2 col-end-3 row-start-1 row-end-2 transition-[max-width] duration-500 ease-in-out overflow-hidden pb-3 w-full h-full`}
          >
            <ErrorDisplay errors={conflicts} viewType={"teacher"} />
          </div>
          <div className=" col-start-2 col-end-3 row-start-2 row-end-3 h-full overflow-hidden pb-2">
            <RoomAvailabilityDisplayer
              availableRooms={availableRooms}
              teacherWeekTimetable={teacherWeekTimetable}
              selectedDay={selectedDay}
              selectedSessionForRoomNumber={selectedSessionForRoomNumber}
              onChangesetSelectedSessionForRoomNumber={
                onChangesetSelectedSessionForRoomNumber
              }
              roomChangeDialogOpen={roomChangeDialogOpen}
            />
          </div>
        </>
      )}
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
        selectedDay={selectedDay}
        selectedSessionForRoomNumber={selectedSessionForRoomNumber}
        roomChangeDialogOpen={roomChangeDialogOpen}
        setRoomChangeDialogOpen={setRoomChangeDialogOpen}
        setTeacherWeekTimetable={setTeacherWeekTimetable}
      />
    </div>
  );
};

export default EditTeacherTimetable;
