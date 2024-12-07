import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AbbreviatedStudentTimetable from './AbbreviatedStudentTimetable';

const AbbreviatedSavedTimetableViewerDialog = ({ open, onClose, studentWeekTimetable}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        style: {
          width: '100%',
          height: '100%',
        },
      }}
    >
      <DialogContent
        style={{
          height: '100%',
          overflow: 'auto', // Enables scrolling if content exceeds height
        }}
      >
        <AbbreviatedStudentTimetable weekTimetable={studentWeekTimetable}/>
      </DialogContent>
    </Dialog>
  );
};

export default AbbreviatedSavedTimetableViewerDialog;
