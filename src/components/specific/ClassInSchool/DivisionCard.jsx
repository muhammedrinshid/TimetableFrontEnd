import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const DivisionCard = ({ divisionName, totalAssignedLessons, totalNeededLessons }) => {
  const avatarLetter = divisionName.charAt(0).toUpperCase();
  const avatarColor = getRandomLightColor();
  const progressPercentage = (parseInt(totalAssignedLessons) / totalNeededLessons) * 100;

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 2,
      mb: 2,
      boxShadow: 3,
      borderRadius: 4,
      '&:hover': {
        boxShadow: 6,
      }
    }}>
      <Avatar
        sx={{
          bgcolor: avatarColor,
          color: 'text.primary',
          width: 60,
          height: 60,
          mb: 2,
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}
      >
        {avatarLetter}
      </Avatar>
      <CardContent sx={{ textAlign: 'center', p: '0 !important', mb: 2, width: '100%' }}>
        <Typography component="div" variant="h6" fontWeight="bold">
          Division {divisionName}
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary" component="div">
            Lessons: {totalAssignedLessons}/{totalNeededLessons}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1
      }}>
        <Tooltip title="Edit division" arrow>
          <IconButton aria-label="edit division" size="small">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add lesson" arrow>
          <IconButton aria-label="add lesson" size="small">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete division" arrow>
          <IconButton aria-label="delete division" size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default DivisionCard;