import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  IconButton,
  Typography,
  Box,
  Chip,
  TextField,
  Paper,
  Alert,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAuth } from '../../context/Authcontext';
import subjectToTeacher from '../../assets/datas/TeachersToSubjects';

const SubjectAssignmentForm = ({ open, onClose, onSubmit, availableSubjects }) => {
  const { totalperiodsInWeek: maxLessonsPerWeek } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [electiveName, setElectiveName] = useState('');
  const [selectedElectiveOptions, setSelectedElectiveOptions] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const total = selectedSubjects.reduce((sum, subject) => sum + subject.lessonsPerWeek, 0);
    setTotalLessons(total);
    setError(total > maxLessonsPerWeek ? `Total lessons (${total}) exceed the maximum allowed (${maxLessonsPerWeek})` : '');
  }, [selectedSubjects, maxLessonsPerWeek]);

  const handleAddCoreSubject = () => {
    const subject = availableSubjects.find(sub => sub.id === selectedSubject);
    if (subject) {
      const subjectTeachers = subjectToTeacher.find(st => st.subject === subject.subject)?.teachers || [];
      setSelectedSubjects([...selectedSubjects, {
        name: subject.subject,
        type: "core",
        qualifiedTeachers: [],
        availableTeachers: subjectTeachers,
        lessonsPerWeek: 0
      }]);
      setSelectedSubject('');
    }
  };

  const handleAddElectiveSubject = () => {
    if (electiveName && selectedElectiveOptions.length > 0) {
      const newElective = {
        name: electiveName,
        type: "elective",
        options: selectedElectiveOptions.map(optionId => {
          const option = availableSubjects.find(sub => sub.id === optionId);
          const optionTeachers = subjectToTeacher.find(st => st.subject === option.subject)?.teachers || [];
          return {
            name: option.subject,
            qualifiedTeachers: [],
            availableTeachers: optionTeachers,
          };
        }),
        lessonsPerWeek: 0
      };
      setSelectedSubjects([...selectedSubjects, newElective]);
      setElectiveName('');
      setSelectedElectiveOptions([]);
    }
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...selectedSubjects];
    newSubjects.splice(index, 1);
    setSelectedSubjects(newSubjects);
  };

  const handleLessonsChange = (index, change) => {
    const newSubjects = [...selectedSubjects];
    newSubjects[index].lessonsPerWeek = Math.max(0, newSubjects[index].lessonsPerWeek + change);
    setSelectedSubjects(newSubjects);
  };

  const handleTeacherChange = (subjectIndex, optionIndex, selectedTeachers) => {
    const newSubjects = [...selectedSubjects];
    if (newSubjects[subjectIndex].type === 'core') {
      newSubjects[subjectIndex].qualifiedTeachers = selectedTeachers;
    } else {
      newSubjects[subjectIndex].options[optionIndex].qualifiedTeachers = selectedTeachers;
    }
    setSelectedSubjects(newSubjects);
  };

  const handleSubmit = () => {
    if (totalLessons <= maxLessonsPerWeek) {
      onSubmit(selectedSubjects);
      onClose();
    } else {
      setError(`Cannot submit. Total lessons (${totalLessons}) exceed the maximum allowed (${maxLessonsPerWeek})`);
    }
  };

  // Filter out already selected subjects
  const availableCoreSubjects = availableSubjects.filter(
    subject => !selectedSubjects.some(
      selectedSubject => selectedSubject.name === subject.subject && selectedSubject.type === 'core'
    )
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assign Subjects to Standard</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="body2" sx={{ mb: 2 }}>
          Total lessons: {totalLessons} / {maxLessonsPerWeek}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Core Subject</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            label="Select Core Subject"
          >
            {availableCoreSubjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>{subject.subject}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleAddCoreSubject} disabled={!selectedSubject} variant="outlined">
          Add Core Subject
        </Button>

        <TextField
          fullWidth
          margin="normal"
          label="Elective Subject Name"
          value={electiveName}
          onChange={(e) => setElectiveName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Elective Options</InputLabel>
          <Select
            multiple
            value={selectedElectiveOptions}
            onChange={(e) => setSelectedElectiveOptions(e.target.value)}
            label="Select Elective Options"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={availableSubjects.find(sub => sub.id === value).subject} />
                ))}
              </Box>
            )}
          >
            {availableSubjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>{subject.subject}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleAddElectiveSubject} disabled={!electiveName || selectedElectiveOptions.length === 0} variant="outlined">
          Add Elective Subject
        </Button>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Selected Subjects:</Typography>
        <List>
          {selectedSubjects.map((subject, index) => (
            <Paper 
              elevation={2} 
              sx={{ mb: 2, p: 2 }} 
              key={index}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {subject.name}
                </Typography>
                <Chip label={subject.type} color={subject.type === 'core' ? 'primary' : 'secondary'} />
              </Box>
              {subject.type === 'core' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      Qualified Teachers: {subject.qualifiedTeachers.length > 0 
                        ? subject.qualifiedTeachers.map(t => {
                            const teacher = subject.availableTeachers.find(at => at.teacherId === t);
                            return `${teacher.name} ${teacher.surname}`;
                          }).join(", ") 
                        : "None assigned"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => handleLessonsChange(index, -1)} size="small">
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{subject.lessonsPerWeek}</Typography>
                      <IconButton onClick={() => handleLessonsChange(index, 1)} size="small">
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Assign Teachers</InputLabel>
                    <Select
                      multiple
                      value={subject.qualifiedTeachers}
                      onChange={(e) => handleTeacherChange(index, null, e.target.value)}
                      label="Assign Teachers"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const teacher = subject.availableTeachers.find(t => t.teacherId === value);
                            return (
                              <Chip
                                key={value}
                                label={`${teacher.name} ${teacher.surname}`}
                                avatar={<Avatar src={teacher.image} />}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {subject.availableTeachers.map((teacher) => (
                        <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                          <Avatar src={teacher.image} sx={{ mr: 2 }} />
                          {teacher.name} {teacher.surname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Options:</Typography>
                    {subject.options.map((option, optionIndex) => (
                      <Box key={optionIndex}>
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          - {option.name}
                        </Typography>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Assign Teachers for {option.name}</InputLabel>
                          <Select
                            multiple
                            value={option.qualifiedTeachers}
                            onChange={(e) => handleTeacherChange(index, optionIndex, e.target.value)}
                            label={`Assign Teachers for ${option.name}`}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => {
                                  const teacher = option.availableTeachers.find(t => t.teacherId === value);
                                  return (
                                    <Chip
                                      key={value}
                                      label={`${teacher.name} ${teacher.surname}`}
                                      avatar={<Avatar src={teacher.image} />}
                                    />
                                  );
                                })}
                              </Box>
                            )}
                          >
                            {option.availableTeachers.map((teacher) => (
                              <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                                <Avatar src={teacher.image} sx={{ mr: 2 }} />
                                {teacher.name} {teacher.surname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Lessons per week:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => handleLessonsChange(index, -1)} size="small">
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{subject.lessonsPerWeek}</Typography>
                      <IconButton onClick={() => handleLessonsChange(index, 1)} size="small">
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton onClick={() => handleRemoveSubject(index)} color="error">
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={totalLessons > maxLessonsPerWeek}>
          Assign Subjects
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubjectAssignmentForm;