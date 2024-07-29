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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useAuth } from '../../../context/Authcontext';
const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const DivisionCard = ({  setISelectedClassforView,division,handleClassroomDelete,standard_id }) => {
  const {totalperiodsInWeek}=useAuth()
  const avatarLetter = division.division
  const avatarColor = getRandomLightColor();
  const progressPercentage = (parseInt(division?.lessons_assigned_subjects) / totalperiodsInWeek) * 100;

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
           {division.divisionName}
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary" component="div">
            Lessons: {division?.lessons_assigned_subjects}/{totalperiodsInWeek}
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
          <IconButton aria-label="add lesson" size="small" onClick={()=>setISelectedClassforView({isOpen:true,id:division?.id,standard_id:standard_id})}>
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete division" arrow>
          <IconButton aria-label="delete division" size="small" onClick={()=>handleClassroomDelete(division.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default DivisionCard;