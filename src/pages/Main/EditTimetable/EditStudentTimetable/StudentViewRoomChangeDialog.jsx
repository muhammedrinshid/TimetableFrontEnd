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
import { useAuth } from "../../../../context/Authcontext";
import { toast } from "react-toastify";
import StudentViewRoomAvailabilityDisplayer from "./StudentViewRoomAvailabilityDisplayer";

const StudentViewRoomChangeDialog = ({
  open,
  onClose,
  availableRooms,
  studentWeekTimetable,
  selectedDay,
  roomChangeDialogOpen,
  setRoomChangeDialogOpen,
  setStudentWeekTimetable,
}) => {
  console.log(roomChangeDialogOpen)
  const { apiDomain } = useAuth();
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
    const dayTeachers = studentWeekTimetable[selectedDay] || [];

    let fromTeacher = null;
    let toTeacher = null;
    let fromSession = null;
    let toSession = null;
    const fromRoomId = fromRoom.room.id;
    const toRoomId = toRoom.room.id;

    dayTeachers.forEach((teacher) => {
      // Get the session group for the selected session
      const periodSessions =
        teacher.sessions?.[
          roomChangeDialogOpen?.selectedSessionForRoomNumber
        ] || [];

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
  function handleSubmitSwapRooms(session1Param, session2Param) {
    const { fromRoom, toRoom } = roomChangeDialogOpen; // Assuming globally accessible `roomChangeDialogOpen`

    // Find the instructors by matching instructor.id with the teacherId
    const instructor1 = studentWeekTimetable?.[selectedDay]?.find(
      (teacher) => teacher.instructor.id === fromRoom.teacherId
    );
    const instructor2 = studentWeekTimetable?.[selectedDay]?.find(
      (teacher) => teacher.instructor.id === toRoom.teacherId
    );

    // Check if instructors are valid
    if (!instructor1 || !instructor2) {
      toast.error("Invalid instructor data found.");
      return;
    }

    // Fetch the sessions from the instructors
    const session1 =
      instructor1.sessions?.[fromRoom.sessionGrpIdx]?.[fromRoom.sessionIndex];
    const session2 =
      instructor2.sessions?.[toRoom.sessionGrpIdx]?.[toRoom.sessionIndex];

    // Validate that both sessions exist
    if (!session1 || !session2) {
      toast.error("Invalid session data found.");
      return;
    }

    // Ensure the passed sessions (session1Param, session2Param) match the fetched sessions (session1, session2)
    if (
      session1Param.session_key !== session1.session_key ||
      session2Param.session_key !== session2.session_key
    ) {
      toast.error("Internal error: Sessions do not match the fetched data.");
      return;
    }

    // Validation: Teachers must be different
    if (fromRoom.teacherId === toRoom.teacherId) {
      toast.error("The sessions must belong to different teachers.");
      return;
    }

    // Validation: Ensure sessions belong to the same session group
    if (fromRoom.sessionGrpIdx !== toRoom.sessionGrpIdx) {
      toast.error("Sessions must be in the same session group.");
      return;
    }

    // Validation: Prevent swapping the same session
    if (session1.session_key === session2.session_key) {
      toast.error("Cannot swap the same session.");
      return;
    }

    // Validation: Check if the rooms are already the same
    if (session1.room?.room_number === session2.room?.room_number) {
      toast.error("Both sessions already have the same room.");
      return;
    }

    // Validation: Ensure both sessions have valid rooms
    if (!session1.room || !session2.room) {
      toast.error("One or both sessions are missing room assignments.");
      return;
    }

    // Deep copy the timetable to safely modify it
    const updatedStudentWeekTimetable = JSON.parse(
      JSON.stringify(studentWeekTimetable)
    );

    // Find the specific instructor session arrays in the updated timetable
    const updatedInstructor1 = updatedStudentWeekTimetable[selectedDay].find(
      (teacher) => teacher.instructor.id === fromRoom.teacherId
    );
    const updatedInstructor2 = updatedStudentWeekTimetable[selectedDay].find(
      (teacher) => teacher.instructor.id === toRoom.teacherId
    );

    // Swap the rooms between session1 and session2 in the deep copy
    const tempRoom =
      updatedInstructor1.sessions[fromRoom.sessionGrpIdx][fromRoom.sessionIndex]
        .room;
    updatedInstructor1.sessions[fromRoom.sessionGrpIdx][
      fromRoom.sessionIndex
    ].room =
      updatedInstructor2.sessions[toRoom.sessionGrpIdx][
        toRoom.sessionIndex
      ].room;
    updatedInstructor2.sessions[toRoom.sessionGrpIdx][
      toRoom.sessionIndex
    ].room = tempRoom;

    // Update the state with the modified timetable
    setStudentWeekTimetable(updatedStudentWeekTimetable);

    // Close the dialog after successful swap
    onClose();

    toast.success("Rooms swapped successfully.");
  }
  function handleSubmitAddRoom(sessionParam) {
    const { fromRoom, toRoom } = roomChangeDialogOpen; // Assuming globally accessible `roomChangeDialogOpen`

    // Find the instructor by matching instructor.id with the `fromRoom.teacherId`
    const instructor = studentWeekTimetable?.[selectedDay]?.find(
      (teacher) => teacher.instructor.id === fromRoom.teacherId
    );

    // Check if the instructor is found
    if (!instructor) {
      toast.error("Instructor not found for the provided teacher ID.");
      return;
    }

    // Fetch the session using the group index (`sessionGrpIdx`) and session index (`sessionIdx`)
    const session =
      instructor.sessions?.[fromRoom.sessionGrpIdx]?.[fromRoom.sessionIndex];

    // Validate that the session exists
    if (!session) {
      toast.error(
        "Invalid session data found based on the given session indexes."
      );
      return;
    }

    // Validation: Ensure the session key matches
    if (session.session_key !== sessionParam.session_key) {
      toast.error("Internal error: Session does not match the fetched data.");
      return;
    }
    // Validation: Ensure the `fromRoom` matches the original session's room details
    if (session.room?.room_number !== fromRoom.room.room_number) {
      toast.error(
        "The current session room does not match the provided 'fromRoom' details."
      );
      return;
    }

    // Validation: Check if the new room is already the same
    if (session.room?.room_number === toRoom.room_number) {
      toast.error("The session already has the specified room.");
      return;
    }

    // Deep copy the timetable to safely modify it
    const updatedStudentWeekTimetable = JSON.parse(
      JSON.stringify(studentWeekTimetable)
    );

    // Update the room details for the fetched session
    updatedStudentWeekTimetable[selectedDay].find(
      (teacher) => teacher.instructor.id === fromRoom.teacherId
    ).sessions[fromRoom.sessionGrpIdx][fromRoom.sessionIndex].room = {
      ...toRoom?.room,
    };

    // Update the state with the modified timetable
    setStudentWeekTimetable(updatedStudentWeekTimetable);

    // Close the dialog after successful update
    onClose();

    toast.success("Room updated successfully.");
  }

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
  const RoomBadge = ({ room }) => {
    if (!room?.room_number || !room?.room_type) return null;

    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <span className="font-medium text-blue-700 dark:text-blue-300">
          Room {room.room_number}
        </span>
        <span className="text-blue-300 dark:text-blue-600">•</span>
        <span className="text-blue-600 dark:text-blue-400">
          {room.room_type}
        </span>
      </div>
    );
  };
  const showPreview =
    roomChangeDialogOpen?.toRoom && roomChangeDialogOpen?.type;
  // const sessions = showPreview ? findSessions() : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center p-4 bg-gray-100  dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <Typography
              variant="h6"
              className="text-gray-800 dark:text-gray-200 font-semibold"
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
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>
              Period {roomChangeDialogOpen?.selectedSessionForRoomNumber + 1}
            </span>
          </div>
        </div>
        <IconButton
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ paddingTop: "20px !important" }}
        className="dark:bg-gray-900"
      >
        {showPreview ? (
          // <div className="space-y-6 ">
          //   <div className="flex items-center justify-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl shadow-sm dark:shadow-indigo-900/10">
          //     <div className="flex items-center gap-3">
          //       <ArrowLeftRight className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          //       <span className="text-base font-semibold text-indigo-600 dark:text-indigo-300">
          //         {roomChangeDialogOpen?.type === "SWAP"
          //           ? "Room Swap Preview"
          //           : "Room Change Preview"}
          //       </span>
          //     </div>
          //   </div>

          //   <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          //     <div className="overflow-x-auto">
          //       <table className="w-full border-collapse">
          //         <thead>
          //           <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850">
          //             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          //               Instructor
          //             </th>
          //             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          //               Subject
          //             </th>
          //             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          //               Class
          //             </th>
          //             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          //               Original Room
          //             </th>
          //             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          //               New Room
          //             </th>
          //           </tr>
          //         </thead>
          //         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          //           {/* First row - From Session */}
          //           {sessions?.fromSession && (
          //             <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          //               <td className="px-6 py-4">
          //                 {sessions?.fromTeacher &&
          //                   renderTeacherInfo(sessions.fromTeacher)}
          //               </td>
          //               <td className="px-6 py-4">
          //                 <div className="flex items-center gap-2">
          //                   <span className="font-medium text-gray-900 dark:text-gray-100">
          //                     {sessions.fromSession.subject ||
          //                       sessions.fromSession.elective_subject_name}
          //                   </span>
          //                   <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
          //                     {sessions.fromSession.type}
          //                   </span>
          //                 </div>
          //               </td>
          //               <td className="px-6 py-4">
          //                 <div className="space-y-1">
          //                   {sessions.fromSession.class_details?.map(
          //                     (detail, index) => (
          //                       <div
          //                         key={index}
          //                         className="text-sm text-gray-600 dark:text-gray-400"
          //                       >
          //                         <span className="font-medium text-gray-900 dark:text-gray-100">
          //                           {detail.standard} {detail.division}
          //                         </span>
          //                         {sessions.fromSession.type === "Elective" &&
          //                           detail.number_of_students != null && (
          //                             <span className="ml-2 text-gray-500 dark:text-gray-500">
          //                               ({detail.number_of_students} students)
          //                             </span>
          //                           )}
          //                       </div>
          //                     )
          //                   )}
          //                 </div>
          //               </td>
          //               <td className="px-6 py-4">
          //                 {sessions.fromSession.room && (
          //                   <RoomBadge room={sessions.fromSession.room} />
          //                 )}
          //               </td>
          //               <td className="px-6 py-4">
          //                 {roomChangeDialogOpen?.type === "SWAP" ? (
          //                   sessions?.toSession?.room && (
          //                     <RoomBadge room={sessions.toSession.room} />
          //                   )
          //                 ) : (
          //                   <RoomBadge
          //                     room={roomChangeDialogOpen?.toRoom?.room}
          //                   />
          //                 )}
          //               </td>
          //             </tr>
          //           )}

          //           {/* Second row - To Session (only for SWAP type) */}
          //           {roomChangeDialogOpen?.type === "SWAP" &&
          //             sessions?.toSession && (
          //               <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          //                 <td className="px-6 py-4">
          //                   {sessions?.toTeacher &&
          //                     renderTeacherInfo(sessions.toTeacher)}
          //                 </td>
          //                 <td className="px-6 py-4">
          //                   <div className="flex items-center gap-2">
          //                     <span className="font-medium text-gray-900 dark:text-gray-100">
          //                       {sessions.toSession.subject ||
          //                         sessions.toSession.elective_subject_name}
          //                     </span>
          //                     <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
          //                       {sessions.toSession.type}
          //                     </span>
          //                   </div>
          //                 </td>
          //                 <td className="px-6 py-4">
          //                   <div className="space-y-1">
          //                     {sessions.toSession.class_details?.map(
          //                       (detail, index) => (
          //                         <div
          //                           key={index}
          //                           className="text-sm text-gray-600 dark:text-gray-400"
          //                         >
          //                           <span className="font-medium text-gray-900 dark:text-gray-100">
          //                             {detail.standard} {detail.division}
          //                           </span>
          //                           {sessions.toSession.type === "Elective" &&
          //                             detail.number_of_students != null && (
          //                               <span className="ml-2 text-gray-500 dark:text-gray-500">
          //                                 ({detail.number_of_students} students)
          //                               </span>
          //                             )}
          //                         </div>
          //                       )
          //                     )}
          //                   </div>
          //                 </td>
          //                 <td className="px-6 py-4">
          //                   {sessions.toSession.room && (
          //                     <RoomBadge room={sessions.toSession.room} />
          //                   )}
          //                 </td>
          //                 <td className="px-6 py-4">
          //                   {sessions.fromSession.room && (
          //                     <RoomBadge room={sessions.fromSession.room} />
          //                   )}
          //                 </td>
          //               </tr>
          //             )}
          //         </tbody>
          //       </table>
          //     </div>
          //   </div>

          //   {/* Alert Message */}
          //   <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-lg">
          //     <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          //       <svg
          //         className="w-5 h-5"
          //         fill="currentColor"
          //         viewBox="0 0 20 20"
          //       >
          //         <path
          //           fillRule="evenodd"
          //           d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          //           clipRule="evenodd"
          //         />
          //       </svg>
          //       <span className="text-sm font-medium">
          //         Please review the changes carefully before confirming
          //       </span>
          //     </div>
          //   </div>

          //   {/* Action Buttons */}
          //   <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
          //     <Button
          //       onClick={handleBack}
          //       variant="outlined"
          //       className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          //     >
          //       <ArrowLeft className="w-4 h-4" />
          //       Back to List
          //     </Button>
          //     <Button
          //       onClick={() => {
          //         if (roomChangeDialogOpen?.type === "SWAP") {
          //           handleSubmitSwapRooms(
          //             sessions?.fromSession,
          //             sessions?.toSession
          //           );
          //         } else {
          //           handleSubmitAddRoom(sessions?.fromSession);
          //         }
          //       }}
          //       className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          //     >
          //       {roomChangeDialogOpen?.type === "SWAP"
          //         ? "Confirm Swap"
          //         : "Confirm Change"}
          //     </Button>
          //   </div>
          // </div>
          <>on preiow</>
        ) : (
          <StudentViewRoomAvailabilityDisplayer
            availableRooms={availableRooms}
            studentWeekTimetable={studentWeekTimetable}
            selectedDay={selectedDay}
            roomChangeDialogOpen={roomChangeDialogOpen}
            setRoomChangeDialogOpen={setRoomChangeDialogOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentViewRoomChangeDialog;
