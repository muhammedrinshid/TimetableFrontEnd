import React from "react";
import { ClassListDashboard, TeacherViewHeading } from "../../common";
import ClassroomCard from "./StudentrViewClassroomCard";
import { useAuth } from "../../../context/Authcontext";
const getGridClassName = (NumberOfPeriodsInAday) => {
  const gridClasses = {
    1: "grid-cols-[minmax(100px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]",
    2: "grid-cols-[minmax(100px,_1.5fr)_repeat(2,_minmax(140px,_1fr))]",
    3: "grid-cols-[minmax(100px,_1.5fr)_repeat(3,_minmax(140px,_1fr))]",
    4: "grid-cols-[minmax(100px,_1.5fr)_repeat(4,_minmax(140px,_1fr))]",
    5: "grid-cols-[minmax(100px,_1.5fr)_repeat(5,_minmax(140px,_1fr))]",
    6: "grid-cols-[minmax(100px,_1.5fr)_repeat(6,_minmax(140px,_1fr))]",
    7: "grid-cols-[minmax(100px,_1.5fr)_repeat(7,_minmax(140px,_1fr))]",
    8: "grid-cols-[minmax(100px,_1.5fr)_repeat(8,_minmax(140px,_1fr))]",
    9: "grid-cols-[minmax(100px,_1.5fr)_repeat(9,_minmax(140px,_1fr))]",
    10: "grid-cols-[minmax(100px,_1.5fr)_repeat(10,_minmax(140px,_1fr))]",
    11: "grid-cols-[minmax(100px,_1.5fr)_repeat(11,_minmax(140px,_1fr))]",
    12: "grid-cols-[minmax(100px,_1.5fr)_repeat(12,_minmax(140px,_1fr))]",
  };

  return (
    gridClasses[NumberOfPeriodsInAday] ||
    "grid-cols-[minmax(100px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]"
  );
};

const StudentrViewOneDayTt = ({
  row1,
  setSelectedSession,
  class_rooms,
  findTaecherById,
  times,
  whoWantSwap,
  toggleDrawer,
  changeTecherStatus,
}) => {
  const { NumberOfPeriodsInAday } = useAuth();
  const gridClassName = getGridClassName(NumberOfPeriodsInAday);

  return (
    <div className={`grid ${gridClassName}  relative  `}>
      {/* first row  head   of student view*/}
      {row1?.slice(0, NumberOfPeriodsInAday+1).map((ele, indx) => (
        <TeacherViewHeading
          setSelectedSession={setSelectedSession}
          indx={indx}
          ele={ele}
        />
      ))}{" "}
      {class_rooms
        .sort((a, b) => {
          if (a.standard < b.standard) {
            return -1;
          }
          if (a.standard > b.standard) {
            return 1;
          }
          if (a.division < b.division) {
            return -1;
          }
          if (a.division > b.division) {
            return 1;
          }
          return 0;
        })
        .map((ele) => {
          // const fullDayPresent = ele.present.every((condition) => condition);

          return (
            <React.Fragment>
              {/* first column where class_rooms detail listed */}
              <ClassListDashboard
                //   fullDayPresent={fullDayPresent}
                ele={ele}
                //   toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
                //   toggleDrawer={toggleDrawer}
              />

              {/* // class and the details listed here       */}
              {ele.periods?.slice(0, NumberOfPeriodsInAday).map((slot, ind) => {
                let teacher = findTaecherById(slot.teacher_id);
                const isLeave = !teacher.present[ind];
                const status = isLeave ? "leave" : "engaged";
                const periodDetails = times[ind];
                return (
                  <ClassroomCard
                    teacher={teacher}
                    subject={slot.subject}
                    ind={ind}
                    slot={slot}
                    periodDetails={periodDetails}
                    whoWantSwap={whoWantSwap}
                    status={status}
                    changeTecherStatus={changeTecherStatus}
                    toggleDrawer={toggleDrawer}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default StudentrViewOneDayTt;
