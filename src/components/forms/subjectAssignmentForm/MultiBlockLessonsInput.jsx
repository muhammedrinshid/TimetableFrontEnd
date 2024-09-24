import { TextField } from "@mui/material";
import React from "react";

const MultiBlockLessonsInput = ({ subject, index, setSelectedSubjects }) => {
  const handleMultiBlockLessonsChange = (event) => {
    const newValue = parseInt(event.target.value, 10);

    setSelectedSubjects((prevSubjects) => {
      const updatedSubjects = [...prevSubjects];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        multi_block_lessons: newValue,
        multi_block_lessons_error: "",
      };

      // Validate the input
      if (isNaN(newValue) || newValue < 1) {
        updatedSubjects[index].multi_block_lessons_error =
          "Please enter a positive integer";
      } else if (newValue > subject.lessons_per_week) {
        updatedSubjects[index].multi_block_lessons_error =
          "Value cannot exceed lessons per week";
      } else if (subject.lessons_per_week % newValue !== 0) {
        updatedSubjects[index].multi_block_lessons_error =
          "Must be a factor of lessons per week";
      }

      return updatedSubjects;
    });
  };

  return (
    <TextField
      type="number"
      value={subject.multi_block_lessons || ""}
      onChange={handleMultiBlockLessonsChange}
      label="Multi-block Lessons"
      error={!!subject.multi_block_lessons_error}
      helperText={subject.multi_block_lessons_error || ""}
    />
  );
};

export default MultiBlockLessonsInput;
