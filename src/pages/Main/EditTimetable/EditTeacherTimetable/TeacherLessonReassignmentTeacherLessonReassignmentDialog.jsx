import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loadings } from "../../../../components/common";
import { ArrowLeft, Badge, Check, X } from "lucide-react";

import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {
  Swap as SwapIcon,
  ArrowLeft as ArrowLeftIcon,
  Check as CheckIcon,
} from "lucide-react";
import TeacherSwapDealDisplayer from "./TeacherSwapDealDisplayer";
import { RandomColorChip } from "../../../../components/Mui components";

const TeacherLessonReassignmentDialog = ({ isOpen, onClose, swapParams,onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapOptions, setSwapOptions] = useState([]);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const findPossibleSwaps = (
    teacherId,
    selectedDay,
    sessionNumber,
    selectedSession,
    timetable
  ) => {
    const result = [];
    const days = Object.keys(timetable);

    // Get the initiating teacher's data
    const teacher1 = timetable[selectedDay].find(
      (t) => t.instructor.id === teacherId
    );
    // Get the initiating selectedSessions's data

    if (!teacher1) return result;

    // First session of swap (selected session)
    const session1 = teacher1.sessions[sessionNumber][0];

    // Iterate through each day
    days.forEach((dayOfWeek) => {
      const daySchedule = timetable[dayOfWeek];

      // Iterate through each teacher in the day
      daySchedule.forEach((teacher2, teacherIndex2) => {
        // Skip if same teacher
        if (teacher2.instructor.id === teacherId) return;

        // Iterate through their sessions
        teacher2.sessions.forEach((sessionGroup2, sessionGroupIndex2) => {
          const session2 = sessionGroup2[0];

          // Skip invalid sessions based on criteria
          if (!isValidSession(session2, selectedSession)) return;
          if (sessionGroup2.length > 1) return;

          // Check for corresponding sessions
          const session3 = teacher1.sessions[sessionGroupIndex2][0];
          const session4 = teacher2.sessions[sessionNumber][0];

          // Validate the corresponding sessions
          if (!areSwappableCoreSessions(session3, session4)) return;

          const teacher1DirectSessions = teacher1.sessions; // Directly assigned sessions for Teacher 1
          const teacher1TimetableSessions = timetable[dayOfWeek].find(
            (t) => t.instructor.id === teacherId // Get the session where the instructor is teacher1
          )?.sessions; // Extract the sessions from the timetable for that day

          const teacher2DirectSessions = teacher2.sessions; // Directly assigned sessions for Teacher 2
          const teacher2TimetableSessions = timetable[selectedDay].find(
            (t) => t.instructor.id === teacher2.instructor.id // Get the session where the instructor is teacher2
          )?.sessions; // Extract the sessions from the timetable for that day

          // Calculate working periods for both teachers
          const teacher1WorkingPeriods = calculateWorkingPeriods({
            [selectedDay]: teacher1DirectSessions,
            [dayOfWeek]: teacher1TimetableSessions || [],
          });

          const teacher2WorkingPeriods = calculateWorkingPeriods({
            [selectedDay]: teacher2TimetableSessions,
            [dayOfWeek]: teacher2DirectSessions || [],
          });
          // If all conditions are met, create swap object
          const swapOption = {
            headers: [
              "Instructor",
              { dayofweek: selectedDay, sessiongrpindx: sessionNumber },
              { dayofweek: dayOfWeek, sessiongrpindx: sessionGroupIndex2 },
            ],
            teachers: [
              {
                instructor: {
                  id: teacher1.instructor.id,
                  name: teacher1.instructor.name,
                  profile_image: teacher1.instructor.profile_image,
                  working_load: teacher1WorkingPeriods,
                },
                sessions: [session1, session3],
              },
              {
                instructor: {
                  id: teacher2.instructor.id,
                  name: teacher2.instructor.name,
                  profile_image: teacher2.instructor.profile_image,
                  working_load: teacher2WorkingPeriods,
                },
                sessions: [session4, session2],
              },
            ],
          };

          result.push(swapOption);
        });
      });
    });

    return result;
  };

  /**
   * Validates if a session meets the basic criteria for swapping
   */
  const isValidSession = (session, selectedSession) => {
    if (!session || session.subject === null) return false;
    if (session.type === "Elective") return false;
    if (!session.class_details || !selectedSession.class_details) return false;

    // For core subjects, verify class details match
    if (session.type === "Core") {
      return (
        session.class_details[0]?.id === selectedSession.class_details[0]?.id
      );
    }

    return false;
  };

  /**
   * Checks if two sessions can be swapped based on their core status and class details
   */
  const areSwappableCoreSessions = (session3, session4) => {
    // If both sessions are null, they can be swapped
    if (!session3.class_details && !session4.class_details) return true;

    // If either session is invalid, they cannot be swapped
    if (!session3?.type || !session4?.type) return false;
    if (session3.type !== "Core" || session4.type !== "Core") return false;

    // Verify both sessions have exactly one class detail
    if (
      !session3.class_details?.length === 1 ||
      !session4.class_details?.length === 1
    )
      return false;

    // Check if class details match
    return session3.class_details[0]?.id === session4.class_details[0]?.id;
  };

  // calculate working period

  function calculateWorkingPeriods(sessionsByDay) {
    const result = {};

    // Loop over each day in the input object
    Object.keys(sessionsByDay).forEach((day) => {
      const sessions = sessionsByDay[day] || [];

      // Calculate teaching and planning periods for each day
      const teachingPeriods = sessions.filter(
        (sessionGroup) => sessionGroup[0]?.subject !== null
      ).length;

      const planningPeriods = sessions.filter(
        (sessionGroup) => sessionGroup[0]?.subject === null
      ).length;

      // Store the result in the output object
      result[day] = {
        teaching: teachingPeriods,
        planning: planningPeriods,
      };
    });

    return result;
  }

  useEffect(() => {
    if (isOpen && swapParams) {
      loadSwapOptions();
    }
  }, [isOpen, swapParams]);

  const loadSwapOptions = async () => {
    setIsLoading(true);
    setSelectedSwap(null);
    // Ensure a minimum loading time of 3 seconds
    const startTime = Date.now();
    const swaps = await findPossibleSwaps(
      swapParams.teacherId,
      swapParams.selectedDay,
      swapParams.sessionNumber,
      swapParams.selectedSession,
      swapParams.teacherWeekTimetable
    );
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 3000 - elapsedTime));
    }
    setSwapOptions(swaps);
    setIsLoading(false);
  };

  const handleSwapSelection = (swap) => {
    setSelectedSwap(swap);
  };

    const handleConfirm = () => {
      if (selectedSwap) {
        onConfirm(selectedSwap);
        onClose();
      }
    };

  const handleBack = () => {
    setSelectedSwap(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="min-h-[300px] h-full ">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center w-full h-full"
            >
              <Loadings.ThemedMiniLoader />
            </motion.div>
          ) : selectedSwap ? (
            <motion.div
              key="selected-swap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold mb-4">Selected Swap</h2>
              <TeacherSwapDealDisplayer data={selectedSwap} selected={true} />
            </motion.div>
          ) : (
            <motion.div
              key="swap-options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold mb-4">Available Swaps </h2>
          
              {swapOptions.map((swap, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 p-4 rounded-lg cursor-pointer"
                  onClick={() => handleSwapSelection(swap)}
                >
                  <TeacherSwapDealDisplayer data={swap} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
      <DialogActions className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
        {selectedSwap ? (
          <>
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Confirm
            </Button>
          </>
        ) : (
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TeacherLessonReassignmentDialog;
