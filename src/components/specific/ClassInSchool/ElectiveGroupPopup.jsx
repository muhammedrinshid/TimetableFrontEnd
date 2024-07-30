import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import ElectiveGroupForm from "../../forms/ElectiveGroupForm";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";

const ElectiveGroupPopup = ({ open, onClose,openElectiveGroupPopup }) => {
  const { apiDomain, headers, logoutUser, totalperiodsInWeek, user } =
    useAuth();
  const [existingGroups, setExistingGroups] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [showAdditionalSection, setShowAdditionalSection] = useState(false);

  useEffect(() => {
    if (open && openElectiveGroupPopup.standardId) {
      fetchElectiveGroupData(openElectiveGroupPopup.standardId);
    }
  }, [open]);

  const fetchElectiveGroupData = async (standardId) => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/class-room/elective-subject-add/${standardId}/`,
        {
          headers,
        }
      );
      setExistingGroups(response.data.existing_elective_groups);
      setClassrooms(response.data.classrooms);
    } catch (err) {
      toast.error(`Error fetching data: ${err.message}`);
    } finally {
    }
  };

  const handleGroupChange = (newValue) => {
    setSelectedGroup(newValue);
    if (newValue && !newValue.__isNew__) {
      // Find the selected group in existingGroups and set its divisions
      const group = existingGroups.find((g) => g.id === newValue.value);
      setDivisions(
        group
          ? group.class_subjects.map((subject) => ({
              ...subject,
              division: classrooms.find((c) => c.id === subject.classroom_id)
                ?.division,
            }))
          : []
      );
      setShowAdditionalSection(true);
    } else {
      setDivisions([]);
      setShowAdditionalSection(false);
    }
  };
  const handleSave = async () => {
    const formData = {
      groupName: selectedGroup ? selectedGroup.label : "",
      groupId: selectedGroup ? selectedGroup.value : "",
      standardId: openElectiveGroupPopup?.standardId,
      divisions: divisions,
    };
  
    try {
      const response = await axios.patch(`${apiDomain}/api/class-room/update-elective-group/`, formData,{headers});
      
      if (response.status === 200) {
        toast.success('Elective group updated successfully!');
        console.log('Updated subjects:', response.data.updated_subjects);
      } else if (response.status === 201) {
        toast.success('New elective group created successfully!');
      } else if (response.status === 304) {
        toast.info('No changes were made to the elective group.');
      }
  
      if (response.data.not_found_subjects && response.data.not_found_subjects.length > 0) {
        toast.warning(`Some subjects were not found: ${response.data.not_found_subjects.join(', ')}`);
      }
  
      onClose();
      // Optionally, you can call a function to refresh the data in the parent component
      // refreshData();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (error.response.status==401) {
            logoutUser()
            
        }
        toast.error(`Error: ${error.response.data.error || 'An error occurred while updating the elective group.'}`);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from the server. Please try again.');
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('An error occurred while sending the request. Please try again.');
        console.error('Error message:', error.message);
      }
    }
  };
  

//   if (loading) {
//     return (
//       <Dialog open={open} onClose={onClose}>
//         <DialogContent>
//           <div className="flex justify-center items-center h-40">
//             <CircularProgress />
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add/Edit Elective Group</DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <CreatableSelect
            isClearable
            options={existingGroups.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
            onChange={handleGroupChange}
            value={selectedGroup}
            placeholder="Select or create an elective group"
          />
        </div>
        {showAdditionalSection && (
          <ElectiveGroupForm
            divisions={divisions}
            setDivisions={setDivisions}
            classrooms={classrooms}
            isExisting={selectedGroup && !selectedGroup.__isNew__}
          />
        )}
        {!showAdditionalSection && (
          <Button
            onClick={() => setShowAdditionalSection(true)}
            variant="outlined"
            className="mt-4"
          >
            Add Other Division Subjects to This Group
          </Button>
        )}
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
