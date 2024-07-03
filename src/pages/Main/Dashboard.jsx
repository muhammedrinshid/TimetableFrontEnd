import React, { useEffect, useState } from "react";
import {
  Teacher_data,
  class_data,
  teacherRow1,
  timeSlots,
} from "../../assets/datas";
import { CiSearch } from "../../assets/icons";
import {
  
  ToggleButton,
} from "../../components/common";


import TeacherAttendanceStatus from "../../components/specific/Dashboard/TeacherAttendanceStatus";
import FreeTeacherOnaSession from "../../components/specific/Dashboard/FreeTeacherOnaSession";
import TeacherViewOneDayTt from "../../components/specific/Dashboard/TeacherViewOneDayTt";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import StudentrViewOneDayTt from "../../components/specific/Dashboard/StudentrViewOneDayTt";
import SwapTeacherPopus from "../../components/specific/Dashboard/SwapTeacherPopus";

const Dashboard = () => {
  const [whoWantSwap, setWhoWantSwap] = useState({
    subject: "",
    session: 0,
    teacher_id: "",
    class_id: "",
    isOpen: false,
  });
  const [whichOnSwap, setWhichOnSwap] = useState({
    subject: "",
    teacher_id: "",
  });

  const [teachers, setTeachers] = useState(Teacher_data);
  const [classsRomms, setClassRooms] = useState(class_data);
  const [row1, setRow1] = useState(teacherRow1);
  const [times, setTimes] = useState(timeSlots);
  const [viewType, setViewType] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(0);
  const [swapPopup, setSwapPopup] = useState(false);

  // function to find the details of class or session by the id
  const findClassById = (id) => {
    return classsRomms.find((cls) => cls.class_id === id) || null;
  };
  const findTaecherById = (id) => {
    return teachers.find((tch) => tch.teacher_id === id) || null;
  };

  // function to change the present status of a teacher for a entair day
  const toggleFullDayLeaveorPresent = (teacher_id, present_or_leave) => {
    if (present_or_leave == "present") {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.teacher_id === teacher_id
            ? { ...teacher, present: teacher.present.map((pre) => true) }
            : teacher
        )
      );
    }
    if (present_or_leave == "leave") {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.teacher_id === teacher_id
            ? { ...teacher, present: teacher.present.map((pre) => false) }
            : teacher
        )
      );
    }
  };

  // change theacher on specifc sesson
  const changeTecherStatus = (id, periodIndex) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.teacher_id === id
          ? {
              ...teacher,
              present: teacher.present.map((pre, index) =>
                index === periodIndex ? !pre : pre
              ),
            }
          : teacher
      )
    );
  };

  // functon to get the statu of teacher with three values present absent half leave
  const getTeacherStatus = (booleanList) => {
    if (booleanList.every((value) => value === true)) {
      return "present";
    } else if (booleanList.every((value) => value === false)) {
      return "absent";
    } else {
      return "half leave";
    }
  };

  const toggleDrawer = (typ, indx, sub, teacher_id, class_id) => {
    if (typ === "toggle") {
      if (whoWantSwap.isOpen) {
        setWhoWantSwap(() => ({
          subject: "",
          session: 0,
          teacher_id: "",
          isOpen: false,
          class_id: "",
        }));
      } else {
        setWhoWantSwap(() => ({
          subject: sub,
          session: indx,
          teacher_id: teacher_id,
          isOpen: true,
          class_id: class_id,
        }));
      }
    } else {
      setWhoWantSwap(() => ({
        subject: "",
        session: 0,
        teacher_id: "",
        isOpen: false,
        class_id: "",
      }));
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

  return (
    <div className=" grid grid-rows-[1fr_10fr_7fr] grid-cols-[4fr_2fr_2fr] overflow-auto  pl-6 pr-4 pb-6 gap-4 ">
      {/* contorle panel */}
      <div className="col-start-1  col-end-2  row-start-1 row-end-2  flex flex-row items-center shadow_box  border-2 border-light-primary">
        {/*  */}
        {/* view controler tacher and student */}
        <div className="flex flex-row  w-full h-full basis-2/3 rounded-lg mr-2">
          <ToggleButton onChange={setViewType} value={viewType} />
        </div>

        {/* Search place */}
        <div className=" flex items-center justify-between">
          <CiSearch className="text-xl " />

          <input
            type="text"
            className="outline-none border-none placeholder:text-opacity-50 focus:ring-0 focus:border focus:border-b-2 focus:border-light-primary "
            name="search"
            placeholder=" Search...."
          />
        </div>
      </div>
      {/* date selector */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 shadow_box flex flex-row justify-be items-center "></div>
      {/* thecher present status of the day  */}
      <div className="col-start-3 col-end-4 row-start-1 row-end-3 shadow_box flex flex-col overflow-hidden">
        <TeacherAttendanceStatus
          countPresentTeachers={countPresentTeachers}
          getTeacherStatus={getTeacherStatus}
          teachers={teachers}
          toggleDrawer={toggleDrawer}
          toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
        />
      </div>

      {/* teacher view and student view */}
      <div className=" relative col-start-1 overflow-auto col-end-3 row-start-2 row-end-4  shadow-custom-10 rounded-lg border  bg-white">
        <TransitionGroup>
          <CSSTransition key={viewType} timeout={500} classNames="slide">
            <div className="absolute inset-0 w-full h-full">
              {viewType ? (
                <TeacherViewOneDayTt
                  changeTecherStatus={changeTecherStatus}
                  findClassById={findClassById}
                  row1={row1}
                  setSelectedSession={setSelectedSession}
                  teachers={teachers}
                  times={times}
                  toggleDrawer={toggleDrawer}
                  toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
                  whoWantSwap={whoWantSwap}
                />
              ) : (
                <StudentrViewOneDayTt
                  row1={row1}
                  setSelectedSession={setSelectedSession}
                  class_rooms={classsRomms}
                  findTaecherById={findTaecherById}
                  whoWantSwap={whoWantSwap}
                  times={times}
                  changeTecherStatus={changeTecherStatus}
                  toggleDrawer={toggleDrawer}
                />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>

      {/* free teacher status for a specific session*/}

      <FreeTeacherOnaSession
        findClassById={findClassById}
        toggleDrawer={toggleDrawer}
        selectedSession={selectedSession}
        teachers={teachers}
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
      />
    </div>
  );
};

export default Dashboard;
