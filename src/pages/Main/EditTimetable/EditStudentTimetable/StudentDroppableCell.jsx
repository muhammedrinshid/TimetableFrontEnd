import React from "react";

import { useDrop } from "react-dnd";
import StudentDraggableSession from "./StudentDraggableSession";
import { IconButton, Tooltip } from "@mui/material";
import { MdAssignmentReturn } from "react-icons/md";

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

const StudentDroppableCell = ({
  rowIndex,
  columnIndex,
  sessions,
  moveSession,
  hasConflict,
  teacher,
  handleOpenRoomChangeDialog,
  selectedDay,
  openChangeOrSwapSessionDialog,
  classData,
  handleOpenTeacherChangeDialog,
  handleOpenAssignOverlappingSession
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
      className={`border rounded-lg ${
        hasConflict(classData?.classroom?.id, columnIndex)
          ? "bg-red-200 error"
          : ""
      }`}
      style={{
        minWidth: "180px",
        height: "160px",
      }}
    >
      <div
        className={`h-full transition-all duration-300 hover:shadow-lg relative flex flex-col justify-center p-2 rounded-lg`}
      >
        {sessions.length === 0 || !sessions[0].name ? (
          <div
            className={`mb-2 last:mb-0 border-t-4 rounded-lg overflow-hidden ${getSessionColor(
              sessions[0]
            )} h-full flex items-center justify-center bg-opacity-50 backdrop-blur-sm`}
          >
            <div className="text-center p-4 space-y-2">
              <p className="font-medium text-sm tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                Free Period
              </p>

              <div className="w-12 h-0.5 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full" />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-light tracking-wide">
                Time to recharge!
              </p>
              <Tooltip title="Assign Overflow Lesson" arrow>
                <IconButton onClick={()=>handleOpenAssignOverlappingSession(classData?.classroom?.id, selectedDay, columnIndex)}>
                  <MdAssignmentReturn className="text-xl text-slate-500" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="space-y-1 h-full">
            {sessions.map((session, index) => (
              <StudentDraggableSession
                key={index}
                session={session}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                sessionIndex={index}
                moveSession={moveSession}
                teacher={teacher}
                selectedDay={selectedDay}
                openChangeOrSwapSessionDialog={openChangeOrSwapSessionDialog}
                classroomId={classData?.classroom?.id}
                handleOpenRoomChangeDialog={handleOpenRoomChangeDialog}
                handleOpenTeacherChangeDialog={handleOpenTeacherChangeDialog}
              />
            ))}
          </div>
        )}
      </div>
    </td>
  );
};

export default StudentDroppableCell;
