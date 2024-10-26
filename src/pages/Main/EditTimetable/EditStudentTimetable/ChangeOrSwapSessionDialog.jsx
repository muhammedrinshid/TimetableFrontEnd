import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";

import { toast } from "react-toastify";
import { motion } from "framer-motion";
import RenderSwapTable from "./RenderSwapTable";




const ChangeOrSwapSessionDialog = ({
  open,
  onClose,
  classroomId,
  sessionGrpIndex,
  session,
  dayOfWeek,
  studentWeekTimetable,
  setStudentWeekTimetable,
}) => {
  const [swapOptions, setSwapOptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFullView, setShowFullView] = useState(false);

  useEffect(() => {
    if (
      open &&
      classroomId &&
      sessionGrpIndex !== null &&
      session &&
      dayOfWeek
    ) {
      const options = findPossibleSwaps();
      setSwapOptions(options);
    }
  }, [open, classroomId, sessionGrpIndex, session, dayOfWeek]);

  const checkTeacherStatus = (teacher, day, sessionIdx, timetable) => {
    let status = { isFree: true, classroom: null, session: null };

    for (const classroom of Object.values(timetable[day])) {
      const sessions = classroom.sessions[sessionIdx] || [];
      for (const sess of sessions) {
        if (
          sess.type === "Core" &&
          sess.class_distribution.length === 1 &&
          sess.class_distribution[0].teacher.id === teacher.id
        ) {
          return {
            isFree: false,
            classroom: classroom,
            session: sess,
          };
        }
      }
    }

    return status;
  };

  const findPossibleSwaps = () => {
    const swapsList = [];

    Object.entries(studentWeekTimetable).forEach(([currentDay, dayData]) => {
      const currentClassroom = dayData.find(
        (room) => room.classroom.id === classroomId
      );
      if (!currentClassroom) return;

      currentClassroom.sessions.forEach((sessionGroup, currentSessionIdx) => {
        if (currentDay === dayOfWeek && currentSessionIdx === sessionGrpIndex)
          return;

        sessionGroup.forEach((destinationSession) => {
          if (
            destinationSession.type === "Elective" ||
            destinationSession.class_distribution.length !== 1
          )
            return;

          const originSession = session;
          const originTeacher = originSession.class_distribution[0].teacher;
          const destinationTeacher =
            destinationSession.class_distribution[0].teacher;

          if (originTeacher.id === destinationTeacher.id) {
            swapsList.push({
              headers: [
                "Classrooms",
                { dayofweek: dayOfWeek, sessiongrpindx: sessionGrpIndex },
                { dayofweek: currentDay, sessiongrpindx: currentSessionIdx },
              ],
              Classrooms: [
                {
                  classroom: currentClassroom.classroom,
                  sessions: [originSession, destinationSession],
                },
              ],
            });
          } else {
            const originTeacherStatus = checkTeacherStatus(
              originTeacher,
              currentDay,
              currentSessionIdx,
              studentWeekTimetable
            );

            const destinationTeacherStatus = checkTeacherStatus(
              destinationTeacher,
              dayOfWeek,
              sessionGrpIndex,
              studentWeekTimetable
            );

            if (originTeacherStatus.isFree && destinationTeacherStatus.isFree) {
              swapsList.push({
                headers: [
                  "Classrooms",
                  { dayofweek: dayOfWeek, sessiongrpindx: sessionGrpIndex },
                  { dayofweek: currentDay, sessiongrpindx: currentSessionIdx },
                ],
                Classrooms: [
                  {
                    classroom: currentClassroom.classroom,
                    sessions: [originSession, destinationSession],
                  },
                ],
              });
            } else if (
              !originTeacherStatus.isFree &&
              !destinationTeacherStatus.isFree &&
              originTeacherStatus.classroom.classroom.id ===
                destinationTeacherStatus.classroom.classroom.id
            ) {
              swapsList.push({
                headers: [
                  "Classrooms",
                  { dayofweek: dayOfWeek, sessiongrpindx: sessionGrpIndex },
                  { dayofweek: currentDay, sessiongrpindx: currentSessionIdx },
                ],
                Classrooms: [
                  {
                    classroom: currentClassroom.classroom,
                    sessions: [originSession, destinationSession],
                  },
                  {
                    classroom: originTeacherStatus.classroom.classroom,
                    sessions: [
                      destinationTeacherStatus.session,
                      originTeacherStatus.session,
                    ],
                  },
                ],
              });
            }
          }
        });
      });
    });

    return swapsList;
  };
  const handleSwapSubmission = (
    { headers, Classrooms },
    
  ) => {
    try {
      // Extract day and session indices from headers
      const [originDay, originSessionIdx] = [
        headers[1].dayofweek,
        headers[1].sessiongrpindx,
      ];
      const [destDay, destSessionIdx] = [
        headers[2].dayofweek,
        headers[2].sessiongrpindx,
      ];

      // Create deep copy of timetable
      const updatedTimetable = JSON.parse(JSON.stringify(studentWeekTimetable));

      // Validate classroom count
      if (Classrooms.length < 1 || Classrooms.length > 2) {
        toast.error("Invalid number of classrooms for swap");
        return;
      }

      // Validate and perform swaps for each classroom
      for (const classroomData of Classrooms) {
        const {
          classroom,
          sessions: [originSession, destinationSession],
        } = classroomData;

        // Find the classroom in origin day
        const originClassroomIndex = updatedTimetable[originDay].findIndex(
          (item) => item.classroom.id === classroom.id
        );

        // Find the classroom in destination day
        const destClassroomIndex = updatedTimetable[destDay].findIndex(
          (item) => item.classroom.id === classroom.id
        );

        if (originClassroomIndex === -1 || destClassroomIndex === -1) {
          toast.error(`Classroom not found in ${originDay} or ${destDay}`);
          return;
        }

        // Validate sessions exist and match
        const originSessionGroup =
          updatedTimetable[originDay][originClassroomIndex].sessions[
            originSessionIdx
          ];
        const destSessionGroup =
          updatedTimetable[destDay][destClassroomIndex].sessions[
            destSessionIdx
          ];

        const originSessionExists = originSessionGroup.some(
          (session) => session.session_key === originSession.session_key
        );

        const destSessionExists = destSessionGroup.some(
          (session) => session.session_key === destinationSession.session_key
        );

        if (!originSessionExists || !destSessionExists) {
          toast.error("One or more sessions not found in specified slots");
          return;
        }

        // Perform the swap
        const tempSession =
          updatedTimetable[originDay][originClassroomIndex].sessions[
            originSessionIdx
          ];
        updatedTimetable[originDay][originClassroomIndex].sessions[
          originSessionIdx
        ] =
          updatedTimetable[destDay][destClassroomIndex].sessions[
            destSessionIdx
          ];
        updatedTimetable[destDay][destClassroomIndex].sessions[destSessionIdx] =
          tempSession;
      }

      // Update state with swapped timetable
      setStudentWeekTimetable(updatedTimetable);
      toast.success("Sessions swapped successfully");
      setSelectedOption(null);
      setSwapOptions(null);
      setShowFullView(false);
    } catch (error) {
      console.error("Error during swap:", error);
      toast.error("An error occurred while swapping sessions");
    }
  };


  const renderFullView = () => {
    if (!selectedOption) return null;
    return (
      <div className="space-y-3 p-3">
        <RenderSwapTable
          option={selectedOption}
          setSelectedOption={setSelectedOption}
          setShowFullView={setShowFullView}
          selected
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="outlined"
            onClick={() => setShowFullView(false)}
            className="bg-white dark:bg-dark-secondary"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              // Handle swap submission here
              handleSwapSubmission(selectedOption);

              onClose();
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          >
            Confirm Swap
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          width: "600px",
          maxHeight: "800px",
          height: "auto",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3">
        {showFullView ? "Confirm Session Swap" : "Available Swap Options"}
      </DialogTitle>
      <DialogContent className="p-0">
        {!open ||
        !classroomId ||
        sessionGrpIndex === null ||
        !session ||
        !dayOfWeek ? (
          <div className="text-red-500 p-3">Missing required information</div>
        ) : showFullView ? (
          renderFullView()
        ) : (
          <div className="space-y-3 p-3">
            {swapOptions?.map((option, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-primary rounded-lg shadow"
              >
                <RenderSwapTable option={option} setSelectedOption={setSelectedOption}  setShowFullView={setShowFullView} />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      {!showFullView && (
        <DialogActions className="p-3 bg-gray-50 dark:bg-dark-secondary">
          <Button onClick={onClose} className="bg-white dark:bg-dark-primary">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ChangeOrSwapSessionDialog;
