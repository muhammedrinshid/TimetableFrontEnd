import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const EmptyClassState = ({ level, onAddClass }) => {
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
      <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h5" color="text.primary" gutterBottom>
        No classes added
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 400 }}>
        No classes added for you on {level}.
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        Please add classes and divisions.
      </Typography>

    </Box>
  );
};

export default EmptyClassState;