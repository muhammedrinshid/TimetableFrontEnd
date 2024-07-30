import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

const ElectiveGroupForm = ({ divisions, setDivisions, classrooms, isExisting }) => {
  const handleDivisionChange = (event, newValue) => {
    setDivisions(newValue);
  };

  const handleSubjectChange = (division, newSubject) => {
    setDivisions(prevDivisions => 
      prevDivisions.map(d => 
        d.classroom_id === division.classroom_id 
          ? { ...d, id: newSubject.id, name: newSubject.name }
          : d
      )
    );
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={classrooms}
        getOptionLabel={(option) => option.division}
        value={divisions.map(d => classrooms.find(c => c.id === d.classroom_id))}
        onChange={(event, newValue) => {
          setDivisions(newValue.map(classroom => ({
            classroom_id: classroom.id,
            division: classroom.division,
            id: null,
            name: ''
          })));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select Divisions"
            placeholder="Divisions"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.division}
              {...getTagProps({ index })}
              disabled={isExisting}
            />
          ))
        }
        disabled={isExisting}
      />
      {divisions.map((division) => (
        <div key={division.classroom_id} className="mt-4">
          <Autocomplete
            value={division}
            onChange={(event, newValue) => handleSubjectChange(division, newValue)}
            options={classrooms.find(c => c.id === division.classroom_id)?.elective_class_subjects || []}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={`Select Subject for ${division.division}`}
              />
            )}
            disabled={isExisting}
          />
        </div>
      ))}
    </div>
  );
};

export default ElectiveGroupForm;