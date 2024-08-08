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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  coreSubjects: yup.array().of(yup.string()),
  electiveSubject: yup.string(),
});

const AddNewSubjectForm = ({
  open,
  onClose,
  openAddNewSubjectForm,
  refresh
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
  const [alreadySelectedSubjects,setAlreadySelectedSubjects]=useState([])
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
        setAlreadySelectedSubjects([...openAddNewSubjectForm?.selectedSubjects])


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
      subjects:
        elective_or_core === "core"
          ? [{ id: subject.id, qualifiedTeachers: [] }]
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
    setTotalSelectedLessons(total+openAddNewSubjectForm?.currentLessonsPerWeek);
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
        refresh()
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    {subject.name} ({subject.elective_or_core})
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveSubject(index)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {subject.elective_or_core === "core" && (
                  <Box mt={1}>
                    <Typography variant="subtitle1">
                      Qualified Teachers:
                    </Typography>
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
                            subject.subjects[0].qualifiedTeachers.includes(
                              teacher.id
                            )
                              ? "primary"
                              : "default"
                          }
                          sx={{ m: 0.5 }}
                        />
                      ))}
                  </Box>
                )}
                <Box mt={1} display="flex" alignItems="center">
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
