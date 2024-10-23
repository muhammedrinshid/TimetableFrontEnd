import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useConflictChecker } from "../../../../hooks/useConflictChecker";
import StudentDroppableCell from "./StudentDroppableCell";
import ClassroomInfoCard from "./ClassroomInfoCard";

// Column dragging component
const DraggableColumn = ({
  columnIndex,
  children,
  moveColumn,
}) => {
  const [, drag] = useDrag({
    type: "COLUMN",
    item: { columnIndex, type: "COLUMN" },
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (draggedItem) => {
      if (draggedItem.columnIndex !== columnIndex) {
        moveColumn(draggedItem.columnIndex, columnIndex);
        draggedItem.columnIndex = columnIndex;
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      className="p-4 font-semibold cursor-pointer"
    >
      {children}
    </th>
  );
};

// Session dragging component

// Modified cell component to only handle session drops

const StudentDraggableTimetable = ({
  studentWeekTimetable,
  selectedDay,
  setStudentWeekTimetable,
  NumberOfPeriodsInAday,
  searchTerm,
  setConflicts,
  conflicts,
}) => {
  const [columns, setColumns] = useState(
    Array.from({ length: NumberOfPeriodsInAday }, (_, i) => `Period ${i + 1}`)
  );
  const [filteredTimetable, setFilteredTimetable] = useState(
    studentWeekTimetable[selectedDay]
  );
  const [currentSwapParams, setCurrentSwapParams] = useState(null);

  const checkedConflicts = useConflictChecker(
    studentWeekTimetable[selectedDay],
    "student"
  );

  useEffect(() => {
    setConflicts(checkedConflicts);
  }, [checkedConflicts, setConflicts]);

  useEffect(() => {
    setFilteredTimetable(studentWeekTimetable[selectedDay]);
  }, [studentWeekTimetable, selectedDay]);

   useEffect(() => {
     if (searchTerm) {
       const lowercasedSearch = searchTerm.toLowerCase();
       const filtered = studentWeekTimetable?.[selectedDay].filter((classData) => {
         // Check class and room matches (unchanged)
         const classMatch =
           `${classData?.classroom?.standard}${classData?.classroom?.division}`
             .toLowerCase()
             .includes(lowercasedSearch);

         const roomMatch =
           `${classData?.classroom?.room?.name} (Room ${classData?.classroom?.room?.room_number})`
             .toLowerCase()
             .includes(lowercasedSearch);

         // Check nested sessions structure
         const sessionMatch = classData?.sessions?.some(
           (sessionGrp) =>
             sessionGrp?.session?.name
               ?.toLowerCase()
               .includes(lowercasedSearch) ||
             sessionGrp?.session?.class_distribution?.some(
               (distribution) =>
                 distribution?.subject
                   ?.toLowerCase()
                   .includes(lowercasedSearch) ||
                 distribution?.teacher?.name
                   ?.toLowerCase()
                   .includes(lowercasedSearch)
             )
         );

         return classMatch || roomMatch || sessionMatch;
       });
       setFilteredTimetable(filtered);
     } else {
      setFilteredTimetable(studentWeekTimetable[selectedDay]);
     }
   }, [searchTerm, studentWeekTimetable, selectedDay]);

  const moveColumn = useCallback(
    (fromIndex, toIndex) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        return newColumns;
      });

      setStudentWeekTimetable((prevTimetable) => {
        const newTimetable = JSON.parse(JSON.stringify(prevTimetable));
        newTimetable[selectedDay] = newTimetable[selectedDay].map((teacher) => {
          const newSessions = [...teacher.sessions];
          const [movedSession] = newSessions.splice(fromIndex, 1);
          newSessions.splice(toIndex, 0, movedSession);
          return { ...teacher, sessions: newSessions };
        });
        return newTimetable;
      });
    },
    [selectedDay, setStudentWeekTimetable]
  );

  const moveSession = useCallback(
    (draggedSession, toRowIndex, toColumnIndex) => {
      setStudentWeekTimetable((prevTimetable) => {
        const newTimetable = JSON.parse(JSON.stringify(prevTimetable));
        const newDayTimetable = newTimetable[selectedDay];

        const fromRowIndex = draggedSession.rowIndex;
        const fromColumnIndex = draggedSession.columnIndex;

        if (fromRowIndex === toRowIndex && fromColumnIndex === toColumnIndex) {
          return prevTimetable;
        }

        const fromClassRoom = newDayTimetable[fromRowIndex];
        const toClassRoom = newDayTimetable[toRowIndex];
        const fromSessionGroup = fromClassRoom.sessions[fromColumnIndex];
        const toSessionGroup = toClassRoom.sessions[toColumnIndex];

        const sessionToMove = {
          ...fromSessionGroup[draggedSession.sessionIndex],
        };

        fromSessionGroup.splice(draggedSession.sessionIndex, 1);

        if (fromSessionGroup.length === 0) {
          fromSessionGroup.push({
            name: null,
            type: null,
            class_distribution: null,
         
          });
        }

        if (toSessionGroup.length === 1 && toSessionGroup[0].name === null) {
          toSessionGroup.length = 0;
        }

        toSessionGroup.push(sessionToMove);

        fromClassRoom.sessions[fromColumnIndex] = fromSessionGroup;
        toClassRoom.sessions[toColumnIndex] = toSessionGroup;

        return newTimetable;
      });
    },
    [selectedDay, setStudentWeekTimetable]
  );

  const hasConflict = (toClassRoomIndex, sessionGroup) => {
    // return (
    //   conflicts?.length > 0 &&
    //   conflicts.some(
    //     (conflict) =>
    //       conflict.sessionGroup === sessionGroup + 1 &&
    //       conflict.teachers.some(
    //         (toClassRoom) =>
    //           toClassRoom?.id ===
    //           filteredTimetable[toClassRoomIndex]?.instructor.id
    //       )
    //   )
    // );
    return false
  };

  

  


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="shadow-xl rounded-lg bg-white dark:bg-gray-800 overflow-auto max-h-[88%] w-full">
        <table className="border-collapse w-full h-full">
          <thead>
            <tr className="sticky left-0 top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200 p-4 font-semibold">
              <th className="p-4 font-semibold">Classrooms</th>
              {columns.map((header, index) => (
                <DraggableColumn
                  key={index}
                  columnIndex={index}
                  moveColumn={moveColumn}
                >
                  {header}
                </DraggableColumn>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTimetable?.map((classData, classIndex) => (
              <tr key={classIndex}>
                <td className="sticky left-0 bg-white dark:bg-gray-800 border p-4 z-10 backdrop-blur-md bg-opacity-50">
                  <ClassroomInfoCard classData={classData} />
                </td>
                {classData.sessions
                  ?.slice(0, NumberOfPeriodsInAday)
                  ?.map((sessionGrp, sessionGrpIndex) => (
                    <StudentDroppableCell
                      key={sessionGrpIndex}
                      classData={classData}
                      rowIndex={classIndex}
                      columnIndex={sessionGrpIndex}
                      sessions={sessionGrp}
                      moveSession={moveSession}
                      hasConflict={hasConflict}
                      selectedDay={selectedDay}
                      studentWeekTimetable={studentWeekTimetable}
                    />
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default StudentDraggableTimetable;
