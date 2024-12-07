import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

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
  const handleDayToggle = (dayValue) => {
    if (!isEditingConfig) return;

    setSchoolData((prev) => {
      const existingDayIndex = prev.academic_schedule?.day_schedules?.findIndex(
        (schedule) => schedule.day === dayValue
      );

      let newDaySchedules;
      if (existingDayIndex === -1) {
        // Add new day with default 1 slot
        newDaySchedules = [
          ...prev.academic_schedule?.day_schedules,
          { day: dayValue, teaching_slots: 1 },
        ];
      } else {
        // Remove the day
        newDaySchedules = prev.academic_schedule?.day_schedules?.filter(
          (schedule) => schedule.day !== dayValue
        );
      }

      const totalSlots = newDaySchedules.reduce(
        (sum, schedule) => sum + schedule.teaching_slots,
        0
      );

      return {
        ...prev,
        academic_schedule: {
          ...prev.academic_schedule,
          day_schedules: newDaySchedules,
          total_weekly_teaching_slots: totalSlots,
        },
      };
    });
  };

  const handleSlotChange = (day, value) => {
    if (!isEditingConfig) return;

    const slots = Math.max(1, Math.min(12, parseInt(value) || 1));

    setSchoolData((prev) => {
      const newDaySchedules = prev.academic_schedule?.day_schedules?.map(
        (schedule) =>
          schedule.day === day
            ? { ...schedule, teaching_slots: slots }
            : schedule
      );

      const totalSlots = newDaySchedules.reduce(
        (sum, schedule) => sum + schedule.teaching_slots,
        0
      );

      return {
        ...prev,
        academic_schedule: {
          ...prev.academic_schedule,
          day_schedules: newDaySchedules,
          total_weekly_teaching_slots: totalSlots,
        },
      };
    });
  };

  const handleInputChange = (name, value) => {
    setSchoolData((prev) => ({
      ...prev,
      academic_schedule: {
        ...prev.academic_schedule,
        [name]: value,
      },
    }));
  };

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Paper elevation={0} sx={{ p: 2, backgroundColor: "transparent" }}>
          <Typography variant="subtitle2" gutterBottom>
            Working Days & Slots
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule =
                schoolData?.academic_schedule?.day_schedules?.find(
                  (schedule) => schedule.day === day.value
                );
              const isChecked = !!daySchedule;

              return (
                <Box
                  key={day.value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "& .MuiFormControlLabel-root": {
                      minWidth: 140,
                      margin: 0,
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleDayToggle(day.value)}
                        disabled={!isEditingConfig}
                      />
                    }
                    label={day.label}
                  />
                  {isChecked && (
                    <TextField
                      type="number"
                      size="small"
                      value={daySchedule.teaching_slots}
                      onChange={(e) =>
                        handleSlotChange(day.value, e.target.value)
                      }
                      disabled={!isEditingConfig}
                      InputProps={{
                        inputProps: { min: 1, max: 12 },
                      }}
                      sx={{ width: 100 }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Total Weekly Teaching Slots"
            value={
              schoolData?.academic_schedule?.total_weekly_teaching_slots || 0
            }
            disabled
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Average Students Allowed"
            type="number"
            value={schoolData?.academic_schedule?.average_students_allowed || 0}
            onChange={(e) =>
              handleInputChange("average_students_allowed", e.target.value)
            }
            disabled={!isEditingConfig}
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />

          <Autocomplete
            freeSolo
            options={["Period", "Block", "Session", "Hour"]}
            value={schoolData?.academic_schedule?.period_name || ""}
            onChange={(_, newValue) =>
              handleInputChange("period_name", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Period Name"
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
            label="Academic Year Start"
            type="date"
            value={schoolData?.academic_schedule?.academic_year_start || ""}
            onChange={(e) =>
              handleInputChange("academic_year_start", e.target.value)
            }
            disabled={!isEditingConfig}
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                max:
                  schoolData?.academic_schedule?.academic_year_end || undefined,
              },
            }}
          />

          <TextField
            label="Academic Year End"
            type="date"
            value={schoolData?.academic_schedule?.academic_year_end || ""}
            onChange={(e) =>
              handleInputChange("academic_year_end", e.target.value)
            }
            disabled={!isEditingConfig}
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                min:
                  schoolData?.academic_schedule?.academic_year_start ||
                  undefined,
              },
            }}
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
      </Box>
    </Box>
  );
};

export default SchoolConfiguration;
