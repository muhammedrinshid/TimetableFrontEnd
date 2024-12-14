import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import AcademicScheduleConfig from "./AcademicScheduleConfig";

const DAYS_OF_WEEK = [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
];

const SchoolConfiguration = ({
  schoolData,
  setSchoolData,
  isEditingConfig,
  setIsEditingConfig,
  handleSave,
}) => {


  return (
    <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          School Configuration
        </Typography>
        <Box>
          {isEditingConfig ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              size="small"
              onClick={handleSave}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                padding: "6px 16px",
                fontSize: 14,
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
                padding: "6px 16px",
                fontSize: 14,
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
        </Box>
      </Box>

      <AcademicScheduleConfig
        isEditingConfig={isEditingConfig}
        schoolData={schoolData}
        setSchoolData={setSchoolData}
      />
    </Box>
  );
};

export default SchoolConfiguration;
