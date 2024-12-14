import React, { useState } from "react";
import AbbreviatedStudentTimetable from "./AbbreviatedStudentTimetable";
import AbbreviatedSavedTimetableViewerDialog from "./AbbreviatedSavedTimetableViewerDialog";
import { IconButton } from "@mui/material";
import { ExpandCircleDown } from "@mui/icons-material";
import CompactViewControlPanel from "./CompactViewControlPanel ";
import AbbreviatedTeacherTimetable from "./AbbreviatedTeacherTimetable";

const CompactViewComponent = ({
  condensedTimetable,
  isTeacherView,
  teacherViewToggle,
}) => {
  const [isScreenView, setIsScrenView] = useState(false);

  const closeScreenView = () => {
    setIsScrenView(false);
  };
  return (
    <>
      <AbbreviatedSavedTimetableViewerDialog
        onClose={closeScreenView}
        open={isScreenView}
      >
         {isTeacherView ? (
          <AbbreviatedTeacherTimetable weekTimetable={condensedTimetable} />
        ) : (
          <AbbreviatedStudentTimetable  weekTimetable={condensedTimetable}/>
        )}
        </AbbreviatedSavedTimetableViewerDialog>
      <div className="p-3">
        <CompactViewControlPanel
          isTeacherView={isTeacherView}
          onExpandView={() => setIsScrenView(true)}
          onViewChange={teacherViewToggle}
        />
        {isTeacherView ? (
          <AbbreviatedTeacherTimetable weekTimetable={condensedTimetable} />
        ) : (
          <AbbreviatedStudentTimetable  weekTimetable={condensedTimetable}/>
        )}
      </div>
    </>
  );
};

export default CompactViewComponent;
