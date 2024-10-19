import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import {
  ArrowLeftRight,
  CalendarDays,
  X as CloseIcon,
  ArrowLeft,
} from "lucide-react";
import RoomAvailabilityDisplayer from "./RoomAvailabilityDisplayer";
import { useAuth } from "../../../../context/Authcontext";

const RoomChangeDialog = ({
  open,
  onClose,
  availableRooms,
  teacherWeekTimetable,
  selectedDay,
  selectedSessionForRoomNumber,
  roomChangeDialogOpen,
  setRoomChangeDialogOpen,
}) => {

    const {apiDomain}=useAuth()
  const handleBack = () => {
    setRoomChangeDialogOpen((prev) => ({
      isOpen: prev.isOpen,
      fromRoom: prev.fromRoom,
      toRoom: null,
      type: null,
    }));
  };

const findSessions = () => {
  const { fromRoom, toRoom } = roomChangeDialogOpen;
  const dayTeachers = teacherWeekTimetable[selectedDay] || [];

  let fromTeacher = null;
  let toTeacher = null;
  let fromSession = null;
  let toSession = null;
  const fromRoomId =fromRoom.room.id;
  const toRoomId = toRoom.room.id  
console.log(toRoom, fromRoom);

  dayTeachers.forEach((teacher) => {
    // Get the session group for the selected session
    const periodSessions =
      teacher.sessions?.[selectedSessionForRoomNumber] || [];

    // Iterate through each session within the session group
    periodSessions.forEach((session) => {
      
      const sessionRoomId = session?.room?.id;

      if (sessionRoomId === fromRoomId) {
        fromTeacher = teacher.instructor || teacher;
        fromSession = session;
      }
      if (sessionRoomId === toRoomId) {
        toTeacher = teacher.instructor || teacher;
        toSession = session;
      }
    });
  });

  return {
    fromTeacher,
    toTeacher,
    fromSession,
    toSession,
  };
};

const renderTeacherInfo = (instructor) => {

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-2">
        <Avatar
          src={
            instructor?.profile_image
              ? `${apiDomain}/${instructor.profile_image}`
              : "/api/placeholder/40/40"
          }
          sx={{
            width: 40,
            height: 40,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "2px solid #fff",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
        <div className="min-w-0">
          <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
            {instructor.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {instructor.teacherId}
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderSession = (session, previewRoom = null) => {
    if (!session) return null;

    const getSessionColor = (session) => {
      switch (session.type) {
        case "Core":
          return "bg-gradient-to-b from-blue-200 via-white to-blue-200 text-blue-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-800 dark:to-black dark:text-gray-200";
        case "Elective":
          return "bg-gradient-to-b from-purple-300 via-white to-purple-200 text-purple-900 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-300";
        default:
          return "bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 dark:bg-gradient-to-r dark:from-black dark:via-gray-700 dark:to-black dark:text-gray-400";
      }
    };

    const displayRoom = previewRoom
      ? {
          ...session.room,
          room_number:
            typeof previewRoom === "object"
              ? previewRoom.room_number
              : previewRoom,
        }
      : session.room;

    return (
      <div className={`rounded-md p-3 ${getSessionColor(session)} shadow-sm`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-sm">
            {session.subject || session.elective_subject_name}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
            {session.type}
          </span>
        </div>

        {displayRoom && (
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-white/30 dark:bg-black/10 rounded px-2 py-1 mb-2">
            <span className="font-medium">Room {displayRoom.room_number}</span>
            <span className="text-gray-400">•</span>
            <span>{displayRoom.room_type}</span>
          </div>
        )}

        {session.class_details && (
          <div className="mt-2 space-y-1">
            {session.class_details.map((classDetail, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-black/20 rounded p-1.5 text-xs flex justify-between items-center"
              >
                <span className="font-medium">
                  {classDetail.standard} {classDetail.division}
                </span>
                {session.type === "Elective" && (
                  <span className="text-gray-500">
                    {classDetail.number_of_students} students
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const showPreview =
    roomChangeDialogOpen?.toRoom && roomChangeDialogOpen?.type;
  const sessions = showPreview ? findSessions() : null;

  // ... rest of your component code remains the same

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-indigo-900/20">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <Typography
              variant="h6"
              className="text-gray-800 dark:text-gray-200"
            >
              Room{" "}
              {showPreview
                ? roomChangeDialogOpen.type === "SWAP"
                  ? "Swap"
                  : "Change"
                : "Availability"}
            </Typography>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{selectedDay}</span>
            <span>•</span>
            <span>Period {selectedSessionForRoomNumber + 1}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showPreview && (
            <Button
              startIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleBack}
              variant="outlined"
              size="small"
            >
              Back to List
            </Button>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon className="w-5 h-5" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="p-6">
        {showPreview ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  {roomChangeDialogOpen.type === "SWAP"
                    ? "Room Swap Preview"
                    : "Room Change Preview"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructor
                </div>
                {renderTeacherInfo(sessions.fromTeacher)}
                {roomChangeDialogOpen.type === "SWAP" && (
                  <>
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    {renderTeacherInfo(sessions.toTeacher)}
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current
                </div>
                {renderSession(sessions.fromSession)}
                {roomChangeDialogOpen.type === "SWAP" && (
                  <>
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    {renderSession(sessions.toSession)}
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </div>
                {renderSession(
                  sessions.fromSession,
                  roomChangeDialogOpen.toRoom
                )}
                {roomChangeDialogOpen.type === "SWAP" && (
                  <>
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    {renderSession(
                      sessions.toSession,
                      roomChangeDialogOpen.fromRoom
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <RoomAvailabilityDisplayer
            availableRooms={availableRooms}
            teacherWeekTimetable={teacherWeekTimetable}
            selectedDay={selectedDay}
            selectedSessionForRoomNumber={selectedSessionForRoomNumber}
            roomChangeDialogOpen={roomChangeDialogOpen}
            setRoomChangeDialogOpen={setRoomChangeDialogOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomChangeDialog;
