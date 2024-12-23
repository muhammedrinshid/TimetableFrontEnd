// src/hooks/useConflictChecker.js
import { useState, useEffect } from "react";
import { validateElectiveGroups } from "../utlts/conflictCheckers/ElectiveGroupCheckers";



export function useElectiveGroupsConflictChecker(electiveGroups) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    let conflictResults = [];
  
      conflictResults = validateElectiveGroups(electiveGroups);

    setConflicts(conflictResults);
  }, [electiveGroups]);

  return conflicts;
}
