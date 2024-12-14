import React, { useEffect, useState } from "react";
import TeacherTimeTableComponent from "./TimeTableforTeacher";
import StudentTimeTableComponent from "./TimeTableforStudent";
import DetailedViewControlPanel from "./DetailedViewControlPanel";
import { Loadings } from "../../common";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";

const DetailedViewComponent = ({
  isTeacherView,
  searchTerm,
  teacherViewToggle,
  teacherTimetableDaySchedules,
  studentTimetableDaySchedules,
  studentWeekTimetable,
  teacherWeekTimetable,
  isTimetableLoading,
}) => {
  const { headers, apiDomain, user } = useAuth();

  const [selectedDay, setSelectedDay] = useState("MON");

  const handleDayChange = (value) => {
    setSelectedDay(value);
  };

  const days = teacherTimetableDaySchedules
    ? teacherTimetableDaySchedules.map(
        (teacherTimetableDaySchedule) => teacherTimetableDaySchedule.day
      )
    : [];
  return (
    <div>
      <DetailedViewControlPanel
        days={days}
        onDayChange={handleDayChange}
        onViewChange={teacherViewToggle}
        selectedDay={selectedDay}
        isTeacherView={isTeacherView}
      />

      {isTimetableLoading ? (
        <Loadings.ThemedMiniLoader />
      ) : isTeacherView ? (
        <TeacherTimeTableComponent
          teacherTimetable={teacherWeekTimetable?.[selectedDay] || []}
          searchTerm={searchTerm}
          teacherTimetableDaySchedules={teacherTimetableDaySchedules?.find(
            (daySchedule) => daySchedule.day == selectedDay
          )}
        />
      ) : (
        <StudentTimeTableComponent
          studentTimeTable={studentWeekTimetable?.[selectedDay] || []}
          searchTerm={searchTerm}
          studentTimetableDaySchedules={studentTimetableDaySchedules?.find(
            (daySchedule) => daySchedule.day == selectedDay
          )}
        />
      )}
    </div>
  );
};

export default DetailedViewComponent;
