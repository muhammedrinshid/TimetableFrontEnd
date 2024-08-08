import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/Authcontext";

const AddNewRoom = ({ open, handleClose, handleSave, initialRoom = null }) => {
  const { headers, apiDomain } = useAuth();
  const [room, setRoom] = useState(
    initialRoom || {
      name: "",
      room_number: "",
      capacity: "",
      occupied: false,
      room_type: "CLASSROOM",
    }
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isRoomNumberAvailable, setIsRoomNumberAvailable] = useState(true);

  useEffect(() => {
    if (initialRoom) {
      setRoom(initialRoom);
    }
  }, [initialRoom]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: name === "occupied" ? checked : value,
    }));

    if (name === "room_number") {
      checkRoomNumberAvailability(value);
    }
  };

  const checkRoomNumberAvailability = async (roomNumber) => {
    if (!roomNumber) return;
    setIsChecking(true);
    try {
      const response = await axios.get(
        `${apiDomain}/api/room/check-availability/${roomNumber}/`,
        { headers }
      );
      setIsRoomNumberAvailable(response.data.is_available);
      if (!response.data.is_available) {
        toast.error("Room number is already in use");
      }
    } catch (error) {
      console.error("Error checking room number availability:", error);
      toast.error("Failed to check room number availability");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = () => {
    if (!isRoomNumberAvailable) {
      toast.error("Please choose a different room number");
      return;
    }
    handleSave(room);
    handleClose();
  };

  // ... rest of the component remains the same

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
      <DialogContent>
        {/* ... other fields */}
   
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Room Name"
          type="text"
          fullWidth
          value={room.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="room_number"
          label="Room Number"
          type="text"
          fullWidth
          required
          value={room.room_number}
          onChange={handleChange}
          error={!isRoomNumberAvailable}
          helperText={
            !isRoomNumberAvailable ? "Room number is already in use" : ""
          }
          InputProps={{
            endAdornment: isChecking && <CircularProgress size={20} />,
          }}
        />
        <TextField
          margin="dense"
          name="capacity"
          label="Capacity"
          type="number"
          fullWidth
          value={room.capacity}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="room-type-label">Room Type</InputLabel>
          <Select
            labelId="room-type-label"
            name="room_type"
            value={room.room_type}
            onChange={handleChange}
          >
            <MenuItem value="CLASSROOM">Classroom</MenuItem>
            <MenuItem value="OFFICE">Office</MenuItem>
            <MenuItem value="COMPUTER_LAB">Computer Lab</MenuItem>
            <MenuItem value="LECTURE_HALL">Lecture Hall</MenuItem>
            <MenuItem value="CONFERENCE_ROOM">Conference Room</MenuItem>
            <MenuItem value="LABORATORY">Laboratory</MenuItem>
            <MenuItem value="STUDY_AREA">Study Area</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
     
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!isRoomNumberAvailable || isChecking}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewRoom;
