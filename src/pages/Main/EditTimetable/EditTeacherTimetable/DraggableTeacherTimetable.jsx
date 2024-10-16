import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip } from "@mui/material";
import { useAuth } from "../../../../context/Authcontext";
import EditTeacherListCard from "./EditTeacherListCard";
import { useConflictChecker } from "../../../../hooks/useConflictChecker";

const getSessionColor = (session) => {
  if (!session || !session.subject) {
    return "bg-gradient-to-b from-green-200 via-white to-green-200 text-green-900 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 dark:text-gray-400";
  }
  switch (session.type) {
    case "Core":
      return "bg-gradient-to-b from-blue-200 via-white to-blue-200 text-blue-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-800 dark:to-black dark:text-gray-200";
    case "Elective":
      return "bg-gradient-to-b from-purple-300 via-white to-purple-200 text-purple-900 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-300";
    default:
      return "bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-700 dark:to-black dark:text-gray-400";
  }
};

const getSessionBorderColor = (session) => {
  if (!session || !session.subject) {
    return "border-gray-300 dark:border-gray-300";
  }
  switch (session.type) {
    case "Core":
      return "border-blue-500 dark:border-gray-800";
    case "Elective":
      return "border-purple-500 dark:border-gray-500";
    default:
      return "border-gray-300 dark:border-gray-300";
  }
};

// Column dragging component
const DraggableColumn = ({ columnIndex, children, moveColumn }) => {
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
    <th ref={(node) => drag(drop(node))} className="p-4 font-semibold">
      {children}
    </th>
  );
};

// Session dragging component
const DraggableSession = ({
  session,
  rowIndex,
  columnIndex,
  sessionIndex,
  moveSession,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "SESSION",
    item: {
      ...session,
      rowIndex,
      columnIndex,
      sessionIndex, // Add sessionIndex to the dragged item
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: session.subject !== null,
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`mb-2 last:mb-0 border-t-4 rounded-lg overflow-hidden ${getSessionBorderColor(
        session
      )} p-2 ${getSessionColor(session)}`}
    >
      <div className={`flex justify-between items-start mt-3`}>
        <Tooltip title={session.subject || session.elective_subject_name}>
          <h3 className="font-bold text-sm leading-tight truncate max-w-[70%]">
            {session.subject || session.elective_subject_name || "Free Period"}
          </h3>
        </Tooltip>
        {session.type && (
          <div
            className={`${
              session.type === "Core"
                ? "bg-green-500 dark:bg-green-400 text-white"
                : "bg-yellow-500 dark:bg-yellow-400 text-gray-900 dark:text-white"
            } text-xs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
          >
            {session.type?.charAt(0)}
          </div>
        )}
      </div>
      {session.room && (
        <p className="text-xs mb-2 flex justify-between items-center text-gray-500 dark:text-gray-400">
          <span className="font-medium">Room {session.room.room_number}</span>
        </p>
      )}
      {session.class_details && (
        <div className="text-xs flex-grow overflow-y-auto">
          {session.class_details.map((classDetail, classIndex) => (
            <div
              key={classIndex}
              className="flex justify-between items-center mb-1 bg-gray-100 dark:bg-gray-600 bg-opacity-50 rounded-md p-1"
            >
              <span className="font-semibold text-nowrap">
                {classDetail.standard} {classDetail.division}
              </span>
              {session.type === "Elective" && (
                <span className="text-gray-500 dark:text-gray-400 text-nowrap">
                  {classDetail.number_of_students} cadet
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Modified cell component to only handle session drops
const DroppableCell = ({
  rowIndex,
  columnIndex,
  sessions,
  moveSession,
  hasConflict,
}) => {
  const [, drop] = useDrop({
    accept: "SESSION",
    drop: (item) => {
      moveSession(item, rowIndex, columnIndex);
    },
  });

  return (
    <td
      ref={drop}
      className={`border ${
        hasConflict(rowIndex, columnIndex) ? "bg-red-200 error" : ""
      }`}
      style={{
        minWidth: "180px",
        height: "160px",
      }}
    >
      <div
        className={`h-full transition-all duration-300 hover:shadow-lg relative flex flex-col justify-center p-2`}
      >
        {sessions.length === 0 || !sessions[0].subject ? (
          <div
            className={`mb-2 last:mb-0 border-t-4 rounded-lg overflow-hidden ${getSessionColor(
              sessions[0]
            )} h-full flex items-center justify-center`}
          >
            <div className="text-center">
              <p className="font-semibold text-lg text-gray-500 dark:text-gray-400">
                Free Period
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Time to recharge!
              </p>
            </div>
          </div>
        ) : (
          sessions.map((session, index) => (
            <DraggableSession
              key={index}
              session={session}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              sessionIndex={index} // Pass the index to DraggableSession
              moveSession={moveSession}
            />
          ))
        )}
      </div>
    </td>
  );
};

const DraggableTeacherTimetable = ({
  teacherTimetable,
  selectedDay,
  setTeacherWeekTimetable,
  NumberOfPeriodsInAday,
  searchTerm,
  setConflicts,
  conflicts,
}) => {
  const [columns, setColumns] = useState(
    Array.from({ length: NumberOfPeriodsInAday }, (_, i) => `Period ${i + 1}`)
  );
  const { darkMode, apiDomain } = useAuth();
  const [filteredTimetable, setFilteredTimetable] = useState(teacherTimetable);

  const checkedConflicts = useConflictChecker(teacherTimetable, "teacher");
  useEffect(() => {
    setConflicts(checkedConflicts);
    console.log("erro");
  }, [checkedConflicts, setConflicts]);
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = teacherTimetable?.filter((teacher) => {
        const nameMatch = teacher.instructor.name
          .toLowerCase()
          .includes(lowercasedSearch);
        const sessionMatch = teacher.sessions.some((sessionGroup) =>
          sessionGroup.some((session) => {
            const subjectMatch = (
              session?.subject ||
              session?.elective_subject_name ||
              ""
            )
              .toLowerCase()
              .includes(lowercasedSearch);
            const roomMatch = session?.room?.room_number
              ?.toString()
              .toLowerCase()
              .includes(lowercasedSearch);
            return subjectMatch || roomMatch;
          })
        );
        return nameMatch || sessionMatch;
      });
      setFilteredTimetable(filtered);
    } else {
      setFilteredTimetable(teacherTimetable);
    }
    console.log("changing");
  }, [searchTerm, teacherTimetable]);

  const moveColumn = useCallback(
    (fromIndex, toIndex) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        return newColumns;
      });

      setTeacherWeekTimetable((prevTimetable) => {
        const newTimetable = { ...prevTimetable };
        newTimetable[selectedDay] = newTimetable[selectedDay].map((teacher) => {
          const newSessions = [...teacher.sessions];
          const [movedSession] = newSessions.splice(fromIndex, 1);
          newSessions.splice(toIndex, 0, movedSession);
          return { ...teacher, sessions: newSessions };
        });
        return newTimetable;
      });
    },
    [selectedDay, setTeacherWeekTimetable]
  );

  const moveSession = useCallback(
    (draggedSession, toRowIndex, toColumnIndex) => {
      setTeacherWeekTimetable((prevTimetable) => {
        const newTimetable = { ...prevTimetable };
        const newDayTimetable = [...newTimetable[selectedDay]];

        // Get source and destination details
        const fromRowIndex = draggedSession.rowIndex;
        const fromColumnIndex = draggedSession.columnIndex;

        // If trying to drop in the same group, return without changes
        if (fromRowIndex === toRowIndex && fromColumnIndex === toColumnIndex) {
          return prevTimetable;
        }

        // Get the session groups
        const fromTeacher = newDayTimetable[fromRowIndex];
        const toTeacher = newDayTimetable[toRowIndex];
        const fromSessionGroup = fromTeacher.sessions[fromColumnIndex];
        const toSessionGroup = toTeacher.sessions[toColumnIndex];

        // Use the exact index from draggedSession
        const sessionToMove = {
          ...fromSessionGroup[draggedSession.sessionIndex],
        };

        // Remove session from source group
        fromSessionGroup.splice(draggedSession.sessionIndex, 1);

        // Add free period if source group becomes empty
        if (fromSessionGroup.length === 0) {
          fromSessionGroup.push({
            subject: null,
            type: null,
            elective_group_id: null,
            subject_id: null,
            elective_subject_name: null,
            room: null,
            class_details: null,
          });
        }

        // Handle destination group
        if (toSessionGroup.length === 1 && toSessionGroup[0].subject === null) {
          // Remove free period if it's the only session
          toSessionGroup.length = 0;
        }

        // Add session to destination group
        toSessionGroup.push(sessionToMove);

        // Update the timetable structure
        fromTeacher.sessions[fromColumnIndex] = fromSessionGroup;
        toTeacher.sessions[toColumnIndex] = toSessionGroup;

        return newTimetable;
      });
    },
    [selectedDay, setTeacherWeekTimetable]
  );
useEffect(()=>{

  console.log("iam changing")
},[teacherTimetable])
  const hasConflict = (teacherIndex, sessionIndex) => {
    return (
      conflicts?.length > 0 &&
      conflicts.some(
        (conflict) =>
          conflict.session === sessionIndex + 1 &&
          conflict.teachers.some(
            (teacher) =>
              teacher.id === filteredTimetable[teacherIndex].instructor.id
          )
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="shadow-xl rounded-lg bg-white dark:bg-gray-800 overflow-auto max-h-[88%] w-full">
        <table className="border-collapse w-full hf">
          <thead>
            <tr className="sticky left-0 top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200 p-4 font-semibold">
              <th className="p-4 font-semibold">Teacher</th>
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
            {filteredTimetable?.map((teacher, teacherIndex) => (
              <tr key={teacherIndex}>
                <td className="sticky left-0 bg-white dark:bg-gray-800 border p-4 z-10 backdrop-blur-md bg-opacity-50">
                  <EditTeacherListCard
                    sessions={teacher?.sessions.flat() || []}
                    teacher={teacher.instructor}
                  />
                </td>
                {teacher.sessions.map((sessionGroup, columnIndex) => (
                  <DroppableCell
                    key={columnIndex}
                    rowIndex={teacherIndex}
                    columnIndex={columnIndex}
                    sessions={sessionGroup}
                    moveSession={moveSession}
                    hasConflict={hasConflict}
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

export default DraggableTeacherTimetable;
