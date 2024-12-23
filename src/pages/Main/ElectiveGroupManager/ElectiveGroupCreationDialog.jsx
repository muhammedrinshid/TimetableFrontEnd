import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";

const ElectiveGroupDialog = ({
  open,
  onClose,
  setElectiveGroups,
  currentStandardIdForNewGroup,
}) => {
  const { apiDomain, headers, handleError } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { initialData, mode, standardId } = currentStandardIdForNewGroup;
  // Initialize form with data if in update mode
  useEffect(() => {
    if (initialData && mode === "update") {
      setGroupName(initialData.group_name);
      console.log(initialData?.preferred_rooms);
      setSelectedRooms(
        initialData?.preferred_rooms?.map((room) => room.id) || []
      );
    }
  }, [initialData, mode]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setGroupName("");
      setSelectedRooms([]);
    }
  }, [open]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/room/exclude_classrooms/`,
        { headers }
      );
      const uniqueRooms = [...response.data];
      initialData?.preferred_rooms?.forEach((room) => {
        if (!uniqueRooms.some((r) => r.id === room.id)) {
          uniqueRooms.push(room);
        }
      });
      setAvailableRooms(uniqueRooms);
    } catch (err) {
      toast.error("Failed to fetch available rooms");
      console.error("Error fetching available rooms:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAvailableRooms();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName || !standardId || selectedRooms.length === 0) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    const electiveGroupData = {
      name: groupName,
      preferred_rooms: selectedRooms,
      standard_id: standardId,
    };

    try {
      let response;
      if (mode === "create") {
        response = await axios.post(
          `${apiDomain}/api/elective-group/group/`,
          electiveGroupData,
          { headers }
        );
      } else {
        response = await axios.put(
          `${apiDomain}/api/elective-group/group/${initialData.group_id}/`,
          electiveGroupData,
          { headers }
        );
      }

      const updatedGroup = response.data;

      setElectiveGroups((prevGrades) =>
        prevGrades.map((grade) => ({
          ...grade,
          standards: grade.standards.map((standard) => {
            if (standard.standard_id === standardId) {
              const updatedGroups =
                mode === "create"
                  ? [...standard.electives_groups, updatedGroup]
                  : standard.electives_groups.map((group) =>
                      group.id === updatedGroup.id ? updatedGroup : group
                    );

              return {
                ...standard,
                electives_groups: updatedGroups,
              };
            }
            return standard;
          }),
        }))
      );

      toast.success(
        `Elective Group ${
          mode === "create" ? "created" : "updated"
        } successfully!`
      );
      onClose();
      setSelectedRooms([]);
      setGroupName("");
    } catch (err) {
      handleError(err);
      onClose();
      setSelectedRooms([]);
      setGroupName("");
    }
  };

  const handleRoomChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRooms(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Create" : "Update"} Elective Group
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="room-select-label">Preferred Rooms</InputLabel>
          <Select
            labelId="room-select-label"
            multiple
            value={selectedRooms}
            onChange={handleRoomChange}
            input={
              <OutlinedInput
                id="select-multiple-chip"
                label="Preferred Rooms"
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((id) => {
                  const room = availableRooms.find((room) => room.id === id);
                  return (
                    <Chip
                      key={id}
                      label={room ? `${room.name} (${room.room_number})` : id}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {availableRooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {`${room.name} (${room.room_number})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {mode === "create" ? "Save" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElectiveGroupDialog;
