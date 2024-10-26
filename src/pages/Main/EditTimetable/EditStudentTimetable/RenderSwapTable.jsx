import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../context/Authcontext";
import { Avatar } from "@mui/material";
import { RoomServiceOutlined } from "@mui/icons-material";
import { GroupIcon } from "lucide-react";

const getSessionBorderColor = (session) => {
  if (!session || !session.name) {
    return "border-gray-300 dark:border-gray-300";
  }
  switch (session.type) {
    case "Core":
      return "border-blue-500";
    case "Elective":
      return "border-purple-500";
    default:
      return "border-gray-300";
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

const getAvatarColor = (standard, division) => {
  const hue =
    (standard?.charCodeAt(0) * 44 + division?.charCodeAt(0) * 5) % 360;
  return `hsl(${hue}, 70%, ${80}%)`;
};

const ClassroomInfoCard = ({ classroom }) => {
  return (
    <div className="w-full bg-light-secondary dark:bg-dark-secondary bg-opacity-20 shadow-sm rounded-lg transition-transform transform hover:-translate-y-0.5">
      <div className="p-3">
        <div className="flex items-center mb-2">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: "1rem",
              marginRight: "12px",
              color: "white",
              flexShrink: 0,
            }}
          >
            {`${classroom?.standard}${classroom?.division}`.substring(0, 4)}
          </Avatar>

          <div className="min-w-0">
            <h3 className="font-bold text-xs dark:text-dark-text truncate">
              {classroom?.class_id}
            </h3>
            <p className="text-vs text-slate-400 dark:text-dark-muted truncate">
              {`${classroom?.room.name}  `}
            </p>
            <p className="text-slate-500 dark:text-dark-text mt-1 font-bold text-vs truncate">
              {`(Room No: ${classroom?.room.room_number})`}
            </p>
          </div>
        </div>

        <hr className="mb-2 border-slate-300 dark:border-dark-border" />

        <div className="flex justify-center gap-2">
          <div className="flex flex-col justify-center items-center gap-0.5">
            <GroupIcon
              className="text-light-primary dark:text-dark-accent"
              style={{ fontSize: "1rem" }}
            />
            <p className="text-vs font-Roboto text-slate-500 dark:text-dark-muted font-medium">
              {classroom?.total_students} Students
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-0.5">
            <RoomServiceOutlined
              className="text-light-primary dark:text-dark-accent"
              style={{ fontSize: "1rem" }}
            />
            <p className="text-vs text-slate-500 dark:text-dark-muted font-medium capitalize">
              {classroom?.room.room_type.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const sessionVariants = {
  initial: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  swap: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.3 },
  },
};

const SessionCard = ({ session, isSwapping, direction }) => {
  const { apiDomain } = useAuth();

  return (
    <div
      className={`
        relative w-full mb-1 last:mb-0 border-t-2 rounded-md overflow-hidden
        ${getSessionBorderColor(session)} ${getSessionColor(session)}
        transition-all duration-500 ease-out
        ${isSwapping ? "animate-session-swap" : ""}
        ${isSwapping && direction === "left" ? "origin-right" : "origin-left"}
      `}
    >
      <div className="flex justify-between items-start mb-1 gap-1">
        <p className="font-semibold text-xs truncate max-w-[120px]">
          {session.name}
        </p>
        <span
          className={`text-vs px-1.5 py-0.5 rounded-full whitespace-nowrap 
          ${
            session?.type === "Elective"
              ? "bg-blue-100 text-blue-800 dark:bg-dark-secondary dark:text-dark-text"
              : "bg-purple-100 text-purple-800 dark:bg-dark-primary dark:text-dark-text"
          }`}
        >
          {session?.type}
        </span>
      </div>

      {session.class_distribution.map((distribution, index) => (
        <div
          key={index}
          className="mt-1 bg-white dark:bg-dark-secondary bg-opacity-50 rounded-md p-1.5"
        >
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center">
              <Avatar
                className="w-6 h-6 min-w-[24px] rounded-full mr-1.5 border border-white dark:border-dark-border"
                src={
                  distribution.teacher.profile_image
                    ? `${apiDomain}/${distribution.teacher.profile_image}`
                    : undefined
                }
              >
                {distribution.teacher.name.charAt(0)}
              </Avatar>
              <div className="min-w-0">
                <p className="text-vs font-medium dark:text-dark-text truncate max-w-[120px]">
                  {distribution.teacher.name}
                </p>
                <p className="text-vs text-gray-500 dark:text-dark-muted truncate max-w-[120px]">
                  {distribution.subject}
                </p>
              </div>
            </div>
          </div>
          <div className="text-vs">
            <p className="text-gray-600 dark:text-dark-muted truncate">
              Room: {distribution.room.name} ({distribution.room.number})
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


const RenderSwapTable = ({
  option,
  setShowFullView,
  setSelectedOption,
  selected = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (selected) {
      const interval = setInterval(() => {
        setIsAnimating(true);

        // Reset animation after completion
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  return (
    <>
      <style jsx global>{`
        @keyframes session-swap {
          0% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-20px) scale(0.95);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-session-swap {
          animation: session-swap 1s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }
      `}</style>

      <div className="overflow-x-auto">
        <table className="border-collapse table-fixed">
          <thead>
            <tr
              className="sticky left-0 top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
              dark:from-gray-800 dark:to-gray-500 dark:text-gray-200"
            >
              <th className="w-44 p-2 font-semibold text-left text-xs">
                Class Info
              </th>
              {option.headers.slice(1).map((header, idx) => (
                <th
                  key={idx}
                  className="w-48 p-2 font-semibold text-left text-xs"
                >
                  {typeof header === "string"
                    ? header
                    : `${header.dayofweek} - Period ${
                        header.sessiongrpindx + 1
                      }`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {option.Classrooms.map((classroom, idx) => (
              <tr
                key={idx}
                onClick={() => {
                  setSelectedOption(option);
                  setShowFullView(true);
                }}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-secondary"
              >
                <td className="w-44 p-2 border-b dark:border-dark-border">
                  <ClassroomInfoCard classroom={classroom?.classroom} />
                </td>
                {classroom.sessions.map((session, sessionIndex) => {
                  const isLastTwoCells =
                    sessionIndex >= classroom.sessions.length - 2;
                  const swapPartner =
                    sessionIndex === classroom.sessions.length - 2
                      ? classroom.sessions.length - 1
                      : classroom.sessions.length - 2;

                  const displaySession =
                    isLastTwoCells && isAnimating
                      ? classroom.sessions[swapPartner]
                      : session;

                  return (
                    <td
                      key={sessionIndex}
                      className="w-48 p-2 border-b dark:border-dark-border"
                    >
                      <SessionCard
                        key={`${sessionIndex}-${isAnimating}`}
                        session={displaySession}
                        isSwapping={isLastTwoCells && isAnimating}
                        direction={
                          sessionIndex === classroom.sessions.length - 2
                            ? "right"
                            : "left"
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default RenderSwapTable;
