import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SubjectIcon from '@mui/icons-material/Subject';
import DeleteIcon from '@mui/icons-material/Delete';

const getRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const ClassCard = ({ standardName, numberOfDivisions,shortName ,addNewDivision,grade }) => {
  const avatarLetter = shortName 
  const avatarColor = getRandomLightColor();

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
          width: 80, 
          height: 80, 
          mb: 2,
          fontSize: '2rem',
          fontWeight: 'bold'
        }}
      >
        {avatarLetter}
      </Avatar>
      <CardContent sx={{ textAlign: 'center', p: '0 !important', mb: 2 }}>
        <Typography component="div" variant="h6" fontWeight="bold">
          {standardName}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {numberOfDivisions} {numberOfDivisions === 1 ? 'Division' : 'Divisions'}
        </Typography>
      </CardContent>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 1
      }}>
        <Tooltip title="Add new division" arrow>
          <IconButton aria-label="add division" onClick={()=>addNewDivision(grade.name,standardName)} size="small">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Assign subjects to all sections" arrow>
          <IconButton aria-label="assign subjects" size="small">
            <SubjectIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete class" arrow>
          <IconButton aria-label="delete class" size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ClassCard;