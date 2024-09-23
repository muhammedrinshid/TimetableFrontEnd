import React from 'react';
import { CircularProgress, LinearProgress, Skeleton, Box, Typography } from '@mui/material';
import { FaBook, FaClock, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

// Simple circular loader
export const SimpleLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" p={2}>
    <CircularProgress />
  </Box>
);

// Linear progress with label
export const LinearLoader = ({ value }) => (
  <Box sx={{ width: '100%', mr: 1 }}>
    <LinearProgress variant="determinate" value={value} />
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
    </Box>
  </Box>
);

// Skeleton loader for content
export const SkeletonLoader = () => (
  <Box sx={{ width: '100%' }}>
    <Skeleton animation="wave" height={40} style={{ marginBottom: 6 }} />
    <Skeleton animation="wave" height={20} width="80%" />
    <Skeleton animation="wave" height={20} width="60%" style={{ marginBottom: 6 }} />
    <Skeleton animation="wave" height={80} />
  </Box>
);

// Themed mini loader
export const ThemedMiniLoader = () => {
  const icons = [FaBook, FaClock, FaGraduationCap, FaChalkboardTeacher];
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={1}>
      {icons.map((Icon, index) => (
        <Box key={index} mx={0.5} className="animate-pulse">
          <Icon size={24} color="#3f51b5" />
        </Box>
      ))}
    </Box>
  );
};

// Full-screen loader for major operations
export const FullScreenLoader = ({ message }) => (
  <Box 
    position="fixed" 
    top={0} 
    left={0} 
    right={0} 
    bottom={0} 
    bgcolor="rgba(255,255,255,0.7)" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center" 
    zIndex={9999}
  >
    <CircularProgress size={60} />
    <Typography variant="h6" color="primary" mt={2}>
      {message || 'Loading...'}
    </Typography>
  </Box>
);

export default {
  SimpleLoader,
  LinearLoader,
  SkeletonLoader,
  ThemedMiniLoader,
  FullScreenLoader
};