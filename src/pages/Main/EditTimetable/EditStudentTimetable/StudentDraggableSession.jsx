import React from "react";
import { useAuth } from "../../../../context/Authcontext";
import { useDrag } from "react-dnd";
import {
  Avatar,
  Button,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mui/material";
import { UserCog2, UserPlus2 } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import { CancelPresentation, ChangeCircleOutlined } from "@mui/icons-material";
import { SiGoogleclassroom } from "react-icons/si";

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
  classroomId,
  columnIndex,
  sessionIndex,
  selectedDay,
  handleOpenRoomChangeDialog,
  openChangeOrSwapSessionDialog,
  handleOpenTeacherChangeDialog,
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
      {session?.class_distribution?.map((distribution, distributionIndex) => (
        <div
          key={distributionIndex}
          className="mt-2 bg-white dark:bg-dark-secondary bg-opacity-50 rounded-md p-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
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

            <Tooltip title="Reassign Teacher" arrow>
              <Button

              onClick={()=>handleOpenTeacherChangeDialog(distribution?.teacher,columnIndex,session?.session_key,distribution?.subject)}
                size="small"
                variant="outlined"
                sx={{
                  minWidth: "24px",
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                  },
                  ".dark &": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                  },
                }}
              >
                <UserCog2 className="h-3 w-3 text-gray-600 dark:text-dark-muted" />
              </Button>
            </Tooltip>
          </div>

          <div className="text-xs">
            {session?.type === "Elective" && (
              <p className="text-gray-600 dark:text-dark-muted">
                Students: {distribution.number_of_students_from_this_class}
              </p>
            )}
            {distribution.room && (
              <p className="text-xs mb-2 flex justify-start gap-1 items-center text-gray-500 dark:text-gray-400">
                <span className="font-medium">
                  Room: {distribution.room.name} (
                  {distribution.room?.room_number})
                </span>
                <Tooltip title="Change Room">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: "24px",
                      width: "24px",
                      height: "24px",
                      padding: 0,
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                      },
                      ".dark &": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          borderColor: "rgba(255, 255, 255, 0.23)",
                        },
                      },
                    }}
                    onClick={() =>
                      handleOpenRoomChangeDialog(
                        classroomId,
                        columnIndex,
                        session?.session_key,
                        distribution.room
                      )
                    }
                  >
                    <SiGoogleclassroom className="text-gray-500 text-sm" />
                  </Button>
                </Tooltip>
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="w-full flex flex-row justify-around self-end mt-2">
        {/* <div className="basis-1/3 flex justify-center items-center  border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
          <Tooltip title="Swap session">
            <IconButton
              disabled={session.type == "Elective"}
              size="small"
              className="p-1 rounded-full light-background-1 hover:shadow-md transition-all duration-300"
            >
              <FaExchangeAlt className="text-sm dark:text-white text-slate-500" />
            </IconButton>
          </Tooltip>
        </div> */}

        <div className="basis-1/3 flex justify-center items-center  border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-600 dark:hover:text-gray-200">
          <Tooltip title="Swap session">
            <IconButton
              disabled={session.type == "Elective"}
              onClick={() =>
                openChangeOrSwapSessionDialog(
                  classroomId,
                  columnIndex,
                  session,
                  selectedDay
                )
              }
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

export default StudentDraggableSession;
