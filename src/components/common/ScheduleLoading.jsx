import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { FaBook, FaClock, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

const ScheduleLoading = ({ minDuration = 5 }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(null);

  const messages = [
   'Arranging classes...',
    'Scheduling teachers...',
    'Optimizing lunch breaks...',
    'Balancing subjects...',
    'Finalizing timetables...',
    
    'Checking room conflicts...',
    'Resolving teacher conflicts...',
    'Handling student group conflicts...',
    'Validating elective group timeslot constraints...',
    'Ensuring teacher assignments...',
    'Ensuring timeslot assignments...',
    
    'Balancing tutor lesson load...',
    'Enforcing daily lesson limits...',
    'Preferring consistent teacher for subject...',
    'Limiting subjects to once per day...',
    'Avoiding overlapping periods for teachers with the same class...',
    'Avoiding continuous subject blocks...',
    'Minimizing continuous teaching for teachers...',
    'Avoiding consecutive elective lessons...'
  ];

  const icons = [FaBook, FaClock, FaGraduationCap, FaChalkboardTeacher];

  useEffect(() => {
    setStartTime(Date.now());
    
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const calculatedProgress = Math.min((elapsedTime / minDuration) * 100, 100);
      
      setProgress(calculatedProgress);
      setMessage(messages[Math.floor(Math.random() * messages.length)]);

      if (calculatedProgress >= 100 && elapsedTime >= minDuration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, startTime]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100%"
      width="100%"
      bgcolor="background.paper"
      borderRadius={2}
      p={3}
    >
      <Box 
        position="relative" 
        width={200} 
        height={200} 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
      >
        {icons.map((Icon, index) => (
          <Box
            key={index}
            position="absolute"
            top={100 - Math.cos((progress / 100 * Math.PI * 2) + (index * Math.PI / 2)) * 80}
            left={100 + Math.sin((progress / 100 * Math.PI * 2) + (index * Math.PI / 2)) * 80}
            style={{
              transform: `translate(-50%, -50%) rotate(${progress * 3.6}deg)`,
              transition: 'all 0.5s ease-out'
            }}
          >
            <Icon size={32} color="#3f51b5" />
          </Box>
        ))}
      </Box>
      <Box mt={2} width="100%">
        <Box width="100%" bgcolor="grey.300" borderRadius={5} height={10}>
          <Box
            width={`${progress}%`}
            bgcolor="primary.main"
            borderRadius={5}
            height={10}
            transition="width 0.5s ease-out"
          />
        </Box>
      </Box>
      <Typography variant="h6" color="primary" mt={2}>
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {`${Math.round(progress)}% Complete`}
      </Typography>
    </Box>
  );
};

export default ScheduleLoading;