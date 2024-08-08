import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Grid,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/Authcontext';

const ElectiveGroupPopup = ({ open, onClose, openElectiveGroupPopup, refresh }) => {
  const { apiDomain, headers, logoutUser } = useAuth();
  const [existingGroups, setExistingGroups] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [showAddOtherDivisions, setShowAddOtherDivisions] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedAdditionalRooms, setSelectedAdditionalRooms] = useState([]);

  useEffect(() => {
    if (open && openElectiveGroupPopup?.standardId) {
      fetchElectiveGroupData(openElectiveGroupPopup.standardId);
      fetchAvailableRooms();
    }
  }, [open, openElectiveGroupPopup]);

  const fetchElectiveGroupData = async (standardId) => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/class-room/elective-subject-add/${standardId}/`,
        { headers }
      );
      setExistingGroups(response.data.existing_elective_groups);
      setClassrooms(response.data.classrooms);

      setDefaultSelectedClassroom(response.data.classrooms);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/room/exclude_classrooms/`, { headers });
      setAvailableRooms(response.data);
    } catch (err) {
      toast.error('Failed to fetch available rooms');
      console.error('Error fetching available rooms:', err);
    }
  };

  const setDefaultSelectedClassroom = (classrooms) => {
    const { classroomId, electiveSubjectId } = openElectiveGroupPopup;
    if (classroomId && electiveSubjectId) {
      const defaultClassroom = classrooms.find(c => c.id === classroomId);
      const defaultSubject = defaultClassroom?.elective_class_subjects.find(s => s.id === electiveSubjectId);
      if (defaultClassroom && defaultSubject) {
        setSelectedClassrooms([{
          classroom_id: defaultClassroom.id,
          division: defaultClassroom.division,
          id: defaultSubject.id,
          name: defaultSubject.name
        }]);
      }
    }
  };

  const handleApiError = (err) => {
    if (err.response && err.response.status === 401) {
      logoutUser();
    } else {
      toast.error(`Error fetching data: ${err.message}`);
    }
  };

  const handleGroupChange = (newValue) => {
    setSelectedGroup(newValue);
    const group = existingGroups.find((group) => group.id === newValue?.value);
    setCurrentGroup(group || null);
    if (group && group.preferred_rooms) {
      const preferredRooms = availableRooms.filter(room => group.preferred_rooms.includes(room.id));
      setSelectedAdditionalRooms(preferredRooms);
    } else {
      setSelectedAdditionalRooms([]);
    }
  };

  const handleAddOtherDivisions = () => setShowAddOtherDivisions(true);

  const handleClassroomChange = (classroom, checked) => {
    if (checked) {
      const defaultSubject = classroom.elective_class_subjects[0];
      setSelectedClassrooms(prev => [...prev, {
        classroom_id: classroom.id,
        division: classroom.division,
        id: defaultSubject.id,
        name: defaultSubject.name
      }]);
    } else {
      setSelectedClassrooms(prev => prev.filter(c => c.classroom_id !== classroom.id));
    }
  };

  const handleSubjectChange = (classroomId, subjectId) => {
    setSelectedClassrooms(prev => prev.map(c => {
      if (c.classroom_id === classroomId) {
        const classroom = classrooms.find(cl => cl.id === classroomId);
        const subject = classroom.elective_class_subjects.find(s => s.id === subjectId);
        return { ...c, id: subject.id, name: subject.name };
      }
      return c;
    }));
  };

  const handleAdditionalRoomsChange = (event, newValue) => {
    setSelectedAdditionalRooms(newValue);
  };

  const handleSave = async () => {
    if (!selectedGroup) {
      toast.error("Please select or create a group");
      return;
    }

    if (selectedClassrooms.length === 0) {
      toast.error("Please select at least one classroom");
      return;
    }

    if (openElectiveGroupPopup.currenGrpId === selectedGroup?.value) {
      toast.info("You have selected the current group");
      return;
    }

    try {
      const formData = {
        groupName: selectedGroup?.label || null,
        groupId: selectedGroup?.value || null,
        standardId: openElectiveGroupPopup?.standardId,
        divisions: selectedClassrooms,
        preferredRooms: selectedAdditionalRooms.map(room => room.id)
      };

      const response = await axios.patch(`${apiDomain}/api/class-room/update-elective-group/`, formData, { headers });
      handleSaveResponse(response);
      refresh();
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleSaveResponse = (response) => {
    if (response.status === 200) {
      toast.success('Elective group updated successfully!');
    } else if (response.status === 201) {
      toast.success('New elective group created successfully!');
    } else if (response.status === 304) {
      toast.info('No changes were made to the elective group.');
    }

    if (response.data.not_found_subjects?.length > 0) {
      toast.warning(`Some subjects were not found: ${response.data.not_found_subjects.join(', ')}`);
    }

    onClose();
  };

  const handleSaveError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        logoutUser();
      } else {
        toast.error(`Error: ${error.response.data.error || 'An error occurred while updating the elective group.'}`);
      }
    } else if (error.request) {
      toast.error('No response received from the server. Please try again.');
    } else {
      toast.error('An error occurred while sending the request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Elective Group</DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Select or Create Group</Typography>
          <CreatableSelect
            isClearable
            options={existingGroups.map(group => ({ value: group.id, label: group.name }))}
            onChange={handleGroupChange}
            value={selectedGroup}
            placeholder="Select or create a group"
          />
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Selected Classroom and Subject</Typography>
          <Select
            value={selectedClassrooms[0]?.classroom_id || ''}
            disabled
            fullWidth
          >
            <MenuItem value={selectedClassrooms[0]?.classroom_id || ''}>
              {selectedClassrooms[0] ? `${selectedClassrooms[0].division} - ${selectedClassrooms[0].name}` : 'No classroom selected'}
            </MenuItem>
          </Select>
        </Box>

        {showAddOtherDivisions && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Other Divisions</Typography>
            <Grid container spacing={2}>
              {classrooms.filter(classroom => classroom.id !== selectedClassrooms[0]?.classroom_id).map((classroom) => {
                const isAlreadySelected = currentGroup?.class_subjects?.find((subject) => subject.classroom_id === classroom.id)?.name || false;
                const isChecked = isAlreadySelected || selectedClassrooms.some(c => c.classroom_id === classroom.id);

                return (
                  <Grid item xs={12} key={classroom.id}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            disabled={isAlreadySelected}
                            onChange={(e) => handleClassroomChange(classroom, e.target.checked)}
                          />
                        }
                        label={classroom.division}
                      />
                      {isAlreadySelected ? (
                        <Typography variant="body2" color="textSecondary">
                          Division already has {isAlreadySelected} in this group
                        </Typography>
                      ) : (
                        isChecked && (
                          <Select
                            value={selectedClassrooms.find(c => c.classroom_id === classroom.id)?.id || ''}
                            onChange={(e) => handleSubjectChange(classroom.id, e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
                          >
                            {classroom.elective_class_subjects.map((subject) => (
                              <MenuItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {!showAddOtherDivisions && (
          <Button onClick={handleAddOtherDivisions} variant="outlined" color="primary">
            Add other division elective subjects to this group
          </Button>
        )}

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Additional Rooms for Overflow Students</Typography>
          <Autocomplete
            multiple
            options={availableRooms}
            getOptionLabel={(option) => `${option.room_number} - ${option.name}`}
            value={selectedAdditionalRooms}
            onChange={handleAdditionalRoomsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Additional Rooms"
                placeholder="Choose rooms"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={`${option.room_number} - ${option.name}`}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElectiveGroupPopup;