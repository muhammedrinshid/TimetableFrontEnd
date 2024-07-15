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
} from "@mui/material";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#2196f3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196f3",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#757575",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2196f3",
          },
          "& .MuiInputBase-input": {
            color: "#333333",
          },
        },
      },
    },
  },
});

const UserConfiguration = ({ setIsSchoolDetailsOpen }) => {

  const {apiDomain,headers,}=useAuth()

  useEffect(()=>{

    console.log(headers)

    axios
    .get(`${apiDomain}/api/user/info`, {headers:headers})
    .then((res) =>{
        

        
        
    }
        ).catch((err)=>{
          if (err?.response?.status==401) {
            console.log("error occured")

            
          }
        })

  },[])
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [schoolData, setSchoolData] = useState({
    email: "school@example.com",
    phone_number: "+1 234 567 8901",
    school_name: "Example High School",
    school_id: "EHS001",
    address: "123 Education St",
    city: "Learningville",
    state: "Knowledge State",
    country: "Wisdom Land",
    postal_code: "12345",
    profile_image: "https://example.com/school-image.jpg",
  });
  const [schoolConfig, setSchoolConfig] = useState({
    working_days: ["MON", "TUE", "WED", "THU", "FRI"],
    teaching_slots: 8,
    average_students_allowed_in_a_class: 40,
    all_subjects_have_teachers: true,
    all_classes_have_subjects: true,
  });

  const DAYS_OF_WEEK = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchoolConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkingDayChange = (day) => {
    setSchoolConfig((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const handleSave = () => {
    console.log("Saving school data:", schoolData);
    setIsEditing(false);
  };

  const handleSaveConfig = () => {
    console.log("Saving school configuration:", schoolConfig);
    setIsEditingConfig(false);
  };

  const [grades, setGrades] = useState([
    { id: 1, name: "High School", shortName: "HS" },
    { id: 2, name: "Higher Secondary", shortName: "HSS" },
  ]);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({ name: "", shortName: "" });
  const [isNewGrade, setIsNewGrade] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleOpenGradeDialog = (grade = null) => {
    if (grade) {
      setCurrentGrade(grade);
      setIsNewGrade(false);
    } else {
      setCurrentGrade({ name: "", shortName: "" });
      setIsNewGrade(true);
    }
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
  };

  const handleGradeChange = (event) => {
    setCurrentGrade({
      ...currentGrade,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveGrade = () => {
    if (isNewGrade) {
      setGrades([...grades, { ...currentGrade, id: Date.now() }]);
    } else {
      setGrades(
        grades.map((grade) =>
          grade.id === currentGrade.id ? currentGrade : grade
        )
      );
    }
    handleCloseGradeDialog();
  };


  const handleDelete = () => {
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform delete operation here
    console.log('Records deleted');
    setIsDeletePopupOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-full rounded-2xl px-6 py-5  shadow-lg overflow-auto">
        <div className="flex flex-row justify-between border-b pb-4">
          <div className="flex flex-row items-center gap-4">
            <IconButton onClick={() => setIsSchoolDetailsOpen(false)}>
              <KeyboardBackspaceIcon
                fontSize="small"
                sx={{ color: "#818181" }}
              />
            </IconButton>
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
              src={schoolData.profile_image}
              sx={{ width: 160, height: 160, boxShadow: 3 }}
              alt={schoolData.school_name}
            />
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
              {Object.entries(schoolData).map(
                ([key, value]) =>
                  key !== "profile_image" && (
                    <TextField
                      key={key}
                      name={key}
                      label={key.replace("_", " ").toUpperCase()}
                      value={value}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: isEditing
                            ? "#f5f5f5"
                            : "transparent",
                        },
                      }}
                    />
                  )
              )}
            </Box>
          </div>
        </div>
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" className="text-blue-600 mb-2">
              Grades
            </Typography>
            <List>
              {grades.map((grade) => (
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
                        onClick={() => handleDelete()}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={grade.name}
                    secondary={grade.shortName}
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
                  onClick={handleSaveConfig}
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
                {DAYS_OF_WEEK.map((day) => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={schoolConfig.working_days.includes(day.value)}
                        onChange={() => handleWorkingDayChange(day.value)}
                        disabled={!isEditingConfig}
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>
            </Box>

            <TextField
              name="teaching_slots"
              label="Teaching Slots"
              type="number"
              value={schoolConfig.teaching_slots}
              onChange={handleConfigChange}
              disabled={!isEditingConfig}
              variant="outlined"
              size="small"
              fullWidth
            />

            <TextField
              name="average_students_allowed_in_a_class"
              label="Avg. Students per Class"
              type="number"
              value={schoolConfig.average_students_allowed_in_a_class}
              onChange={handleConfigChange}
              disabled={!isEditingConfig}
              variant="outlined"
              size="small"
              fullWidth
            />

            <Autocomplete
              multiple
              freeSolo
              options={["Period", "Block", "Session", "Hour"]}
              value={schoolConfig.period_names}
              onChange={(event, newValue) => {
                handleConfigChange({
                  target: { name: "period_names", value: newValue },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="period_names"
                  label="Period Names"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
              disabled={!isEditingConfig}
            />

  

            <TextField
              label="All Subjects Have Teachers"
              value={schoolConfig.all_subjects_have_teachers ? "Yes" : "No"}
              disabled
              variant="outlined"
              size="small"
              fullWidth
            />

            <TextField
              label="All Classes Have Subjects"
              value={schoolConfig.all_classes_have_subjects ? "Yes" : "No"}
              disabled
              variant="outlined"
              size="small"
              fullWidth
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
                variant="outlined"
                value={currentGrade.name}
                onChange={handleGradeChange}
              />
              <TextField
                margin="dense"
                name="shortName"
                label="Short Name"
                type="text"
                fullWidth
                variant="outlined"
                value={currentGrade.shortName}
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
        onConfirm={handleConfirmDelete}
      />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UserConfiguration;
