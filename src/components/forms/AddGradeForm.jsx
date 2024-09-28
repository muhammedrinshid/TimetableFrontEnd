import React from "react";
import { useForm, Controller } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";

const AddGradeForm = ({
  open,
  onClose,
  seletctedGreadeForCreation,
  setClassByLevel,
}) => {
  const { apiDomain, logoutUser, headers } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      short_name: "",
      number_of_divisions: "",
    },
  });
  const createGradeAndClassrooms = async (gradeData) => {
    const apiUrl = `${apiDomain}/api/class-room/create-grade/`;

    const requestData = {
      name: gradeData.name,
      short_name: gradeData.short_name,
      level: gradeData.level,
      number_of_divisions: gradeData.number_of_divisions,
    };

    try {
      const response = await axios.post(apiUrl, requestData, { headers });
      console.log(response);
      let newGrade = {
        ...response.data.grade,
        classrooms: response.data.classrooms,
      };

      setClassByLevel((prev) => {
        let newData = prev.map((level) =>
          level.id == response.data.level_id
            ? { ...level, grades: [...level.grades,newGrade]}
            : level
        );
        return newData
      });
      onClose()
      toast.success("Grade and classrooms created successfully");
    } catch (err) {
      if (err.response) {
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser(); // Assuming you have this function defined
        } else {
          toast.error(
            `Error creating grade and classrooms: ${
              err.response.data?.message || "Unexpected error"
            }`
          );
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
      throw err;
    }
  };

  const onSubmitForm = async (data) => {
    data["level"] = seletctedGreadeForCreation;

    console.log(data);

    try {
      const result = await createGradeAndClassrooms(data);
      // Handle successful creation

      // Show success toast
      toast.success("Grade and classrooms created successfully!");
      // Update your component state or perform any other actions here
    } catch (error) {
      // Error is already handled in the function, but you can add any additional handling here if needed
      console.error("Creation failed:", error);
      // Show error toast
      toast.error("Creation failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Grade</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Grade name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Grade Name"
                type="text"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="short_name"
            control={control}
            rules={{ required: "Short name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Short Name"
                type="text"
                fullWidth
                error={!!errors.short_name}
                helperText={errors.short_name?.message}
              />
            )}
          />
          <Controller
            name="number_of_divisions"
            control={control}
            rules={{
              required: "Number of divisions is required",
              min: {
                value: 1,
                message: "Number of divisions must be greater than 0",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Number of Divisions"
                type="number"
                fullWidth
                error={!!errors.number_of_divisions}
                helperText={errors.number_of_divisions?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddGradeForm;
