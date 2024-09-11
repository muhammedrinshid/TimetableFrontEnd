import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { defaultAvatarImage } from "../../assets/images";
import AddNewRoom from "../../components/forms/AddNewRoom";
import RoomsSection from "../../components/specific/UserConfiguration/RoomsSection";

// theme for the input fields
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#312ECB",
            fontWeight: 500,
            backgroundColor: "transparent",
            padding: "0 4px",
            transition: "all 0.2s ease-out",
            "&.Mui-focused": {
              color: "#1a18a0",
            },
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#312ECB",
              borderWidth: "2px",
              transition: "all 0.2s ease-out",
            },
            "&:hover fieldset": {
              borderColor: "#1a18a0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1a18a0",
            },
          },
          "& .MuiInputBase-input": {
            color: "#333",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#666",
            opacity: 0.7,
          },
        },
      },
    },
  },
});

// data for working days
const DAYS_OF_WEEK = [
  { label: "Monday", value: "MON" },
  { label: "Tuesday", value: "TUE" },
  { label: "Wednesday", value: "WED" },
  { label: "Thursday", value: "THU" },
  { label: "Friday", value: "FRI" },
  { label: "Saturday", value: "SAT" },
  { label: "Sunday", value: "SUN" },
];

const UserConfiguration = ({  }) => {
  // context datas
  const { apiDomain, headers, logoutUser, fileUploadHeaders } = useAuth();
  const [schoolData, setSchoolData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(schoolData.profile_image);
  const [newImage, setNewImage] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({
    name: "",
    short_name: "",
  });
  const [isNewGrade, setIsNewGrade] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(null);

  // this will fetch the data while loading the page
  const fetchData = async () => {
    try {
      const [userInfoResponse, roomsResponse] = await Promise.all([
        axios.get(`${apiDomain}/api/user/info`, { headers }),
        axios.get(`${apiDomain}/api/room/rooms/`, { headers }),
      ]);
      setSchoolData({ ...userInfoResponse.data });
      setRooms(roomsResponse.data);
      setIsLoading(false);
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            `Error occurred: ${
              err.response.data?.message || "Unexpected error"
            }`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        toast.error("Error occurred: No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", err.message);
        toast.error(`Error occurred: ${err.message}`);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // function to call when the config and basic data of school updating
  const handleSave = async () => {
    const updatedData = { ...schoolData };

    // Remove grades from the data to be sent
    delete updatedData.grades;

    // Remove profile_image if it's a string (URL)
    if (typeof updatedData.profile_image === "string") {
      delete updatedData.profile_image;
    }

    // Ensure working_days is properly formatted
    if (updatedData.working_days && !Array.isArray(updatedData.working_days)) {
      updatedData.working_days = [updatedData.working_days];
    }

    try {
      const response = await axios.put(
        `${apiDomain}/api/user/info/`,
        updatedData,
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      setSchoolData(response.data);
      setImagePreview(response.data.profile_image);
      toast.success("Successfully Updated");
      setIsEditing(false);
      setIsEditingConfig(false);
    } catch (err) {
      if (err.response) {
        console.error(
          "Response error:",
          err.response.status,
          err.response.data
        );
        if (err.response.status === 401) {
          toast.error("Error occurred: Unauthorized access");
          logoutUser();
        } else {
          toast.error(
            `Error occurred: ${
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
    }
  };

  // input change function for every text and other inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolData((prev) => ({ ...prev, [name]: value }));
  };

  // fhand the field working day on change
  const handleWorkingDayChange = (dayValue) => {
    setSchoolData((prevData) => {
      const currentWorkingDays = prevData.working_days || [];
      let newWorkingDays;

      if (currentWorkingDays.includes(dayValue)) {
        // If the day is already selected, remove it
        newWorkingDays = currentWorkingDays.filter((day) => day !== dayValue);
      } else {
        // If the day is not selected, add it
        newWorkingDays = [...currentWorkingDays, dayValue];
      }

      // Sort the working days to maintain consistent order
      newWorkingDays.sort(
        (a, b) =>
          DAYS_OF_WEEK.findIndex((day) => day.value === a) -
          DAYS_OF_WEEK.findIndex((day) => day.value === b)
      );

      return {
        ...prevData,
        working_days: newWorkingDays,
      };
    });
  };

  // popup handler for update and create grade
  const handleOpenGradeDialog = (grade = null) => {
    if (grade) {
      setCurrentGrade(grade);
      setIsNewGrade(false);
    } else {
      setCurrentGrade({ name: "", short_name: "" });
      setIsNewGrade(true);
    }
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
  };

  // handle changer for update and create grade
  const handleGradeChange = (event) => {
    setCurrentGrade({
      ...currentGrade,
      [event.target.name]: event.target.value,
    });
  };

  // udate and create grade
  const handleSaveGrade = async () => {
    // create
    if (isNewGrade) {
      try {
        const response = await axios.post(
          `${apiDomain}/api/user/grade/`,
          currentGrade,
          {
            headers: headers,
          }
        );

        setSchoolData((prev) => ({
          ...prev,
          grades: [...prev.grades, response.data],
        }));
      } catch (err) {
        if (err.response) {
          console.error(
            "Response error:",
            err.response.status,
            err.response.data
          );
          if (err.response.status === 401) {
            toast.error("Error occurred: Unauthorized access");
            logoutUser();
          } else {
            toast.error(
              `Error occurred: ${
                err.response.data?.message || "Unexpected error"
              }`
            );
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error("No response received:", err.request);
          toast.error("Error occurred: No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", err.message);
          toast.error(`Error occurred: ${err.message}`);
        }
      }
    } else {
      // update grade
      try {
        const response = await axios.put(
          `${apiDomain}/api/user/grade/${currentGrade.id}/`,
          currentGrade,
          {
            headers: headers,
          }
        );
        setSchoolData((prev) => ({
          ...prev,
          grades: prev.grades.map((grade) =>
            grade.id === currentGrade.id ? response.data : grade
          ),
        }));
      } catch (err) {
        if (err.response) {
          console.error(
            "Response error:",
            err.response.status,
            err.response.data
          );
          if (err.response.status === 401) {
            toast.error("Error occurred: Unauthorized access");
            logoutUser();
          } else {
            toast.error(
              `Error occurred: ${
                err.response.data?.message || "Unexpected error"
              }`
            );
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error("No response received:", err.request);
          toast.error("Error occurred: No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", err.message);
          toast.error(`Error occurred: ${err.message}`);
        }
      }
    }
    handleCloseGradeDialog();
  };

  // function to open grade dlete popup and set which grade to be delete
  const handleGradeDelete = (delete_id) => {
    setIsDeletePopupOpen(delete_id);
  };

  // function for delete confirmation
  const handleConfirmGradeDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiDomain}/api/user/grade/${isDeletePopupOpen}`,
        {
          headers: headers,
        }
      );
      toast.success("Successfully deleted");
      setIsDeletePopupOpen(null);
      fetchData();
    } catch (error) {
      // Handle errors
      console.error("There was an error deleting the grade:", error);
      toast.error("error occured");
      // Optionally, handle errors in the UI or state
    }
  };

  // image change handleer
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // image updater
  const handleImageSave = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("profile_image", newImage);

    try {
      const response = await axios.put(
        `${apiDomain}/api/user/update-profile-image/`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSchoolData((prevData) => ({
        ...prevData,
        profile_image: response.data.profile_image,
      }));
      setImagePreview(null);
      setNewImage(null);
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error("Failed to update profile image");
    }
  };
  const [openRoomForm, setOpenRoomForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleOpenRoomForm = (room = null) => {
    setCurrentRoom(room);
    setOpenRoomForm(true);
  };

  const handleCloseRoomForm = () => {
    setOpenRoomForm(false);
    setCurrentRoom(null);
  };

  const handleSaveRoom = async (roomData) => {
    try {
      let response;
      if (roomData.id) {
        // Editing existing room
        response = await axios.put(
          `${apiDomain}/api/room/rooms/${roomData.id}/`,
          roomData,
          { headers }
        );
        setRooms(
          rooms.map((room) => (room.id === roomData.id ? response.data : room))
        );
        toast.success("Room updated successfully");
      } else {
        // Adding new room
        response = await axios.post(`${apiDomain}/api/room/rooms/`, roomData, {
          headers,
        });
        setRooms([...rooms, response.data]);
        toast.success("Room added successfully");
      }
      handleCloseRoomForm();
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Failed to save room");
    }
  };
  return isLoading ? (
    <CircularProgress />
  ) : (
    <ThemeProvider theme={theme}>
      <div className="w-full h-full rounded-2xl px-6 py-5  shadow-lg overflow-auto">
        <div className="flex flex-row justify-between border-b pb-4">
          <div className="flex flex-row items-center gap-4">
           
            <h1 className="text-xl font-semibold">School Details</h1>
          </div>
          <div className="flex flex-row gap-3">
            {isEditing ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                size="small"
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  padding: "10px 14px",
                  fontSize: 12,
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  padding: "10px 14px",
                  fontSize: 12,
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  color: "#2196f3",
                  borderColor: "#2196f3",
                  "&:hover": {
                    backgroundColor: "rgba(33, 150, 243, 0.2)",
                    borderColor: "#1976d2",
                  },
                }}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                padding: "10px 14px",
                fontSize: 12,
                backgroundColor: "rgba(255, 182, 193, 0.2)",
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(255, 182, 193, 0.5)",
                  borderColor: "#d32f2f",
                },
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* School Overview Section */}
        <div className="flex flex-row pt-6 pl-1 border-b pb-5">
          <div className="basis-1/3 flex flex-col items-center">
            <Avatar
              src={
                imagePreview ||
                (schoolData.profile_image
                  ? `${apiDomain}${schoolData.profile_image}`
                  : defaultAvatarImage)
              }
              sx={{ width: 160, height: 160, boxShadow: 3 }}
              alt={schoolData.school_name}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                sx={{ mt: 2 }}
                onClick={imagePreview ? handleImageSave : undefined}
              >
                {imagePreview ? "Save Image" : "Change Image"}
              </Button>
            </label>
            <Typography
              variant="h6"
              sx={{ mt: 2, fontWeight: "bold", color: "#333" }}
            >
              {schoolData.school_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
              ID: {schoolData.school_id}
            </Typography>
          </div>
          <div className="basis-2/3 px-6">
            <p className="text-sm font-medium text-blue-600 font-Inter mb-4">
              SCHOOL DETAILS
            </p>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
              <TextField
                name="city"
                label="CITY"
                value={schoolData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "##DDE4ED" : "transparent",
                  },
                }}
              />

              <TextField
                name="country"
                label="COUNTRY"
                value={schoolData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "#f5f5f5" : "transparent",
                  },
                }}
              />

              <TextField
                name="school_name"
                label="NAME"
                value={schoolData.school_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "#f5f5f5" : "transparent",
                  },
                }}
              />

              <TextField
                name="phone_number"
                label="PHONE NUMBER"
                value={schoolData.phone_number}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "#f5f5f5" : "transparent",
                  },
                }}
              />

              <TextField
                name="postal_code"
                label="POSTAL CODE"
                value={schoolData.postal_code}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "#f5f5f5" : "transparent",
                  },
                }}
              />

              <TextField
                name="address"
                label="ADDRESS"
                value={schoolData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "#f5f5f5" : "transparent",
                  },
                }}
              />
            </Box>
          </div>
        </div>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" className="text-blue-600 mb-2">
            Grades
          </Typography>
          <List>
            {schoolData?.grades?.map((grade) => (
              <ListItem
                key={grade.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenGradeDialog(grade)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleGradeDelete(grade?.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={grade?.name}
                  secondary={grade?.short_name}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenGradeDialog()}
            sx={{ mt: 2 }}
          >
            Add New Grade
          </Button>
        </Box>
        {/* School Configuration Section */}
        <div className="mt-8 border-t pt-6 ">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="text-blue-600">
              School Configuration
            </Typography>
            <div>
              {isEditingConfig ? (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  size="small"
                  onClick={handleSave}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    padding: "10px 14px",
                    fontSize: 12,
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#45a049",
                    },
                  }}
                >
                  Save Config
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => setIsEditingConfig(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    padding: "10px 14px",
                    fontSize: 12,
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    color: "#2196f3",
                    borderColor: "#2196f3",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.2)",
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  Edit Config
                </Button>
              )}
            </div>
          </div>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Working Days
              </Typography>
              <FormGroup row>
                {DAYS_OF_WEEK.map((day) => {
                  return (
                    <FormControlLabel
                      key={day.value}
                      control={
                        <Checkbox
                          checked={schoolData?.working_days?.includes(
                            day.value
                          )}
                          onChange={() => handleWorkingDayChange(day.value)}
                          disabled={!isEditingConfig}
                        />
                      }
                      label={day.label}
                    />
                  );
                })}
              </FormGroup>
            </Box>

            <TextField
              name="teaching_slots"
              label="Teaching Slots"
              type="number"
              value={schoolData?.teaching_slots}
              onChange={handleInputChange}
              disabled={!isEditingConfig}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="average_students_allowed_in_a_class"
              label="Avg. Students per Class"
              type="number"
              value={schoolData?.average_students_allowed_in_a_class}
              onChange={handleInputChange}
              disabled={!isEditingConfig}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Autocomplete
              freeSolo
              options={["Period", "Block", "Session", "Hour"]}
              value={schoolData?.period_name || null}
              onChange={(event, newValue) => {
                handleInputChange({
                  target: { name: "period_name", value: newValue },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="period_names"
                  label="Period Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
              disabled={!isEditingConfig}
            />

            <TextField
              label="All Subjects Have Teachers"
              value={schoolData?.all_subjects_have_teachers ? "Yes" : "No"}
              disabled
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="All Classes Have Subjects"
              value={schoolData?.all_classes_have_subjects ? "Yes" : "No"}
              disabled
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Dialog open={openGradeDialog} onClose={handleCloseGradeDialog}>
            <DialogTitle>
              {isNewGrade ? "Create New Grade" : "Edit Grade"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Grade Name"
                type="text"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={currentGrade.name}
                onChange={handleGradeChange}
              />
              <TextField
                margin="dense"
                name="short_name"
                label="Short Name"
                type="text"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={currentGrade.short_name}
                onChange={handleGradeChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseGradeDialog}>Cancel</Button>
              <Button onClick={handleSaveGrade}>Save</Button>
            </DialogActions>
          </Dialog>
          <DeleteConfirmationPopup
            isOpen={isDeletePopupOpen}
            onClose={() => setIsDeletePopupOpen(false)}
            onConfirm={handleConfirmGradeDelete}
          />
        </div>
        {/* Rooms Section */}
        <RoomsSection
          rooms={rooms}
          handleOpenRoomForm={handleOpenRoomForm}
        />
      </div>
      <AddNewRoom
        open={openRoomForm}
        handleClose={handleCloseRoomForm}
        handleSave={handleSaveRoom}
        initialRoom={currentRoom}
      />
    </ThemeProvider>
  );
};

export default UserConfiguration;
