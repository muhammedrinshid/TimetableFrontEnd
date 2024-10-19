import { useState, useCallback } from "react";

const useTimetableWithHistory = (initialTimetable = {}) => {
  const [history, setHistory] = useState([initialTimetable]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const teacherWeekTimetable = history[currentIndex];

  const setTeacherWeekTimetable = useCallback(
    (newTimetableOrUpdater) => {
      const newTimetable =
        typeof newTimetableOrUpdater === "function"
          ? newTimetableOrUpdater(teacherWeekTimetable)
          : newTimetableOrUpdater;

      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, currentIndex + 1);
        return [...newHistory, newTimetable];
      });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    },
    [currentIndex, teacherWeekTimetable]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    teacherWeekTimetable,
    setTeacherWeekTimetable,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useTimetableWithHistory;
