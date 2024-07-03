import React from "react";
import {
  TeacherViewClassroomCard,
  TeacherListDashboard,
  TeacherViewHeading,
} from "../../common";
import { useAuth } from "../../../context/Authcontext";







const getGridClassName = (NumberOfPeriodsInAday) => {
  const gridClasses = {
    1: 'grid-cols-[minmax(160px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]',
    2: 'grid-cols-[minmax(160px,_1.5fr)_repeat(2,_minmax(140px,_1fr))]',
    3: 'grid-cols-[minmax(160px,_1.5fr)_repeat(3,_minmax(140px,_1fr))]',
    4: 'grid-cols-[minmax(160px,_1.5fr)_repeat(4,_minmax(140px,_1fr))]',
    5: 'grid-cols-[minmax(160px,_1.5fr)_repeat(5,_minmax(140px,_1fr))]',
    6: 'grid-cols-[minmax(160px,_1.5fr)_repeat(6,_minmax(140px,_1fr))]',
    7: 'grid-cols-[minmax(160px,_1.5fr)_repeat(7,_minmax(140px,_1fr))]',
    8: 'grid-cols-[minmax(160px,_1.5fr)_repeat(8,_minmax(140px,_1fr))]',
    9: 'grid-cols-[minmax(160px,_1.5fr)_repeat(9,_minmax(140px,_1fr))]',
    10: 'grid-cols-[minmax(160px,_1.5fr)_repeat(10,_minmax(140px,_1fr))]',
    11: 'grid-cols-[minmax(160px,_1.5fr)_repeat(11,_minmax(140px,_1fr))]',
    12: 'grid-cols-[minmax(160px,_1.5fr)_repeat(12,_minmax(140px,_1fr))]'
  };

  return gridClasses[NumberOfPeriodsInAday] || 'grid-cols-[minmax(160px,_1.5fr)_repeat(1,_minmax(140px,_1fr))]';
};





const TeacherViewOneDayTt = ({
  findClassById,
  changeTecherStatus,
  teachers,
  row1,
  times,
  toggleDrawer,
  whoWantSwap,
  setSelectedSession,
  toggleFullDayLeaveorPresent,
}) => {

  const {NumberOfPeriodsInAday}=useAuth()
  const gridClassName = getGridClassName(NumberOfPeriodsInAday);


  
  return (
    <div class={`grid ${gridClassName}  relative  `}>
      {/* first row  head   of teacher view*/}

      {row1?.slice(0, NumberOfPeriodsInAday+1).map((ele, indx) => (
        <TeacherViewHeading
          setSelectedSession={setSelectedSession}
          indx={indx}
          ele={ele}
        />
      ))}

      {/* Teacher time Schedule dispaly here */}

      {teachers.map((ele) => {
        const fullDayPresent = ele.present.every((condition) => condition);

        return (
          <React.Fragment>


            
            {/* first column where teachers detail listed */}
            <TeacherListDashboard
              fullDayPresent={fullDayPresent}
              ele={ele}
              toggleFullDayLeaveorPresent={toggleFullDayLeaveorPresent}
              toggleDrawer={toggleDrawer}
            />

            {/* // class and the details listed here       */}
            {ele.class_slot?.slice(0, NumberOfPeriodsInAday).map((slot, ind) => {
              const classRoom = findClassById(slot);
              const periodDetails = times[ind];

              return (
                <TeacherViewClassroomCard
                  classRoom={classRoom}
                  ele={ele}
                  ind={ind}
                  periodDetails={periodDetails}
                  changeTecherStatus={changeTecherStatus}
                  toggleDrawer={toggleDrawer}
                  whoWantSwap={whoWantSwap}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TeacherViewOneDayTt;
