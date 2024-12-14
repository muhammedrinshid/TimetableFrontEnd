import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dialog, IconButton, styled, TextField, Tooltip } from "@mui/material";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { RefreshCwIcon } from "lucide-react";
import { useAuth } from "../../../context/Authcontext";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
const useStyles = makeStyles({
  select: {
    height: 24,
    width: "100%",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
      Padding: 0,
    },
    "&.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
      borderRadius: 12,
    },
  },
});
const TeachersActivityStatsControlePanel = ({
  setSelectedDate,
  selectedDate,
  handleRefresh
}) => {
const { academicYearEnd,academicYearStart } = useAuth();
    
  const [selectedDateRangeOption, setSelectedDateRangeOption] =
    useState("academic_year");
  const handleDateChange = (newDate, type = "startDate") => {
    if (type === "startDate") {
      setSelectedDate((prev) => ({ ...prev, startDate: newDate }));
    } else {
      setSelectedDate((prev) => ({ ...prev, endDate: newDate }));
    }
  };
  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-root": {
      padding: "8px 12px",
      borderRadius: "8px",
    },
    "& .MuiInputBase-input": {
      padding: "0px",
    },
  });
  const dateRangeOptions = [
    { value: "last_month", label: "Last Month" },
    { value: "last_week", label: "Last Week" },
    { value: "custom", label: "Custom" },
  ];

  const handleChangeDateRange = (newValue) => {
    let startDate = null;
    let endDate = null;

    const currentDate = new Date();

    switch (newValue) {
      case "academic_year":
        // Get 6 months ago
        if (academicYearStart && academicYearEnd) {
            startDate=academicYearStart
            endDate=academicYearEnd
        }else{
            const start = new Date();
            start.setMonth(currentDate.getMonth() - 6);
            startDate = formatDate(start);
                console.log(academicYearEnd)

            // Get 6 months from now
            const end = new Date();
            end.setMonth(currentDate.getMonth() + 6);
            endDate = formatDate(end);
        }
      
        break;

      case "last_month":
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);
        const firstDayLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const lastDayLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          0
        );
        startDate = formatDate(firstDayLastMonth);
        endDate = formatDate(lastDayLastMonth);
        break;

      case "last_week":
        const lastWeek = new Date();
        lastWeek.setDate(currentDate.getDate() - 7);
        const startOfLastWeek = new Date(
          lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay())
        );
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        startDate = formatDate(startOfLastWeek);
        endDate = formatDate(endOfLastWeek);
        break;

      case "custom":
        // Keep null for custom
        startDate = null;
        endDate = null;
        break;

      default:
        break;
    }
    setSelectedDate({ startDate, endDate });
    setSelectedDateRangeOption(newValue);
  };
  const classes = useStyles();

  return (
    <div className="relative flex flex-row justify-between gap-10">
      <div className="p-1 pr-2 bg-white rounded-2xl   shadow-custom-8">
        <FormControl fullWidth sx={{ m: 1 }}>
          <Select
            value={selectedDateRangeOption}
            onChange={(e) => handleChangeDateRange(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            className={classes.select}
            size="small"
            fullWidth={true}
          >
            <MenuItem value="academic_year">
              <em>Academic Year</em>
            </MenuItem>
            {dateRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="p-1 flex flex-row justify-between items-center gap-2 bg-white dark:bg-dark-secondary rounded-2xl px-3  shadow-custom-8">
        <div className="flex-grow flex items-center overflow-hidden">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              value={selectedDate.startDate}
              disabled={!(selectedDateRangeOption=="custom")}

              onChange={(newDate) => handleDateChange(newDate, "startDate")}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    className: "dark:text-dark-text",
                  }}
                  className="dark:bg-dark-secondary bg-white w-full"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: "16px",
                      padding: "4px 8px",
                    },
                    "& .MuiInputBase-input": {
                      paddingX: "8px",
                    },
                  }}
                />
              )}
            />

            <DesktopDatePicker
              value={selectedDate.endDate}
              onChange={(newDate) => handleDateChange(newDate, "endDate")}
              disabled={!(selectedDateRangeOption=="custom")}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    className: "dark:text-dark-text",
                  }}
                  className="dark:bg-dark-secondary bg-white w-full"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: "16px",
                      padding: "4px 8px",
                    },
                    "& .MuiInputBase-input": {
                      paddingX: "8px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="p-1  bg-white rounded-2xl   shadow-custom-8">
     
</div>
    </div>
  );
};

export default TeachersActivityStatsControlePanel;
