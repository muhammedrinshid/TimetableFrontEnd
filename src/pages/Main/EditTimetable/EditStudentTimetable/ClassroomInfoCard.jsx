import React from "react";
import { Avatar } from "@mui/material";
import { Group as GroupIcon, Room as RoomIcon } from "@mui/icons-material";

const ClassroomInfoCard = ({ classData }) => {
  const { classroom } = classData;

  const getAvatarColor = (standard, division) => {
    const hue =
      (standard?.charCodeAt(0) * 44 + division.charCodeAt(0) * 5) % 360;
    return `hsl(${hue}, 70%, ${80}%)`;
  };

  return (
    <div className="max-w-sm bg-light-secondary dark:bg-dark-secondary bg-opacity-20 shadow-md rounded-2xl transition-transform transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Avatar
            sx={{
              bgcolor: getAvatarColor(classroom.standard, classroom.division),
              width: 56,
              height: 56,
              fontSize: "1.5rem",
              marginRight: "16px",
              color: "white",
            }}
          >
            {`${classroom.standard}${classroom.division}`.substring(0, 4)}
          </Avatar>

          <div>
            <h3 className="font-bold text-sm dark:text-dark-text">
              {classroom.class_id}
            </h3>
            <p className="text-xs text-slate-400 dark:text-dark-muted text-nowrap">
              {`${classroom.room.name}  `}{" "}
            </p>
            <p className="text-slate-500 dark:text-dark-text mt-2 font-bold text-sm text-nowrap">{`(Room No: ${classroom.room.room_number})`}</p>
          </div>
        </div>

        <hr className="mb-4 border-slate-300 dark:border-dark-border" />

        <div className="flex justify-center gap-3">
          <div className="flex flex-col justify-center items-center gap-1">
            <GroupIcon
              className="text-light-primary dark:text-dark-accent"
              style={{ fontSize: "1.25rem" }}
            />
            <p className="text-xs font-Roboto text-slate-500 dark:text-dark-muted font-medium">
              {classroom.total_students} Students
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <RoomIcon
              className="text-light-primary dark:text-dark-accent"
              style={{ fontSize: "1.25rem" }}
            />
            <p className="text-xs text-slate-500 dark:text-dark-muted font-medium capitalize">
              {classroom.room.room_type.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomInfoCard;
