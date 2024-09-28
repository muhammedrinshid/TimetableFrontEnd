import React, { useEffect, useState } from "react";
import {
  Teacher_data,
  class_data,

} from "../../assets/datas";
import { CiSearch } from "../../assets/icons";
import { Loadings, ScheduleLoading, ToggleButton } from "../../components/common";
import CircularProgress from "@mui/material/CircularProgress";
import TeacherAttendanceStatus from "../../components/specific/Dashboard/TeacherAttendanceStatus";
import FreeTeacherOnaSession from "../../components/specific/Dashboard/FreeTeacherOnaSession";
import TeacherViewOneDayTt from "../../components/specific/Dashboard/TeacherViewOneDayTt";
import StudentrViewOneDayTt from "../../components/specific/Dashboard/StudentrViewOneDayTt";
import SwapTeacherPopus from "../../components/specific/Dashboard/SwapTeacherPopus";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Authcontext";
import { styled, TextField } from "@mui/material";

const Dashboard = () => {
  const { apiDomain, headers } = useAuth();
  const today = new Date();
  const [loading, setLoading] = useState(false);

  const [teacherWeekTimetable, setTeacherWeekTimetable] = useState([]);
  const [studentWeekTimetable, setStudentWeekTimetable] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [teachers, setTeachers] = useState(Teacher_data);
  const [classsRomms, setClassRooms] = useState(class_data);

  const [viewType, setViewType] = useState(true);

  const [selectedDate, setSelectedDate] = useState(today);

  const [selectedSession, setSelectedSession] = useState(0);
  const [swapPopup, setSwapPopup] = useState(false);

  function getCapitalDayOfWeek() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = selectedDate.getDay();
    return daysOfWeek[dayIndex].toUpperCase();
  }
  useEffect(() => {
    let weekDay = getCapitalDayOfWeek();
    const fetchTeacherWeekTimetable = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/time-table/teacher-view-day/${weekDay}/`,
          {
            headers,
          }
        );
        setTeacherWeekTimetable(response.data);
      } catch (error) {
        console.error(`Error fetching teacher timetable:`, error);
        toast.error(`Failed to load teacher timetable. Please try again.`);
      }
    };

    const fetchStudentWeekTimetable = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/time-table/student-view-day/${weekDay}/`,
          {
            headers,
          }
        );
        setStudentWeekTimetable(response.data);
      } catch (error) {
        console.error(`Error fetching teacher timetable:`, error);
        toast.error(`Failed to load teacher timetable. Please try again.`);
      }
    };

    const delayedFetch = async () => {
      setLoading(true);
      const startTime = Date.now();
      await Promise.all([
        fetchTeacherWeekTimetable(),
        fetchStudentWeekTimetable(),
      ]);
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 2000 - elapsedTime));
      }
      setLoading(false);
    };

    delayedFetch();
  }, [selectedDate]);

  const [whoWantSwap, setWhoWantSwap] = useState({
    subject: "",
    session: 0,
    teacherDetails:null,
    isOpen: false,
  });
  const [whichOnSwap, setWhichOnSwap] = useState({
    subject: "",
    teacherDetails:null,
  });

  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-root": {
      border: "none",
      outline: "none",
    },
  });

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  // function to find the details of class or session by the id
  const findClassById = (id) => {
    return classsRomms.find((cls) => cls.class_id === id) || null;
  };
  const findTaecherById = (id) => {
    return teachers.find((tch) => tch.teacher_id === id) || null;
  };

  // function to change the present status of a teacher for a entair day
  const toggleFullDayLeaveorPresent = (teacher_id, present_or_leave) => {
    console.log(teacher_id, present_or_leave);

    setTeacherWeekTimetable((prevTeachers) =>
      prevTeachers.map((teacher) =>
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
      )
    );
  };

  // change theacher on specifc sesson
  const changeTecherStatus = (id, periodIndex) => {
    setTeacherWeekTimetable((prevTeachers) =>
      prevTeachers?.map((teacher) =>
        teacher.instructor.teacher_id === id
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
      )
    );
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

  const toggleDrawer = (typ, indx,sub, teacherDetails) => {
    if (typ === "toggle") {
      if (whoWantSwap.isOpen) {
        setWhoWantSwap(() => ({
          subject: "",
          session: 0,
          teacherDetails: null,
          isOpen: false,
        }));
      } else {
        setWhoWantSwap(() => ({
          subject: sub,
          session: indx,
          teacherDetails: teacherDetails,
          isOpen: true,
        }));
      }
    } else {
      setWhoWantSwap(() => ({
        subject: "",
        session: 0,
        teacherDetails: null,
        isOpen: false,
      }));
    }
    console.log(whoWantSwap);
  };

  // function to count the number of teachers are present in specific day
  const countPresentTeachers = (dataList) => {
    return dataList.filter(
      (data) =>
        getTeacherStatus(data.present) === "present" ||
        getTeacherStatus(data.present) === "half leave"
    ).length;
  };
  const filteredStudentData = studentWeekTimetable.filter((student) => {
    const {
      grade,
      division,
      class_id,
      room: { room_number },
    } = student.classroom;
    return (
      grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      class_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filtered teacher data based on search query
  const filteredTeacherData = teacherWeekTimetable.filter((teacher) => {
    const { name, surname, teacher_id } = teacher.instructor;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className=" grid grid-rows-[1fr_10fr_7fr] grid-cols-[4fr_2fr_2fr] overflow-auto  pl-6 pr-4 pb-6 gap-4  ">
      {/* contorle panel */}
      <div className="col-start-1  col-end-2  row-start-1 row-end-2  flex flex-row items-center   ">
        {/*  */}
        {/* view controler tacher and student */}
        <div className="flex flex-row   h-full basis-1/2 flex-shrink-0 flex-grow rounded-lg mr-2">
          <ToggleButton onChange={setViewType} value={viewType} />
        </div>

        {/* Search place */}
        <div className=" flex items-center justify-around  px-2 shadow_box bg-white rounded-lg h-full flex-shrink-0">
          <CiSearch className="text-xl " />

          <input
            type="text"
            className="outline-none border-none placeholder:text-opacity-50 focus:ring-0 focus:border focus:border-b-2 focus:border-light-primary "
            name="search"
            placeholder=" Search...."
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>
      </div>
      {/* date selector */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 shadow_box flex flex-row justify-center items-center ">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                variant="grade"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
              />
            )}
          />
        </LocalizationProvider>
      </div>
      {/* thecher present status of the day  */}
      <div className="col-start-3 col-end-4 row-start-1 row-end-3 shadow_box flex flex-col overflow-hidden">
        <TeacherAttendanceStatus
          countPresentTeachers={countPresentTeachers}
          getTeacherStatus={getTeacherStatus}
          teacherWeekTimetable={teacherWeekTimetable}
          toggleDrawer={toggleDrawer}
          toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
        />
      </div>

      {/* teacher view and student view */}
      <div className=" relative col-start-1 overflow-auto col-end-3 row-start-2 row-end-4  shadow-custom-10 rounded-lg border  bg-white">
        <div className="relative w-full h-full flex items-center justify-center  overflow-x-auto">
          {loading ? (
            <Loadings.ThemedMiniLoader />
          ) : (
            <div className="absolute inset-0 w-full h-full ">
              {viewType ? (
                <TeacherViewOneDayTt
                  teacherTimetable={filteredTeacherData}
                  changeTecherStatus={changeTecherStatus}
                  setSelectedSession={setSelectedSession}
                  toggleDrawer={toggleDrawer}
                  toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
                />
              ) : (
                <StudentrViewOneDayTt
                  
                  studentTimeTable={filteredStudentData}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* free teacher status for a specific session*/}
      <FreeTeacherOnaSession
        findClassById={findClassById}
        toggleDrawer={toggleDrawer}
        selectedSession={selectedSession}
        teachers={teacherWeekTimetable}
        whoWantSwap={whoWantSwap}
        findTaecherById={findTaecherById}
        setSwapPopup={setSwapPopup}
        setWhichOnSwap={setWhichOnSwap}
      />
      <SwapTeacherPopus
        findTaecherById={findTaecherById}
        swapPopup={swapPopup}
        findClassById={findClassById}
        setSwapPopup={setSwapPopup}
        whichOnSwap={whichOnSwap}
        whoWantSwap={whoWantSwap}
        setTeachers={setTeachers}
        setClassRooms={setClassRooms}
        class_rooms={classsRomms}
        teachers={teachers}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Dashboard;
