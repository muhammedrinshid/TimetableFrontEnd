import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Grid,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationOnIcon,
  PersonPinCircle,
  Person,
} from "@mui/icons-material";

import { AlertTriangle, X as CloseIcon } from "lucide-react";
import { useAuth } from "../../../../context/Authcontext";
import { toast } from "react-toastify";

const OverflowSessionsHandleDialog = ({
  studentWeekTimetable,
  open,
  handleClose,
  overflowSessionsHandleDialogState,
  overflowSessionsHandleDialogSetState,
  setStudentWeekTimetable,
}) => {
  // Consolidated state
  const { darkMode, apiDomain } = useAuth();

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    sessionData: null,
    sessionGrpIndex: null,
    sessionDay: null,
    classroomId: null,
  });

  const handleSessionSelect = (session, grpIndx, dayOfWeek, clsId) => {
    setConfirmDialog({
      open: true,
      sessionData: session,
      sessionGrpIndex: grpIndx,
      sessionDay: dayOfWeek,
      classroomId: clsId,
    });
  };

  const handleConfirmSelection = () => {
    if (!confirmDialog.sessionData) {
      toast.info("No session data selected. Please choose a session.");
      return;
    }

    setStudentWeekTimetable((prev) => {
      // Deep copy of the existing timetable
      const updatedTimetable = JSON.parse(JSON.stringify(prev));

      // Find and remove the session from `studentWeekTimetable`
      const daySessions = updatedTimetable[confirmDialog.sessionDay];
      if (!daySessions) {
        toast.info("Invalid day selected. Please verify the timetable data.");
        return prev;
      }

      const classroom = daySessions.find(
        (cls) =>
          cls.classroom.id === overflowSessionsHandleDialogState?.classroomId
      );
      if (!classroom) {
        toast.info(
          "Classroom not found. Please verify the selected classroom."
        );
        return prev;
      }

      const groupSessions = classroom.sessions[confirmDialog.sessionGrpIndex];
      if (!groupSessions) {
        toast.info(
          "Session group not found. Please verify the selected session group."
        );
        return prev;
      }

      const sessionIndex = groupSessions.findIndex(
        (session) =>
          session.session_key === confirmDialog.sessionData.session_key
      );
      if (sessionIndex === -1) {
        toast.info(
          "Session not found in the selected group. Please verify the session details."
        );
        return prev;
      }

      // Pop the session
      const [poppedSession] = groupSessions.splice(sessionIndex, 1);

      // Deep copy of overflow sessions handle state
      const overflowUpdated = JSON.parse(
        JSON.stringify(overflowSessionsHandleDialogState)
      );

      // Locate the target classroom and push the popped session
      const targetDaySessions = updatedTimetable[overflowUpdated.selectedDay];
      if (!targetDaySessions) {
        toast.info(
          "Target day sessions not found. Please verify the timetable."
        );
        return prev;
      }

      const targetClassroom = targetDaySessions.find(
        (cls) => cls.classroom.id === overflowUpdated.classroomId
      );
      if (!targetClassroom) {
        toast.info("Target classroom not found. Please verify the selection.");
        return prev;
      }

      const targetSessions =
        targetClassroom.sessions[overflowUpdated.sessionGrpIndex];
      if (
        targetSessions.length === 0 ||
        (targetSessions.length === 1 &&
          targetSessions[0].name === null &&
          targetSessions[0].type === null &&
          targetSessions[0].class_distribution === null)
      ) {
        // Remove the null session and push the new session
        targetClassroom.sessions[overflowUpdated.sessionGrpIndex] = [
          poppedSession,
        ];
      } else {
        // Show error if there are other sessions in the group
        console.log(targetSessions);
        toast.info(
          "Cannot overwrite existing session group. Please remove or modify the current sessions."
        );
        return prev;
      }

      // If all operations succeed, return the updated timetable
      return updatedTimetable;
    });

    // Update dialog state only if all operations succeeded
    setConfirmDialog({
      open: false,
      sessionData: null,
      sessionGrpIndex: null,
      sessionDay: null,
    });

    handleClose();
  };

  useEffect(() => {
    if (overflowSessionsHandleDialogState.classroomId) {
      const findOverflowLessons = (classroomId) => {
        const overflowSessions = [];
        for (const [day, dayTimetable] of Object.entries(
          studentWeekTimetable
        )) {
          dayTimetable.forEach((classroomEntry) => {
            if (classroomEntry.classroom.id === classroomId) {
              classroomEntry.sessions.forEach((sessionGrp, idx) => {
                if (sessionGrp.length > 1) {
                  overflowSessions.push({
                    day,
                    sessionGrpIndex: idx,
                    sessions: sessionGrp,
                  });
                }
              });
            }
          });
        }
        console.log(overflowSessions);
        return overflowSessions;
      };

      const overflowSessions = findOverflowLessons(
        overflowSessionsHandleDialogState.classroomId
      );
      overflowSessionsHandleDialogSetState((prevState) => ({
        ...prevState,
        overflowSessions,
      }));
    }
  }, [overflowSessionsHandleDialogState.classroomId, studentWeekTimetable]);

  const getSessionConflicts = (session) => {
    const conflicts = [];
    const targetElectiveId = session.elective_id;

    // Iterate through all classrooms on the selected day
    const classrooms =
      studentWeekTimetable[overflowSessionsHandleDialogState?.selectedDay];
    if (!classrooms) return conflicts;

    classrooms.forEach(({ sessions }) => {
      const sessionGroup =
        sessions[overflowSessionsHandleDialogState?.sessionGrpIndex];

      sessionGroup.forEach((currentSession) => {
        if (!currentSession) return;

        currentSession?.class_distribution?.forEach((currentDistribution) => {
          session.class_distribution.forEach((targetDistribution) => {
            // Check for elective conflicts (if session is elective)
            if (
              session.type === "Elective" &&
              currentSession.type === "Elective"
            ) {
              const currentElectiveId = currentSession.elective_id;
              if (currentElectiveId && currentElectiveId === targetElectiveId) {
                // Elective sessions with the same ID are not conflicts, so skip
                return;
              }
            }

            // Check for teacher conflicts
            const currentTeacherId = currentDistribution?.teacher?.id;
            const targetTeacherId = targetDistribution?.teacher?.id;
            if (currentTeacherId && currentTeacherId === targetTeacherId) {
              conflicts.push({
                conflictType: "TEACHER_CONFLICT",
                session: currentSession,
              });
            }

            // Check for room conflicts
            const currentRoomId = currentDistribution?.room?.id;
            const targetRoomId = targetDistribution?.room?.id;
            if (currentRoomId && currentRoomId === targetRoomId) {
              conflicts.push({
                conflictType: "ROOM_CONFLICT",
                session: currentSession,
              });
            }
          });
        });
      });
    });

    return conflicts;
  };

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

  // Function to find overflow lessons

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle className="p-2 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WarningIcon className="text-amber-500" sx={{ fontSize: 24 }} />
              <span className="text-lg font-semibold">
                Overlapping Sessions
              </span>
            </div>
            <IconButton
              onClick={handleClose}
              size="small"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <CloseIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="p-4">
          <div className="space-y-8">
            {overflowSessionsHandleDialogState?.overflowSessions.map(
              (dayGroup, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Chip
                      label={dayGroup?.day}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Period {dayGroup?.sessionGrpIndex + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayGroup.sessions.map((session, sessionIndex) => {
                      const conflicts = getSessionConflicts(session);

                      return (
                        <div
                          key={sessionIndex}
                          // className={`rounded-lg ${getTypeStyles(session.type)} p-4 shadow-sm hover:shadow-md transition-all`}
                          className={`mb-2 last:mb-0 border-t-4 rounded-lg overflow-hidden ${getSessionBorderColor(
                            session
                          )} p-2 ${getSessionColor(session)}`}
                        >
                          <div className="mb-3 flex flex-col gap-2">
                            <h3 className="font-semibold truncate">
                              {session.name}
                            </h3>
                            <Chip
                              label={session.type}
                              className={`${
                                session.type === "Elective"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                              }`}
                              size="small"
                            />
                          </div>

                          {session.class_distribution?.map(
                            (distribution, distIndex) => (
                              <div
                                key={distIndex}
                                className="mb-3 rounded-lg bg-white/50 dark:bg-gray-900/50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-gray-800">
                                    {distribution.teacher.profile_image && (
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
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">
                                      {distribution.teacher.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                      {distribution.subject}
                                    </p>
                                  </div>
                                </div>

                                {distribution.room && (
                                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <LocationOnIcon className="h-4 w-4" />
                                    <span>
                                      {distribution.room.name} (
                                      {distribution.room.room_number})
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          <div className="border-t dark:border-gray-700 pt-2 mt-2">
                            {/* Conflicts Section */}
                            <div className="mb-3">
                              {conflicts.length > 0 ? (
                                <>
                                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    Conflicts Found:
                                  </span>
                                  <div className="mt-2 space-y-2">
                                    {conflicts.map(
                                      (conflict, conflictIndex) => (
                                        <div
                                          key={conflictIndex}
                                          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 p-2 rounded-md"
                                        >
                                          {conflict.conflictType ===
                                            "TEACHER_CONFLICT" && (
                                            <>
                                              <Person
                                                className="text-red-500"
                                                fontSize="small"
                                              />
                                              <span className="truncate">
                                                Teacher conflict with{" "}
                                                <strong>
                                                  {
                                                    conflict.session
                                                      .class_distribution[0]
                                                      ?.teacher.name
                                                  }
                                                </strong>
                                              </span>
                                            </>
                                          )}
                                          {conflict.conflictType ===
                                            "ROOM_CONFLICT" && (
                                            <>
                                              <LocationOnIcon
                                                className="text-red-500"
                                                fontSize="small"
                                              />
                                              <span className="truncate">
                                                Room conflict (
                                                {
                                                  conflict.session
                                                    .class_distribution[0]?.room
                                                    .room_number
                                                }
                                                )
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 p-2 rounded-md">
                                  <CheckCircleIcon
                                    className="text-green-500"
                                    fontSize="small"
                                  />
                                  <span className="truncate">
                                    No conflicts found! You can safely pick this
                                    session.
                                  </span>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() =>
                                handleSessionSelect(
                                  session,
                                  dayGroup?.sessionGrpIndex,
                                  dayGroup?.day
                                )
                              }
                              startIcon={<CheckCircleIcon />}
                              className="w-full"
                            >
                              Select Session
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, sessionData: null })}
      >
        <DialogTitle>Confirm Lesson Selection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to select this lesson to assign? "
            {confirmDialog.sessionData?.name}"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, sessionData: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            color="primary"
          >
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OverflowSessionsHandleDialog;
