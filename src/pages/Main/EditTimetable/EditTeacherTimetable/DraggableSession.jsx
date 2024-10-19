import React from 'react'
import { useAuth } from '../../../../context/Authcontext';
import { useDrag } from 'react-dnd';
import { IconButton, Tooltip } from "@mui/material";
import {  FaExchangeAlt } from "react-icons/fa";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";



const getSessionBorderColor = (session) => {
  if (!session || !session.subject) {
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



const DraggableSession = ({
  session,
  rowIndex,
  columnIndex,
  sessionIndex,
  selectedDay,
  teacher,
  onOpenTeacherSwapDialog,
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

  const handleOpenSwapDialog = () => {
    onOpenTeacherSwapDialog(
      teacher?.instructor.id,
      selectedDay,
      columnIndex,
      session,
      teacherWeekTimetable
    );
  };
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
                ? "bg-blue-500 dark:bg-blue-400 text-whit bg-opacity-30"
                : "bg-purple-500 dark:bg-purple-400 text-gray-900 dark:text-white bg-opacity-30"
            } text-xs font-semibold uppercase rounded-full tracking-wider py-1 px-2`}
          >
            {session.type?.charAt(0)}
          </div>
        )}
      </div>
      {session.room && (
        <p className="text-xs mb-2 flex justify-start gap-1 items-center text-gray-500 dark:text-gray-400">
          <span className="font-medium">Room {session.room.room_number}</span>
          <Tooltip title="Change Room">
            <IconButton
              onClick={() =>
                handleOpenRoomChangeDialog(
                  teacher.instructor.id,
                  columnIndex,
                  sessionIndex,
                  session.room
                )
              }
            >
              <FaExchangeAlt className="text-gray-500 text-sm" />
            </IconButton>
          </Tooltip>
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

      <div className="w-full flex flex-row justify-around self-end mt-2">
        <div className="basis-1/3 flex justify-center items-center p-1 border-t border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
          <Tooltip title="Absent this period">
            <IconButton
              size="small"
              className="p-1 rounded-full light-background-1 hover:shadow-md transition-all duration-300"
            >
              <CancelPresentationIcon
                fontSize="small"
                sx={{
                  color: darkMode ? "#FFFFFF" : "#1F1F1F",
                }}
              />
            </IconButton>
          </Tooltip>
        </div>

        <div className="basis-1/3 flex justify-center items-center border-t border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
          <Tooltip title="Assign a free teacher">
            <IconButton
              size="small"
              className="p-1 rounded-full light-background-1 hover:shadow-md transition-all duration-300"
            >
              <ChangeCircleIcon
                fontSize="small"
                sx={{ color: darkMode ? "#FFFFFF" : "#1F1F1F" }}
              />
            </IconButton>
          </Tooltip>
        </div>

        <div className="basis-1/3 flex justify-center items-center border-t border-l border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
          <Tooltip title="Copy data">
            <IconButton
              onClick={handleOpenSwapDialog}
              disabled={session.type == "Elective"}
              size="small"
              className="p-1 rounded-full light-background-1 hover:shadow-md transition-all duration-300"
            >
              <FaExchangeAlt className="text-sm dark:text-white text-slate-500" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};


export default DraggableSession