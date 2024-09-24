import { TextField } from "@mui/material";
import React from "react";

const MultiBlockLessonsInputForSingleClasssubject = ({
  subject,
  setFormData,
}) => {
  const handleMultiBlockLessonsChange = (event) => {
    let newError = "";
    const newValue = parseInt(event.target.value, 10);

    if (isNaN(newValue) || newValue < 1) {
      newError = "Please enter a positive integer";
    } else if (newValue > subject.lessons_per_week) {
      newError = "Value cannot exceed lessons per week";
    } else if (subject.lessons_per_week % newValue !== 0) {
      newError = "Must be a factor of lessons per week";
    }

    setFormData((prevSubjects) => ({
      ...prevSubjects,
      multi_block_lessons: newValue,
      multi_block_lessons_error: newError,
    }));

    // You may want to do something with updatedSubjects here if needed
    // updatedSubjects; // Uncomment if needed
  };

  return (
    <TextField
      type="number"
      value={subject.multi_block_lessons || ""}
      onChange={handleMultiBlockLessonsChange}
      label="Multi-block Lessons"
      fullWidth
      error={!!subject.multi_block_lessons_error}
      helperText={subject.multi_block_lessons_error || ""}
    />
  );
};

export default MultiBlockLessonsInputForSingleClasssubject;
