import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateSubjectForm = ({ open, onClose, subject ,refresh}) => {
  const { apiDomain, headers } = useAuth();
  const [formData, setFormData] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [availableSubjectAndTeachers, setAvailableSubjectAndTeachers] =
    useState([]);
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/room/exclude_classrooms/`,
          { headers }
        );
        setAvailableRooms(response.data);
      } catch (err) {
        toast.error("Failed to fetch available rooms");
        console.error("Error fetching available rooms:", err);
      }
    };
  
  useEffect(() => {
    if (open && subject) {
      setFormData({
        name: subject.name,
        lessons_per_week: subject.lessons_per_week,
        is_elective: subject.is_elective,
        teacher: subject.teacher,
        options: subject.options || [],
      });
      fetchAvailableSubjectAndTeachers();
      fetchAvailableRooms()
    } else {
      setFormData(null);
      setAvailableSubjectAndTeachers([]);
    }
  }, [open, subject]);

  const fetchAvailableSubjectAndTeachers = async () => {
    if (subject && subject.id) {
      try {
        const response = await fetch(
          `${apiDomain}/api/class-room/subjects-with-teachers/${subject.gradeId}`,
          { headers }
        );
        const data = await response.json();
        setAvailableSubjectAndTeachers(data);
      } catch (error) {
        console.error("Error fetching available teachers:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (e) => {
    const selectedIds = e.target.value;
    const newOptions = selectedIds.map((id) => {
      const existingOption = formData.options.find(
        (opt) => opt.subject.id === id
      );
      if (existingOption) return existingOption;
      const subject = availableSubjectAndTeachers.find((s) => s.id === id);
      return {
        subject: subject,
        number_of_students: 0,
        allotted_teachers: [],
        preferred_rooms: [],
      };
    });

    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleStudentNumberChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].number_of_students = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleTeacherChange = (index, teacherId, subjectId) => {
    let currentData = formData.options[index].allotted_teachers || [];

    let newData = currentData.some((t) => t.id === teacherId)
      ? currentData.filter((t) => t.id !== teacherId)
      : [
          ...currentData,
          availableSubjectAndTeachers
            .find((item) => item.id === subjectId)
            ?.qualified_teachers.find((t) => t.id === teacherId),
        ].filter((t) => t !== undefined); // Ensure no undefined values

    let updatedFormData = { ...formData };
    updatedFormData.options[index].allotted_teachers = newData;
    setFormData(updatedFormData);
  };

  const handleTeacherToggle = (teacherId) => {
    setFormData((prev) => ({
      ...prev,
      teacher: prev.teacher.some((t) => t.id === teacherId)
        ? prev.teacher.filter((t) => t.id !== teacherId)
        : [
            ...prev.teacher,
            availableSubjectAndTeachers
              .find((item) => item.id === subject.subjectId)
              ?.qualified_teachers.find((t) => t.id === teacherId),
          ],
    }));
  };

  const handleSubmit = async () => {
    let subjects = formData.is_elective
  ? formData.options.map((option) => ({
      subject: option.subject.id,
      number_of_students: option.number_of_students,
      assigned_teachers: option.allotted_teachers.map((teacher) => teacher.id),
      preferred_rooms:[]
     
    }))
  : [
      {
        subject: subject?.subjectId,
        assigned_teachers: formData?.teacher?.map((teacher) => teacher.id) || [],
        number_of_students:0,
        preferred_rooms:[]
      },
    ]

    // Prepare the data
    const dataToSend = {
      name: formData.name,
      lessons_per_week: formData.lessons_per_week,
      subjects: subjects,
    };

    try {
      const response = await axios.put(
        `${apiDomain}/api/class-room/class-subject-detail/${subject.id}/`,
        dataToSend,
        { headers }
      );

      if (response.status === 200) {
        toast.success("Subject updated successfully!");
        refresh()
        onClose();
      } else {
        toast.error("Failed to update subject. Please try again.");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Failed to update subject"}`
        );
      } else if (error.request) {
        toast.error(
          "No response received from server. Please try again later."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (!open || !formData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {formData?.is_elective
          ? "Update Elective Subject"
          : "Update Core Subject"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Subject Name"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!formData.is_elective}
        />
        <TextField
          margin="dense"
          label="Lessons per Week"
          type="number"
          fullWidth
          name="lessons_per_week"
          value={formData.lessons_per_week}
          onChange={handleInputChange}
        />

        {!formData.is_elective && (
          <div>
            <h4>Assigned Teachers</h4>
            {(
              availableSubjectAndTeachers.find(
                (item) => item.id === subject.subjectId
              )?.qualified_teachers || []
            ).map((teacher) => (
              <Chip
                key={teacher.id}
                avatar={
                  <Avatar
                    alt={teacher.full_name}
                    src={
                      teacher.profile_image &&
                      `${apiDomain}${teacher.profile_image}`
                    }
                  />
                }
                label={teacher.full_name}
                onClick={() => handleTeacherToggle(teacher.id)}
                color={
                  formData.teacher.some((t) => t.id === teacher.id)
                    ? "primary"
                    : "default"
                }
                sx={{ m: 0.5 }}
              />
            ))}
          </div>
        )}

        {formData.is_elective && (
          <div>
            <h4>Options</h4>
            <Select
              multiple
              fullWidth
              value={formData.options.map((opt) => opt.subject.id)}
              onChange={handleOptionChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        availableSubjectAndTeachers.find((s) => s.id === value)
                          ?.name
                      }
                    />
                  ))}
                </Box>
              )}
            >
              {availableSubjectAndTeachers.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>

            {formData.options.map((option, index) => (
              <div key={option.subject.id}>
                <TextField
                  margin="dense"
                  label={`Number of Students for ${option.subject.name}`}
                  type="number"
                  value={option.number_of_students}
                  onChange={(e) =>
                    handleStudentNumberChange(index, e.target.value)
                  }
                />

                <h5>Assigned Teachers for {option.subject.name}</h5>

                {(
                  availableSubjectAndTeachers.find(
                    (item) => item.id === option?.subject?.id
                  )?.qualified_teachers || []
                ).map((teacher) => (
                  <Chip
                    key={teacher.id}
                    avatar={
                      <Avatar
                        alt={teacher.full_name}
                        src={
                          teacher.profile_image &&
                          `${apiDomain}${teacher.profile_image}`
                        }
                      />
                    }
                    label={teacher.full_name}
                    onClick={() =>
                      handleTeacherChange(index, teacher.id, option.subject.id)
                    }
                    color={
                      formData.options[index].allotted_teachers?.some(
                        (t) => t.id === teacher.id
                      )
                        ? "primary"
                        : "default"
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}
                {/* <Select
                  multiple
                  fullWidth
                  value={option.allotted_teachers.map((t) => t.id) || []}
                  onChange={(e) => handleTeacherChange(index, e.target.value,option.subject.id)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected?.map((teacherId) => {
                        const teacher = option.subject.allotted_teachers?.find(
                          (t) => t?.id === teacherId
                        );
                        return (
                          <Chip key={teacherId} label={teacher.full_name} />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableSubjectAndTeachers.find(
                (item) => item.id === option?.subject?.id
              )?.qualified_teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </MenuItem>
                  ))}
                </Select> */}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSubjectForm;
