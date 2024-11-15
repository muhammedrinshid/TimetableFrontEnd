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

const AddStandardForm = ({
  open,
  onClose,
  seletctedGreadeForCreation,
  refectClasssroomListdata
  ,
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
  const createStandardAndClassrooms = async (standardData) => {
    const apiUrl = `${apiDomain}/api/class-room/create-standard/`;

    const requestData = {
      name: standardData.name,
      short_name: standardData.short_name,
      grade: standardData.grade,
      number_of_divisions: standardData.number_of_divisions,
    };

    try {
      const response = await axios.post(apiUrl, requestData, { headers });
      console.log(response);
      let newStandard = {
        ...response.data.standard,
        classrooms: response.data.classrooms,
      };

      refectClasssroomListdata();

      onClose()
      toast.success("Standard and classrooms created successfully");
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
            `Error creating standard and classrooms: ${
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
    data["grade"] = seletctedGreadeForCreation;


    try {
      const result = await createStandardAndClassrooms(data);
      // Handle successful creation

      // Show success toast
      toast.success("Standard and classrooms created successfully!");
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
      <DialogTitle>Add New Standard</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Standard name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Standard Name"
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

export default AddStandardForm;
