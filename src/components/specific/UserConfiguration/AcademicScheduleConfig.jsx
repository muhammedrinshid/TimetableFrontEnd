import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  Add as PlusIcon,
} from "@mui/icons-material";
import { ClipboardPasteIcon, CopyIcon } from "lucide-react";

// Comprehensive day mapping with full names and abbreviations
const DAY_MAPPING = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

// Get all available days that are not already in the schedule
const getAvailableDays = (existingDays) => {
  return Object.keys(DAY_MAPPING).filter(
    (day) => !existingDays.some((schedule) => schedule.day === day)
  );
};

const AcademicScheduleConfig = ({
  schoolData,
  isEditingConfig,
  setSchoolData,
}) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const theme = useTheme();
  const [copiedDaySchedule, setCopiedDaySchedule] = useState(null);

  // Handler to toggle day in schedule
  const handleDayToggle = (dayValue) => {
    if (!isEditingConfig) return;

    setSchoolData((prev) => {
      const existingDayIndex = prev.academic_schedule?.day_schedules?.findIndex(
        (schedule) => schedule.day === dayValue
      );

      let newDaySchedules;
      if (existingDayIndex === -1) {
        // Add new day with default 1 slot and empty periods
        newDaySchedules = [
          ...(prev.academic_schedule?.day_schedules || []),
          {
            day: dayValue,
            teaching_slots: 1,
            periods: [
              {
                period_number: 1,
                start_time: null,
                end_time: null,
              },
            ],
          },
        ];
      } else {
        // Remove the day
        newDaySchedules = prev.academic_schedule?.day_schedules?.filter(
          (schedule) => schedule.day !== dayValue
        );
      }

      // Recalculate total weekly teaching slots
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

  // Handler to change period times
  const handlePeriodTimeChange = (dayAbbr, periodNumber, timeType, newTime) => {
    if (!isEditingConfig) return;

    setSchoolData((prev) => {
      const newDaySchedules = prev.academic_schedule?.day_schedules?.map(
        (schedule) => {
          if (schedule.day === dayAbbr) {
            // Update periods
            const newPeriods = schedule.periods.map((period) =>
              period.period_number === periodNumber
                ? { ...period, [timeType]: newTime }
                : period
            );

            return { ...schedule, periods: newPeriods };
          }
          return schedule;
        }
      );

      return {
        ...prev,
        academic_schedule: {
          ...prev.academic_schedule,
          day_schedules: newDaySchedules,
        },
      };
    });
  };

  // Handler to change number of slots for a day
  const handleSlotChange = (day, value) => {
    if (!isEditingConfig) return;

    // Constrain slots between 1 and 12
    const slots = Math.max(1, Math.min(12, parseInt(value) || 1));

    setSchoolData((prev) => {
      const newDaySchedules = prev.academic_schedule?.day_schedules?.map(
        (schedule) => {
          if (schedule.day === day) {
            // If reducing slots, truncate periods
            const newPeriods = schedule.periods
              .slice(0, slots)
              .map((period, index) => ({
                ...period,
                period_number: index + 1,
              }));

            // If increasing slots, add new empty periods
            while (newPeriods.length < slots) {
              newPeriods.push({
                period_number: newPeriods.length + 1,
                start_time: null,
                end_time: null,
              });
            }

            return {
              ...schedule,
              teaching_slots: slots,
              periods: newPeriods,
            };
          }
          return schedule;
        }
      );

      // Recalculate total weekly teaching slots
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

  // Render schedule for a specific day
  const renderDaySchedule = (daySchedule) => {
    const dayAbbr = daySchedule.day;
    const dayName = DAY_MAPPING[dayAbbr] || dayAbbr;

    const handleCopy = () => setCopiedDaySchedule(daySchedule);
    const handlePaste = (dayAbbr) => {
      if (copiedDaySchedule) {
        const targetDaySchedule =
          schoolData.academic_schedule.day_schedules.find(
            (schedule) => schedule.day === dayAbbr
          );

        if (targetDaySchedule) {
          const updatedPeriods = targetDaySchedule.periods.map(
            (period, index) => {
              // Check if there is a corresponding period in the copied schedule
              const copiedPeriod = copiedDaySchedule.periods[index];

              // If copiedPeriod exists, update the times, else retain the current values
              return {
                ...period,
                start_time: copiedPeriod
                  ? copiedPeriod.start_time
                  : period.start_time,
                end_time: copiedPeriod
                  ? copiedPeriod.end_time
                  : period.end_time,
              };
            }
          );

          // Create the updated day schedule with the new periods
          const updatedDaySchedule = {
            ...targetDaySchedule,
            periods: updatedPeriods,
          };

          // Update the academic schedule with the new day schedule
          const updatedAcademicSchedule =
            schoolData.academic_schedule.day_schedules.map((schedule) =>
              schedule.day === dayAbbr ? updatedDaySchedule : schedule
            );

          // Update the schoolData state with the modified academic schedule
          setSchoolData((prevData) => ({
            ...prevData,
            academic_schedule: {
              ...prevData.academic_schedule,
              day_schedules: updatedAcademicSchedule,
            },
          }));

          // Reset copiedDaySchedule state after pasting
          setCopiedDaySchedule(null);
        }
      }
    };

    const isCopied = copiedDaySchedule?.day === dayAbbr;

    return (
      <Accordion
        key={dayAbbr}
        expanded={expandedDay === dayAbbr}
        onChange={() =>
          setExpandedDay(expandedDay === dayAbbr ? null : dayAbbr)
        }
        disabled={!isEditingConfig}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "none",
          border: `1px solid ${theme.palette.divider}`,
          "&:before": { display: "none" },
          "&.Mui-disabled": {
            opacity: 0.7,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              gap: 2,
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {dayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {daySchedule.teaching_slots} slots
          </Typography>
          {isCopied ? (
            <Typography variant="body2" color="primary">
              Copied
            </Typography>
          ) : (
            <IconButton
              onClick={copiedDaySchedule ? handlePaste : handleCopy}
              size="small"
            >
              {copiedDaySchedule ? <ClipboardPasteIcon /> : <CopyIcon />}
            </IconButton>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Teaching Slots Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Teaching Slots:</Typography>
              <IconButton
                onClick={() =>
                  handleSlotChange(dayAbbr, daySchedule.teaching_slots - 1)
                }
                disabled={daySchedule.teaching_slots <= 1}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={daySchedule.teaching_slots}
                onChange={(e) =>
                  handleSlotChange(dayAbbr, parseInt(e.target.value, 10))
                }
                disabled={!isEditingConfig}
                InputProps={{
                  inputProps: { min: 1, max: 12 },
                }}
                sx={{ width: 80 }}
              />
              <IconButton
                onClick={() =>
                  handleSlotChange(dayAbbr, daySchedule.teaching_slots + 1)
                }
                disabled={daySchedule.teaching_slots >= 12}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Periods */}
            {daySchedule.periods.map((period) => (
              <Box
                key={`${dayAbbr}-period-${period.period_number}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  p: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  Period {period.period_number}
                </Typography>
                <Tooltip title="Start Time">
                  <TextField
                    type="time"
                    size="small"
                    value={period.start_time || ""}
                    onChange={(e) =>
                      handlePeriodTimeChange(
                        dayAbbr,
                        period.period_number,
                        "start_time",
                        e.target.value
                      )
                    }
                    disabled={!isEditingConfig}
                    sx={{ width: 120 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Tooltip>
                <Tooltip title="End Time">
                  <TextField
                    type="time"
                    size="small"
                    value={period.end_time || ""}
                    onChange={(e) =>
                      handlePeriodTimeChange(
                        dayAbbr,
                        period.period_number,
                        "end_time",
                        e.target.value
                      )
                    }
                    disabled={!isEditingConfig}
                    sx={{ width: 120 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Tooltip>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
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

  // Modal to add new day
  const renderAddDayModal = () => {
    const availableDays = getAvailableDays(
      schoolData.academic_schedule?.day_schedules || []
    );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {availableDays.map((day) => (
          <Button
            key={day}
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={() => handleDayToggle(day)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {DAY_MAPPING[day]}
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gap: 3,
        p: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            Academic Schedule
          </Typography>
          {isEditingConfig && (
            <Button
              variant="outlined"
              startIcon={<PlusIcon />}
              onClick={() => setShowAddDayModal(!showAddDayModal)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Add Day
            </Button>
          )}
        </Box>

        {showAddDayModal && renderAddDayModal()}

        {schoolData?.academic_schedule?.day_schedules?.map(renderDaySchedule)}
      </Box>

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
          onChange={(_, newValue) => handleInputChange("period_name", newValue)}
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
                schoolData?.academic_schedule?.academic_year_start || undefined,
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
        <FormControlLabel
          control={
            <Checkbox
              checked={
                schoolData?.academic_schedule?.is_auto_timetable_creation ||
                false
              }
              onChange={(e) =>
                handleInputChange(
                  "is_auto_timetable_creation",
                  e.target.checked
                )
              }
              disabled={!isEditingConfig}
            />
          }
          label="Automatic Timetable Creation"
        />
      </Box>
    </Box>
  );
};

export default AcademicScheduleConfig;
