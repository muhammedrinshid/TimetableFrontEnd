import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { Group as GroupIcon, Room as RoomIcon } from '@mui/icons-material';

const ClassroomInfoCard = ({ classData }) => {
  const { classroom } = classData;

  const getAvatarColor = (standard, division) => {
    const hue = (standard?.charCodeAt(0) * 20 + division.charCodeAt(0) * 5) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <Card
      sx={{
        maxWidth: 340,
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        backgroundColor: '#ecf3fa',
        borderRadius: 3,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(classroom.standard, classroom.division),
              width: 56,
              height: 56,
              fontSize: 20,
              marginRight: '16px',
            }}
          >
            {`${classroom.standard}${classroom.division}`}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {classroom.class_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${classroom.room.name} (Room ${classroom.room.room_number})`}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ marginBottom: '16px' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ marginRight: '8px', color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {classroom.total_students} Students
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RoomIcon sx={{ marginRight: '8px', color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {classroom.room.room_type}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClassroomInfoCard;
