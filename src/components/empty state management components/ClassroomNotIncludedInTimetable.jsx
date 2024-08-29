import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TimerOffIcon from '@mui/icons-material/TimerOff';

const ClassroomNotIncludedInTimetable = ({ classroomName, onCreateNewSchedule }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 3,
        textAlign: 'center',
      }}
    >
      <TimerOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h5" color="text.primary" gutterBottom>
        No Timetable Optimization Available
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 400 }}>
        {classroomName} has not been included in the default timetable optimization.
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        Create a New Schedule to add this classroom to the timetable.
      </Typography>
      
      <Button variant="contained" color="primary" onClick={onCreateNewSchedule}>
        Create New Schedule
      </Button>

    </Box>
  );
};

export default ClassroomNotIncludedInTimetable;
