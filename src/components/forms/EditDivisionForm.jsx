import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useAuth } from '../../context/Authcontext';

const filter = createFilterOptions();

const EditClassroomForm = ({ open, onClose, editClassroomForm }) => {
  const {apiDomain,headers}=useAuth()
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomData, nonOccupiedRooms] = await Promise.all([
          axios.get(`${apiDomain}/api/class-room/classroom/${editClassroomForm?.classroomId}/`, { headers }),
          axios.get(`${apiDomain}/api/room/non-occupied-rooms/`, { headers })
        ]);

        const currentRoom = classroomData.data.room;
        const allRooms = [...nonOccupiedRooms.data];

        // Add the current room to the list if it's not null
        if (currentRoom) {
          const roomExists = allRooms.some(room => room.id === currentRoom.id);
          if (!roomExists) {
            allRooms.push(currentRoom);
          }
        }

        setRooms(allRooms);

        // Set default values
        setSelectedRoom(currentRoom || null);
        setNumberOfStudents(classroomData.data.number_of_students || 0);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch classroom data');
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, editClassroomForm]);

  const handleSubmit =async () => {
    try {
      // Prepare the data to submit
      const dataToSubmit = {
        room: selectedRoom ? {
          id: selectedRoom.id,
          name: selectedRoom.name,
          room_number: selectedRoom.room_number,
          capacity: selectedRoom.capacity
        } : null,
        number_of_students: numberOfStudents
      };

      // Make the API call
      const response = await axios.patch(
        `${apiDomain}/api/class-room/classroom/${editClassroomForm?.classroomId}/`,
        dataToSubmit,
        { headers }
      );

      // Handle successful response
      if (response.status === 200) {
        toast.success('Classroom updated successfully');
        onClose(); // Close the form
        // You might want to update the parent component's state or trigger a refetch
      } else {
        toast.error('Failed to update classroom');
      }
    } catch (error) {
      console.error('Error updating classroom:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Error: ${error.response.data.error || 'Failed to update classroom'}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error setting up the request');
      }
    }
    // Handle form submission logic here
    console.log('Selected Room:', selectedRoom);
    console.log('Number of Students:', numberOfStudents);
    onClose();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Classroom</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Autocomplete
            value={selectedRoom}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setSelectedRoom({ room_number: newValue, isNew: true });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setSelectedRoom({ room_number: newValue.inputValue, isNew: true });
              } else {

                setSelectedRoom(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.room_number);
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  room_number: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={rooms}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.room_number;
            }}
            renderOption={(props, option) => <li {...props}>{option.room_number}</li>}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Room" />
            )}
          />
          <TextField
            label="Number of Students"
            type="number"
            value={numberOfStudents}
            onChange={(e) => setNumberOfStudents(Number(e.target.value))}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClassroomForm;