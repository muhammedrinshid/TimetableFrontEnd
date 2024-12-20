import React from 'react'
import StudentViewTeacherAvailabilityDisplayer from './StudentViewTeacherAvailabilityDisplayer'
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
import { useAuth } from '../../../../context/Authcontext';
import { toast } from 'react-toastify';



const getAvatarColor = (standard, division) => {
  const hue = (standard?.charCodeAt(0) * 44 + division.charCodeAt(0) * 5) % 360;
  return `hsl(${hue}, 70%, ${80}%)`;
};
const StudentViewTeacherChangeDialog = ({
  availableTeachers,
  teacherChangeDialogOpen,
  setTeacherChangeDialogOpen,
  setStudentWeekTimetable,
  studentWeekTimetable,
  selectedDay,
  onClose,
  open,

}) => {
    const { apiDomain } = useAuth();
  const renderTeacherInfo = (instructor) => {
    console.log(instructor)
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
              {instructor?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {instructor?.teacherId}
            </div>
          </div>
        </div>
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
const processTeacherChangeData = () => {
  const { selectedSessionForTeacherChange, fromTeacher, toTeacher, type } =
    teacherChangeDialogOpen;

  // Find all sessions using the fromTeacher
  const fromSessions = findMatchingSessionsByTeacher(
    studentWeekTimetable[selectedDay],
    fromTeacher.id,
    selectedSessionForTeacherChange
  );

  // For SWAP type, find all sessions using the toTeacher
  let toSessions = [];
  if (type === "SWAP") {
    toSessions = findMatchingSessionsByTeacher(
      studentWeekTimetable[selectedDay],
      toTeacher.id,
      selectedSessionForTeacherChange
    );
  }

  // Combine all sessions into table rows format
  const tableRows = [];
  // Add fromSessions rows
  fromSessions.forEach(({ session, classroom, room, session_key }) => {
    tableRows.push({
      class: {
        id: classroom.id,
        standard: classroom.standard,
        division: classroom.division,
        class_id: classroom.class_id,
      },
      subject: { name: session?.subject, type: session?.type },
      session_key: session_key,
      originalTeacher: {
        name: fromTeacher.name,
        profile_image: fromTeacher.profile_image,
        id: fromTeacher.id,
      },
      newTeacher:
        type === "SWAP"
          ? toSessions[0]?.session.class_distribution[0].teacher
          : toTeacher,
      room: room,
    });
  });

  // For SWAP type, add toSessions rows
  if (type === "SWAP") {
    toSessions.forEach(({ session, classroom, room, session_key }) => {
      tableRows.push({
        class: {
          id: classroom.id,
          standard: classroom.standard,
          division: classroom.division,
          class_id: classroom.class_id,
        },
        session_key: session_key,
        subject: { name: session?.subject, type: session?.type },
        originalTeacher: {
          name: toTeacher.name,
          profile_image: toTeacher.profile_image,
          id: toTeacher.id,
        },
        newTeacher: fromSessions[0]?.session.class_distribution[0].teacher,
        room: room,
      });
    });
  }

  return {
    type,
    tableRows,
  };
};

// Helper function to find matching sessions for a teacher
const findMatchingSessionsByTeacher = (
  timetableData,
  teacherId,
  sessionIndex
) => {
  const matches = [];

  for (const classData of timetableData) {
    const sessionGroup = classData.sessions[sessionIndex];
    if (!sessionGroup) continue;

    // Iterate through each session in the session group
    for (const session of sessionGroup) {
      const distributions = session.class_distribution;

      for (const dist of distributions) {
        if (dist.teacher.id === teacherId) {
          const sessionDetails = {
            session: {
              subject: dist.subject,
              type: session.type,
              elective_id: session.elective_id,
              class_distribution: [dist],
            },
            classroom: classData.classroom,
            session_key: session?.session_key,
            room: dist.room,
          };

          // If already have matches, check if this is part of same elective group
          if (matches.length > 0) {
            const firstMatch = matches[0].session;
            if (
              firstMatch.type === "Elective" &&
              session.type === "Elective" &&
              firstMatch.elective_id === session.elective_id
            ) {
              matches.push(sessionDetails);
            }
          } else {
            matches.push(sessionDetails);
            // If this is a core subject, return immediately
            if (session.type === "Core") {
              return matches;
            }
          }
        }
      }
    }
  }

  return matches;
};

 const handleTeacherChangeSubmit = (
   previewSessions,
   sessionIndex = teacherChangeDialogOpen?.selectedSessionForTeacherChange
 ) => {
   try {
     const updatedTimetable = JSON.parse(JSON.stringify(studentWeekTimetable));
     const dayTimetable = updatedTimetable[selectedDay];
     let allUpdatesSuccessful = true;

     for (const previewSession of previewSessions) {
       const targetClassId = previewSession.class?.id;
       const targetSessionKey = previewSession.session_key;

       // Check if targetClassId or targetSessionKey is null
       if (targetClassId == null) {
         toast.error("Target class ID is null or undefined.");
         allUpdatesSuccessful = false;
         continue;
       }

       if (targetSessionKey == null) {
         toast.error("Target session key is null or undefined.");
         allUpdatesSuccessful = false;
         continue;
       }

       const newTeacher = previewSession.newTeacher;
       const classroomIndex = dayTimetable.findIndex(
         (classroom) => classroom.classroom.id === targetClassId
       );

       if (classroomIndex === -1) {
         toast.error(`Classroom with ID ${targetClassId} not found`);
         allUpdatesSuccessful = false;
         continue;
       }

       let sessionFound = false;
       const sessionGroups = dayTimetable[classroomIndex].sessions;
       const sessions = sessionGroups[sessionIndex];

       for (let i = 0; i < sessions.length; i++) {
         const session = sessions[i];

         if (session.session_key === targetSessionKey) {
           for (let j = 0; j < session.class_distribution.length; j++) {
             const distribution = session.class_distribution[j];

             if (
               distribution.subject === previewSession.subject.name &&
               distribution.room.name === previewSession.room.name &&
               distribution.room.id === previewSession.room.id
             ) {
               dayTimetable[classroomIndex].sessions[sessionIndex][
                 i
               ].class_distribution[j].teacher = {
                 ...newTeacher,
               };
               sessionFound = true;
               break;
             }
           }

           if (sessionFound) break;
         }
       }

       if (!sessionFound) {
         toast.error(
           `Session with key ${targetSessionKey} not found for classroom ${targetClassId}`
         );
         allUpdatesSuccessful = false;
       }
     }

     if (allUpdatesSuccessful) {
       setStudentWeekTimetable(updatedTimetable);
       return true;
     } else {
       toast.error("Some updates failed. Timetable not updated.");
       return false;
     }
   } catch (error) {
     toast.error("Error updating timetable: " + error.message);
     return false;
   }
 };
   const handleSubmit = (previewSessions) => {
     if (!showPreview || !previewSessions) return;

     const success = handleTeacherChangeSubmit(previewSessions);

     if (success) {
       onClose();
     } else {
       toast.error("Failed to update timetable.");
     }
   };

  const handleBack = () => {
    setTeacherChangeDialogOpen((prev) => ({
      ...prev,

      toTeacher: null,
      type: null,
    }));
  };


 const showPreview = teacherChangeDialogOpen?.toTeacher && teacherChangeDialogOpen?.type; 
 const { type, tableRows: previewSessions } = showPreview ? processTeacherChangeData()  : { type: null, previewSessions: null };
 
 
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
               ? teacherChangeDialogOpen.type === "SWAP"
                 ? "Swap"
                 : "Change"
               : "Availability"}
           </Typography>
         </div>
         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
           <span>{selectedDay}</span>
           <span className="text-gray-400 dark:text-gray-500">•</span>
           <span>
             Period {teacherChangeDialogOpen?.selectedSessionForTeacherChange + 1}
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
         <div className="space-y-6 ">
           <div className="flex items-center justify-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl shadow-sm dark:shadow-indigo-900/10">
             <div className="flex items-center gap-3">
               <ArrowLeftRight className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
               <span className="text-base font-semibold text-indigo-600 dark:text-indigo-300">
                 {type === "SWAP"
                   ? "Teacher Swap Preview"
                   : "Teacher Change Preview"}
               </span>
             </div>
           </div>

           <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850">
                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                       Class
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                       Subject
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                       Original Instructor
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                       New Instructor
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                       Room
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                   {previewSessions.map((previewSession) => (
                     <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center mb-4">
                           <Avatar
                             sx={{
                               bgcolor: getAvatarColor(
                                 previewSession?.class?.standard,
                                 previewSession?.class?.division
                               ),
                               width: 56,
                               height: 56,
                               fontSize: "1.5rem",
                               marginRight: "16px",
                               color: "white",
                             }}
                           >
                             {`${previewSession?.class?.standard}${previewSession?.class?.division}`.substring(
                               0,
                               4
                             )}
                           </Avatar>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <span className="font-medium text-gray-900 dark:text-gray-100">
                             {previewSession?.subject?.name}
                           </span>
                           <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                             {previewSession?.subject?.type ||
                               "no type determined"}
                           </span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         {previewSession?.originalTeacher &&
                           renderTeacherInfo(previewSession?.originalTeacher)}
                       </td>
                       <td className="px-6 py-4">
                         {previewSession?.newTeacher &&
                           renderTeacherInfo(previewSession?.newTeacher)}
                       </td>
                       <td className="px-6 py-4">
                         {previewSession?.room && (
                           <RoomBadge room={previewSession?.room} />
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-lg">
             <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                 <path
                   fillRule="evenodd"
                   d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                   clipRule="evenodd"
                 />
               </svg>
               <span className="text-sm font-medium">
                 Please review the changes carefully before confirming
               </span>
             </div>
           </div>

           <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
             <Button
               onClick={handleBack}
               variant="outlined"
               className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
             >
               <ArrowLeft className="w-4 h-4" />
               Back to List
             </Button>
             <Button
               onClick={() => {
                 handleSubmit(previewSessions);
               }}
               className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
             >
               {type === "SWAP" ? "Confirm Swap" : "Confirm Change"}
             </Button>
           </div>
         </div>
       ) : (
         <StudentViewTeacherAvailabilityDisplayer
           availableTeachers={availableTeachers}
           selectedDay={selectedDay}
           setTeacherChangeDialogOpen={setTeacherChangeDialogOpen}
           studentWeekTimetable={studentWeekTimetable}
           teacherChangeDialogOpen={teacherChangeDialogOpen}
         />
       )}
     </DialogContent>
   </Dialog>
 );
};

export default StudentViewTeacherChangeDialog