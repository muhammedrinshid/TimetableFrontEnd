// src/hooks/useConflictChecker.js
import { useState, useEffect } from "react";
import { checkTeacherConflicts } from "../utlts/conflictCheckers/teacherCheckers";
import { checkStudentConflicts } from "../utlts/conflictCheckers/studentCheckers";


export function useConflictChecker(timetable, viewType) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    let conflictResults = [];
    if (viewType === "teacher") {
      conflictResults = checkTeacherConflicts(timetable);
    } else if (viewType === "student") {
      conflictResults = checkStudentConflicts(timetable);
    }
    setConflicts(conflictResults);
  }, [timetable, viewType]);

  return conflicts;
}
