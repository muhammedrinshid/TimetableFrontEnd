import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip, IconButton, Avatar } from "@mui/material";
import {
  CheckIcon,
  CancelPresentationIcon,
  ChangeCircleIcon,
  CopyAllIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../../context/Authcontext";
import EditTeacherListCard from "./EditTeacherListCard";
import { useConflictChecker } from "../../../../hooks/useConflictChecker";

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
    <th ref={(node) => drag(drop(node))} className=" p-4 font-semibold">
      {children}
    </th>
  );
};

const DraggableCell = ({
  rowIndex,
  columnIndex,
  children,
  moveCell,
  hasConflict,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CELL",
    item: { rowIndex, columnIndex, type: "CELL" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CELL",
    drop: (draggedItem) => {
      if (
        draggedItem.rowIndex !== rowIndex ||
        draggedItem.columnIndex !== columnIndex
      ) {
        moveCell(
          draggedItem.rowIndex,
          draggedItem.columnIndex,
          rowIndex,
          columnIndex
        );
      }
    },
  });

  return (
    <td
      ref={(node) => drag(drop(node))}
      className={`border p-2  ${
        hasConflict(rowIndex, columnIndex) ? "bg-red-200 error" : ""
      }`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        minWidth: "180px",
        height: "160px",
      }}
    >
      {children}
    </td>
  );
};

const getSessionColor = (session) => {
  if (!session.subject) {
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

const getSessionBorderColor = (session, hasError = false) => {
  switch (session.type) {
    case "Core":
      return "border-blue-500 dark:border-gray-800";
    case "Elective":
      return "border-purple-500 dark:border-gray-500";
    default:
      return "border-gray-300 dark:border-gray-300";
  }
};


const DraggableTeacherTimetable = ({
  teacherTimetable,
  selectedDay,
  setTeacherWeekTimetable,
  NumberOfPeriodsInAday,
  searchTerm,
  setConflicts,
  conflicts
}) => {
  const { darkMode, apiDomain } = useAuth();
  const [filteredTimetable, setFilteredTimetable] = useState(teacherTimetable);

  const [columns, setColumns] = useState(
    Array.from({ length: NumberOfPeriodsInAday }, (_, i) => `Period ${i + 1}`)
  );

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

  const moveCell = useCallback(
    (fromRowIndex, fromColumnIndex, toRowIndex, toColumnIndex) => {
      setTeacherWeekTimetable((prevTimetable) => {
        const newTimetable = { ...prevTimetable };
        const newDayTimetable = [...newTimetable[selectedDay]];

        const fromTeacher = { ...newDayTimetable[fromRowIndex] };
        const toTeacher = { ...newDayTimetable[toRowIndex] };

        const fromSession = { ...fromTeacher.sessions[fromColumnIndex] };
        const toSession = { ...toTeacher.sessions[toColumnIndex] };

        fromTeacher.sessions[fromColumnIndex] = toSession;
        toTeacher.sessions[toColumnIndex] = fromSession;

        newDayTimetable[fromRowIndex] = fromTeacher;
        newDayTimetable[toRowIndex] = toTeacher;

        newTimetable[selectedDay] = newDayTimetable;

        return newTimetable;
      });
    },
    [selectedDay, setTeacherWeekTimetable]
  );



  

  const renderSessionContent = (session) => {
    if (session.subject) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Tooltip title={session.subject || session.elective_subject_name}>
              <h3 className="font-bold text-sm leading-tight truncate max-w-[70%]">
                {session.subject || session.elective_subject_name}
              </h3>
            </Tooltip>
            <div
              className={`${
                session.type === "Core"
                  ? "bg-green-500 dark:bg-green-400 text-white"
                  : "bg-yellow-500 dark:bg-yellow-400 text-gray-900 dark:text-white"
              } text-xs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
            >
              {session.type?.charAt(0)}
            </div>
          </div>
          {session.room && (
            <p className="text-xs mb-2 flex justify-between items-center text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                Room {session.room.room_number}
              </span>
            </p>
          )}
          {session.class_details && (
            <div className="text-xs flex-grow overflow-y-auto">
              {session.class_details.map((classDetail, index) => (
                <div
                  key={index}
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
    } else {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-500 dark:text-gray-400">
              Free Period
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Time to recharge!
            </p>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = teacherTimetable?.filter((teacher) => {
        const nameMatch = teacher.instructor.name
          .toLowerCase()
          .includes(lowercasedSearch);
        const sessionMatch = teacher.sessions.some((session) => {
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
        });
        return nameMatch || sessionMatch;
      });
      setFilteredTimetable(filtered);
    } else {
      setFilteredTimetable(teacherTimetable);
    }
  }, [searchTerm, teacherTimetable]);

  const checkedConflicts = useConflictChecker(teacherTimetable, "teacher");
 useEffect(() => {
   setConflicts(checkedConflicts);
   console.log(checkedConflicts)
 }, [checkedConflicts]);

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
        {/* Table that should scroll */}
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
                    sessions={teacher?.sessions || []}
                    teacher={teacher.instructor}
                  />
                </td>
                {teacher.sessions.map((session, columnIndex) => (
                  <DraggableCell
                    key={columnIndex}
                    rowIndex={teacherIndex}
                    columnIndex={columnIndex}
                    moveCell={moveCell}
                    hasConflict={hasConflict}
                  >
                    <div
                      className={`rounded-lg h-full ${getSessionColor(
                        session
                      )} transition-all duration-300 hover:shadow-lg relative overflow-hidden border-t-4 ${getSessionBorderColor(
                        session
                      )} p-2`}
                    >
                      {renderSessionContent(session)}
                    </div>
                  </DraggableCell>
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
