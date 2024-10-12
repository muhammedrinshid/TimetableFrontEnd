import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tooltip, IconButton } from "@mui/material";
import {
  CheckIcon,
  CancelPresentationIcon,
  ChangeCircleIcon,
  CopyAllIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../../context/Authcontext";

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
    <div ref={(node) => drag(drop(node))} className="column">
      {children}
    </div>
  );
};

const DraggableCell = ({ rowIndex, columnIndex, children, moveCell }) => {
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
    <div
      ref={(node) => drag(drop(node))}
      className="cell"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

const getSessionColor = (session, teacher, index) => {
  let colorClass = "";

  if (!session.subject) {
    colorClass =
      "bg-gradient-to-b from-green-200 via-white to-green-200 text-green-90 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 dark:text-gray-400 bg-gradient-moving";
  } else {
    switch (session.type) {
      case "Core":
        colorClass =
          "from-blue-200 bg-gradient-to-b via-white to-blue-200 text-blue-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-800 dark:to-black dark:text-gray-200";
        break;
      case "Elective":
        colorClass =
          "from-purple-300 bg-gradient-to-b via-white to-purple-200 text-purple-900 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-300";
        break;
      default:
        colorClass =
          "bg-gradient-moving bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-700 dark:to-black dark:text-gray-400";
        break;
    }
  }

  if (teacher?.sessions[index]?.subject !== null) {
    colorClass += " blinking-top-border leave__card";
  }

  return colorClass;
};

const getSessionBorderColor = (session) => {
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
}) => {
  const { darkMode } = useAuth();

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
        <div className="session-card flex flex-col h-full p-3">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
              {session.subject || session.elective_subject_name}
            </h3>
            <div
              className={`${
                session.type === "Core"
                  ? "bg-green-500 dark:bg-green-400 text-white"
                  : "bg-yellow-500 dark:bg-yellow-400 text-gray-900 dark:text-white"
              } text-vs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
            >
              {session.type?.charAt(0)}
            </div>
          </div>
          {session.room && (
            <p className="room text-xs mb-3 flex justify-between items-center text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                Room {session.room.room_number}
              </span>
            </p>
          )}
          {session.class_details && (
            <div className="class-details text-sm flex-grow">
              {session.class_details.map((classDetail, index) => (
                <div
                  key={index}
                  className="class-info flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-600 bg-opacity-50 rounded-md p-2"
                >
                  <span className="class-name font-semibold text-gray-900 dark:text-white text-sm text-nowrap">
                    {classDetail.standard} {classDetail.division}
                  </span>
                  {session.type === "Elective" && (
                    <span className="student-count text-gray-500 dark:text-gray-400 text-vs text-nowrap justify-self-end">
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
        <div className="free-period text-center py-8">
          <p className="font-semibold text-xl text-gray-500 dark:text-gray-400">
            Free Period
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Time to recharge!
          </p>
        </div>
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="shadow-xl rounded-lg bg-white dark:bg-gray-800 max-h-full max-w-full overflow-scroll">
        <div
          className="flex relative"
          style={{
            minWidth: `${150 + NumberOfPeriodsInAday * 180}px`,
          }}
        >
          <div className="sticky left-0 top-0 z-20" style={{ width: "150px" }}>
            <div className="bg-gradient-to-r sticky left-0 top-0 z-20 from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200 p-4 font-semibold h-16 flex items-center">
              Teacher
            </div>
            {teacherTimetable?.map((teacher, teacherIndex) => (
              <div
                key={teacherIndex}
                className="border-b p-4 h-32 flex items-center"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={teacher.instructor.profile_image}
                    alt={`${teacher.instructor.name} ${teacher.instructor.surname}`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-sm">
                    {teacher.instructor.name} {teacher.instructor.surname}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {columns.map((header, columnIndex) => (
            <DraggableColumn
              key={columnIndex}
              columnIndex={columnIndex}
              moveColumn={moveColumn}
            >
              <div className="w-[180px]">
                <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:to-gray-500 dark:text-gray-200 p-4 font-semibold h-16 flex items-center justify-center">
                  {header}
                </div>
                {teacherTimetable?.map((teacher, teacherIndex) => {
                  const session = teacher.sessions[columnIndex];
                  return (
                    <DraggableCell
                      key={`${teacherIndex}-${columnIndex}`}
                      rowIndex={teacherIndex}
                      columnIndex={columnIndex}
                      moveCell={moveCell}
                    >
                      <div className="border-b p-2 h-32">
                        <div
                          className={`rounded-lg h-full ${getSessionColor(
                            session,
                            teacher,
                            columnIndex
                          )} transition-all duration-300 hover:shadow-lg hover:scale-102 relative overflow-hidden`}
                          style={{
                            borderTop: `4px solid ${getSessionBorderColor(
                              session
                            )}`,
                          }}
                        >
                          {renderSessionContent(session)}
                          {/* Action buttons can be added here if needed */}
                        </div>
                      </div>
                    </DraggableCell>
                  );
                })}
              </div>
            </DraggableColumn>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default DraggableTeacherTimetable;
