import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Switch, 
  FormControlLabel 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/Authcontext';
import DeleteConfirmationPopup from '../../common/DeleteConfirmationPopup';

const RoomsSection = ({ rooms, handleOpenRoomForm }) => {
  const [showClassrooms, setShowClassrooms] = useState(false);
  const [deleteRoom, setDeleteRoom] = useState(false);
const {apiDomain,headers}=useAuth()
  const filteredRooms = rooms.filter(room => 
    showClassrooms ? true : room.room_type !== 'CLASSROOM'
  );
  const handleDeleteRoom = async (roomId) => {
    if (deleteRoom) {
      try {
        await axios.delete(`${apiDomain}/api/room/rooms/${deleteRoom}/`, { headers });
        toast.success("Room deleted successfully");
        setDeleteRoom(false)
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error("Failed to delete room");
      }
      
    }else{
      toast.error("error occured")
    }
     
    
  };
  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="text-blue-600">
          Rooms
        </Typography>
        <div className="flex items-center">
          <FormControlLabel
            control={
              <Switch
                checked={showClassrooms}
                onChange={(e) => setShowClassrooms(e.target.checked)}
                name="showClassrooms"
              />
            }
            label="Show Classrooms"
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenRoomForm()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              padding: "10px 14px",
              fontSize: 12,
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              color: "#2196f3",
              borderColor: "#2196f3",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                borderColor: "#1976d2",
              },
            }}
          >
            Add Room
          </Button>
        </div>
      </div>
      <List>
        {filteredRooms.map((room) => (
          <ListItem
            key={room.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenRoomForm(room)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setDeleteRoom(room.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={room.name || `Room ${room.room_number}`}
              secondary={`Type: ${room.room_type} | Capacity: ${room.capacity || "N/A"}`}
            />
          </ListItem>
        ))}
      </List>
      <DeleteConfirmationPopup
            isOpen={deleteRoom}
            onClose={() => setDeleteRoom(false)}
            onConfirm={handleDeleteRoom}
          />
    </div>
  );
};

export default RoomsSection;