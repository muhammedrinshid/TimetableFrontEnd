import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/Authcontext";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import MultiBlockLessonsInput from "./subjectAssignmentForm/MultiBlockLessonsInput";

const schema = yup.object().shape({
  coreSubjects: yup.array().of(yup.string()),
  electiveSubject: yup.string(),
});

const AddNewSubjectForm = ({
  open,
  onClose,
  openAddNewSubjectForm,
  refresh,
}) => {
  const {
    totalperiodsInWeek: maxlessons_per_week,
    apiDomain,
    headers,
  } = useAuth();
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalSelectedLessons, setTotalSelectedLessons] = useState(0);
  const [alreadySelectedSubjects, setAlreadySelectedSubjects] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

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

  const fetchSubjectsWithTeachers = async () => {
    if (openAddNewSubjectForm?.gradeId) {
      try {
        const response = await axios.get(
          `${apiDomain}/api/class-room/subjects-with-teachers/${openAddNewSubjectForm.gradeId}`,
          {
            headers,
          }
        );
        setAvailableSubjects(response.data);
        setIsLoadingSubjects(false);
        setAlreadySelectedSubjects([
          ...openAddNewSubjectForm?.selectedSubjects,
        ]);

        if (response.data.length === 0) {
          toast.info("You have no subject. Create subjects to proceed.");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchSubjectsWithTeachers();
      fetchAvailableRooms();
    }
  }, [open, openAddNewSubjectForm]);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      coreSubjects: [],
      electiveSubject: "",
    },
  });

  const handleAddSubject = (subject, elective_or_core) => {
    const newSubject = {
      id: subject.id,
      name: subject.name,
      elective_or_core: elective_or_core,
      need_special_rooms: false,
      need_multi_block_lessons:false,
      multi_block_lessons:1,
      prevent_first_half_period:false,
      multi_block_lessons_error:'',

      subjects:
        elective_or_core === "core"
          ? [{ id: subject.id, qualifiedTeachers: [], preferedRooms: [] }]
          : [],
      lessons_per_week: 1,
    };
    setSelectedSubjects([...selectedSubjects, newSubject]);
    updateTotalSelectedLessons([...selectedSubjects, newSubject]);
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects.splice(index, 1);
    setSelectedSubjects(updatedSubjects);
    updateTotalSelectedLessons(updatedSubjects);
  };
  const handleToggleSpecialRooms = (index) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects[index].need_special_rooms =
      !updatedSubjects[index].need_special_rooms;
    setSelectedSubjects(updatedSubjects);
  };
  const handleTogglePreventFirstHalfPeriod = (index) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects[index].prevent_first_half_period =
      !updatedSubjects[index].prevent_first_half_period;
    setSelectedSubjects(updatedSubjects);
  };

  const handleToggleneedMultiBlockLessons = (index) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects[index].need_multi_block_lessons =
      !updatedSubjects[index].need_multi_block_lessons;
    updatedSubjects[index].multi_block_lessons = parseInt(1);
    updatedSubjects[index].multi_block_lessons_error = "";
    setSelectedSubjects(updatedSubjects);
  };
  const handlePreferedRoomSelect = (index, newRooms) => {
    const updatedSubjects = [...selectedSubjects];

    // Update the preferredRooms for the specific subject
    if (updatedSubjects[index].elective_or_core === "core") {
      updatedSubjects[index].subjects[0].preferedRooms = newRooms.map(
        (room) => ({
          id: room.id,
          room_number: room.room_number,
          name: room.name,
        })
      );
    }
    console.log(updatedSubjects);

    setSelectedSubjects(updatedSubjects);
  };

  const handleTeacherSelect = (subjectIndex, teacherId) => {
    const updatedSubjects = [...selectedSubjects];
    const subject = updatedSubjects[subjectIndex];
    const teacherIndex =
      subject.subjects[0].qualifiedTeachers.indexOf(teacherId);

    if (teacherIndex === -1) {
      subject.subjects[0].qualifiedTeachers.push(teacherId);
    } else {
      subject.subjects[0].qualifiedTeachers.splice(teacherIndex, 1);
    }

    setSelectedSubjects(updatedSubjects);
  };

  const handlelessons_per_weekChange = (index, change) => {
    const updatedSubjects = [...selectedSubjects];
    updatedSubjects[index].lessons_per_week = Math.max(
      1,
      updatedSubjects[index].lessons_per_week + change
    );
    setSelectedSubjects(updatedSubjects);
    updateTotalSelectedLessons(updatedSubjects);
  };

  const updateTotalSelectedLessons = (subjects) => {
    const total = subjects.reduce(
      (sum, subject) => sum + subject.lessons_per_week,
      0
    );
    setTotalSelectedLessons(
      total + openAddNewSubjectForm?.currentLessonsPerWeek
    );
  };

  const onSubmit = async (data) => {
    const formattedData = {
      selectedSubjects: selectedSubjects.map((subject) => {
        const { id, ...subjectWithoutId } = subject;
        return {
          ...subjectWithoutId,
          subjects: subject.subjects.map((s) => ({
            id: s.id,
            qualifiedTeachers: s.qualifiedTeachers,
            preferedRooms: s.preferedRooms.map((room) => room.id) || [],
          })),
        };
      }),
    };

    try {
      const response = await axios.post(
        `${apiDomain}/api/class-room/assign-subjects-to-single-classroom/${openAddNewSubjectForm.classroomId}/`,
        formattedData,
        { headers }
      );

      if (response.status === 201) {
        toast.success("Subjects assigned successfully");
        onClose();
        reset();
        setSelectedSubjects([]);
        setTotalSelectedLessons(0);
        refresh();
      }
    } catch (error) {
      console.error("Error assigning subjects:", error);
      toast.error(error.response?.data?.message || "Error assigning subjects");
    }
  };

  const isSubmitDisabled = totalSelectedLessons > maxlessons_per_week;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add Subjects
        <Typography
          variant="subtitle1"
          color={isSubmitDisabled ? "error" : "textSecondary"}
        >
          Total Lessons: {totalSelectedLessons} / {maxlessons_per_week}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="coreSubjects"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                fullWidth
                displayEmpty
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {availableSubjects.map((subject) => (
                  <MenuItem
                    key={subject.id}
                    value={subject.name}
                    disabled={alreadySelectedSubjects.includes(subject.id)}
                    onClick={() => handleAddSubject(subject, "core")}
                  >
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="electiveSubject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Add Elective Subject"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubject(
                      { id: Date.now(), name: e.target.value },
                      "elective"
                    );
                    field.onChange("");
                  }
                }}
              />
            )}
          />
          <Box mt={2}>
            {selectedSubjects.map((subject, index) => (
            <Box
            key={subject.id}
            mb={2}
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={1}
          >
            {/* Header Section */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              mb={3}
            >
              <Typography variant="h6" sx={{ flex: 1 }}>
                {subject.name} ({subject.elective_or_core})
              </Typography>
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                {subject.elective_or_core === "core" && (
                  <>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={subject.need_special_rooms}
                          onChange={() => handleToggleSpecialRooms(index)}
                        />
                      }
                      label="Need Special Rooms"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={subject.prevent_first_half_period}
                          onChange={() => handleTogglePreventFirstHalfPeriod(index)}
                        />
                      }
                      label="Prevent First Half Period"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={subject.need_multi_block_lessons}
                          onChange={() => handleToggleneedMultiBlockLessons(index)}
                        />
                      }
                      label="Need Multi-block Lessons"
                    />
                  </>
                )}
                <IconButton
                  onClick={() => handleRemoveSubject(index)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          
            {/* Special Rooms Section */}
            {subject.need_special_rooms && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Special Rooms
                </Typography>
                <Autocomplete
                  multiple
                  options={availableRooms}
                  getOptionLabel={(option) => `${option.room_number} - ${option.name}`}
                  value={subject.subjects[0].preferedRooms}
                  onChange={(e, newValue) => handlePreferedRoomSelect(index, newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Preferred Rooms"
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
            )}
          
            {/* Multi-block Lessons Section */}
            {subject.need_multi_block_lessons && (
              <MultiBlockLessonsInput
                subject={subject}
                index={index}
                setSelectedSubjects={setSelectedSubjects}
              />
            )}
          
            {/* Qualified Teachers Section */}
            {subject.elective_or_core === "core" && (
              <Box mt={1}>
                <Typography variant="subtitle1">Qualified Teachers:</Typography>
                {availableSubjects
                  .find((s) => s.id === subject.id)
                  ?.qualified_teachers.map((teacher) => (
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
                      onClick={() => handleTeacherSelect(index, teacher.id)}
                      color={
                        subject.subjects[0].qualifiedTeachers.includes(teacher.id)
                          ? "primary"
                          : "default"
                      }
                      sx={{ m: 0.5 }}
                    />
                  ))}
              </Box>
            )}
          
            {/* Lessons Per Week Section */}
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1">Lessons per week:</Typography>
              <IconButton
                onClick={() => handlelessons_per_weekChange(index, -1)}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{subject.lessons_per_week}</Typography>
              <IconButton
                onClick={() => handlelessons_per_weekChange(index, 1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNewSubjectForm;
