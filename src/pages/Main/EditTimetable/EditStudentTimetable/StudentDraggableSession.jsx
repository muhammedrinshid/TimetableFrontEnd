import React from "react";
import { useAuth } from "../../../../context/Authcontext";
import { useDrag } from "react-dnd";
import { Avatar } from "@mui/material";

const getSessionBorderColor = (session) => {
  if (!session || !session.name) {
    return "border-gray-300 dark:border-gray-300";
  }
  switch (session.type) {
    case "Core":
      return "border-blue-500 ";
    case "Elective":
      return "border-purple-500 ";
    default:
      return "border-gray-300 ";
  }
};

const getSessionColor = (session) => {
  switch (session.type) {
    case "Core":
      return "bg-blue-100 text-blue-800 dark:bg-dark-primaryShades-600 dark:text-dark-text";
    case "Elective":
      return "bg-purple-100 text-purple-800 dark:bg-dark-primaryShades-500 dark:text-dark-text";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-dark-primaryShades-600 dark:text-dark-text";
  }
};

const StudentDraggableSession = ({
  session,
  rowIndex,
  columnIndex,
  sessionIndex,
  selectedDay,
  
  teacherWeekTimetable,
  handleOpenRoomChangeDialog,
}) => {
  const { darkMode, apiDomain } = useAuth();

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
      <div className="flex justify-between items-start mb-2">
        <p className="font-semibold text-sm truncate flex-grow">
          {session.name}
        </p>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            session?.type === "Elective"
              ? "bg-blue-100 text-blue-800 dark:bg-dark-secondary dark:text-dark-text"
              : "bg-purple-100 text-purple-800 dark:bg-dark-primary dark:text-dark-text"
          }`}
        >
          {session?.type}
        </span>
      </div>
      {session.class_distribution.map((distribution, distributionIndex) => (
        <div
          key={distributionIndex}
          className="mt-2 bg-white dark:bg-dark-secondary bg-opacity-50 rounded-md p-2"
        >
          <div className="flex items-center mb-1">
            <Avatar
              alt={distribution.teacher.name}
              src={
                distribution.teacher.profile_image
                  ? `${apiDomain}/${distribution.teacher.profile_image}`
                  : undefined
              }
              className="w-8 h-8 rounded-full mr-2 border-2 border-white dark:border-dark-border"
            >
              {!distribution.teacher.profile_image &&
                distribution.teacher.name.charAt(0)}
            </Avatar>
            <div>
              <p className="text-xs font-medium dark:text-dark-text">
                {distribution.teacher.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                {distribution.subject}
              </p>
            </div>
          </div>
          <div className="text-xs">
            {session?.type == "Elective" && (
              <p className="text-gray-600 dark:text-dark-muted">
                Students: {distribution.number_of_students_from_this_class}
              </p>
            )}
            {
              <p className="text-gray-600 dark:text-dark-muted">
                Room: {distribution.room.name} ({distribution.room.number})
              </p>
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentDraggableSession;
